import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useWatchlist } from '../../context/WatchlistContext';

export default function MovieDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const { favorites, addToFavorites, removeFromFavorites } = useWatchlist();

  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    if (!id || !TMDB_API_KEY) return;

    const fetchDetails = async () => {
      try {
        // This logic assumes the URL structure is /movie/[id] or /tv/[id]
        const mediaType = router.pathname.startsWith('/movie') ? 'movie' : 'tv';
        const url = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=en-US`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch details.");
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchDetails();
  }, [id, TMDB_API_KEY, router.pathname]);

  if (error) return <p>Error: {error}</p>;
  if (!details) return <p>Loading...</p>;

  const isFavorite = !!favorites.find(fav => fav.id === details.id);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
        <img 
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`} 
          alt={details.title || details.name} 
          style={{ width: '300px', borderRadius: '8px' }}
        />
        <div>
          <h1 style={{ fontSize: '3rem' }}>{details.title || details.name}</h1>
          <p style={{ fontSize: '1.2rem', color: '#666', fontStyle: 'italic' }}>{details.tagline}</p>
          <h2 style={{ marginTop: '2rem' }}>Overview</h2>
          <p>{details.overview}</p>
          <div style={{marginTop: '2rem'}}>
            {isFavorite ? (
              <button onClick={() => removeFromFavorites(details.id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem' }}>
                Remove from Favorites
              </button>
            ) : (
              <button onClick={() => addToFavorites(details)} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem' }}>
                Add to Favorites
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}