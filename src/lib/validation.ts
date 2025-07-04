import { z } from "zod";

// Form validation schema
export const numberFactSchema = z.object({
  number: z.string().optional(),
  category: z.enum(["math", "trivia", "date"] as const),
  isRandom: z.preprocess((val) => val === "on", z.boolean()),
});

// Type for validated form data
export type ValidatedFormData = z.infer<typeof numberFactSchema>;

// Validation helper functions
export const validateNumber = (number: string): boolean => {
  return /^\d+$/.test(number);
};

export const validateFormData = (data: unknown): ValidatedFormData => {
  return numberFactSchema.parse(data);
};

// Custom validation rules
export const validationRules = {
  number: {
    required: (isRandom: boolean, number?: string) => {
      if (!isRandom && !number) {
        return "Пожалуйста, введите число.";
      }
      return null;
    },
    format: (number?: string) => {
      if (number && !validateNumber(number)) {
        return "Число должно быть в цифровом формате.";
      }
      return null;
    },
  },
} as const;
