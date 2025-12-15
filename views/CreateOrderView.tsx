
import React, { useState, useMemo, useEffect } from 'react';
import { OrderType, Order, OrderStatus, OrderItem, Customer, ServiceItem } from '../types';
import { SERVICES, MOCK_CUSTOMERS } from '../constants';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Trash2, Plus, UserCheck, MapPin, User, Smartphone, Lock, CreditCard, Banknote, ArrowRightLeft, Sparkles, Search, Mail, History, X } from 'lucide-react';
import { ReceiptView } from '../components/ReceiptView';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateOrderViewProps {
  onCreateOrder: (order: Order) => void;
  staffName: string;
  location: string;
}

// Common device models for autocomplete
const SUGGESTED_MODELS = [
  "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 15 Plus",
  "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14",
  "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini",
  "iPhone 12 Pro Max", "iPhone 12", "iPhone 11", "iPhone XR", "iPhone X",
  "Samsung S24 Ultra", "Samsung S24+", "Samsung S24",
  "Samsung S23 Ultra", "Samsung S23",
  "Pixel 8 Pro", "Pixel 8",
  "iPad Pro 12.9", "iPad Air 5", "iPad mini 6", "iPad 10th Gen"
];

export const CreateOrderView: React.FC<CreateOrderViewProps> = ({ onCreateOrder, staffName, location }) => {
  const [step, setStep] = useState<'FORM' | 'RECEIPT'>('FORM');
  const [orderType, setOrderType] = useState<OrderType>(OrderType.REPAIR);
  
  // Form State
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '', email: '', isMember: false, deviceModel: '' });
  const [items, setItems] = useState<OrderItem[]>([{ id: '1', name: '', price: 0, quantity: 1 }]);
  const [deposit, setDeposit] = useState<string>('0');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'TRANSFER'>('CASH');
  
  // Repair Specifics
  const [imei, setImei] = useState('');
  const [passcode, setPasscode] = useState('');
  const [notes, setNotes] = useState('');
  
  // UI State
  const [foundCustomer, setFoundCustomer] = useState(false);
  const [lastVisitInfo, setLastVisitInfo] = useState<string | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Group services
  const groupedServices = useMemo(() => {
    const groups: Record<string, ServiceItem[]> = {};
    SERVICES.forEach(service => {
      const cat = service.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(service);
    });
    return groups;
  }, []);

  // --- AUTO-FILL LOGIC ---
  useEffect(() => {
    if (customer.phone.length >= 3) {
      const existing = MOCK_CUSTOMERS.find(c => c.phone.includes(customer.phone));
      if (existing) {
        if (!customer.name || customer.name === existing.name.substring(0, customer.name.length)) {
           setCustomer(prev => ({
             ...prev,
             name: existing.name,
             email: existing.email || '',
             isMember: existing.isMember,
             deviceModel: existing.deviceModel || prev.deviceModel
           }));
           setFoundCustomer(true);
           if (existing.visitCount && existing.visitCount > 0) {
             setLastVisitInfo(`Visits: ${existing.visitCount} | Total: $${existing.totalSpent}`);
           }
        }
      } else {
        setFoundCustomer(false);
        setLastVisitInfo(null);
      }
    } else {
      setFoundCustomer(false);
      setLastVisitInfo(null);
    }
  }, [customer.phone]);


  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = customer.isMember ? subtotal * 0.10 : 0; 
  const total = subtotal - discount;
  const balance = Math.max(0, total - parseFloat(deposit || '0'));

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', price: 0, quantity: 1 }]);
  };

  const handleBulkAdd = (selectedServices: ServiceItem[]) => {
    const newItems = [...items];
    
    // Remove the empty placeholder if it exists
    if (newItems.length === 1 && newItems[0].name === '' && newItems[0].price === 0) {
      newItems.pop();
    }

    selectedServices.forEach(s => {
       const priceMatch = s.price.match(/(\d+(\.\d+)?)/);
       const priceNum = priceMatch ? parseFloat(priceMatch[0]) : 0;
       newItems.push({ 
         id: Date.now().toString() + Math.random(), 
         name: s.name, 
         price: priceNum, 
         quantity: 1 
       });
    });
    setItems(newItems);
    setShowServiceModal(false);
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(idx, 1);
      setItems(newItems);
    }
  };

  const handleItemChange = (idx: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      id: `INV-${Math.floor(Math.random() * 10000)}`,
      date: new Date(),
      type: orderType,
      customer,
      items,
      subtotal,
      discount,
      deposit: parseFloat(deposit || '0'),
      totalAmount: total,
      balanceDue: balance,
      status: balance > 0 ? OrderStatus.PENDING : OrderStatus.COMPLETED,
      staffName: staffName,
      location: location,
      notes: notes,
      paymentMethod: paymentMethod,
      deviceDetails: orderType === OrderType.REPAIR ? { imei, passcode } : undefined
    };
    
    onCreateOrder(newOrder);
    setCreatedOrder(newOrder);
    setStep('RECEIPT');
  };

  const resetForm = () => {
    setCustomer({ name: '', phone: '', email: '', isMember: false, deviceModel: '' });
    setItems([{ id: '1', name: '', price: 0, quantity: 1 }]);
    setDeposit('0');
    setImei('');
    setPasscode('');
    setNotes('');
    setPaymentMethod('CASH');
    setStep('FORM');
    setCreatedOrder(null);
    setFoundCustomer(false);
    setLastVisitInfo(null);
  };

  const allSuggestedModels = Array.from(new Set([
    ...SUGGESTED_MODELS,
    ...MOCK_CUSTOMERS.map(c => c.deviceModel).filter((m): m is string => !!m)
  ])).sort();

  if (step === 'RECEIPT' && createdOrder) {
    return (
      <ReceiptView order={createdOrder} onClose={resetForm} />
    );
  }

  return (
    <div className="pb-24 bg-gray-50 min-h-full">
      {/* Type Selector */}
      <div className="bg-white p-2 flex sticky top-0 z-10 shadow-sm">
        {Object.values(OrderType).map((type) => (
          <button
            key={type}
            onClick={() => setOrderType(type)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              orderType === type 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      
      <div className="px-4 pt-2">
        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-2 flex items-center justify-between text-xs text-blue-700">
           <span className="flex items-center"><User size={12} className="mr-1"/> Operator: {staffName}</span>
           <span className="flex items-center"><MapPin size={12} className="mr-1"/> {location}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-6">
        {/* Customer Section */}
        <div className={`p-4 rounded-xl border transition-colors shadow-sm space-y-4 ${foundCustomer ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center">
               Customer Details
               {foundCustomer && <span className="ml-2 text-[10px] bg-green-200 text-green-700 px-2 py-0.5 rounded-full flex items-center"><Search size={10} className="mr-1"/> Found</span>}
            </h3>
            <label className="flex items-center space-x-2 text-sm cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={customer.isMember}
                onChange={(e) => setCustomer({...customer, isMember: e.target.checked})}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={customer.isMember ? "text-blue-600 font-bold" : "text-gray-500"}>
                {customer.isMember ? "VIP Member" : "Guest"}
              </span>
            </label>
          </div>
          
          {/* Last Visit Alert */}
          <AnimatePresence>
            {lastVisitInfo && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/80 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-800 flex items-center"
              >
                 <History size={12} className="mr-2" />
                 <span className="font-semibold">{lastVisitInfo}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
                <Input 
                  placeholder="Phone (Auto-search)" 
                  value={customer.phone}
                  onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  required
                  className={foundCustomer ? "border-green-300 focus:ring-green-100" : ""}
                />
            </div>
            <Input 
              placeholder="Name" 
              value={customer.name}
              onChange={(e) => setCustomer({...customer, name: e.target.value})}
              required
            />
          </div>
          
          {/* New Email Field */}
          <div className="relative">
             <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               type="email"
               placeholder="Email Address (Optional)"
               className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white"
               value={customer.email}
               onChange={(e) => setCustomer({...customer, email: e.target.value})}
             />
          </div>
          
          {/* Enhanced Device Details for Repairs */}
          {orderType === OrderType.REPAIR && (
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <div className="flex items-center space-x-2 text-xs text-gray-400 font-semibold uppercase">
                <Smartphone size={12} />
                <span>Device Intake</span>
              </div>
              
              <Input 
                 list="model-suggestions"
                 placeholder="Device Model (e.g. iPhone 13)" 
                 value={customer.deviceModel}
                 onChange={(e) => setCustomer({...customer, deviceModel: e.target.value})}
                 className="bg-blue-50 border-blue-100"
                 required
                 autoComplete="off"
               />
               <datalist id="model-suggestions">
                 {allSuggestedModels.map(model => (
                   <option key={model} value={model} />
                 ))}
               </datalist>

               <div className="grid grid-cols-2 gap-3">
                 <div className="relative">
                    <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      placeholder="IMEI / SN (Optional)"
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      value={imei}
                      onChange={(e) => setImei(e.target.value)}
                    />
                 </div>
                 <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      placeholder="Passcode"
                      className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                    />
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Items Section */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Service & Items</h3>
             <button 
               type="button"
               onClick={() => setShowServiceModal(true)}
               className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-colors"
             >
               + Bulk Add
             </button>
          </div>
          
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={item.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                   <input 
                     placeholder="Item Description"
                     className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none font-medium"
                     value={item.name}
                     onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                     required
                   />
                   <div className="flex gap-2">
                     <div className="relative w-28">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                       <input 
                         type="number"
                         placeholder="0.00"
                         className="w-full pl-6 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none"
                         value={item.price || ''}
                         onChange={(e) => handleItemChange(idx, 'price', parseFloat(e.target.value))}
                         required
                       />
                     </div>
                     <div className="flex items-center border border-gray-200 rounded-lg px-2 bg-gray-50">
                        <span className="text-xs text-gray-400 mr-2">Qty</span>
                        <input 
                           type="number"
                           className="w-12 py-2 text-sm bg-transparent outline-none text-center font-bold"
                           value={item.quantity}
                           onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value))}
                        />
                     </div>
                   </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveItem(idx)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg mt-1 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <button 
            type="button"
            onClick={handleAddItem}
            className="w-full py-3 flex items-center justify-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg border border-gray-200 border-dashed hover:bg-gray-100 transition-colors"
          >
            <Plus size={16} className="mr-1" /> Add Custom Item
          </button>

           <div className="pt-2">
             <textarea 
                placeholder="Internal notes, problem description, or warranty terms..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
             />
           </div>
        </div>

        {/* Totals & Payment Section */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-sm">
           <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
              {[
                { id: 'CASH', icon: Banknote, label: 'Cash' },
                { id: 'CARD', icon: CreditCard, label: 'Card' },
                { id: 'TRANSFER', icon: ArrowRightLeft, label: 'Trf' }
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as any)}
                  className={`flex-1 flex flex-col items-center justify-center py-2 rounded-md text-[10px] font-bold transition-all ${
                    paymentMethod === pm.id 
                      ? 'bg-slate-800 text-white shadow' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <pm.icon size={16} className="mb-0.5" />
                  {pm.label}
                </button>
              ))}
           </div>

           <div className="space-y-2 pt-2">
             <div className="flex justify-between text-gray-500">
               <span>Subtotal</span>
               <span>${subtotal.toFixed(2)}</span>
             </div>
             {customer.isMember && (
               <div className="flex justify-between text-green-600 font-medium">
                 <span className="flex items-center"><UserCheck size={14} className="mr-1"/> Member Discount (10%)</span>
                 <span>-${discount.toFixed(2)}</span>
               </div>
             )}
             
             <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
               <span>Total Amount</span>
               <span>${total.toFixed(2)}</span>
             </div>

             {(orderType === OrderType.PREORDER || orderType === OrderType.REPAIR) && (
               <div className="bg-white p-2 rounded-lg border border-gray-200 mt-2">
                 <div className="flex justify-between items-center mb-1">
                   <span className="font-medium text-gray-700 text-xs uppercase">Payment Received</span>
                   <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded">{paymentMethod}</span>
                 </div>
                 <div className="flex items-center">
                   <span className="text-gray-400 mr-2 font-bold text-lg">$</span>
                   <input 
                     type="number"
                     className="w-full py-1 outline-none font-bold text-xl text-slate-900"
                     value={deposit}
                     onChange={(e) => setDeposit(e.target.value)}
                     placeholder="0.00"
                   />
                 </div>
               </div>
             )}
             
             {parseFloat(deposit) > 0 && balance > 0 && (
                <div className="flex justify-between text-sm font-bold text-red-500 pt-1">
                  <span>Balance Due</span>
                  <span>${balance.toFixed(2)}</span>
                </div>
             )}
           </div>
        </div>

        <Button type="submit" fullWidth className="!bg-slate-900 !rounded-xl !py-4 shadow-xl">
           Confirm & Create Order
        </Button>
      </form>

      {/* Bulk Service Selection Modal */}
      <AnimatePresence>
        {showServiceModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl w-full max-w-sm h-[80vh] flex flex-col overflow-hidden">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-900">Select Services</h3>
                  <button onClick={() => setShowServiceModal(false)}><X size={20} /></button>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {Object.entries(groupedServices).map(([category, items]) => (
                    <div key={category}>
                       <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{category}</h4>
                       <div className="space-y-2">
                         {(items as ServiceItem[]).map(s => (
                           <div key={s.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-blue-50 cursor-pointer" 
                                onClick={() => handleBulkAdd([s])}>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                                <p className="text-xs text-gray-500">{s.price}</p>
                              </div>
                              <Plus size={16} className="text-blue-500" />
                           </div>
                         ))}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
