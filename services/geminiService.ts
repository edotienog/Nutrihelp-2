import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserProfile, MealPlan, ScanResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema definitions for structured output
const ingredientSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    item: { type: Type.STRING },
    amount: { type: Type.STRING },
  },
};

const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    mealType: { type: Type.STRING, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
    description: { type: Type.STRING },
    ingredients: { type: Type.ARRAY, items: ingredientSchema },
    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
    nutritionalHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
    preparationTime: { type: Type.STRING },
  },
};

const mealPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    date: { type: Type.STRING },
    meals: { type: Type.ARRAY, items: recipeSchema },
    dailyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
};

const scanResultSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isSafe: { type: Type.BOOLEAN },
    productName: { type: Type.STRING },
    reasoning: { type: Type.STRING },
    nutritionalAnalysis: { type: Type.STRING },
    warningLevel: { type: Type.STRING, enum: ['Safe', 'Caution', 'Danger'] },
  },
};

export class GeminiService {
  
  static async generateDailyMealPlan(profile: UserProfile): Promise<MealPlan> {
    const prompt = `
      Create a personalized 1-day meal plan for an Australian senior.
      Profile:
      - Age: ${profile.age}
      - Gender: ${profile.gender}
      - Health Conditions: ${profile.healthConditions.join(', ') || 'None'}
      - Allergies: ${profile.allergies.join(', ') || 'None'}
      - Preferences: ${profile.dietaryPreferences.join(', ') || 'None'}
      
      Focus on nutrient-dense foods available in Australian supermarkets. Ensure recipes are easy to prepare.
      Include Breakfast, Lunch, Dinner, and one Snack.
      Return strictly JSON.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: mealPlanSchema,
        },
      });

      const text = response.text;
      if (!text) throw new Error("No response from Gemini");
      return JSON.parse(text) as MealPlan;
    } catch (error) {
      console.error("Error generating meal plan:", error);
      throw error;
    }
  }

  static async analyzeProduct(imageBase64: string, profile: UserProfile): Promise<ScanResult> {
    const prompt = `
      Analyze this image of a food product label or meal.
      Evaluate if it is suitable for this user based on their profile:
      - Health Conditions: ${profile.healthConditions.join(', ') || 'None'}
      - Allergies: ${profile.allergies.join(', ') || 'None'}
      
      Identify the product name.
      Determine if it is 'Safe', 'Caution' (consume in moderation), or 'Danger' (avoid).
      Provide a clear reasoning for a senior citizen.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: scanResultSchema,
        },
      });

      const text = response.text;
      if (!text) throw new Error("No response from Gemini");
      return JSON.parse(text) as ScanResult;
    } catch (error) {
      console.error("Error analyzing product:", error);
      throw error;
    }
  }

  static async chat(message: string, profile: UserProfile): Promise<string> {
    const systemInstruction = `
      You are NutriHelp, a compassionate and knowledgeable nutrition assistant for Australian seniors.
      The user is ${profile.age} years old.
      Health Conditions: ${profile.healthConditions.join(', ')}.
      Allergies: ${profile.allergies.join(', ')}.
      Keep answers concise, easy to read, and encouraging. Use metric units.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
          systemInstruction: systemInstruction,
        },
      });
      return response.text || "I'm sorry, I couldn't understand that. Could you try again?";
    } catch (error) {
      console.error("Chat error:", error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  }
}
