
import React, { useState } from 'react';
import { BeltColor, User } from '../types.ts';

interface LoginProps {
  onLogin: (user: User) => void;
  onOpenAdmin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onOpenAdmin }) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [belt, setBelt] = useState<BeltColor>(BeltColor.WHITE);

  const belts = Object.values(BeltColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && pin.trim()) {
      onLogin({ name, belt, points: 0, password: pin });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-[url('https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-lg"></div>
      <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in border border-white/20">
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-12 text-white text-center">
          <div className="flex justify-center mb-6">
             <div className="p-5 bg-white/20 rounded-3xl backdrop-blur-md">
                <svg className="w-12 h-12 text-yellow-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
             </div>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-1 leading-none">Golden Shoto</h1>
          <p className="text-[10px] font-bold text-yellow-100 uppercase tracking-[0.4em] opacity-80">Academy Digital Dojo</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-12 space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Registered Student Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-600 focus:bg-white outline-none transition-all text-slate-800 font-bold"
              placeholder="e.g. Rahul Shoto"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Academy Access Code</label>
            <input
              type="text"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-600 focus:bg-white outline-none transition-all text-slate-800 font-bold"
              placeholder="Your 4-digit code"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Training Level</label>
            <div className="grid grid-cols-5 gap-2">
              {belts.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBelt(b)}
                  title={b}
                  className={`py-3 text-[10px] font-black rounded-xl border-2 transition-all uppercase ${
                    belt === b 
                      ? 'border-yellow-600 bg-yellow-600 text-white shadow-xl scale-110' 
                      : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {b.charAt(0)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-3xl transition-all active:scale-95 shadow-2xl shadow-slate-200 mt-4 uppercase tracking-widest text-sm"
          >
            Enter Study Hall
          </button>

          <div className="pt-6 border-t border-slate-50 text-center">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-[10px] font-black text-slate-300 hover:text-yellow-600 transition-colors uppercase tracking-[0.2em]"
            >
              Academy Management Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
