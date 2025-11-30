import React, { useState, useEffect } from 'react';
import { ProfileSetup } from './components/ProfileSetup';
import { DailyPlan } from './components/DailyPlan';
import { Scanner } from './components/Scanner';
import { ChatAssistant } from './components/ChatAssistant';
import { UserProfile } from './types';

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'scan' | 'chat'>('plan');

  useEffect(() => {
    // Try to load profile from local storage for persistence
    const saved = localStorage.getItem('nutrihelp_profile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
  }, []);

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('nutrihelp_profile', JSON.stringify(profile));
  };

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to reset your profile?")) {
        setUserProfile(null);
        localStorage.removeItem('nutrihelp_profile');
    }
  };

  if (!userProfile) {
    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
             <header className="flex items-center justify-center mb-8">
                 <span className="text-4xl mr-2">🍏</span>
                 <h1 className="text-4xl font-bold text-emerald-800">NutriHelp</h1>
             </header>
             <ProfileSetup onSave={handleSaveProfile} />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-emerald-700 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
                 <span className="text-2xl mr-2">🍏</span>
                 <h1 className="text-2xl font-bold">NutriHelp</h1>
            </div>
            <div className="flex items-center space-x-4">
                 <span className="text-emerald-100 hidden sm:inline">Hello, {userProfile.name}</span>
                 <button 
                    onClick={handleLogout}
                    className="text-sm bg-emerald-800 hover:bg-emerald-900 px-3 py-1 rounded-lg transition-colors"
                 >
                    Reset Profile
                 </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 pb-24">
        {activeTab === 'plan' && (
            <div className="animate-fade-in">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Today's Meal Plan</h2>
                <DailyPlan userProfile={userProfile} />
            </div>
        )}
        {activeTab === 'scan' && (
            <div className="animate-fade-in">
                <Scanner userProfile={userProfile} />
            </div>
        )}
        {activeTab === 'chat' && (
            <div className="animate-fade-in">
                <ChatAssistant userProfile={userProfile} />
            </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-4xl mx-auto flex justify-around p-2">
            <button 
                onClick={() => setActiveTab('plan')}
                className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${activeTab === 'plan' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-emerald-500'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-bold text-sm">Meals</span>
            </button>
            
            <button 
                onClick={() => setActiveTab('scan')}
                className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${activeTab === 'scan' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-emerald-500'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-bold text-sm">Scan</span>
            </button>
            
            <button 
                onClick={() => setActiveTab('chat')}
                className={`flex flex-col items-center p-2 rounded-lg w-full transition-colors ${activeTab === 'chat' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-emerald-500'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="font-bold text-sm">Assistant</span>
            </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
