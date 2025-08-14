// pages/index.js
import { useState, useEffect } from 'react';

// --- Components ---

function MovieCard({ movie, onAddToFavorites, onRemoveFromFavorites, isFavorite }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', margin: '1rem', width: '250px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title || movie.name} 
          style={{ width: '100%', borderRadius: '8px' }}
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/500x750/e2e8f0/e2e8f0?text=No+Image' }}
        />
        <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>{movie.title || movie.name}</h3>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>{movie.release_date || movie.first_air_date}</p>
      </div>
      {isFavorite ? (
        <button onClick={() => onRemoveFromFavorites(movie.id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '1rem' }}>
          Remove from Favorites
        </button>
      ) : (
        <button onClick={() => onAddToFavorites(movie)} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '1rem' }}>
          Add to Favorites
        </button>
      )}
    </div>
  );
}

function FavoritesList({ favorites, onRemoveFromFavorites }) {
    return (
        <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '2rem', borderBottom: '2px solid #ddd', paddingBottom: '0.5rem' }}>My Watchlist</h2>
            {favorites.length === 0 ? (
                <p>Your watchlist is empty.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {favorites.map(movie => (
                        <MovieCard key={movie.id} movie={movie} onRemoveFromFavorites={onRemoveFromFavorites} isFavorite={true} />
                    ))}
                </div>
            )}
        </div>
    );
}

// Updated component for recommendations
function Recommendations({ topMovies, topTvShows, onAddToFavorites, onRemoveFromFavorites, favorites }) {
    return (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eef2ff', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '2rem', borderBottom: '2px solid #ddd', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Top Rated</h2>
            
            {/* Top Movies Section */}
            <div>
                <h3 style={{fontSize: '1.5rem'}}>Movies</h3>
                <div style={{ display: 'flex', overflowX: 'auto', padding: '0.5rem' }}>
                    {topMovies.map(movie => (
                        <div key={movie.id} style={{flex: '0 0 auto'}}>
                           <MovieCard 
                                movie={movie}
                                onAddToFavorites={onAddToFavorites}
                                onRemoveFromFavorites={onRemoveFromFavorites}
                                isFavorite={!!favorites.find(fav => fav.id === movie.id)}
                           />
                        </div>
                    ))}
                </div>
            </div>

            {/* Top TV Shows Section */}
            <div style={{marginTop: '2rem'}}>
                <h3 style={{fontSize: '1.5rem'}}>TV Shows</h3>
                 <div style={{ display: 'flex', overflowX: 'auto', padding: '0.5rem' }}>
                    {topTvShows.map(show => (
                        <div key={show.id} style={{flex: '0 0 auto'}}>
                            <MovieCard 
                                movie={show}
                                onAddToFavorites={onAddToFavorites}
                                onRemoveFromFavorites={onRemoveFromFavorites}
                                isFavorite={!!favorites.find(fav => fav.id === show.id)}
                           />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


// --- Main App Page ---

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [topMovies, setTopMovies] = useState([]);
  const [topTvShows, setTopTvShows] = useState([]);

  // The API key is now read from environment variables
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    // Load favorites from local storage
    const storedFavorites = localStorage.getItem('movie-favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    // Fetch recommendations
    const fetchRecommendations = async () => {
        if (!TMDB_API_KEY) {
            setError("TMDB API Key is not configured. Please set NEXT_PUBLIC_TMDB_API_KEY environment variable.");
            return;
        }
        try {
            // Fetch Top Movies
            const movieRes = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
            const movieData = await movieRes.json();
            setTopMovies(movieData.results.slice(0, 5));

            // Fetch Top TV Shows
            const tvRes = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
            const tvData = await tvRes.json();
            setTopTvShows(tvData.results.slice(0, 5));

        } catch (err) {
            console.error("Failed to fetch recommendations:", err);
            // Optionally set an error state for recommendations
        }
    };

    fetchRecommendations();
  }, [TMDB_API_KEY]);

  useEffect(() => {
    // Save favorites to local storage
    localStorage.setItem('movie-favorites', JSON.stringify(favorites));
  }, [favorites]);


  const searchMovies = async (e) => {
    e.preventDefault();
    setError(null);
    if (!query) return;

    if (query.toLowerCase() === 'error') {
        try {
            throw new Error("Simulated API Error: The movie 'error' could not be found.");
        } catch (err) {
            console.error(err);
            setError(err.message);
            setResults([]);
            return;
        }
    }

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
      }
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setResults([]);
    }
  };

  const addToFavorites = (movie) => {
    if (!favorites.find(fav => fav.id === movie.id)) {
        setFavorites([...favorites, movie]);
    }
  };

  const removeFromFavorites = (movieId) => {
    setFavorites(favorites.filter(movie => movie.id !== movieId));
  };

  const triggerFrontendError = () => {
      try {
        throw new Error("This is a simulated frontend error!");
      } catch (err) {
          console.error(err);
          setError(err.message);
      }
  };


  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '3rem', color: '#111827' }}>Movie Finder</h1>
        
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <button onClick={triggerFrontendError} style={{ backgroundColor: '#d97706', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                Trigger Frontend Error
            </button>
        </div>

        <form onSubmit={searchMovies} style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a movie... or type 'error'"
            style={{ fontSize: '1rem', padding: '0.75rem', width: '50%', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <button type="submit" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem', marginLeft: '0.5rem', border: 'none', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
            Search
          </button>
        </form>

        {/* Display error message if an error exists */}
        {error && (
            <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '2rem' }}>
                <p><strong>An error occurred:</strong> {error}</p>
            </div>
        )}
        
        {/* Display Recommendations if there are no search results */}
        {results.length === 0 && !error && (
            <Recommendations 
                topMovies={topMovies} 
                topTvShows={topTvShows} 
                onAddToFavorites={addToFavorites}
                onRemoveFromFavorites={removeFromFavorites}
                favorites={favorites}
            />
        )}

        {/* Display Search Results */}
        {results.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {results.map(movie => (
                <MovieCard 
                key={movie.id} 
                movie={movie} 
                onAddToFavorites={addToFavorites}
                onRemoveFromFavorites={removeFromFavorites}
                isFavorite={!!favorites.find(fav => fav.id === movie.id)}
                />
            ))}
            </div>
        )}

        <FavoritesList favorites={favorites} onRemoveFromFavorites={removeFromFavorites} />
      </div>
    </div>
  );
}

