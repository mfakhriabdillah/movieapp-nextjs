// 1. New File: components/Layout.js
// This component provides a consistent header and layout for all pages.
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '1rem 2rem' }}>
        <nav style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#111827', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Movie Finder
          </Link>
          <div>
            <Link href="/" style={{ textDecoration: 'none', color: '#3b82f6', marginRight: '1.5rem', fontSize: '1rem' }}>
              Discover
            </Link>
            <Link href="/watchlist" style={{ textDecoration: 'none', color: '#3b82f6', fontSize: '1rem' }}>
              My Watchlist
            </Link>
          </div>
        </nav>
      </header>
      <main style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
