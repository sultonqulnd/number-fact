import { numberFactsApi } from "../services/numberFactsApi";
import { NumberFact, FactCategory } from "../types";

// Export the RTK Query API
export const numberFactApi = numberFactsApi;

// Custom API error class
export class ApiError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

// Simple API wrapper for server actions
export const simpleApi = {
  async getNumberFact(
    number: string,
    category: FactCategory
  ): Promise<NumberFact> {
    try {
      const response = await fetch(
        `https://numbersapi.com/${number}/${category}`,
        {
          headers: {
            Accept: "text/plain",
            "User-Agent": "NumberFactsApp/1.0",
          },
        }
      );

      if (!response.ok) {
        throw new ApiError(
          `API request failed: ${response.statusText}`,
          response.status
        );
      }

      const fact = await response.text();

      return {
        number: number === "random" ? fact.split(" ")[0] : number,
        category,
        fact: fact.trim(),
        timestamp: Date.now(),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        `Failed to fetch number fact: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
