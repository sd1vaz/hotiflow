import React, { useState, useRef } from 'react';
import { X, ShoppingBag, User, MapPin, DollarSign, FileText, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, OrderStatus } from '../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Order) => void;
  currentUser: { id: string; name: string };
}

export default function NewOrderModal({ isOpen, onClose, onSubmit, currentUser }: NewOrderModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [total, setTotal] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !address || !total) return;

    // Simulate file URL
    let pdfUrl = '';
    if (pdfFile) {
      pdfUrl = URL.createObjectURL(pdfFile);
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerName,
      address,
      priority: 'medium',
      status: 'pending' as OrderStatus,
      createdAt: Date.now(),
      total: parseFloat(total),
      pdfUrl: pdfUrl || undefined,
      items: [], // Simplified for this request
      logs: [
        {
          userId: currentUser.id,
          userName: currentUser.name,
          timestamp: Date.now(),
          fromStatus: 'created',
          toStatus: 'pending'
        }
      ]
    };

    onSubmit(newOrder);
    setCustomerName('');
    setAddress('');
    setTotal('');
    setPdfFile(null);
    onClose();
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
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="bg-emerald-500 p-8 text-white flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Novo Pedido</h2>
                  <p className="text-emerald-100 text-[10px] uppercase font-bold tracking-widest">Cadastro manual de solicitação</p>
                </div>
                <button onClick={onClose} className="ml-auto text-white/50 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cliente</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                      placeholder="Nome do cliente ou empresa"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Endereço de Entrega</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                      placeholder="Logradouro, número, bairro"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Valor Total</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        step="0.01"
                        value={total}
                        onChange={(e) => setTotal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                        placeholder="0,00"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Anexo PDF</label>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed transition-all text-xs font-bold uppercase tracking-widest",
                        pdfFile 
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:border-slate-300"
                      )}
                    >
                      {pdfFile ? <FileText size={16} /> : <Upload size={16} />}
                      {pdfFile ? pdfFile.name.slice(0, 10) + '...' : 'SUBIR PDF'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-600 active:scale-[0.98] transition-all tracking-[0.2em] uppercase text-sm mt-4"
                >
                  Confirmar Pedido
                </button>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
