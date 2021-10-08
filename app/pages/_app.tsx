import '../styles/global.css';
import AppContextProvider from '../context/AppContextProvider';
import { ThemeProvider } from 'next-themes';
import { Provider } from 'next-auth/client';
import SnackbarContextProvider from '../context/SnackbarContextProvider';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider enableSystem>
      <SnackbarContextProvider>
        <AppContextProvider>
          <Provider session={pageProps.session}>
            <Component {...pageProps} />
          </Provider>
        </AppContextProvider>
      </SnackbarContextProvider>
    </ThemeProvider>
  );
}
