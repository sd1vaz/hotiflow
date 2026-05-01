import { Draggable } from '@hello-pangea/dnd';
import { Calendar, CheckCircle2, FileText, Camera, Trash2, History } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Order, User } from '../types';

interface OrderCardProps {
  order: Order;
  index: number;
  onUpdateFile: (orderId: string, type: 'pdf' | 'photo') => void;
  onDeleteOrder: (orderId: string) => void;
  currentUser: User;
}

export default function OrderCard({ order, index, onUpdateFile, onDeleteOrder, currentUser }: OrderCardProps) {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-rose-100 text-rose-700',
  };

  const statusBorderColors = {
    pending: 'border-blue-400',
    preparing: 'border-amber-400',
    delivery: 'border-emerald-500',
    delivered: 'border-slate-400',
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  const lastLog = order.logs[order.logs.length - 1];

  return (
    <Draggable draggableId={order.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-4"
        >
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "bg-white p-4 rounded-2xl shadow-sm border-b-4 transition-all duration-200 group relative",
              statusBorderColors[order.status],
              snapshot.isDragging ? "shadow-xl ring-2 ring-emerald-500/20 rotate-2" : "hover:shadow-md"
            )}
          >
            {currentUser.role === 'admin' && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteOrder(order.id); }}
                className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 active:scale-95"
                title="Remover Pedido"
              >
                <Trash2 size={12} />
              </button>
            )}

            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black text-slate-400 tracking-wider">#{order.id.toUpperCase().slice(0, 6)}</span>
              <div className="flex gap-1.5">
                {order.pdfUrl && <FileText size={14} className="text-blue-500" />}
                {order.deliveryPhotoUrl && <CheckCircle2 size={14} className="text-emerald-500" />}
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase ml-1",
                  priorityColors[order.priority]
                )}>
                  {order.priority === 'high' ? 'URGENTE' : order.priority === 'medium' ? 'NORMAL' : 'BAIXA'}
                </span>
              </div>
            </div>

            <h3 className="font-bold text-slate-800 text-sm mb-1">
              {order.customerName}
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
              {order.items.map(item => `${item.quantity} ${item.name}`).join(', ')}
            </p>

            {/* User Activity */}
            {lastLog && (
              <div className="bg-slate-50 px-2.5 py-1.5 rounded-lg flex items-center gap-2 mb-4 border border-slate-100">
                <History size={10} className="text-slate-400" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                  Status alterado por <span className="text-emerald-600">{lastLog.userName}</span>
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              {!order.pdfUrl ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); onUpdateFile(order.id, 'pdf'); }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200 transition-colors"
                >
                  <FileText size={12} /> PDF
                </button>
              ) : (
                <a 
                  href={order.pdfUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 py-1.5 rounded-lg text-[10px] font-bold border border-blue-100"
                >
                  <FileText size={12} /> VER PDF
                </a>
              )}

              {order.status === 'delivery' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onUpdateFile(order.id, 'photo'); }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold border transition-colors",
                    order.deliveryPhotoUrl 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                      : "bg-amber-50 text-amber-600 border-amber-200 shadow-sm shadow-amber-100"
                  )}
                >
                  <Camera size={12} /> {order.deliveryPhotoUrl ? 'FOTO OK' : 'FOTO'}
                </button>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px]">👤</div>
                <span className="text-[11px] font-medium text-slate-400 italic">
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <div className="text-slate-800 font-black text-sm">
                R$ {order.total.toFixed(2)}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}
