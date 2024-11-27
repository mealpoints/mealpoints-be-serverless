export type NutritionalData = {
  calories: {
    value: number;
    unit: string;
  };
  protein: {
    value: number;
    unit: string;
  };
  fat: {
    value: number;
    unit: string;
  };
  carbohydrates: {
    value: number;
    unit: string;
  };
  fiber: {
    value: number;
    unit: string;
  };
  sugars: {
    value: number;
    unit: string;
  };
};

export type MealData = {
  meal_name: string;
  score: {
    value: number;
    total: number;
  };
  macros: NutritionalData;
};

export type OpenAIResponseObject = {
  message: string,
  data?: MealData
}

export type OpenAIResponse = OpenAIResponseObject | string

