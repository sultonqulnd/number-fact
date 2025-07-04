"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setLocale } from "../redux/features/localeSlice";
import { localeNames, localeFlags, type Locale } from "../i18n/config";

export function LangSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentLocale = useAppSelector((state) => state.locale.currentLocale);

  const handleLocaleChange = (locale: Locale) => {
    // Update Redux state
    dispatch(setLocale(locale));

    // Navigate to the new locale path
    const segments = pathname.split("/");
    segments[1] = locale; // Replace the locale segment
    const newPath = segments.join("/");
    window.location.href = newPath;

    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="transition-all duration-200 hover:scale-105"
        aria-label="Select language"
        title={localeNames[currentLocale]}
      >
        <Globe className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg z-50">
          <div className="py-1">
            {Object.entries(localeNames).map(([locale, name]) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale as Locale)}
                className={`w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-2 ${
                  currentLocale === locale ? "bg-muted" : ""
                }`}
              >
                <span className="text-lg">{localeFlags[locale as Locale]}</span>
                <span className="text-sm">{name}</span>
                {currentLocale === locale && (
                  <span className="ml-auto text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
