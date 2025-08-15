// This is now the main landing page for discovering movies.
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWatchlist } from '../context/WatchlistContext';

// --- Reusable MovieCard Component ---
function MovieCard({ movie, onAddToFavorites, onRemoveFromFavorites, isFavorite }) {
  const mediaType = movie.title ? 'movie' : 'tv';
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', margin: '1rem', width: '250px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <Link href={`/${mediaType}/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title || movie.name} 
              style={{ width: '100%', borderRadius: '8px', cursor: 'pointer' }}
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/500x750/e2e8f0/e2e8f0?text=No+Image' }}
            />
            <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>{movie.title || movie.name}</h3>
        </Link>
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

// --- Main Discover Page ---
export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [topMovies, setTopMovies] = useState([]);
  const [topTvShows, setTopTvShows] = useState([]);
  const { favorites, addToFavorites, removeFromFavorites } = useWatchlist();

  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    const fetchRecommendations = async () => {
        if (!TMDB_API_KEY) return;
        try {
            const movieRes = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
            const movieData = await movieRes.json();
            setTopMovies(movieData.results.slice(0, 5));

            const tvRes = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
            const tvData = await tvRes.json();
            setTopTvShows(tvData.results.slice(0, 5));
        } catch (err) {
            console.error("Failed to fetch recommendations:", err);
        }
    };
    fetchRecommendations();
  }, [TMDB_API_KEY]);

  const searchMovies = async (e) => {
    e.preventDefault();
    setError(null);
    if (!query) return;

    if (query.toLowerCase() === 'error') {
        try {
            throw new Error("Simulated API Error");
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
      if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setResults([]);
    }
  };

  const triggerFrontendError = () => {
      try {
        throw new Error("Simulated frontend error!");
      } catch (err) {
          console.error(err);
          setError(err.message);
      }
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', color: '#111827' }}>Discover</h1>
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

      {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '2rem' }}>
              <p><strong>An error occurred:</strong> {error}</p>
          </div>
      )}

      {results.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {results.map(movie => (
            <MovieCard key={movie.id} movie={movie} onAddToFavorites={addToFavorites} onRemoveFromFavorites={removeFromFavorites} isFavorite={!!favorites.find(fav => fav.id === movie.id)} />
          ))}
        </div>
      ) : (
        <Recommendations topMovies={topMovies} topTvShows={topTvShows} onAddToFavorites={addToFavorites} onRemoveFromFavorites={removeFromFavorites} favorites={favorites} />
      )}
    </>
  );
}

// --- Recommendations Component (used in Discover Page) ---
function Recommendations({ topMovies, topTvShows, onAddToFavorites, onRemoveFromFavorites, favorites }) {
    return (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eef2ff', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '2rem', borderBottom: '2px solid #ddd', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Top Rated</h2>
            <div>
                <h3 style={{fontSize: '1.5rem'}}>Movies</h3>
                <div style={{ display: 'flex', overflowX: 'auto', padding: '0.5rem' }}>
                    {topMovies.map(movie => (
                        <div key={movie.id} style={{flex: '0 0 auto'}}>
                           <MovieCard movie={movie} onAddToFavorites={onAddToFavorites} onRemoveFromFavorites={onRemoveFromFavorites} isFavorite={!!favorites.find(fav => fav.id === movie.id)} />
                        </div>
                    ))}
                </div>
            </div>
            <div style={{marginTop: '2rem'}}>
                <h3 style={{fontSize: '1.5rem'}}>TV Shows</h3>
                 <div style={{ display: 'flex', overflowX: 'auto', padding: '0.5rem' }}>
                    {topTvShows.map(show => (
                        <div key={show.id} style={{flex: '0 0 auto'}}>
                            <MovieCard movie={show} onAddToFavorites={onAddToFavorites} onRemoveFromFavorites={onRemoveFromFavorites} isFavorite={!!favorites.find(fav => fav.id === show.id)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}