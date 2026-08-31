import { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import type { FavoritesContextType } from '../context/FavoritesContext';

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider');
  }
  return context;
};
