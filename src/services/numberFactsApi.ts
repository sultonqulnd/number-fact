import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { NumberFact, FactCategory } from "../types";

// Fallback facts when API is down
const fallbackFacts: Record<FactCategory, string[]> = {
  trivia: [
    "42 is the answer to the ultimate question of life, the universe, and everything.",
    "7 is considered a lucky number in many cultures.",
    "13 is often considered unlucky in Western culture.",
    "0 is the only number that cannot be represented in Roman numerals.",
    "1 is the first natural number and the foundation of all counting.",
  ],
  math: [
    "42 is the product of 6 and 7.",
    "7 is a prime number.",
    "13 is also a prime number.",
    "0 is the additive identity element.",
    "1 is the multiplicative identity element.",
  ],
  date: [
    "42 days from now will be a special day.",
    "7 days make up a week.",
    "13 is the number of weeks in a quarter.",
    "0 represents the beginning of time.",
    "1 represents the first day of any month.",
  ],
};

const getRandomFallbackFact = (
  category: FactCategory,
  number: string
): NumberFact => {
  const facts = fallbackFacts[category];
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  return {
    number,
    category,
    fact: randomFact,
    timestamp: Date.now(),
  };
};

export const numberFactsApi = createApi({
  reducerPath: "numberFactsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://numbersapi.com",
    prepareHeaders: (headers) => {
      headers.set("User-Agent", "NumberFactsApp/1.0");
      return headers;
    },
  }),
  tagTypes: ["NumberFact"],
  endpoints: (builder) => ({
    getNumberFact: builder.query<
      NumberFact,
      { number: string; category: FactCategory }
    >({
      async queryFn({ number, category }, api, extraOptions, baseQuery) {
        try {
          const result = await baseQuery({
            url: `/${number}/${category}`,
            method: "GET",
            headers: {
              Accept: "text/plain",
            },
          });

          if (result.error) {
            // If API fails, return fallback fact
            return { data: getRandomFallbackFact(category, number) };
          }

          const fact =
            typeof result.data === "string" ? result.data : String(result.data);
          return {
            data: {
              number: number === "random" ? fact.split(" ")[0] : number,
              category,
              fact: fact.trim(),
              timestamp: Date.now(),
            },
          };
        } catch {
          // If any error occurs, return fallback fact
          return { data: getRandomFallbackFact(category, number) };
        }
      },
      providesTags: (result, error, { number, category }) =>
        result ? [{ type: "NumberFact", id: `${number}-${category}` }] : [],
    }),

    getRandomFact: builder.query<NumberFact, FactCategory>({
      async queryFn(category, api, extraOptions, baseQuery) {
        try {
          const result = await baseQuery({
            url: `/random/${category}`,
            method: "GET",
            headers: {
              Accept: "text/plain",
            },
          });

          if (result.error) {
            // If API fails, return fallback fact with random number
            const randomNumber = Math.floor(Math.random() * 100) + 1;
            return {
              data: getRandomFallbackFact(category, randomNumber.toString()),
            };
          }

          const fact =
            typeof result.data === "string" ? result.data : String(result.data);
          return {
            data: {
              number: fact.split(" ")[0],
              category,
              fact: fact.trim(),
              timestamp: Date.now(),
            },
          };
        } catch {
          // If any error occurs, return fallback fact with random number
          const randomNumber = Math.floor(Math.random() * 100) + 1;
          return {
            data: getRandomFallbackFact(category, randomNumber.toString()),
          };
        }
      },
      providesTags: ["NumberFact"],
    }),

    getFactByCategory: builder.query<NumberFact[], FactCategory>({
      async queryFn(category, api, extraOptions, baseQuery) {
        try {
          const result = await baseQuery({
            url: `/category/${category}`,
            method: "GET",
          });

          if (result.error) {
            // If API fails, return fallback facts
            return {
              data: fallbackFacts[category].map((fact, index) => ({
                number: (index + 1).toString(),
                category,
                fact,
                timestamp: Date.now(),
              })),
            };
          }

          const response = result.data as unknown[];
          return {
            data: response.map((item, index) => {
              const data = item as {
                number?: string;
                category?: string;
                fact?: string;
              };
              return {
                number: data.number || (index + 1).toString(),
                category: (data.category as FactCategory) || "trivia",
                fact:
                  data.fact ||
                  fallbackFacts[category][
                    index % fallbackFacts[category].length
                  ],
                timestamp: Date.now(),
              };
            }),
          };
        } catch {
          // If any error occurs, return fallback facts
          return {
            data: fallbackFacts[category].map((fact, index) => ({
              number: (index + 1).toString(),
              category,
              fact,
              timestamp: Date.now(),
            })),
          };
        }
      },
      providesTags: (result) =>
        result
          ? result.map(({ number, category }) => ({
              type: "NumberFact",
              id: `${number}-${category}`,
            }))
          : [],
    }),
  }),
});

export const {
  useGetNumberFactQuery,
  useGetRandomFactQuery,
  useGetFactByCategoryQuery,
} = numberFactsApi;
