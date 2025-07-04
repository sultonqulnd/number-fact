"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Moon, Sun, Monitor } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setTheme, updateResolvedTheme } from "../redux/features/themeSlice";
import { Theme } from "../redux/features/themeSlice";

export function ThemeToggle() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { theme, resolvedTheme } = useAppSelector((state) => state.theme);

  useEffect(() => {
    // Update resolved theme when system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => dispatch(updateResolvedTheme());

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [dispatch]);

  const toggleTheme = () => {
    const themes: Theme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    dispatch(setTheme(nextTheme));
  };

  const getIcon = () => {
    if (theme === "system") {
      return <Monitor className="h-4 w-4" />;
    }
    return resolvedTheme === "dark" ? (
      <Sun className="h-4 w-4" />
    ) : (
      <Moon className="h-4 w-4" />
    );
  };

  const getLabel = () => {
    switch (theme) {
      case "light":
        return t("theme.light");
      case "dark":
        return t("theme.dark");
      case "system":
        return t("theme.system");
      default:
        return t("theme.toggle");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="transition-all duration-200 hover:scale-105"
      aria-label={getLabel()}
      title={getLabel()}
    >
      {getIcon()}
    </Button>
  );
}
