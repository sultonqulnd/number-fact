import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
}

const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("theme") as Theme;
    if (saved && ["light", "dark", "system"].includes(saved)) {
      return saved;
    }
  }
  return "system";
};

const getResolvedTheme = (theme: Theme): "light" | "dark" => {
  if (theme === "system" && typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme === "dark" ? "dark" : "light";
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
  resolvedTheme: getResolvedTheme(getInitialTheme()),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      state.resolvedTheme = getResolvedTheme(action.payload);

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);

        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (action.payload === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          root.classList.add(systemTheme);
        } else {
          root.classList.add(action.payload);
        }
      }
    },
    updateResolvedTheme: (state) => {
      state.resolvedTheme = getResolvedTheme(state.theme);
    },
  },
});

export const { setTheme, updateResolvedTheme } = themeSlice.actions;
export default themeSlice.reducer;
