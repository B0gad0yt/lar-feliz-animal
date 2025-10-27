'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Animal } from '@/lib/types';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (animalId: string) => void;
  removeFavorite: (animalId: string) => void;
  isFavorite: (animalId: string) => boolean;
  toggleFavorite: (animalId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = 'lar-feliz-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = (animalId: string) => {
    setFavorites((prev) => {
      if (prev.includes(animalId)) return prev;
      return [...prev, animalId];
    });
  };

  const removeFavorite = (animalId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== animalId));
  };

  const isFavorite = (animalId: string) => {
    return favorites.includes(animalId);
  };

  const toggleFavorite = (animalId: string) => {
    if (isFavorite(animalId)) {
      removeFavorite(animalId);
    } else {
      addFavorite(animalId);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
