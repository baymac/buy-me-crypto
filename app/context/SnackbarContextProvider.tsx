import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  createElement,
} from 'react';
import Snackbar from '../components/Snackbar/Snackbar';

export const uniqueId = Math.random().toString(16).slice(2);

export type SnackbarVariants = 'success' | 'error' | 'warning' | 'info';

export type TSnackbarOptions = {
  variant?: SnackbarVariants;
  duration?: number;
};

export type TSnackbarItem = {
  message: string;
  options?: TSnackbarOptions;
};

export type TSnackbarItemInner = TSnackbarItem & { id: string };

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
  const [snackbarItems, setSetSnackbarItems] = useState<TSnackbarItemInner[]>(
    []
  );

  const enqueueSnackbar = (snackBarItem: TSnackbarItem) => {
    setSetSnackbarItems((prevSnackbarItems) =>
      prevSnackbarItems.concat({ ...snackBarItem, id: uniqueId })
    );
  };

  const dequeueSnackbar = (id: string) => {
    setSetSnackbarItems((prevSnackbarItems) =>
      prevSnackbarItems.filter((prevSnackbarItem) => prevSnackbarItem.id !== id)
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
            id: snackbarItem.id,
            message: snackbarItem.message,
            duration: snackbarItem?.options?.duration ?? 1500,
            variant: snackbarItem?.options?.variant ?? 'info',
            dequeueSnackbar: dequeueSnackbar,
          },
          null
        )
      )}
    </SnackbarContext.Provider>
  );
}
