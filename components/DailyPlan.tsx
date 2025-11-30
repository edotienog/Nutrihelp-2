import React, { useEffect, useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { UserProfile, MealPlan, Recipe } from '../types';

interface Props {
  userProfile: UserProfile;
}

export const DailyPlan: React.FC<Props> = ({ userProfile }) => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  useEffect(() => {
    loadMealPlan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMealPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const plan = await GeminiService.generateDailyMealPlan(userProfile);
      setMealPlan(plan);
    } catch (err) {
      setError("Unable to generate meal plan. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipe = (mealName: string) => {
    setExpandedMeal(expandedMeal === mealName ? null : mealName);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-16 w-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xl text-emerald-800 font-medium">Chef Gemini is preparing your personalized menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button 
            onClick={loadMealPlan}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold"
        >
            Try Again
        </button>
      </div>
    );
  }

  if (!mealPlan) return null;

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-emerald-100 p-6 rounded-xl border border-emerald-200">
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Daily Tips</h2>
        <ul className="list-disc list-inside text-emerald-800 text-lg space-y-1">
          {mealPlan.dailyTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        {mealPlan.meals.map((meal, index) => (
          <MealCard 
            key={index} 
            meal={meal} 
            isExpanded={expandedMeal === meal.name} 
            onToggle={() => toggleRecipe(meal.name)} 
          />
        ))}
      </div>
      
      <button 
        onClick={loadMealPlan}
        className="w-full mt-8 py-4 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
      >
        Regenerate Menu
      </button>
    </div>
  );
};

const MealCard: React.FC<{ meal: Recipe; isExpanded: boolean; onToggle: () => void }> = ({ meal, isExpanded, onToggle }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden transition-all">
      <button 
        onClick={onToggle}
        className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-slate-50"
      >
        <div>
            <span className="uppercase tracking-wide text-xs font-bold text-emerald-600 mb-1 block">{meal.mealType}</span>
            <h3 className="text-xl font-bold text-slate-800">{meal.name}</h3>
        </div>
        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/50">
          <p className="text-slate-600 italic mb-4 mt-4">{meal.description}</p>
          
          <div className="mb-4">
            <h4 className="font-bold text-slate-700 mb-2">Ingredients</h4>
            <ul className="space-y-2">
                {meal.ingredients.map((ing, i) => (
                    <li key={i} className="flex justify-between text-slate-700 border-b border-slate-200 pb-1 last:border-0">
                        <span>{ing.item}</span>
                        <span className="font-semibold">{ing.amount}</span>
                    </li>
                ))}
            </ul>
          </div>

          <div className="mb-4">
             <h4 className="font-bold text-slate-700 mb-2">Instructions</h4>
             <ol className="list-decimal list-inside space-y-2 text-slate-700">
                {meal.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                ))}
             </ol>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
             {meal.nutritionalHighlights.map((tag, i) => (
                 <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                     {tag}
                 </span>
             ))}
             <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm font-semibold">
                ⏱ {meal.preparationTime}
             </span>
          </div>
        </div>
      )}
    </div>
  );
};
