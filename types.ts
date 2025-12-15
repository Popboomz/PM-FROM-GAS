
export enum Tab {
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
  PREORDERS = 'PREORDERS',
  POS = 'POS',
  REPAIRS = 'REPAIRS',
  PROFILE = 'PROFILE',
  CUSTOMERS = 'CUSTOMERS',
  MEMBERSHIP = 'MEMBERSHIP',
  AI_ASSISTANT = 'AI_ASSISTANT'
}

export enum OrderType {
  REPAIR = 'REPAIR',
  SALES = 'SALES',
  PREORDER = 'PREORDER'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PICKED_UP = 'PICKED_UP',
  CANCELLED = 'CANCELLED'
}

export interface Customer {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  isMember: boolean;
  deviceModel?: string;
  totalSpent?: number;
  visitCount?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: Date;
  type: OrderType;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number; // For members or manual
  deposit: number; // For pre-orders
  totalAmount: number;
  balanceDue: number; // Calculated
  status: OrderStatus;
  notes?: string;
  staffName?: string;
  location?: string;
  paymentMethod?: 'CASH' | 'CARD' | 'TRANSFER';
  deviceDetails?: {
    imei?: string;
    passcode?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  icon: string;
  category?: string;
}
