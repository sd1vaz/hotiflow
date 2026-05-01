import { Droppable } from '@hello-pangea/dnd';
import { Column as ColumnType, User, Order } from '../types';
import OrderCard from './OrderCard';
import { cn } from '../lib/utils';

interface ColumnProps {
  column: ColumnType;
  onUpdateFile: (orderId: string, type: 'pdf' | 'photo') => void;
  onDeleteOrder: (orderId: string) => void;
  currentUser: User;
}

export default function Column({ column, onUpdateFile, onDeleteOrder, currentUser }: ColumnProps) {
  const statusColors = {
    pending: 'bg-blue-500',
    preparing: 'bg-amber-500',
    delivery: 'bg-emerald-500',
    delivered: 'bg-slate-400',
  };

  const statusBgColors = {
    pending: 'bg-blue-100 text-blue-600',
    preparing: 'bg-amber-100 text-amber-600',
    delivery: 'bg-emerald-100 text-emerald-600',
    delivered: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="flex flex-col w-72 shrink-0 h-full">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", statusColors[column.id])} />
          {column.title}
          <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold ml-1", statusBgColors[column.id])}>
            {column.orders.length.toString().padStart(2, '0')}
          </span>
        </h2>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 rounded-2xl p-2 transition-colors duration-200 kanban-scroll overflow-y-auto min-h-[150px]",
              snapshot.isDraggingOver ? "bg-emerald-100/30" : "bg-transparent"
            )}
          >
            {column.orders.map((order: Order, index: number) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                index={index} 
                onUpdateFile={onUpdateFile}
                onDeleteOrder={onDeleteOrder}
                currentUser={currentUser}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
