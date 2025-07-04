import { NumberFact, FactCategory } from "../types";

// Base API provider interface
export interface ApiProvider {
  name: string;
  baseUrl: string;
  getNumberFact(number: string, category: FactCategory): Promise<NumberFact>;
  isAvailable(): Promise<boolean>;
}

// NumbersAPI provider (primary)
export class NumbersApiProvider implements ApiProvider {
  name = "NumbersAPI";
  baseUrl = "https://numbersapi.com";

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/42/trivia`, {
        method: "HEAD",
        signal: AbortSignal.timeout(3000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getNumberFact(
    number: string,
    category: FactCategory
  ): Promise<NumberFact> {
    const url = `${this.baseUrl}/${number}/${category}`;

    // Try text format first
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/plain",
        "User-Agent": "NumberFactsApp/1.0",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const fact = await response.text();

    if (fact && fact.trim()) {
      return {
        number: number === "random" ? fact.split(" ")[0] : number,
        category,
        fact: fact.trim(),
      };
    }

    throw new Error("Empty response from API");
  }
}

// Math Facts API provider (fallback)
export class MathFactsApiProvider implements ApiProvider {
  name = "MathFactsAPI";
  baseUrl = "https://api.math.tools";

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/numbers/nct/42`, {
        method: "HEAD",
        signal: AbortSignal.timeout(3000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getNumberFact(
    number: string,
    category: FactCategory
  ): Promise<NumberFact> {
    // Map our categories to MathFacts API categories
    const categoryMap: Record<FactCategory, string> = {
      trivia: "nct",
      math: "nct",
      date: "nct",
    };

    const apiCategory = categoryMap[category];
    const url = `${this.baseUrl}/numbers/${apiCategory}/${number}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "NumberFactsApp/1.0",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      number: data.number || number,
      category,
      fact: data.text || data.fact || "Интересный математический факт.",
    };
  }
}

// Local facts provider (offline fallback)
export class LocalFactsProvider implements ApiProvider {
  name = "LocalFacts";
  baseUrl = "local";

  private localFacts: Record<string, Record<string, string>> = {
    trivia: {
      "42": '42 - это ответ на главный вопрос жизни, вселенной и всего такого (из книги "Автостопом по галактике").',
      "7": "7 считается счастливым числом во многих культурах.",
      "13": "13 часто считается несчастливым числом, особенно в западной культуре.",
      "100": "100 - это квадрат числа 10 и основа для процентов.",
      random:
        "Каждое число имеет свою уникальную историю и значение в математике и культуре.",
    },
    math: {
      "42": "42 - это произведение первых трех простых чисел: 2 × 3 × 7.",
      "7": "7 - это простое число, которое нельзя представить как сумму трех квадратов.",
      "13": "13 - это простое число, которое является суммой двух квадратов: 2² + 3².",
      "100":
        "100 = 10² = 2² × 5², это составное число с простыми делителями 2 и 5.",
      random: "Математика - это язык, на котором написана природа.",
    },
    date: {
      "42": "42-й день года - это 11 февраля (в невисокосный год).",
      "7": "7-й день года - это 7 января (в невисокосный год).",
      "13": "13-й день года - это 13 января (в невисокосный год).",
      "100": "100-й день года - это 10 апреля (в невисокосный год).",
      random: "Каждый день года имеет свой уникальный номер и историю.",
    },
  };

  async isAvailable(): Promise<boolean> {
    return true; // Always available
  }

  async getNumberFact(
    number: string,
    category: FactCategory
  ): Promise<NumberFact> {
    const facts = this.localFacts[category];
    const fact = facts[number] || facts["random"] || "Интересный факт о числе.";

    return {
      number: number === "random" ? "Случайное" : number,
      category,
      fact,
    };
  }
}

// Multi-provider API service
export class MultiApiService {
  private providers: ApiProvider[] = [
    new NumbersApiProvider(),
    new MathFactsApiProvider(),
    new LocalFactsProvider(),
  ];

  async getNumberFact(
    number: string,
    category: FactCategory
  ): Promise<NumberFact> {
    let lastError: Error | null = null;

    for (const provider of this.providers) {
      try {
        // Check if provider is available
        const isAvailable = await provider.isAvailable();
        if (!isAvailable) {
          console.log(`Provider ${provider.name} is not available`);
          continue;
        }

        // Try to get fact from this provider
        const fact = await provider.getNumberFact(number, category);
        console.log(`Successfully got fact from ${provider.name}`);
        return fact;
      } catch (error) {
        lastError = error as Error;
        console.error(`Error with provider ${provider.name}:`, error);
        continue;
      }
    }

    // If all providers failed, throw the last error
    throw lastError || new Error("All API providers are unavailable");
  }

  async getAvailableProviders(): Promise<string[]> {
    const available: string[] = [];

    for (const provider of this.providers) {
      try {
        const isAvailable = await provider.isAvailable();
        if (isAvailable) {
          available.push(provider.name);
        }
      } catch {
        // Provider is not available
      }
    }

    return available;
  }
}

// Export singleton instance
export const multiApiService = new MultiApiService();
