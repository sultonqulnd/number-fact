import { ApiConfig, FactCategory } from "../types";

// API Configuration
export const API_CONFIG: ApiConfig = {
  baseUrl: "https://numbersapi.com",
  timeout: 10000,
  retries: 3,
};

// Application Constants
export const APP_NAME = "Number Facts";
export const APP_VERSION = "1.0.0";

// Form Validation
export const VALIDATION_MESSAGES = {
  REQUIRED_NUMBER: "Пожалуйста, введите число.",
  INVALID_NUMBER: "Число должно быть в цифровом формате.",
  INVALID_FORM_DATA: "Неверные данные формы.",
  NETWORK_ERROR:
    "Ошибка подключения к серверу. Проверьте интернет-соединение и попробуйте снова.",
  TIMEOUT_ERROR:
    "Превышено время ожидания ответа от сервера. Проверьте подключение к интернету.",
  NOT_FOUND: "Факт для данного числа не найден. Попробуйте другое число.",
  SERVER_ERROR: "Сервер NumbersAPI временно недоступен. Попробуйте позже.",
  UNKNOWN_ERROR: "Произошла неизвестная ошибка при обращении к API.",
} as const;

// Category Labels
export const CATEGORY_LABELS: Record<FactCategory, string> = {
  trivia: "Общий (Trivia)",
  math: "Математический (Math)",
  date: "Дата (Date)",
} as const;

// UI Constants
export const UI_CONSTANTS = {
  LOADING_TEXT: "Загрузка...",
  SUBMIT_TEXT: "Получить факт",
  ERROR_TITLE: "Ошибка!",
  RESULT_TITLE: "Ваш результат",
  NUMBER_LABEL: "Число",
  CATEGORY_LABEL: "Категория",
  FACT_LABEL: "Факт",
  RANDOM_NUMBER_LABEL: "Случайное число",
  NUMBER_PLACEHOLDER: "Например: 42",
  CATEGORY_PLACEHOLDER: "Выберите категорию",
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;
