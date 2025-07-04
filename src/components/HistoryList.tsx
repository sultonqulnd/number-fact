"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, History, Share2, Copy } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  removeFromHistory,
  clearHistory,
} from "../redux/features/historySlice";
import { NumberFact } from "../types";
import { toast } from "sonner";

export function HistoryList() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const history = useAppSelector((state) => state.history);

  const handleRemove = (fact: NumberFact) => {
    dispatch(
      removeFromHistory({ number: fact.number, category: fact.category })
    );
    toast.success(t("history.removed"));
  };

  const handleClear = () => {
    dispatch(clearHistory());
    toast.success(t("history.cleared"));
  };

  const handleShare = async (fact: NumberFact) => {
    const text =
      t("result.description", { number: fact.number }) + " " + fact.fact;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t("result.title"),
          text,
        });
        toast.success(t("actions.shared"));
      } catch (error) {
        console.error("Ошибка при отправке:", error);
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success(t("actions.copied"));
    }
  };

  const handleCopy = async (fact: NumberFact) => {
    const text =
      t("result.description", { number: fact.number }) + " " + fact.fact;
    await navigator.clipboard.writeText(text);
    toast.success(t("actions.copied"));
  };

  if (history.facts.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-500" />
            {t("history.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            {t("history.empty")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-500" />
          {t("history.title")} ({history.facts.length})
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {t("history.clear")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.facts.map((fact: NumberFact, index: number) => (
          <div
            key={`${fact.number}-${fact.category}-${index}`}
            className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-lg">{fact.number}</span>
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    {fact.category === "trivia" && t("categories.trivia")}
                    {fact.category === "math" && t("categories.math")}
                    {fact.category === "date" && t("categories.date")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{fact.fact}</p>
                {fact.timestamp && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(fact.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare(fact)}
                  className="h-8 w-8 p-0"
                  title={t("actions.share")}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(fact)}
                  className="h-8 w-8 p-0"
                  title={t("actions.copy")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(fact)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  title={t("history.remove")}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
