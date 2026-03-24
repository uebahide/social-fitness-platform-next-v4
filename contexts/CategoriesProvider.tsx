'use client';

import { Category } from '@/types/api/category';
import { createContext, useContext, useState } from 'react';

type CategoriesState = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
};

const categoriesContext = createContext<CategoriesState | undefined>(undefined);

export const CategoriesProvider = ({
  initialCategories,
  children,
}: {
  initialCategories: Category[];
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  return (
    <categoriesContext.Provider value={{ categories, setCategories }}>
      {children}
    </categoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(categoriesContext);
  if (!context) throw new Error('useCategories must be used within CategoriesProvider');
  return context;
};
