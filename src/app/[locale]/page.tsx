"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { NumberFactForm } from "../../components/NumberFactForm";
import { NumberFactResult } from "../../components/NumberFactResult";
import { ThemeToggle } from "../../components/ThemeToggle";
import { LangSelect } from "../../components/LangSelect";
import { FavoritesList } from "../../components/FavoritesList";
import { HistoryList } from "../../components/HistoryList";
import { useAppDispatch } from "../../hooks";
import { addToFavorites } from "../../redux/features/favoritesSlice";
import { NumberFact } from "../../types";
import { Toaster } from "sonner";

export default function HomePage() {
  const t = useTranslations();
  const [currentFact, setCurrentFact] = useState<NumberFact | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "favorites" | "history">(
    "form"
  );
  const dispatch = useAppDispatch();

  const handleFactReceived = (fact: NumberFact) => {
    setCurrentFact(fact);
  };

  const handleAddToFavorites = (fact: NumberFact) => {
    dispatch(addToFavorites(fact));
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("app.title")}
            </h1>
            <div className="flex items-center gap-2">
              <LangSelect />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form and Result */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("form")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "form"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("navigation.search")}
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "favorites"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("navigation.favorites")}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "history"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("navigation.history")}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "form" && (
              <div className="space-y-6">
                <NumberFactForm onFactReceived={handleFactReceived} />
                {currentFact && (
                  <NumberFactResult
                    fact={currentFact}
                    onAddToFavorites={handleAddToFavorites}
                  />
                )}
              </div>
            )}

            {activeTab === "favorites" && <FavoritesList />}
            {activeTab === "history" && <HistoryList />}
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">
                {t("info.about.title")}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t("info.about.description")}
              </p>
              <div className="space-y-2 text-sm">
                {t
                  .raw("info.about.features")
                  .map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span>{feature}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">
                {t("info.categories.title")}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>{t("info.categories.trivia")}</span>
                  <span className="text-muted-foreground">trivia</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("info.categories.math")}</span>
                  <span className="text-muted-foreground">math</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t("info.categories.date")}</span>
                  <span className="text-muted-foreground">date</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
