
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Search, Filter, Smartphone, ShoppingBag, Clock, Download, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface HistoryViewProps {
  orders: Order[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING'>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'THIS_MONTH' | 'LAST_MONTH'>('ALL');
  const [locationFilter, setLocationFilter] = useState<'ALL' | 'Eastwood' | 'Parramatta'>('ALL');

  // Export to CSV Function
  const handleExport = () => {
    const headers = ["Order ID", "Date", "Customer Name", "Phone", "Email", "Type", "Status", "Total", "Balance", "Location"];
    const csvRows = [headers.join(',')];

    filteredOrders.forEach(order => {
      const row = [
        order.id,
        order.date.toLocaleDateString(),
        `"${order.customer.name}"`,
        order.customer.phone,
        order.customer.email || '',
        order.type,
        order.status,
        order.totalAmount,
        order.balanceDue,
        order.location || 'N/A'
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredOrders = orders
    .filter(o => {
      if (statusFilter === 'PENDING') return o.status !== OrderStatus.COMPLETED;
      return true;
    })
    .filter(o => {
      if (locationFilter === 'ALL') return true;
      return o.location === locationFilter;
    })
    .filter(o => {
      if (dateFilter === 'ALL') return true;
      const now = new Date();
      const orderDate = new Date(o.date);
      if (dateFilter === 'THIS_MONTH') {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
      if (dateFilter === 'LAST_MONTH') {
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        return orderDate.getMonth() === lastMonth.getMonth() && orderDate.getFullYear() === lastMonth.getFullYear();
      }
      return true;
    })
    .filter(o => {
      const lowerTerm = searchTerm.toLowerCase();
      return (
        o.customer.name.toLowerCase().includes(lowerTerm) || 
        o.customer.phone.includes(searchTerm) ||
        o.id.toLowerCase().includes(lowerTerm) ||
        (o.customer.deviceModel && o.customer.deviceModel.toLowerCase().includes(lowerTerm))
      );
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="px-4 pt-4 pb-24 space-y-4 bg-gray-50 min-h-full">
      
      {/* Search & Export Toolbar */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Name, Phone, ID..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
           onClick={handleExport}
           className="hidden md:flex items-center px-4 py-3 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm"
        >
          <Download size={16} className="mr-2" /> Export
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
         {/* Status Toggle */}
         <button 
           onClick={() => setStatusFilter(statusFilter === 'ALL' ? 'PENDING' : 'ALL')}
           className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center whitespace-nowrap transition-colors ${statusFilter === 'PENDING' ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-200 text-gray-600'}`}
        >
          <Filter size={14} className="mr-1.5" />
          {statusFilter === 'ALL' ? 'All Status' : 'Pending Only'}
        </button>

        {/* Date Filter Dropdown (Simulated) */}
        <div className="relative group">
           <button className="px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-600 flex items-center whitespace-nowrap">
             <Calendar size={14} className="mr-1.5" />
             {dateFilter === 'ALL' ? 'Any Date' : dateFilter.replace('_', ' ')}
           </button>
           <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden hidden group-hover:block z-20">
              <div className="p-1">
                {['ALL', 'THIS_MONTH', 'LAST_MONTH'].map((d) => (
                  <button 
                    key={d} 
                    onClick={() => setDateFilter(d as any)}
                    className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 rounded"
                  >
                    {d === 'ALL' ? 'Any Date' : d.replace('_', ' ')}
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* Location Filter */}
        <div className="relative group">
           <button className="px-3 py-2 bg-white rounded-lg border border-gray-200 text-xs font-bold text-gray-600 flex items-center whitespace-nowrap">
             <MapPin size={14} className="mr-1.5" />
             {locationFilter === 'ALL' ? 'All Shops' : locationFilter}
           </button>
           <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden hidden group-hover:block z-20">
              <div className="p-1">
                {['ALL', 'Eastwood', 'Parramatta'].map((l) => (
                  <button 
                    key={l} 
                    onClick={() => setLocationFilter(l as any)}
                    className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50 rounded"
                  >
                    {l === 'ALL' ? 'All Shops' : l}
                  </button>
                ))}
              </div>
           </div>
        </div>

        <button 
           onClick={handleExport}
           className="md:hidden flex items-center px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold whitespace-nowrap"
        >
          <Download size={14} className="mr-1.5" /> CSV
        </button>
      </div>

      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <motion.div 
            key={order.id}
            layout
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm active:scale-[0.99] transition-transform cursor-pointer hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{order.id}</span>
                {order.customer.isMember && (
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">VIP</span>
                )}
                {order.location && (
                   <span className="text-[10px] text-gray-400 flex items-center">
                     <MapPin size={10} className="mr-0.5"/> {order.location}
                   </span>
                )}
              </div>
              <span className="text-xs text-gray-400">{order.date.toLocaleDateString()}</span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{order.customer.name}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                   {order.type === 'REPAIR' && <Smartphone size={12} className="mr-1" />}
                   {order.type === 'SALES' && <ShoppingBag size={12} className="mr-1" />}
                   {order.type === 'PREORDER' && <Clock size={12} className="mr-1" />}
                   {order.type === 'REPAIR' ? order.customer.deviceModel : `${order.items.length} items`}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">${order.totalAmount.toFixed(2)}</div>
                
                {/* Balance Due Visualization */}
                {order.balanceDue > 0 ? (
                  <div className="mt-1 flex flex-col items-end">
                    <span className="text-xs font-bold text-red-500">Due: ${order.balanceDue.toFixed(2)}</span>
                    <div className="w-16 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                       <div 
                         className="h-full bg-green-500" 
                         style={{ width: `${(order.deposit / (order.totalAmount || 1)) * 100}%` }}
                       ></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded mt-1 inline-block">
                    Paid
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                 order.status === 'COMPLETED' ? 'text-gray-400' : 'text-blue-600'
              }`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>
          </motion.div>
        ))}
        
        {filteredOrders.length === 0 && (
           <div className="text-center py-12 text-gray-400">
             <p>No orders found matching filters.</p>
           </div>
        )}
      </div>
    </div>
  );
};
