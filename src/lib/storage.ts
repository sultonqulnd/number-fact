import { NumberFact } from "../types";

// Storage keys
const STORAGE_KEYS = {
  FAVORITES: "number-facts-favorites",
  HISTORY: "number-facts-history",
} as const;

// Storage limits
const STORAGE_LIMITS = {
  HISTORY_MAX_ITEMS: 50,
  FAVORITES_MAX_ITEMS: 100,
} as const;

// Storage utility functions
export const storage = {
  // Get item from localStorage with error handling
  get: <T>(key: string, defaultValue: T): T => {
    try {
      if (typeof window === "undefined") return defaultValue;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  // Set item to localStorage with error handling
  set: <T>(key: string, value: T): boolean => {
    try {
      if (typeof window === "undefined") return false;
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },

  // Remove item from localStorage
  remove: (key: string): boolean => {
    try {
      if (typeof window === "undefined") return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },
};

// Favorites management
export interface FavoriteFact extends NumberFact {
  addedAt: string;
  id: string;
}

export const favoritesManager = {
  // Get all favorites
  getAll: (): FavoriteFact[] => {
    return storage.get<FavoriteFact[]>(STORAGE_KEYS.FAVORITES, []);
  },

  // Add fact to favorites
  add: (fact: NumberFact): boolean => {
    const favorites = favoritesManager.getAll();
    const existingIndex = favorites.findIndex(
      (f) => f.number === fact.number && f.category === fact.category
    );

    if (existingIndex !== -1) {
      return false; // Already exists
    }

    const newFavorite: FavoriteFact = {
      ...fact,
      id: `${fact.number}-${fact.category}-${Date.now()}`,
      addedAt: new Date().toISOString(),
    };

    // Limit the number of favorites
    if (favorites.length >= STORAGE_LIMITS.FAVORITES_MAX_ITEMS) {
      favorites.shift(); // Remove oldest
    }

    favorites.push(newFavorite);
    return storage.set(STORAGE_KEYS.FAVORITES, favorites);
  },

  // Remove fact from favorites
  remove: (id: string): boolean => {
    const favorites = favoritesManager.getAll();
    const filtered = favorites.filter((f) => f.id !== id);
    return storage.set(STORAGE_KEYS.FAVORITES, filtered);
  },

  // Check if fact is in favorites
  isFavorite: (fact: NumberFact): boolean => {
    const favorites = favoritesManager.getAll();
    return favorites.some(
      (f) => f.number === fact.number && f.category === fact.category
    );
  },

  // Get favorite by id
  getById: (id: string): FavoriteFact | null => {
    const favorites = favoritesManager.getAll();
    return favorites.find((f) => f.id === id) || null;
  },
};

// History management
export interface HistoryItem extends NumberFact {
  searchedAt: string;
  id: string;
}

export const historyManager = {
  // Get all history
  getAll: (): HistoryItem[] => {
    return storage.get<HistoryItem[]>(STORAGE_KEYS.HISTORY, []);
  },

  // Add fact to history
  add: (fact: NumberFact): boolean => {
    const history = historyManager.getAll();
    const existingIndex = history.findIndex(
      (h) => h.number === fact.number && h.category === fact.category
    );

    const newHistoryItem: HistoryItem = {
      ...fact,
      id: `${fact.number}-${fact.category}-${Date.now()}`,
      searchedAt: new Date().toISOString(),
    };

    // Remove existing item if found
    if (existingIndex !== -1) {
      history.splice(existingIndex, 1);
    }

    // Add to beginning (most recent first)
    history.unshift(newHistoryItem);

    // Limit the number of history items
    if (history.length > STORAGE_LIMITS.HISTORY_MAX_ITEMS) {
      history.splice(STORAGE_LIMITS.HISTORY_MAX_ITEMS);
    }

    return storage.set(STORAGE_KEYS.HISTORY, history);
  },

  // Clear all history
  clear: (): boolean => {
    return storage.remove(STORAGE_KEYS.HISTORY);
  },

  // Remove specific item from history
  remove: (id: string): boolean => {
    const history = historyManager.getAll();
    const filtered = history.filter((h) => h.id !== id);
    return storage.set(STORAGE_KEYS.HISTORY, filtered);
  },
};
