
import React, { useState } from 'react';
import { User, BeltColor, Question } from '../types.ts';
import { generateQuiz, testApiKey } from '../geminiService.ts';

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
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle');

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const q = await generateQuiz(user.belt, user.customApiKey);
      onStartQuiz(q);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleTestKey = async () => {
    if (!tempApiKey.trim()) return;
    setTestStatus('testing');
    const isOk = await testApiKey(tempApiKey);
    setTestStatus(isOk ? 'success' : 'fail');
    if (isOk) {
      setTimeout(() => setTestStatus('idle'), 3000);
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
             className={`text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest transition-all border-2 flex items-center gap-2 ${user.customApiKey ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
           >
             <span className={`w-2 h-2 rounded-full ${user.customApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
             {user.customApiKey ? 'Using Personal Key' : 'Using Academy Key'}
           </button>
           <button onClick={onLogout} className="text-slate-400 hover:text-red-600 text-[10px] font-black transition-colors uppercase tracking-widest">Logout</button>
        </div>
      </nav>

      {showApiSettings && (
        <div className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">AI Configuration</h3>
              <p className="text-xs text-slate-500">Add your own API key to bypass Academy rate limits.</p>
            </div>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 uppercase border border-blue-100 px-3 py-1 rounded-lg hover:bg-blue-50">Get Key Free</a>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input 
                type="password"
                value={tempApiKey}
                onChange={(e) => { setTempApiKey(e.target.value); setTestStatus('idle'); }}
                placeholder="Enter your Gemini API Key"
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-yellow-600 outline-none font-mono text-sm pr-32"
              />
              <button 
                onClick={handleTestKey}
                disabled={!tempApiKey || testStatus === 'testing'}
                className={`absolute right-2 top-2 bottom-2 px-4 rounded-xl text-[10px] font-black uppercase transition-all ${
                  testStatus === 'testing' ? 'bg-slate-200 text-slate-400' :
                  testStatus === 'success' ? 'bg-emerald-500 text-white' :
                  testStatus === 'fail' ? 'bg-red-500 text-white' :
                  'bg-slate-900 text-white hover:bg-black'
                }`}
              >
                {testStatus === 'testing' ? 'Testing...' : 
                 testStatus === 'success' ? 'Valid Key ✓' : 
                 testStatus === 'fail' ? 'Invalid ✗' : 'Test Key'}
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button 
                onClick={handleSaveApiKey}
                className="flex-1 py-4 bg-yellow-600 text-white font-black rounded-2xl hover:bg-yellow-700 transition-all uppercase tracking-widest text-xs"
              >
                Save & Use This Key
              </button>
              {user.customApiKey && (
                <button 
                  onClick={() => { setTempApiKey(''); onUpdateUser({ ...user, customApiKey: '' }); setShowApiSettings(false); }}
                  className="px-6 py-4 border-2 border-slate-100 text-slate-400 font-bold rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all uppercase tracking-widest text-[10px]"
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-6">
          <div className={`w-20 h-20 rounded-xl border-4 flex items-center justify-center font-bold text-2xl shadow-xl transform rotate-3 transition-transform hover:rotate-0 ${beltColors[user.belt]}`}>
            {user.belt.charAt(0)}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Osu, {user.name}!</h2>
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
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group border-4 border-slate-700/50">
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
             <svg width="240" height="240" viewBox="0 0 24 24" fill="white"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-4">Mastery Awaits.</h3>
            <p className="text-slate-300 mb-10 max-w-md text-lg leading-relaxed">
              Step into the digital dojo. Every question is a movement, every answer a strike. Sharpen your mind.
            </p>

            {error && (
              <div className="mb-8 p-5 bg-red-950/80 text-red-200 rounded-2xl text-xs border-2 border-red-500/30 backdrop-blur-md animate-in slide-in-from-top-2 duration-300 flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div className="space-y-2">
                  <p className="font-bold uppercase tracking-widest">Sensei Observation:</p>
                  <p className="leading-relaxed opacity-90">{error}</p>
                  {!user.customApiKey && (
                    <button onClick={() => setShowApiSettings(true)} className="text-yellow-400 underline font-bold uppercase tracking-widest">Add your own API key to bypass limits</button>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={loading}
              className="group flex items-center gap-4 px-10 py-6 bg-yellow-600 hover:bg-yellow-500 text-white rounded-[2rem] font-black transition-all shadow-xl active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Summoning Sensei...
                </>
              ) : (
                <>
                  Enter Training Hall
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
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
                    <p className="text-xs font-bold text-slate-800">Flash Model Activated</p>
                    <p className="text-[10px] text-slate-500">Faster response times for all belt ranks.</p>
                  </div>
               </div>
               <div className="flex gap-4 items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0"></span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Personal API Keys</p>
                    <p className="text-[10px] text-slate-500">Students can now bypass academy limits.</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Performance</h4>
             <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-black text-slate-800">Stage 1</span>
                <span className="text-xs font-bold text-yellow-600">Locked</span>
             </div>
             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-200 h-full w-[10%]"></div>
             </div>
          </div>
        </div>
      </main>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 pb-12">
         {[
           { label: 'Model', value: 'Flash 3' },
           { label: 'Language', value: 'Bengali' },
           { label: 'Status', value: 'Active' },
           { label: 'Region', value: 'BD/Global' }
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
