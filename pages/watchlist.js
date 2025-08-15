import { useWatchlist } from '../context/WatchlistContext';
import Link from 'next/link';

// Re-using the same MovieCard component for consistency
function MovieCard({ movie, onRemoveFromFavorites }) {
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
      <button onClick={() => onRemoveFromFavorites(movie.id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', width: '100%', marginTop: '1rem' }}>
        Remove from Watchlist
      </button>
    </div>
  );
}


export default function WatchlistPage() {
  const { favorites, removeFromFavorites } = useWatchlist();

  return (
    <div>
      <h1 style={{ fontSize: '3rem', borderBottom: '2px solid #ddd', paddingBottom: '0.5rem' }}>My Watchlist</h1>
      {favorites.length === 0 ? (
        <p style={{marginTop: '2rem', fontSize: '1.2rem'}}>Your watchlist is empty. Go to the Discover page to add some movies and shows!</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: '2rem' }}>
          {favorites.map(movie => (
            <MovieCard key={movie.id} movie={movie} onRemoveFromFavorites={removeFromFavorites} />
          ))}
        </div>
      )}
    </div>
  );
}