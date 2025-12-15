
import React from 'react';
import { Tab, Order } from '../types';
import { ArrowUpRight, Clock, Users, Crown, Bot, Sparkles } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: Tab) => void;
  recentOrders: Order[];
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, recentOrders }) => {
  // Mock calculations
  const dailySales = recentOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  const pendingJobs = recentOrders.filter(o => o.status !== 'COMPLETED').length;

  return (
    <div className="space-y-6 pb-24 px-4 pt-4 bg-gray-50/50">
      
      {/* KPI Cards */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <div className="p-1.5 bg-green-100 rounded-md text-green-600">
              <ArrowUpRight size={16} />
            </div>
            <span className="text-xs font-semibold uppercase">Daily Sales</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${dailySales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <div className="p-1.5 bg-orange-100 rounded-md text-orange-600">
              <Clock size={16} />
            </div>
            <span className="text-xs font-semibold uppercase">Pending</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{pendingJobs} Jobs</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-sm font-bold text-gray-900 mb-3 px-1">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => onNavigate(Tab.MEMBERSHIP)}
            className="flex flex-col items-center justify-center bg-white text-gray-700 border border-gray-200 p-4 rounded-2xl shadow-sm active:scale-95 transition-transform"
          >
            <Crown size={24} className="mb-2 text-purple-500" />
            <span className="text-xs font-bold text-center">Member Benefits</span>
          </button>
          <button 
            onClick={() => onNavigate(Tab.AI_ASSISTANT)}
            className="flex flex-col items-center justify-center bg-slate-800 text-white p-4 rounded-2xl shadow-lg shadow-slate-200 active:scale-95 transition-transform overflow-hidden relative"
          >
            {/* Subtle background effect for AI */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full -mr-4 -mt-4 blur-xl"></div>
            <Bot size={24} className="mb-2" />
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold">Ask AI</span>
              <Sparkles size={8} className="text-yellow-300" />
            </div>
          </button>
          <button 
            onClick={() => onNavigate(Tab.CUSTOMERS)}
            className="flex flex-col items-center justify-center bg-white text-gray-700 border border-gray-200 p-4 rounded-2xl shadow-sm active:scale-95 transition-transform"
          >
            <Users size={24} className="mb-2 text-emerald-500" />
            <span className="text-xs font-bold">Members</span>
          </button>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-gray-900">Recent Activity</h2>
          <button onClick={() => onNavigate(Tab.HISTORY)} className="text-xs text-blue-600 font-medium">View All</button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {recentOrders.slice(0, 3).map((order, idx) => (
            <div key={order.id} className={`p-4 flex items-center justify-between ${idx !== 2 ? 'border-b border-gray-50' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${order.type === 'REPAIR' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                  {order.type === 'REPAIR' ? 'REP' : 'SAL'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{order.customer.name}</p>
                  <p className="text-xs text-gray-400">{order.customer.deviceModel || 'General Item'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">${order.totalAmount}</p>
                <p className={`text-[10px] font-medium uppercase px-1.5 py-0.5 rounded inline-block ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {order.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
