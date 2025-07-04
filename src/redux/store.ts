import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { numberFactsApi } from "../services/numberFactsApi";
import themeReducer from "./features/themeSlice";
import favoritesReducer from "./features/favoritesSlice";
import historyReducer from "./features/historySlice";
import localeReducer from "./features/localeSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    favorites: favoritesReducer,
    history: historyReducer,
    locale: localeReducer,
    [numberFactsApi.reducerPath]: numberFactsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(numberFactsApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
