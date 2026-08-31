import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '../types';
import { useAuth } from '../hooks/useAuth';
import { getFavoritesApi, addFavoriteApi, removeFavoriteApi } from '../api/favorites.api';
import { FavoritesContext } from './FavoritesContext';

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const refreshFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setFavoriteIds(new Set());
      return;
    }

    try {
      const data = await getFavoritesApi();
      setFavorites(data);
      setFavoriteIds(new Set(data.map((item) => item.id)));
    } catch {
      // Si falla por 401 o red, se mantiene seguro
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    getFavoritesApi()
      .then((data) => {
        if (isMounted) {
          setFavorites(data);
          setFavoriteIds(new Set(data.map((item) => item.id)));
        }
      })
      .catch(() => {
        // Ignorar errores en carga inicial
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const isFavorite = useCallback(
    (eventId: string): boolean => {
      return favoriteIds.has(eventId);
    },
    [favoriteIds]
  );

  const toggleFavorite = async (event: Event) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const alreadyFav = favoriteIds.has(event.id);

    if (alreadyFav) {
      // Quitar de favoritos de forma optimista
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.delete(event.id);
        return next;
      });
      setFavorites((prev) => prev.filter((item) => item.id !== event.id));

      try {
        await removeFavoriteApi(event.id);
      } catch (err: unknown) {
        // Un 404 no debe romper la interfaz
        console.warn('Error al eliminar favorito (se mantiene limpio):', err);
      }
    } else {
      // Agregar a favoritos de forma optimista
      setFavoriteIds((prev) => new Set(prev).add(event.id));
      setFavorites((prev) => [event, ...prev]);

      try {
        await addFavoriteApi(event.id);
      } catch (err: unknown) {
        // Un 409 (ya existe) o 404 no debe romper la interfaz
        console.warn('Error al agregar favorito (409/404 manejado):', err);
      }
    }
  };

  const activeFavorites = isAuthenticated ? favorites : [];
  const activeFavoriteIds = isAuthenticated ? favoriteIds : new Set<string>();

  return (
    <FavoritesContext.Provider
      value={{
        favorites: activeFavorites,
        favoriteIds: activeFavoriteIds,
        isLoading,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
