import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  createElement,
} from 'react';
import Snackbar from '../components/Snackbar/Snackbar';

export type SnackbarVariants = 'success' | 'error' | 'warning' | 'info';

export type TSnackbarOptions = {
  variant?: SnackbarVariants;
  duration?: number;
};

export type TSnackbarItem = {
  message: string;
  options?: TSnackbarOptions;
};

export interface ISnackbarContextValues {
  enqueueSnackbar: (snackBarItem: TSnackbarItem) => void;
}

const SnackbarContext = createContext({
  enqueueSnackbar: (snackBarItem: TSnackbarItem) => {},
});

export function useSnackbar() {
  return useContext(SnackbarContext);
}

export default function SnackbarContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [snackbarItems, setSetSnackbarItems] = useState<TSnackbarItem[]>([]);

  const enqueueSnackbar = (snackBarItem: TSnackbarItem) => {
    setSetSnackbarItems((prevSnackbarItems) =>
      prevSnackbarItems.concat(snackBarItem)
    );
  };

  const value: ISnackbarContextValues = {
    enqueueSnackbar,
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {snackbarItems.map((snackbarItem) =>
        createElement(
          Snackbar,
          {
            message: snackbarItem.message,
            duration: snackbarItem?.options?.duration ?? 1500,
            variant: snackbarItem?.options?.variant ?? 'info',
          },
          null
        )
      )}
    </SnackbarContext.Provider>
  );
}
