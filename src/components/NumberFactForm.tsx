"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  useGetNumberFactQuery,
  useGetRandomFactQuery,
} from "../services/numberFactsApi";
import { useAppDispatch } from "../hooks";
import { addToHistory } from "../redux/features/historySlice";
import { FactCategory, NumberFact } from "../types";
import { LoadingSpinner } from "./LoadingSpinner";

interface NumberFactFormProps {
  onFactReceived: (fact: NumberFact) => void;
}

export function NumberFactForm({ onFactReceived }: NumberFactFormProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    number: "",
    category: "trivia" as FactCategory,
    isRandom: false,
  });

  const [shouldFetch, setShouldFetch] = useState(false);
  const [queryParams, setQueryParams] = useState<{
    number: string;
    category: FactCategory;
  } | null>(null);

  const dispatch = useAppDispatch();

  // RTK Query hooks
  const {
    data: fact,
    error,
    isLoading,
  } = useGetNumberFactQuery(queryParams!, {
    skip: !shouldFetch || !queryParams,
  });

  const {
    data: randomFact,
    error: randomError,
    isLoading: randomLoading,
    refetch: refetchRandom,
  } = useGetRandomFactQuery(formData.category, {
    skip: !shouldFetch || !formData.isRandom,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShouldFetch(true);

    if (formData.isRandom) {
      refetchRandom();
    } else {
      if (!formData.number.trim()) return;
      setQueryParams({ number: formData.number, category: formData.category });
    }
  };

  // Handle fact received from regular query
  useEffect(() => {
    if (fact && shouldFetch && !formData.isRandom) {
      onFactReceived(fact);
      dispatch(addToHistory(fact));
      setShouldFetch(false);
      setQueryParams(null);
    }
  }, [fact, shouldFetch, formData.isRandom, onFactReceived, dispatch]);

  // Handle fact received from random query
  useEffect(() => {
    if (randomFact && shouldFetch && formData.isRandom) {
      onFactReceived(randomFact);
      dispatch(addToHistory(randomFact));
      setShouldFetch(false);
    }
  }, [randomFact, shouldFetch, formData.isRandom, onFactReceived, dispatch]);

  const currentError = error || randomError;
  const currentLoading = isLoading || randomLoading;

  return (
    <Card className="w-full max-w-md mx-auto transition-all duration-300 hover:shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {t("form.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              {t("form.category")}
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value: FactCategory) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
              disabled={currentLoading}
            >
              <SelectTrigger className="w-full transition-all">
                <SelectValue placeholder={t("form.categoryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trivia">{t("categories.trivia")}</SelectItem>
                <SelectItem value="math">{t("categories.math")}</SelectItem>
                <SelectItem value="date">{t("categories.date")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRandom"
              checked={formData.isRandom}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  isRandom: checked as boolean,
                }))
              }
              disabled={currentLoading}
            />
            <Label htmlFor="isRandom" className="text-sm font-medium">
              {t("form.randomNumber")}
            </Label>
          </div>

          {!formData.isRandom && (
            <div className="space-y-2">
              <Label htmlFor="number" className="text-sm font-medium">
                {t("form.number")}
              </Label>
              <Input
                id="number"
                type="text"
                placeholder={t("form.numberPlaceholder")}
                value={formData.number}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, number: e.target.value }))
                }
                disabled={currentLoading}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={
              currentLoading || (!formData.isRandom && !formData.number.trim())
            }
          >
            {currentLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                {t("form.loading")}
              </div>
            ) : (
              t("form.submit")
            )}
          </Button>

          {currentError && (
            <div className="text-red-500 text-sm text-center">
              {t("actions.error")}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
