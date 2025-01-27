// Root Interface (Discriminated Union)
export type MealResponse = Food | NonFood;

export type Food = {
  type: "food"; // Input type is "food"
  meal: Meal; // Meal details, required for "food"
  suggestion: string; // Suggestion for improving the meal
  nonFoodMessage: null; // Always null for "food"
};

export type NonFood = {
  type: "non-food"; // Input type is "non-food"
  meal: null; // Always null for "non-food"
  suggestion: null; // Always null for "non-food"
  nonFoodMessage: string; // Message for "non-food"
};

// Meal Interface
export interface Meal {
  name: string; // Name of the meal
  score: Score; // Meal score details
  macros: Macros; // Nutritional breakdown
}

// Score Interface
export interface Score {
  value: number; // Score value
  max: number; // Maximum score
}

// Macros Interface
export interface Macros {
  calories: number; // Calories in kcal
  protein: number; // Protein in grams
  fat: number; // Fat in grams
  carbohydrates: number; // Carbohydrates in grams
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

export type OpenAIResponse = string | MealResponse | IWeightLossTargetResponse;
