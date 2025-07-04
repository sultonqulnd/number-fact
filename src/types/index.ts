// Core application types
export interface NumberFact {
  number: string;
  category: FactCategory;
  fact: string;
  timestamp?: number;
}

export type FactCategory = "trivia" | "math" | "date";

export interface ApiResponse {
  success: boolean;
  data?: NumberFact;
  error?: string;
}

export interface FormData {
  number?: string;
  category: FactCategory;
  isRandom: boolean;
}

// API configuration types
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: string;
}

// UI state types
export interface UIState {
  isLoading: boolean;
  error: AppError | null;
  data: NumberFact | null;
}
