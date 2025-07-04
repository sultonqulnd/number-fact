import { VALIDATION_MESSAGES } from "../utils/constants";
import { NumberFact, FactCategory } from "../types";
import { multiApiService } from "./api-providers";

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number,
    public details?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// API service class
export class NumberFactApiService {
  async getNumberFact(
    number: string,
    category: FactCategory
  ): Promise<NumberFact> {
    try {
      const fact = await multiApiService.getNumberFact(number, category);
      return fact;
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific error cases
        if (error.message.includes("404")) {
          throw new ApiError("NOT_FOUND", VALIDATION_MESSAGES.NOT_FOUND);
        }

        if (error.message.includes("5")) {
          throw new ApiError("SERVER_ERROR", VALIDATION_MESSAGES.SERVER_ERROR);
        }

        if (error.message.includes("timeout")) {
          throw new ApiError("TIMEOUT", VALIDATION_MESSAGES.TIMEOUT_ERROR);
        }

        if (
          error.message.includes("fetch") ||
          error.message.includes("network")
        ) {
          throw new ApiError("NETWORK", VALIDATION_MESSAGES.NETWORK_ERROR);
        }

        throw new ApiError("API_ERROR", error.message);
      }

      throw new ApiError("UNKNOWN", VALIDATION_MESSAGES.UNKNOWN_ERROR);
    }
  }

  // Get available API providers
  async getAvailableProviders(): Promise<string[]> {
    return multiApiService.getAvailableProviders();
  }
}

// Export singleton instance
export const numberFactApi = new NumberFactApiService();
