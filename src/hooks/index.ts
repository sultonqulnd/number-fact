import { useState, useCallback } from "react";
import { NumberFact, FactCategory } from "../types";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";

// Custom hook for form state management
export function useNumberFactForm() {
  const [isRandom, setIsRandom] = useState(false);
  const [number, setNumber] = useState("");
  const [category, setCategory] = useState<FactCategory>("trivia");

  const handleRandomToggle = useCallback((checked: boolean) => {
    setIsRandom(checked);
    if (checked) {
      setNumber("");
    }
  }, []);

  const handleNumberChange = useCallback((value: string) => {
    setNumber(value);
  }, []);

  const handleCategoryChange = useCallback((value: FactCategory) => {
    setCategory(value);
  }, []);

  const resetForm = useCallback(() => {
    setIsRandom(false);
    setNumber("");
    setCategory("trivia");
  }, []);

  return {
    formState: {
      isRandom,
      number,
      category,
    },
    handlers: {
      handleRandomToggle,
      handleNumberChange,
      handleCategoryChange,
      resetForm,
    },
  };
}

// Custom hook for result display
export function useResultDisplay() {
  const [result, setResult] = useState<NumberFact | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayResult = useCallback((fact: NumberFact) => {
    setResult(fact);
    setError(null);
  }, []);

  const displayError = useCallback((message: string) => {
    setError(message);
    setResult(null);
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    error,
    handlers: {
      displayResult,
      displayError,
      clearResult,
    },
  };
}

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
