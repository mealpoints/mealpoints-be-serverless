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

export interface IOpenAIMealResponse {
  message: string;
  data?: MealData;
}

export interface IWeightLossTargetResponse {
  target: {
    calories: number; // The target daily calorie intake.
    protein: number; // The target daily protein intake in grams.
    fats: number; // The target daily fat intake in grams.
    carbs: number; // The target daily carbohydrate intake in grams.
  };
  message: string; // A message regarding the weight loss target and advice.
}

export type OpenAIResponse =
  | string
  | IOpenAIMealResponse
  | IWeightLossTargetResponse;
