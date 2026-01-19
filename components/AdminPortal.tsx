
import React, { useState, useEffect } from 'react';
import { QuizResult, DojoSettings } from '../types.ts';

interface AdminPortalProps {
  onBack: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onBack }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'records' | 'settings'>('records');
  const [results, setResults] = useState<QuizResult[]>([]);
  
  // Settings State
  const [settings, setSettings] = useState<DojoSettings>({
    model: 'gemini-3-pro-preview',
    systemInstruction: '',
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
    useGoogleSearch: false
  });

  useEffect(() => {
    if (isAuthenticated) {
      const cloudData = JSON.parse(localStorage.getItem('dojo_cloud_data') || '[]');
      setResults(cloudData);
      
      const savedSettings = localStorage.getItem('dojo_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else {
        setSettings({
          model: 'gemini-3-pro-preview',
          systemInstruction: 'Act as a Karate Sensei for Golden Shoto Academy.\nGenerate exactly 5 multiple choice questions for a student at the {BELT} belt rank.\nTest knowledge of technical stances (Dachi), strikes (Uchi/Tsuki), terminology, and Dojo etiquette.\nEvery text field must include an English version and a Bengali translation.\nReturn exactly 5 questions in a JSON array.',
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
          useGoogleSearch: false
        });
      }
    }
  }, [isAuthenticated]);

  const handleSaveSettings = () => {
    localStorage.setItem('dojo_settings', JSON.stringify(settings));
    alert('Dojo Configuration Updated Successfully');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '2005') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Sensei PIN');
      setPin('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl max-w-xs w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Sensei Verification</h2>
          <p className="text-sm text-slate-500 mb-6">Enter secure Dojo PIN to access management.</p>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-3 text-center text-2xl tracking-[1em] border-2 border-slate-100 rounded-xl focus:border-red-500 outline-none mb-4"
            placeholder="••••"
            autoFocus
          />
          <button type="submit" className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors uppercase tracking-widest text-xs">
            Unlock Management
          </button>
          <button type="button" onClick={onBack} className="mt-4 text-xs text-slate-400 hover:text-slate-600 uppercase tracking-widest font-bold">
            Back to Dojo
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Sensei Management</h1>
          <p className="text-slate-500 text-sm">Controlling Dojo AI Logic and Student Progress.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
           <button 
             onClick={() => setActiveTab('records')}
             className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'records' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Student Logs
           </button>
           <button 
             onClick={() => setActiveTab('settings')}
             className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
           >
             AI Dojo Config
           </button>
        </div>
      </div>

      {activeTab === 'records' ? (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Training Date</th>
                  <th className="p-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Student Name</th>
                  <th className="p-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Rank</th>
                  <th className="p-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Score</th>
                  <th className="p-5 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Review</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-16 text-center text-slate-400 italic">The scroll of records is currently empty.</td>
                  </tr>
                ) : (
                  results.map((res) => (
                    <tr key={res.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 text-sm text-slate-500 font-medium">
                        {new Date(res.timestamp).toLocaleDateString()}
                      </td>
                      <td className="p-5 font-bold text-slate-900">{res.studentName}</td>
                      <td className="p-5">
                        <span className="px-2 py-1 bg-slate-900 text-white rounded text-[9px] font-black uppercase tracking-tighter">{res.belt}</span>
                      </td>
                      <td className="p-5">
                        <span className={`text-sm font-black ${res.score / res.total >= 0.8 ? 'text-green-600' : 'text-slate-700'}`}>
                          {res.score} / {res.total}
                        </span>
                      </td>
                      <td className="p-5">
                         <details className="cursor-pointer group">
                            <summary className="text-[10px] text-red-600 font-black hover:underline list-none uppercase tracking-widest">Inspect</summary>
                            <div className="mt-4 p-4 bg-slate-900 text-white rounded-2xl text-[10px] space-y-3 shadow-2xl border-l-4 border-red-600">
                               {res.details.map((d, i) => (
                                 <div key={i} className="border-b border-white/10 pb-2 last:border-0">
                                    <p className="font-bold text-slate-300 mb-1">Question {i+1}: {d.question}</p>
                                    <div className="flex gap-4">
                                       <span>Selection: <span className={d.isCorrect ? 'text-green-400' : 'text-red-400'}>{d.userAnswer}</span></span>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </details>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in pb-20">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 space-y-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter border-b border-slate-100 pb-4">Core AI Settings</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Intelligence Model</label>
                <select 
                  value={settings.model}
                  onChange={(e) => setSettings({...settings, model: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-bold text-slate-800 focus:border-yellow-600 transition-colors"
                >
                  <option value="gemini-3-pro-preview">Gemini 3 Pro (Recommended)</option>
                  <option value="gemini-3-flash-preview">Gemini 3 Flash (High Speed)</option>
                  <option value="gemini-2.5-flash-lite-latest">Gemini 2.5 Flash Lite</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-8">
                <button 
                  onClick={() => setSettings({...settings, useGoogleSearch: !settings.useGoogleSearch})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.useGoogleSearch ? 'bg-yellow-600' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.useGoogleSearch ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <div>
                  <label className="block text-[10px] font-black text-slate-900 uppercase tracking-widest">Sensei's Knowledge Grounding</label>
                  <p className="text-[10px] text-slate-400 uppercase">Enable Google Search for recent Karate news</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Instruction Prompt</label>
                <span className="text-[9px] font-bold text-yellow-600 uppercase">Use {`{BELT}`} for rank dynamic</span>
              </div>
              <textarea
                value={settings.systemInstruction}
                onChange={(e) => setSettings({...settings, systemInstruction: e.target.value})}
                className="w-full h-48 p-6 bg-slate-900 text-green-400 font-mono text-xs rounded-2xl border-4 border-slate-800 outline-none focus:border-yellow-600 transition-all shadow-inner"
                placeholder="Enter AI instructions here..."
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 space-y-8">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter border-b border-slate-100 pb-4">Advanced Sensei Parameters</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Temperature: {settings.temperature}</label>
                 <input 
                   type="range" min="0" max="1" step="0.1" 
                   value={settings.temperature}
                   onChange={(e) => setSettings({...settings, temperature: parseFloat(e.target.value)})}
                   className="w-full accent-yellow-600"
                 />
                 <p className="text-[9px] text-slate-400 mt-2 uppercase italic">Controls randomness in answers</p>
              </div>

              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Top-P: {settings.topP}</label>
                 <input 
                   type="range" min="0" max="1" step="0.01" 
                   value={settings.topP || 0.95}
                   onChange={(e) => setSettings({...settings, topP: parseFloat(e.target.value)})}
                   className="w-full accent-yellow-600"
                 />
                 <p className="text-[9px] text-slate-400 mt-2 uppercase italic">Cumulative probability threshold</p>
              </div>

              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Top-K: {settings.topK}</label>
                 <input 
                   type="range" min="1" max="100" step="1" 
                   value={settings.topK || 40}
                   onChange={(e) => setSettings({...settings, topK: parseInt(e.target.value)})}
                   className="w-full accent-yellow-600"
                 />
                 <p className="text-[9px] text-slate-400 mt-2 uppercase italic">Sample from top K tokens only</p>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Max Output Tokens: {settings.maxOutputTokens}</label>
                 <div className="flex gap-4">
                   <input 
                     type="number" 
                     value={settings.maxOutputTokens || 2048}
                     onChange={(e) => setSettings({...settings, maxOutputTokens: parseInt(e.target.value)})}
                     className="w-40 p-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-800"
                   />
                   <p className="text-[10px] text-slate-400 uppercase self-center">Limits the length of AI generation. 2048 is standard.</p>
                 </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
               <button 
                onClick={handleSaveSettings}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest text-xs"
              >
                Apply All AI Config Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-50/80 backdrop-blur-sm border-t border-slate-100 flex justify-center z-50">
         <button onClick={onBack} className="text-[10px] font-black text-slate-400 hover:text-red-600 transition-colors uppercase tracking-[0.3em]">Exit Management Console</button>
      </div>
    </div>
  );
};

export default AdminPortal;
