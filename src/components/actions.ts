"use server";

import { simpleApi, ApiError } from "../lib/api";
import { validateFormData, validationRules } from "../lib/validation";
import { VALIDATION_MESSAGES } from "../utils/constants";
import { NumberFact } from "../types";

// Server action state interface
export interface State {
  message?: string | null;
  data?: NumberFact | null;
}

// Main server action for getting number facts
export async function getNumberFact(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    // Validate form data
    const validatedData = validateFormData({
      number: formData.get("number"),
      category: formData.get("category"),
      isRandom: formData.get("isRandom"),
    });

    const { number, category, isRandom } = validatedData;

    // Additional validation
    const requiredError = validationRules.number.required(isRandom, number);
    if (requiredError) {
      return { message: requiredError };
    }

    const formatError = validationRules.number.format(number);
    if (formatError) {
      return { message: formatError };
    }

    // Determine number to fetch
    const numberToFetch = isRandom ? "random" : number || "";

    // Fetch fact from API
    const fact = await simpleApi.getNumberFact(numberToFetch, category);

    // Save to history (this will be handled on the client side)
    // We can't directly access localStorage in server actions, so we'll handle this in the client

    return {
      data: fact,
    };
  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return {
        message: VALIDATION_MESSAGES.INVALID_FORM_DATA,
      };
    }

    // Handle API errors
    if (error instanceof ApiError) {
      return {
        message: error.message,
      };
    }

    // Handle unknown errors
    return {
      message: VALIDATION_MESSAGES.UNKNOWN_ERROR,
    };
  }
}
