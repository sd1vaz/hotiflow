import React, { useState } from 'react';
import { AuthUser, UserRole } from '../types';
import { X, UserPlus, Shield, User, Key, Users, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AuthUser[];
  onRegister: (newUser: AuthUser) => void;
  onDelete: (userId: string) => void;
}

export default function UserManagementModal({ isOpen, onClose, users, onRegister, onDelete }: UserManagementModalProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [typedPassword, setTypedPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !password) return;

    const newUser: AuthUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      username,
      password,
      role
    };

    onRegister(newUser);
    setName('');
    setUsername('');
    setPassword('');
    alert('Usuário cadastrado com sucesso!');
  };

  const handleConfirmDelete = (user: AuthUser) => {
    if (user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1) {
      alert('Não é possível remover o único administrador.');
      return;
    }

    if (typedPassword === user.password) {
      onDelete(user.id);
      setConfirmDeleteId(null);
      setTypedPassword('');
    } else {
      alert('Senha incorreta!');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] md:h-[600px]"
            >
              <div className="bg-emerald-500 md:w-56 p-6 md:p-8 text-white flex flex-col shrink-0">
                <div className="flex items-center md:block gap-4 md:gap-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-0 md:mb-6">
                    <Users size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-black tracking-tight leading-tight md:mb-2">Equipe HortiFlow</h2>
                    <p className="hidden md:block text-emerald-100 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                      Gerencie o acesso dos funcionários ao sistema.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-8 space-y-4">
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex md:block items-center justify-between">
                    <div className="text-[10px] font-black uppercase text-emerald-200 md:mb-1">Total de Membros</div>
                    <div className="text-xl md:text-2xl font-black">{users.length}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Administração de Contas</h3>
                  <button onClick={onClose} className="text-slate-400 hover:text-rose-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
                  {/* Form */}
                  <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                          placeholder="Ex: Carlos Silva"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Usuário / Login</label>
                      <div className="relative">
                        <UserPlus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                          placeholder="EX: carlos.horti"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Senha</label>
                      <div className="relative">
                        <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                          placeholder="Senha de acesso"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-span-2 space-y-1.5 pt-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Nível de Acesso</label>
                       <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setRole('employee')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${role === 'employee' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                          >
                            <User size={14} /> Funcionário
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${role === 'admin' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                          >
                            <Shield size={14} /> Administrador
                          </button>
                       </div>
                    </div>

                    <button
                      type="submit"
                      className="col-span-2 mt-4 bg-emerald-500 text-white font-black py-3 rounded-xl shadow-lg border border-emerald-600/20 hover:bg-emerald-600 transition-all text-xs tracking-widest uppercase"
                    >
                      Cadastrar Novo Membro
                    </button>
                  </form>

                  {/* List */}
                  <div className="pt-8 pt-8">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Membros Atuais</h4>
                    <div className="space-y-3">
                      {users.map(u => (
                        <div key={u.id} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${u.role === 'admin' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                {u.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                              </div>
                              <div>
                                  <div className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{u.name}</div>
                                  <div className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">@{u.username}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className={`text-[8px] font-black px-2 py-1 rounded tracking-tighter uppercase ${u.role === 'admin' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                                {u.role}
                              </span>
                              <button 
                                onClick={() => {
                                  if (confirmDeleteId === u.id) {
                                    setConfirmDeleteId(null);
                                    setTypedPassword('');
                                  } else {
                                    setConfirmDeleteId(u.id);
                                  }
                                }}
                                className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {confirmDeleteId === u.id && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex flex-col gap-2"
                            >
                              <p className="text-[9px] font-black text-rose-600 uppercase tracking-tighter">Confirmar exclusão? Digite a SENHA dele:</p>
                              <div className="flex gap-2">
                                <input 
                                  type="password"
                                  value={typedPassword}
                                  onChange={(e) => setTypedPassword(e.target.value)}
                                  className="flex-1 bg-white border border-rose-200 rounded-lg py-1 px-3 text-[10px] font-bold outline-none focus:ring-2 focus:ring-rose-500/20"
                                  placeholder="Senha do usuário..."
                                />
                                <button 
                                  onClick={() => handleConfirmDelete(u)}
                                  className="bg-rose-500 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
                                >
                                  CONFIRMAR
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
