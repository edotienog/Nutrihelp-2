import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { UserProfile, ScanResult } from '../types';

interface Props {
  userProfile: UserProfile;
}

export const Scanner: React.FC<Props> = ({ userProfile }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous state
    setResult(null);
    setError(null);
    setAnalyzing(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      setImagePreview(reader.result as string);
      
      try {
        const scanResult = await GeminiService.analyzeProduct(base64String, userProfile);
        setResult(scanResult);
      } catch (err) {
        setError("Could not analyze the image. Please try again with a clearer photo.");
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-emerald-800 mb-4">Safety Scanner</h2>
      <p className="text-slate-600 mb-6 text-center text-lg">
        Take a photo of a food label or product to check if it's safe for you.
      </p>

      {/* Upload Button */}
      <label className="w-full aspect-[4/3] bg-slate-100 border-4 border-dashed border-emerald-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors relative overflow-hidden">
        {imagePreview ? (
           <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        ) : null}
        
        <div className="relative z-10 flex flex-col items-center bg-white/80 p-4 rounded-xl backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xl font-bold text-emerald-800">Tap to Scan</span>
        </div>
        <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            onChange={handleFileChange} 
            disabled={analyzing}
        />
      </label>

      {analyzing && (
        <div className="mt-8 flex flex-col items-center animate-pulse">
          <div className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-lg font-semibold text-emerald-700">Analyzing product safety...</span>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-lg text-center font-medium">
          {error}
        </div>
      )}

      {result && (
        <div className={`mt-8 w-full p-6 rounded-xl border-l-8 shadow-md ${
            result.warningLevel === 'Safe' ? 'bg-green-50 border-green-500' :
            result.warningLevel === 'Caution' ? 'bg-yellow-50 border-yellow-500' :
            'bg-red-50 border-red-500'
        }`}>
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-2xl font-bold text-slate-800">{result.productName || "Unknown Product"}</h3>
             <span className={`px-4 py-1 rounded-full font-bold uppercase text-sm ${
                 result.warningLevel === 'Safe' ? 'bg-green-200 text-green-800' :
                 result.warningLevel === 'Caution' ? 'bg-yellow-200 text-yellow-800' :
                 'bg-red-200 text-red-800'
             }`}>
                 {result.warningLevel}
             </span>
          </div>
          
          <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-slate-700 mb-1">Analysis:</h4>
                <p className="text-lg text-slate-900 leading-relaxed">{result.reasoning}</p>
            </div>
            
            {result.nutritionalAnalysis && (
                <div className="bg-white/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-slate-700 text-sm mb-1">Nutrition Facts:</h4>
                    <p className="text-slate-800 italic">{result.nutritionalAnalysis}</p>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
