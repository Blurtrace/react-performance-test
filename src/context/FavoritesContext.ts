import { createContext } from 'react';
import type { Event } from '../types';

export interface FavoritesContextType {
  favorites: Event[];
  favoriteIds: Set<string>;
  isLoading: boolean;
  isFavorite: (eventId: string) => boolean;
  toggleFavorite: (event: Event) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
