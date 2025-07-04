"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { NumberFact } from "../types";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart, Share2, Copy } from "lucide-react";
import { useAppSelector } from "../hooks";
import { toast } from "sonner";

interface NumberFactResultProps {
  fact: NumberFact;
  onAddToFavorites: (fact: NumberFact) => void;
}

export function NumberFactResult({
  fact,
  onAddToFavorites,
}: NumberFactResultProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const favorites = useAppSelector((state) => state.favorites);

  const isFavorite = favorites.facts.some(
    (f) => f.number === fact.number && f.category === fact.category
  );

  const handleToggleFavorite = () => {
    onAddToFavorites(fact);
    toast.success(isFavorite ? t("favorites.removed") : t("favorites.added"));
  };

  const handleShare = async () => {
    const shareText =
      t("result.description", { number: fact.number }) + " " + fact.fact;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t("result.title"),
          text: shareText,
        });
        toast.success(t("actions.shared"));
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    const shareText =
      t("result.description", { number: fact.number }) + " " + fact.fact;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success(t("actions.copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error(t("actions.error"));
    }
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              {t("result.title")}
            </CardTitle>
            <CardDescription>
              {t("result.description", { number: fact.number })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={isFavorite ? "text-red-500" : "text-muted-foreground"}
              title={isFavorite ? t("favorites.remove") : t("favorites.added")}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              title={t("actions.share")}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              title={t("actions.copy")}
              className={copied ? "text-green-500" : ""}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {t("result.number")}
          </p>
          <p className="text-lg font-semibold">{fact.number}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {t("result.category")}
          </p>
          <p className="text-lg font-semibold capitalize">
            {fact.category === "trivia" && t("categories.trivia")}
            {fact.category === "math" && t("categories.math")}
            {fact.category === "date" && t("categories.date")}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {t("result.fact")}
          </p>
          <p className="text-lg leading-relaxed">{fact.fact}</p>
        </div>
      </CardContent>
    </Card>
  );
}
