import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NumberFact } from "../../types";

interface FavoritesState {
  facts: NumberFact[];
}

const getInitialFavorites = (): NumberFact[] => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const initialState: FavoritesState = {
  facts: getInitialFavorites(),
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<NumberFact>) => {
      const exists = state.facts.some(
        (fact) =>
          fact.number === action.payload.number &&
          fact.category === action.payload.category
      );

      if (!exists) {
        state.facts.push({
          ...action.payload,
          timestamp: Date.now(),
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("favorites", JSON.stringify(state.facts));
        }
      }
    },

    removeFromFavorites: (
      state,
      action: PayloadAction<{ number: string; category: string }>
    ) => {
      state.facts = state.facts.filter(
        (fact) =>
          !(
            fact.number === action.payload.number &&
            fact.category === action.payload.category
          )
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("favorites", JSON.stringify(state.facts));
      }
    },

    clearFavorites: (state) => {
      state.facts = [];

      if (typeof window !== "undefined") {
        localStorage.removeItem("favorites");
      }
    },

    loadFavorites: (state) => {
      state.facts = getInitialFavorites();
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  loadFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
