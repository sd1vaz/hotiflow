import React, { useState } from 'react';
import { User, AuthUser } from '../types';
import { Leaf, Lock, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  users: AuthUser[];
  onLogin: (user: User) => void;
}

export default function Login({ users, onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const { password: _, ...userInfo } = user;
      onLogin(userInfo);
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-500/10 overflow-hidden border border-emerald-100">
          <div className="bg-emerald-500 p-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-500 shadow-xl mb-6">
              <Leaf size={46} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">HortiFlow</h1>
            <p className="text-emerald-100 text-[10px] uppercase font-bold tracking-[0.2em] mt-2">Acesso Restrito ao Sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs font-bold border border-rose-100 animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Usuário</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  placeholder="Seu nome de usuário"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:shadow-emerald-300 active:scale-[0.98] transition-all tracking-widest uppercase text-sm"
            >
              Entrar no Sistema
            </button>

            <div className="pt-4 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
                admin: admin (senha: 123)<br />
                usuário: user (senha: 123)
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
