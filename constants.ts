
import { Order, OrderType, OrderStatus, ServiceItem, Customer } from './types';

export const APP_NAME = "PM Staff OS";

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C001', name: 'Alice Tan', phone: '012-3456789', email: 'alice.t@example.com', isMember: true, deviceModel: 'iPhone 13 Pro', totalSpent: 450, visitCount: 3 },
  { id: 'C002', name: 'Bob Smith', phone: '019-8765432', email: 'bob.smith@test.com', isMember: false, deviceModel: 'Samsung S24', totalSpent: 50, visitCount: 1 },
  { id: 'C003', name: 'Charlie Doe', phone: '017-1122334', email: 'charlie@gmail.com', isMember: true, deviceModel: 'iPad Air 4', totalSpent: 120, visitCount: 2 },
  { id: 'C004', name: 'David Lee', phone: '016-5556666', email: 'david.l@outlook.com', isMember: true, deviceModel: 'Pixel 8', totalSpent: 200, visitCount: 4 },
  { id: 'C005', name: 'Eve Wong', phone: '012-9988776', email: 'eve.w@example.com', isMember: false, deviceModel: 'MacBook Air', totalSpent: 0, visitCount: 0 },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2023-001',
    date: new Date(new Date().getTime() - 86400000), // Yesterday
    type: OrderType.REPAIR,
    customer: MOCK_CUSTOMERS[0],
    items: [{ id: '1', name: 'Screen Replacement (OLED)', price: 180, quantity: 1 }],
    subtotal: 180,
    discount: 18, // 10% Member discount
    deposit: 0,
    totalAmount: 162,
    balanceDue: 0,
    status: OrderStatus.COMPLETED,
    location: 'Eastwood'
  },
  {
    id: 'ORD-2023-002',
    date: new Date(new Date().getTime() - 3600000), // 1 hour ago
    type: OrderType.PREORDER,
    customer: MOCK_CUSTOMERS[1],
    items: [{ id: '2', name: 'Special Case Import', price: 50, quantity: 1 }],
    subtotal: 50,
    discount: 0,
    deposit: 20,
    totalAmount: 50,
    balanceDue: 30,
    status: OrderStatus.PENDING,
    location: 'Parramatta'
  }
];

export const SERVICES: ServiceItem[] = [
  // --- Screen Protection & Accessories ---
  {
    id: 'sp-1',
    name: 'Tempered Glass (Basic)',
    description: 'Standard 9H protection glass.',
    price: '$10',
    duration: '5 mins',
    icon: 'Shield',
    category: 'Protection & Accessories'
  },
  {
    id: 'sp-2',
    name: 'Privacy / Matte Glass',
    description: 'Anti-spy or anti-glare premium glass.',
    price: '$20',
    duration: '5 mins',
    icon: 'ShieldCheck',
    category: 'Protection & Accessories'
  },
  {
    id: 'sp-3',
    name: 'Hydrogel Film (UV Cure)',
    description: 'Self-healing film for curved screens (Samsung/Pixel).',
    price: '$25',
    duration: '10 mins',
    icon: 'Smartphone',
    category: 'Protection & Accessories'
  },
  
  // --- Battery Services ---
  {
    id: 'bat-1',
    name: 'Battery Replacement (Standard)',
    description: 'Standard capacity OEM-grade battery.',
    price: '$60',
    duration: '30 mins',
    icon: 'Battery',
    category: 'Power & Battery'
  },
  {
    id: 'bat-2',
    name: 'Battery Replacement (High Cap)',
    description: 'High capacity battery for extended life.',
    price: '$80',
    duration: '30 mins',
    icon: 'BatteryCharging',
    category: 'Power & Battery'
  },
  {
    id: 'chg-1',
    name: 'Charging Port Service',
    description: 'Deep cleaning or flex cable replacement.',
    price: '$55',
    duration: '45 mins',
    icon: 'Zap',
    category: 'Power & Battery'
  },

  // --- Screen & Display ---
  {
    id: 'scr-1',
    name: 'Screen Repair (In-Cell/LCD)',
    description: 'Budget-friendly display replacement.',
    price: '$90',
    duration: '45 mins',
    icon: 'Smartphone',
    category: 'Screen & Display'
  },
  {
    id: 'scr-2',
    name: 'Screen Repair (Soft OLED)',
    description: 'Premium quality, original color & touch feel.',
    price: '$180',
    duration: '45 mins',
    icon: 'Smartphone',
    category: 'Screen & Display'
  },
  {
    id: 'scr-3',
    name: 'Back Glass (Laser Removal)',
    description: 'Laser machine removal of cracked back glass.',
    price: '$100',
    duration: '3 hours',
    icon: 'Smartphone',
    category: 'Screen & Display'
  },

  // --- Components ---
  {
    id: 'cam-1',
    name: 'Camera Lens Glass Only',
    description: 'Replace cracked external lens glass.',
    price: '$45',
    duration: '30 mins',
    icon: 'Camera',
    category: 'Components'
  },
  {
    id: 'cam-2',
    name: 'Main Camera Module',
    description: 'Fix shaking camera or black screen issues.',
    price: '$120+',
    duration: '1 hour',
    icon: 'Camera',
    category: 'Components'
  },
  {
    id: 'aud-1',
    name: 'Speaker/Mic Cleaning',
    description: 'Restore low volume issues due to dust.',
    price: '$30',
    duration: '20 mins',
    icon: 'Speaker',
    category: 'Components'
  },

  // --- Advanced / Board Level ---
  {
    id: 'wtr-1',
    name: 'Water Damage Ultrasonic',
    description: 'Motherboard chemical cleaning & diagnostic.',
    price: '$60',
    duration: '24 hours',
    icon: 'Droplets',
    category: 'Advanced Repair'
  },
  {
    id: 'brd-1',
    name: 'Board Level Repair (Start)',
    description: 'Audio IC, Power IC, Short circuit repair.',
    price: '$150+',
    duration: '3-5 days',
    icon: 'Cpu',
    category: 'Advanced Repair'
  },
  {
    id: 'face-1',
    name: 'FaceID Repair',
    description: 'Fix "Move iPhone higher/lower" errors.',
    price: '$140',
    duration: '1 day',
    icon: 'ScanFace',
    category: 'Advanced Repair'
  },

  // --- Software ---
  {
    id: 'soft-1',
    name: 'Data Transfer / Backup',
    description: 'Move data to new device or USB drive.',
    price: '$50',
    duration: '1 hour',
    icon: 'HardDrive',
    category: 'Software'
  },
  {
    id: 'soft-2',
    name: 'System Restore / Flash',
    description: 'Fix boot loops or software crashes.',
    price: '$40',
    duration: '1 hour',
    icon: 'RefreshCw',
    category: 'Software'
  }
];

export const INITIAL_SYSTEM_INSTRUCTION = `
You are "Mechanic Mike", a senior technician assistant for the staff at "Phone Mechanic".
Your users are professional phone technicians.
Help them diagnose complex board-level issues, suggest repair steps for specific models, or interpret error codes.
Keep responses technical, precise, and safety-oriented. 
If asked about parts pricing, give general market estimates for original vs aftermarket parts.
`;
