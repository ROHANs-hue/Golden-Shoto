
import React, { useState, useEffect } from 'react';
import { QuizResult } from '../types';

interface AdminPortalProps {
  onBack: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onBack }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const cloudData = JSON.parse(localStorage.getItem('dojo_cloud_data') || '[]');
      setResults(cloudData);
    }
  }, [isAuthenticated]);

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
          <p className="text-sm text-slate-500 mb-6">Enter secure Dojo PIN to access student cloud data.</p>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-3 text-center text-2xl tracking-[1em] border-2 border-slate-100 rounded-xl focus:border-red-500 outline-none mb-4"
            placeholder="••••"
            autoFocus
          />
          <button type="submit" className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
            Verify PIN
          </button>
          <button type="button" onClick={onBack} className="mt-4 text-xs text-slate-400 hover:text-slate-600">
            Cancel and Return
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sensei's Cloud Portal</h1>
          <p className="text-slate-500">Monitoring student progress and technique comprehension.</p>
        </div>
        <button 
          onClick={onBack}
          className="px-6 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold transition-all text-sm"
        >
          Close Portal
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Date</th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Student</th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Belt</th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Score</th>
                <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 italic">No student records found in the cloud yet.</td>
                </tr>
              ) : (
                results.map((res) => (
                  <tr key={res.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(res.timestamp).toLocaleDateString()} {new Date(res.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 font-bold text-slate-900">{res.studentName}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold uppercase">{res.belt}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${res.score / res.total >= 0.8 ? 'bg-green-500' : res.score / res.total >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${(res.score / res.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">{res.score}/{res.total}</span>
                      </div>
                    </td>
                    <td className="p-4">
                       <details className="cursor-pointer group">
                          <summary className="text-xs text-red-600 font-bold hover:underline list-none">View Answers</summary>
                          <div className="mt-4 p-4 bg-slate-50 rounded-lg text-[11px] space-y-3">
                             {res.details.map((d, i) => (
                               <div key={i} className="border-b border-slate-200 pb-2 last:border-0">
                                  <p className="font-bold mb-1">Q{i+1}: {d.question}</p>
                                  <div className="flex gap-4">
                                     <span>Answer: <span className={d.isCorrect ? 'text-green-600' : 'text-red-600'}>{d.userAnswer}</span></span>
                                     {!d.isCorrect && <span>Correct: <span className="text-green-600">{d.correctAnswer}</span></span>}
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
    </div>
  );
};

export default AdminPortal;
