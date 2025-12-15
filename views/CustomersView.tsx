
import React, { useState } from 'react';
import { Customer, Order } from '../types';
import { Search, User, Crown, Phone, ChevronRight, ArrowLeft, Clock, ShoppingBag, Smartphone, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReceiptView } from '../components/ReceiptView';

interface CustomersViewProps {
  customers: Customer[];
  orders: Order[];
}

export const CustomersView: React.FC<CustomersViewProps> = ({ customers, orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // If order is selected, show receipt
  if (selectedOrder) {
    return (
      <ReceiptView 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        isHistoryMode 
      />
    );
  }

  // Filter customers for list view
  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  // If customer is selected, show details and their orders
  if (selectedCustomer) {
    const customerOrders = orders.filter(o => 
      // Match loosely by name or phone since IDs might not match in this mock data structure
      o.customer.name === selectedCustomer.name || o.customer.phone === selectedCustomer.phone
    ).sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
      <div className="bg-gray-50 min-h-full pb-24">
        {/* Detail Header */}
        <div className="bg-white sticky top-0 z-10 border-b border-gray-100 shadow-sm px-4 py-3 flex items-center space-x-3">
          <button 
            onClick={() => setSelectedCustomer(null)}
            className="p-2 hover:bg-gray-100 rounded-full -ml-2 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="font-bold text-gray-900">{selectedCustomer.name}</h2>
        </div>

        <div className="p-4 space-y-6">
           {/* Customer Stats Card */}
           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
             <div className="flex items-center space-x-4 mb-4">
               <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl ${selectedCustomer.isMember ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                 {selectedCustomer.isMember ? <Crown size={28} /> : <User size={28} />}
               </div>
               <div>
                 <h3 className="text-lg font-bold text-gray-900">{selectedCustomer.name}</h3>
                 <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
               <div>
                 <p className="text-xs text-gray-400 uppercase font-bold">Total Spent</p>
                 <p className="text-xl font-bold text-gray-900">${selectedCustomer.totalSpent || 0}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-400 uppercase font-bold">Visits</p>
                 <p className="text-xl font-bold text-gray-900">{selectedCustomer.visitCount || 0}</p>
               </div>
             </div>
             {selectedCustomer.deviceModel && (
                <div className="mt-3 pt-3 border-t border-gray-50 text-sm">
                   <span className="text-gray-400 mr-2">Main Device:</span>
                   <span className="font-medium text-gray-800">{selectedCustomer.deviceModel}</span>
                </div>
             )}
           </div>

           {/* Order History */}
           <div>
             <h3 className="font-bold text-gray-900 mb-3 px-1">Order History</h3>
             <div className="space-y-3">
               {customerOrders.length > 0 ? (
                 customerOrders.map(order => (
                   <motion.div 
                     key={order.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     onClick={() => setSelectedOrder(order)}
                     className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer group relative"
                   >
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                           <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                             order.type === 'REPAIR' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                           }`}>
                             {order.type}
                           </span>
                           <span className="text-xs text-gray-400">{order.date.toLocaleDateString()}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${
                          order.status === 'COMPLETED' ? 'text-green-600' : 'text-orange-500'
                        }`}>
                          {order.status}
                        </span>
                     </div>
                     <div className="flex justify-between items-end">
                       <div>
                         <p className="text-sm font-bold text-gray-900 flex items-center">
                           {order.items[0]?.name}
                           {order.items.length > 1 && <span className="text-xs text-gray-400 font-normal ml-1">+{order.items.length - 1} more</span>}
                         </p>
                         <p className="text-xs text-gray-500 mt-0.5">ID: {order.id}</p>
                       </div>
                       <div className="flex flex-col items-end">
                         <p className="text-sm font-bold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                         <div className="flex items-center text-blue-600 text-xs font-bold mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <span className="mr-1">View</span>
                            <ChevronRight size={14} />
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
                   <p className="text-sm text-gray-400">No previous orders found.</p>
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full pb-24">
      <div className="bg-white p-4 sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filtered.map((customer, idx) => (
          <motion.div 
            key={customer.id || idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedCustomer(customer)}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between active:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${customer.isMember ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                {customer.isMember ? <Crown size={20} /> : <User size={20} />}
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 flex items-center">
                  {customer.name}
                  {customer.isMember && (
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-bold uppercase">VIP</span>
                  )}
                </h3>
                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                  <Phone size={10} className="mr-1" />
                  {customer.phone}
                </div>
              </div>
            </div>
            <div className="flex items-center text-gray-400">
               <div className="text-right mr-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Visits</p>
                  <p className="text-xs font-bold text-gray-900">{customer.visitCount || 0}</p>
               </div>
               <ChevronRight size={18} />
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">
                <User size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No customers found.</p>
            </div>
        )}
      </div>
    </div>
  );
};
