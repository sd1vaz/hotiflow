/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OrderStatus = 'pending' | 'preparing' | 'delivery' | 'delivered';
export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
}

export interface AuthUser extends User {
  password: string;
}

export interface AuditLog {
  userId: string;
  userName: string;
  timestamp: number;
  fromStatus: OrderStatus | 'created';
  toStatus: OrderStatus;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: string;
  category: 'fruit' | 'vegetable' | 'other';
}

export interface Order {
  id: string;
  customerName: string;
  address: string;
  items: OrderItem[];
  status: OrderStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  total: number;
  pdfUrl?: string;
  deliveryPhotoUrl?: string;
  logs: AuditLog[];
}

export interface Column {
  id: OrderStatus;
  title: string;
  orders: Order[];
}
