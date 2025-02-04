'use client';

import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

export type BreadcrumbListItem = {
  name?: string;
  link?: string;
};

export interface BreadcrumbsContextProps {
  items?: BreadcrumbListItem[];
  setItems: Dispatch<SetStateAction<BreadcrumbListItem[] | undefined>>;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextProps | undefined>(undefined);

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider');
  }
  return context;
};

type BreadcrumbsProviderProps = PropsWithChildren;

export const BreadcrumbsProvider: FC<BreadcrumbsProviderProps> = ({ children }) => {
  const [items, setItems] = useState<BreadcrumbListItem[] | undefined>();
  return (
    <BreadcrumbsContext.Provider
      value={{
        items,
        setItems,
      }}
    >
      {children}
    </BreadcrumbsContext.Provider>
  );
};
