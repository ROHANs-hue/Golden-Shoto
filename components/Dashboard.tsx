
import React, { useState } from 'react';
import { User, BeltColor, Question } from '../types.ts';
import { generateQuiz } from '../geminiService.ts';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onStartQuiz: (questions: Question[]) => void;
  onUpdateUser: (user: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onStartQuiz, onUpdateUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(user.customApiKey || '');

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const q = await generateQuiz(user.belt, user.customApiKey);
      onStartQuiz(q);
    } catch (err: any) {
      console.error("Quiz Start Error:", err);
      setError(err.message || 'The Sensei is busy. Check your API key or connection.');
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    const updatedUser = { ...user, customApiKey: tempApiKey };
    onUpdateUser(updatedUser);
    setShowApiSettings(false);
  };

  const beltColors: Record<BeltColor, string> = {
    [BeltColor.WHITE]: 'bg-white text-gray-800 border-gray-200',
    [BeltColor.YELLOW]: 'bg-yellow-400 text-yellow-900 border-yellow-500',
    [BeltColor.YELLOW_2]: 'bg-yellow-500 text-yellow-900 border-yellow-600 border-b-4',
    [BeltColor.BLUE]: 'bg-blue-600 text-white border-blue-700',
    [BeltColor.GREEN]: 'bg-green-600 text-white border-green-700',
    [BeltColor.PURPLE]: 'bg-purple-600 text-white border-purple-700',
    [BeltColor.BROWN]: 'bg-amber-900 text-white border-amber-950',
    [BeltColor.BROWN_1]: 'bg-amber-900 text-white border-amber-950 border-r-4 border-yellow-400',
    [BeltColor.BROWN_2]: 'bg-amber-900 text-white border-amber-950 border-r-8 border-yellow-400',
    [BeltColor.BLACK]: 'bg-black text-white border-gray-800',
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <nav className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-600 p-1.5 rounded-lg">
             <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
          </div>
          <div>
            <span className="font-bold text-slate-800 tracking-tight block leading-tight">GOLDEN SHOTO</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block leading-tight">Academy Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <button 
             onClick={() => setShowApiSettings(!showApiSettings)}
             className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest transition-all ${user.customApiKey ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}`}
           >
             {user.customApiKey ? '● Personal Key Active' : 'Configure AI Key'}
           </button>
           <button onClick={onLogout} className="text-slate-400 hover:text-red-600 text-xs font-bold transition-colors uppercase">Logout</button>
        </div>
      </nav>

      {showApiSettings && (
        <div className="bg-yellow-50 border-2 border-yellow-200 p-8 rounded-3xl animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-black text-yellow-800 uppercase tracking-widest mb-4">Personal Sensei Configuration</h3>
          <p className="text-xs text-yellow-700 mb-6 leading-relaxed">
            To use your own Gemini credits, enter your API Key below. This key is saved only in your browser's local storage.
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="ml-1 underline font-bold">Get your free key here</a>.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Paste your Gemini API Key here"
              className="flex-1 px-6 py-4 bg-white border-2 border-yellow-100 rounded-2xl focus:border-yellow-600 outline-none font-mono text-sm"
            />
            <button 
              onClick={handleSaveApiKey}
              className="px-8 py-4 bg-yellow-600 text-white font-black rounded-2xl hover:bg-yellow-700 transition-all uppercase tracking-widest text-xs"
            >
              Save Personal Key
            </button>
          </div>
          {user.customApiKey && (
            <button 
              onClick={() => { setTempApiKey(''); onUpdateUser({ ...user, customApiKey: '' }); }}
              className="mt-4 text-[10px] font-bold text-yellow-800/50 hover:text-red-600 uppercase transition-colors"
            >
              Remove personal key and use Academy key
            </button>
          )}
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-6">
          <div className={`w-20 h-20 rounded-xl border-4 flex items-center justify-center font-bold text-2xl shadow-xl transform rotate-3 transition-transform hover:rotate-0 ${beltColors[user.belt]}`}>
            {user.belt.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Osu, Student {user.name}!</h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1">
              Currently training for 
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shadow-sm ${beltColors[user.belt]}`}>
                {user.belt}
              </span>
              rank
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
           <span className="text-[10px] text-slate-400 font-bold uppercase mb-1">Dojo Member Since</span>
           <span className="text-sm font-bold text-slate-700">{new Date().getFullYear()}</span>
        </div>
      </header>

      <main className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <svg width="240" height="240" viewBox="0 0 24 24" fill="white"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4">Mind over Matter.</h3>
            <p className="text-slate-300 mb-10 max-w-md text-lg leading-relaxed">
              At Golden Shoto Karate Academy, we believe the quiz is a mental kata. Refine your knowledge of terminology, ethics, and technique.
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-xl text-sm border border-red-800/50 backdrop-blur-md animate-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={loading}
              className="flex items-center gap-3 px-10 py-5 bg-yellow-600 hover:bg-yellow-500 text-white rounded-2xl font-black transition-all shadow-xl active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating Session...
                </>
              ) : (
                <>
                  Start Quiz Challenge
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Dojo Updates</h4>
            <div className="space-y-4">
               <div className="flex gap-4 items-start pb-4 border-b border-slate-50">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 shrink-0"></span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">New Terminology Set</p>
                    <p className="text-[10px] text-slate-500">Sensei updated Brown belt requirements.</p>
                  </div>
               </div>
               <div className="flex gap-4 items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0"></span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Bengali Support Added</p>
                    <p className="text-[10px] text-slate-500">Live translations now available for all students.</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Your Mastery</h4>
             <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-black text-slate-800">Level 1</span>
                <span className="text-xs font-bold text-yellow-600">0 / 500 XP</span>
             </div>
             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-600 h-full w-[10%] transition-all"></div>
             </div>
          </div>
        </div>
      </main>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pb-12">
         {[
           { label: 'Total Students', value: '124' },
           { label: 'Quizzes Taken', value: '1,452' },
           { label: 'Avg Mastery', value: '88%' },
           { label: 'Rankings', value: '#12' }
         ].map((stat, i) => (
           <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</span>
              <span className="text-xl font-black text-slate-800">{stat.value}</span>
           </div>
         ))}
      </section>
    </div>
  );
};

export default Dashboard;
