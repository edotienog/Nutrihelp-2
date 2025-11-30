export interface UserProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  healthConditions: string[]; // e.g., Diabetes, Hypertension
  allergies: string[]; // e.g., Peanuts, Gluten
  dietaryPreferences: string[]; // e.g., Vegetarian, Low Salt
}

export interface Ingredient {
  item: string;
  amount: string;
}

export interface Recipe {
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutritionalHighlights: string[]; // e.g., "High in Fiber", "Low Sodium"
  preparationTime: string;
}

export interface MealPlan {
  date: string;
  meals: Recipe[];
  dailyTips: string[];
}

export interface ScanResult {
  isSafe: boolean;
  productName: string;
  reasoning: string;
  nutritionalAnalysis: string;
  warningLevel: 'Safe' | 'Caution' | 'Danger';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
