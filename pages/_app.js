// This file wraps all pages with the Layout and WatchlistProvider.
import { WatchlistProvider } from '../context/WatchlistContext';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <WatchlistProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WatchlistProvider>
  );
}

export default MyApp;