import React, { useState } from 'react';
import { UserProfile } from '../types';

interface Props {
  onSave: (profile: UserProfile) => void;
}

export const ProfileSetup: React.FC<Props> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(65);
  const [gender, setGender] = useState<UserProfile['gender']>('Female');
  const [conditions, setConditions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [preferences, setPreferences] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: UserProfile = {
      name,
      age,
      gender,
      healthConditions: conditions.split(',').map(s => s.trim()).filter(Boolean),
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
      dietaryPreferences: preferences.split(',').map(s => s.trim()).filter(Boolean),
    };
    onSave(profile);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">Welcome to NutriHelp</h2>
      <p className="text-slate-600 mb-8 text-lg text-center">
        Let's get to know you better to provide the best nutritional advice.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xl font-semibold text-slate-700 mb-2">What should we call you?</label>
          <input
            type="text"
            required
            className="w-full p-4 border-2 border-slate-200 rounded-lg text-lg focus:border-emerald-500 focus:ring-emerald-500"
            placeholder="e.g. Mary"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xl font-semibold text-slate-700 mb-2">Age</label>
            <input
              type="number"
              required
              min="50"
              max="120"
              className="w-full p-4 border-2 border-slate-200 rounded-lg text-lg focus:border-emerald-500"
              value={age}
              onChange={e => setAge(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xl font-semibold text-slate-700 mb-2">Gender</label>
            <select
              className="w-full p-4 border-2 border-slate-200 rounded-lg text-lg focus:border-emerald-500 bg-white"
              value={gender}
              onChange={e => setGender(e.target.value as any)}
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xl font-semibold text-slate-700 mb-2">Health Conditions (Comma separated)</label>
          <input
            type="text"
            className="w-full p-4 border-2 border-slate-200 rounded-lg text-lg focus:border-emerald-500"
            placeholder="e.g. Diabetes, High Blood Pressure"
            value={conditions}
            onChange={e => setConditions(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-slate-700 mb-2">Allergies (Comma separated)</label>
          <input
            type="text"
            className="w-full p-4 border-2 border-slate-200 rounded-lg text-lg focus:border-emerald-500"
            placeholder="e.g. Peanuts, Shellfish, Gluten"
            value={allergies}
            onChange={e => setAllergies(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-slate-700 mb-2">Dietary Preferences (Optional)</label>
          <input
            type="text"
            className="w-full p-4 border-2 border-slate-200 rounded-lg text-lg focus:border-emerald-500"
            placeholder="e.g. Vegetarian, Low Salt"
            value={preferences}
            onChange={e => setPreferences(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl py-4 rounded-lg shadow-md transition-all active:scale-95 mt-8"
        >
          Start My Health Journey
        </button>
      </form>
    </div>
  );
};
