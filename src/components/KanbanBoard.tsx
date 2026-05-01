import { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Leaf, Plus, Search, LogOut, Users } from 'lucide-react';
import { Column as ColumnType, Order, OrderStatus, User, AuthUser } from '../types';
import Column from './Column';
import UserManagementModal from './UserManagementModal';
import NewOrderModal from './NewOrderModal';

const INITIAL_DATA: ColumnType[] = [
  {
    id: 'pending',
    title: 'Novos Pedidos',
    orders: [
      {
        id: '1',
        customerName: 'Dona Helena',
        address: 'Rua das Flores, 123',
        priority: 'high',
        status: 'pending',
        createdAt: Date.now() - 1000 * 60 * 15,
        total: 85.50,
        logs: [{ userId: 'system', userName: 'HortiFlow', timestamp: Date.now() - 1000 * 60 * 15, fromStatus: 'created', toStatus: 'pending' }],
        items: [
          { id: 'i1', name: 'Alface Crespa', quantity: '2un', category: 'vegetable' },
          { id: 'i2', name: 'Tomate Cereja', quantity: '500g', category: 'fruit' },
          { id: 'i3', name: 'Ovos Caipira', quantity: '1dz', category: 'other' },
        ]
      },
      {
        id: '2',
        customerName: 'Seu Manoel',
        address: 'Av. Paulista, 1500',
        priority: 'medium',
        status: 'pending',
        createdAt: Date.now() - 1000 * 60 * 45,
        total: 120.00,
        logs: [{ userId: 'system', userName: 'HortiFlow', timestamp: Date.now() - 1000 * 60 * 45, fromStatus: 'created', toStatus: 'pending' }],
        items: [
          { id: 'i4', name: 'Banana Nanica', quantity: '12un', category: 'fruit' },
          { id: 'i5', name: 'Maçã Fuji', quantity: '1kg', category: 'fruit' },
        ]
      }
    ]
  },
  {
    id: 'preparing',
    title: 'Em Separação',
    orders: [
      {
        id: '3',
        customerName: 'Restaurante Sabor',
        address: 'Rua Gastronomia, 45',
        priority: 'high',
        status: 'preparing',
        createdAt: Date.now() - 1000 * 60 * 60 * 2,
        total: 450.00,
        logs: [{ userId: 'system', userName: 'HortiFlow', timestamp: Date.now() - 1000 * 60 * 60 * 2, fromStatus: 'pending', toStatus: 'preparing' }],
        items: [
          { id: 'i6', name: 'Saco de Batata', quantity: '50kg', category: 'vegetable' },
          { id: 'i7', name: 'Cebola Branca', quantity: '10kg', category: 'vegetable' },
        ]
      }
    ]
  },
  {
    id: 'delivery',
    title: 'Saiu p/ Entrega',
    orders: [
      {
        id: '4',
        customerName: 'Ana Clara',
        address: 'Travessa da Paz, 8',
        priority: 'low',
        status: 'delivery',
        createdAt: Date.now() - 1000 * 60 * 60 * 4,
        total: 45.90,
        logs: [{ userId: 'system', userName: 'HortiFlow', timestamp: Date.now() - 1000 * 60 * 60 * 4, fromStatus: 'preparing', toStatus: 'delivery' }],
        items: [
          { id: 'i8', name: 'Melancia Inteira', quantity: '1un', category: 'fruit' },
        ]
      }
    ]
  },
  {
    id: 'delivered',
    title: 'Entregues',
    orders: []
  }
];

interface KanbanBoardProps {
  currentUser: User;
  users: AuthUser[];
  onRegisterUser: (newUser: AuthUser) => void;
  onLogout: () => void;
}

