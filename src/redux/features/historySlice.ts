import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NumberFact } from "../../types";

interface HistoryState {
  facts: NumberFact[];
  maxItems: number;
}

const getInitialHistory = (): NumberFact[] => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }
  return [];
};

const initialState: HistoryState = {
  facts: getInitialHistory(),
  maxItems: 50,
};

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<NumberFact>) => {
      const newFact = {
        ...action.payload,
        timestamp: Date.now(),
      };

      // Remove duplicate if exists
      state.facts = state.facts.filter(
        (fact) =>
          !(
            fact.number === action.payload.number &&
            fact.category === action.payload.category
          )
      );

      // Add to beginning
      state.facts.unshift(newFact);

      // Keep only maxItems
      if (state.facts.length > state.maxItems) {
        state.facts = state.facts.slice(0, state.maxItems);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("history", JSON.stringify(state.facts));
      }
    },

    removeFromHistory: (
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
        localStorage.setItem("history", JSON.stringify(state.facts));
      }
    },

    clearHistory: (state) => {
      state.facts = [];

      if (typeof window !== "undefined") {
        localStorage.removeItem("history");
      }
    },

    loadHistory: (state) => {
      state.facts = getInitialHistory();
    },

    setMaxItems: (state, action: PayloadAction<number>) => {
      state.maxItems = action.payload;
      if (state.facts.length > state.maxItems) {
        state.facts = state.facts.slice(0, state.maxItems);
        if (typeof window !== "undefined") {
          localStorage.setItem("history", JSON.stringify(state.facts));
        }
      }
    },
  },
});

export const {
  addToHistory,
  removeFromHistory,
  clearHistory,
  loadHistory,
  setMaxItems,
} = historySlice.actions;

export default historySlice.reducer;
