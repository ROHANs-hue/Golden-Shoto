
import React, { useState } from 'react';
import { BeltColor, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onOpenAdmin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onOpenAdmin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [belt, setBelt] = useState<BeltColor>(BeltColor.WHITE);

  const belts = Object.values(BeltColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && password.trim()) {
      onLogin({ name, belt, points: 0, password });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[url('https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-8 text-white text-center border-b-4 border-yellow-400">
          <div className="flex justify-center mb-2">
             <svg className="w-12 h-12 text-yellow-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">Golden Shoto</h1>
          <p className="text-sm font-medium text-yellow-100 uppercase tracking-[0.2em]">Karate Academy</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="flex items-center justify-center mb-4">
             <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase animate-pulse">● Dojo Live</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Student Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
              placeholder="Full Name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Select Your Rank</label>
            <div className="grid grid-cols-5 gap-1.5">
              {belts.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBelt(b)}
                  title={b}
                  className={`py-2 text-[8px] font-bold rounded border transition-all uppercase truncate px-1 ${
                    belt === b 
                      ? 'border-yellow-600 bg-yellow-600 text-white shadow-md' 
                      : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg mt-4"
          >
            Enter Academy
          </button>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="w-full text-center text-xs text-slate-400 hover:text-yellow-600 transition-colors pt-2"
          >
            Sensei / Admin Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
