import { IUserMeal } from "../../shared/models/userMeal.model";

export const USER_MEAL: Record<string, IUserMeal> = {
  // @ts-expect-error - This is a mock object
  kadhiPakoraWithRoti: {
    id: "6734f339b73e94bf47a529f8",
    user: "669ac7abf64c637ab093b9bc",
    name: "Kadhi Pakora with Roti",
    score: {
      value: 7.8,
      total: 10,
    },
    macros: {
      calories: {
        value: 350,
        unit: "kcal",
      },
      protein: {
        value: 9,
        unit: "grams",
      },
      fat: {
        value: 10,
        unit: "grams",
      },
      carbohydrates: {
        value: 58,
        unit: "grams",
      },
      fiber: {
        value: 5,
        unit: "grams",
      },
      sugars: {
        value: 6,
        unit: "grams",
      },
    },
  },
  // @ts-expect-error - This is a mock object
  rajmaChawal: {
    id: "6734f339b73e94bf47a529f9",
    name: "Rajma Chawal",
    score: {
      value: 8.5,
      total: 10,
    },
    macros: {
      calories: {
        value: 400,
        unit: "kcal",
      },
      protein: {
        value: 15,
        unit: "grams",
      },
      fat: {
        value: 12,
        unit: "grams",
      },
      carbohydrates: {
        value: 60,
        unit: "grams",
      },
      fiber: {
        value: 6,
        unit: "grams",
      },
      sugars: {
        value: 7,
        unit: "grams",
      },
    },
  },
  // @ts-expect-error - This is a mock object
  broccoliSalad: {
    id: "6734f339b73e94bf47a529f9",
    name: "Broccoli Salad",
    score: {
      value: 8.5,
      total: 10,
    },
    macros: {
      calories: {
        value: 400,
        unit: "kcal",
      },
      protein: {
        value: 15,
        unit: "grams",
      },
      fat: {
        value: 12,
        unit: "grams",
      },
      carbohydrates: {
        value: 60,
        unit: "grams",
      },
      fiber: {
        value: 6,
        unit: "grams",
      },
      sugars: {
        value: 7,
        unit: "grams",
      },
    },
  },
};
