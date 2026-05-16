/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import KanbanBoard from './components/KanbanBoard';
import Login from './components/Login';
import { User, AuthUser } from './types';

const INITIAL_USERS: AuthUser[] = [
  { id: 'u1', name: 'Admin Geral', username: 'admin', password: '123', role: 'admin' },
  { id: 'u2', name: 'Operador Padrão', username: 'user', password: '123', role: 'employee' },
];

export default function App() {
  const [users, setUsers] = useState<AuthUser[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleRegisterUser = (newUser: AuthUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  if (!currentUser) {
    return <Login users={users} onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen">
      <KanbanBoard 
        currentUser={currentUser} 
        users={users}
        onRegisterUser={handleRegisterUser}
        onDeleteUser={handleDeleteUser}
        onLogout={() => setCurrentUser(null)} 
      />
    </div>
  );
}
