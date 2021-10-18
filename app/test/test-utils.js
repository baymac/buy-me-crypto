import { render } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import AppContextProvider from '../context/AppContextProvider';
import SnackbarContextProvider from '../context/SnackbarContextProvider';
import WalletContextProvider from '../context/WalletContextProvider';

// Add in any providers here if necessary:
const Providers = ({ children }) => {
  return (
    <SnackbarContextProvider>
      <WalletContextProvider>
        <AppContextProvider>{children}</AppContextProvider>
      </WalletContextProvider>
    </SnackbarContextProvider>
  );
};

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