export default function KanbanBoard({ currentUser, users, onRegisterUser, onLogout }: KanbanBoardProps) {
  const [columns, setColumns] = useState<ColumnType[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const filteredColumns = columns.map(col => ({
    ...col,
    orders: col.orders.filter(order => 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }));

  const handleManualNewOrder = (newOrder: Order) => {
    setColumns(prev => prev.map(col => 
      col.id === 'pending' 
        ? { ...col, orders: [newOrder, ...col.orders] }
        : col
    ));
  };

  const deleteOrder = (orderId: string) => {
    if (currentUser.role !== 'admin') return;
    setColumns(prev => prev.map(col => ({
      ...col,
      orders: col.orders.filter(order => order.id !== orderId)
    })));
  };

  const updateOrderFile = (orderId: string, type: 'pdf' | 'photo') => {
    setColumns(prev => prev.map(col => ({
      ...col,
      orders: col.orders.map(order => {
        if (order.id !== orderId) return order;
        if (type === 'pdf') {
          return { ...order, pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' };
        }
        return { ...order, deliveryPhotoUrl: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&q=80&w=200' };
      })
    })));
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startCol = columns.find(c => c.id === source.droppableId)!;
    const finishCol = columns.find(c => c.id === destination.droppableId)!;
    const movedOrder = startCol.orders[source.index];

    // RESTRICTION: Check for photo before delivery
    if (destination.droppableId === 'delivered' && !movedOrder.deliveryPhotoUrl) {
      alert('⚠️ Erro: É necessário anexar uma foto de comprovação antes de marcar como entregue.');
      return;
    }

    if (startCol === finishCol) {
      const newOrders = Array.from(startCol.orders);
      const [removed] = newOrders.splice(source.index, 1);
      newOrders.splice(destination.index, 0, removed);

      const newColumns = columns.map(c => 
        c.id === startCol.id ? { ...c, orders: newOrders } : c
      );

      setColumns(newColumns);
      return;
    }

    const startOrders: Order[] = Array.from(startCol.orders);
    const [originalMovedOrder] = startOrders.splice(source.index, 1);
    const movedOrderToUpdate: Order = originalMovedOrder;
    
    // Update order status and add log
    const updatedOrder: Order = {
      ...movedOrderToUpdate,
      status: destination.droppableId as OrderStatus,
      logs: [
        ...movedOrderToUpdate.logs,
        {
          userId: currentUser.id,
          userName: currentUser.name,
          timestamp: Date.now(),
          fromStatus: source.droppableId as OrderStatus,
          toStatus: destination.droppableId as OrderStatus
        }
      ]
    };

    const finishOrders = Array.from(finishCol.orders);
    finishOrders.splice(destination.index, 0, updatedOrder);

    const newColumns = columns.map(c => {
      if (c.id === startCol.id) return { ...c, orders: startOrders };
      if (c.id === finishCol.id) return { ...c, orders: finishOrders };
      return c;
    });

    setColumns(newColumns);
  };

  return (
    <div className="h-screen flex flex-col bg-brand-bg overflow-hidden font-sans">
      {/* Header */}
      <nav className="h-20 bg-white border-b-4 border-emerald-500/20 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <span className="text-2xl">🍎</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-emerald-900 tracking-tight leading-none">HortiFlow</h1>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">Gestão de Pedidos Frescos</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center relative mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-full py-1.5 pl-9 pr-4 w-48 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[11px] font-black text-slate-800 leading-none uppercase tracking-tight">{currentUser.name}</span>
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">{currentUser.role === 'admin' ? 'Administrador' : 'Funcionário'}</span>
            </div>

            <div className="h-8 w-px bg-slate-200"></div>

            <div className="flex gap-2">
              {currentUser.role === 'admin' && (
                <>
                  <button 
                    onClick={() => setIsUserModalOpen(true)}
                    className="bg-slate-100 text-slate-500 p-2 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-all group"
                    title="Gerenciar Equipe"
                  >
                    <Users size={18} />
                  </button>
                  <button 
                    onClick={() => setIsOrderModalOpen(true)}
                    className="bg-emerald-500 text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-95 text-[10px] font-black uppercase tracking-widest"
                  >
                    <Plus size={16} strokeWidth={3} />
                    NOVO
                  </button>
                </>
              )}
              <button 
                onClick={onLogout}
                className="bg-slate-100 text-slate-500 p-2 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all group"
                title="Sair"
              >
                <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Board */}
      <main className="flex-1 p-6 flex gap-6 overflow-x-auto kanban-scroll bg-[radial-gradient(#d1fae5_1px,transparent_1px)] [background-size:32px_32px]">
        <DragDropContext onDragEnd={onDragEnd}>
          {filteredColumns.map((column: ColumnType) => (
            <Column 
              key={column.id} 
              column={column} 
              onUpdateFile={updateOrderFile}
              onDeleteOrder={deleteOrder}
              currentUser={currentUser}
            />
          ))}
        </DragDropContext>
      </main>
      
      {/* Footer Info */}
      <footer className="h-12 bg-brand-dark px-8 flex items-center justify-between shrink-0">
        <div className="flex gap-6 items-center text-emerald-200 text-[10px] font-black uppercase tracking-widest">
          <span className="flex items-center gap-2">🕒 Atualizado: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="hidden sm:flex items-center gap-2">🌡️ Temp. Câmara: 4.2°C</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Sistema Operacional</span>
        </div>
        <div className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em]">
          HortiFlow v2.4 Enterprise Edition
        </div>
      </footer>

      <UserManagementModal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        users={users}
        onRegister={onRegisterUser}
      />

      <NewOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmit={handleManualNewOrder}
        currentUser={currentUser}
      />
    </div>
  );
}
