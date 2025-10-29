'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, documentId, getDocs } from 'firebase/firestore';
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
  const firestore = useFirestore();

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

  // Remove IDs de animais que não existem mais.
  const pruneFavorites = useCallback(async () => {
    if (!firestore || favorites.length === 0) return;
    try {
      const chunkSize = 10; // Limite do operador 'in'
      const existingIds = new Set<string>();
      for (let i = 0; i < favorites.length; i += chunkSize) {
        const slice = favorites.slice(i, i + chunkSize);
        const q = query(collection(firestore, 'animals'), where(documentId(), 'in', slice));
        const snap = await getDocs(q);
        snap.forEach(doc => existingIds.add(doc.id));
      }
      const orphanIds = favorites.filter(id => !existingIds.has(id));
      if (orphanIds.length) {
        setFavorites(prev => prev.filter(id => !orphanIds.includes(id)));
        // localStorage será atualizado pelo efeito existente.
      }
    } catch (error) {
      console.error('Falha ao podar favoritos órfãos', error);
    }
  }, [firestore, favorites]);

  // Executa pruning após carregamento inicial e periodicamente.
  useEffect(() => {
    if (isLoaded) {
      pruneFavorites();
      const interval = setInterval(pruneFavorites, 5 * 60 * 1000); // 5 minutos
      return () => clearInterval(interval);
    }
  }, [isLoaded, pruneFavorites]);

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
