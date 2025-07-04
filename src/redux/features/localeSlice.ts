import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Locale } from "../../i18n/config";

interface LocaleState {
  currentLocale: Locale;
}

const getInitialLocale = (): Locale => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved && ["en", "ru", "uz"].includes(saved)) {
      return saved;
    }
  }
  return "ru";
};

const initialState: LocaleState = {
  currentLocale: getInitialLocale(),
};

export const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.currentLocale = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("locale", action.payload);

        // Update the URL to reflect the new locale
        const pathname = window.location.pathname;
        const segments = pathname.split("/");
        if (segments[1] && ["en", "ru", "uz"].includes(segments[1])) {
          segments[1] = action.payload;
        } else {
          segments.splice(1, 0, action.payload);
        }
        const newPathname = segments.join("/");
        window.history.replaceState(null, "", newPathname);
      }
    },

    loadLocale: (state) => {
      state.currentLocale = getInitialLocale();
    },
  },
});

export const { setLocale, loadLocale } = localeSlice.actions;
export default localeSlice.reducer;
