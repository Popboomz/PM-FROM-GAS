
import React from 'react';
import { Crown, Gift, Clock, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { MOCK_CUSTOMERS } from '../constants';

const RECENT_USAGE = [
  { id: 1, customer: 'Alice Tan', benefit: 'Free Screen Protector', time: '10 mins ago', type: 'GIFT' },
  { id: 2, customer: 'David Lee', benefit: '10% Member Discount', time: '1 hour ago', type: 'DISCOUNT' },
  { id: 3, customer: 'Charlie Doe', benefit: 'Priority Diagnostic', time: '3 hours ago', type: 'SERVICE' },
  { id: 4, customer: 'Alice Tan', benefit: 'Extended Warranty (30 Days)', time: 'Yesterday', type: 'WARRANTY' },
];

const BENEFITS = [
  { id: 'b1', name: '10% Off All Repairs', description: 'Automatic discount on labor & parts', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 'b2', name: 'Free Screen Protector', description: '1 per year for registered device', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'b3', name: 'Priority Service', description: 'Skip the queue for diagnostics', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-100' },
  { id: 'b4', name: 'Birthday Gift', description: '$20 voucher during birthday month', icon: Gift, color: 'text-pink-600', bg: 'bg-pink-100' },
];

export const MembershipView: React.FC = () => {
  const totalMembers = MOCK_CUSTOMERS.filter(c => c.isMember).length;
  const benefitsUsedToday = 12;

  const handleDownloadReport = () => {
    alert("Downloading Member Usage Report (PDF)...");
  };

  return (
    <div className="px-4 pt-4 pb-24 bg-gray-50 min-h-full space-y-6">
      
      {/* Header Stats */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="flex items-center space-x-3 mb-4 relative z-10">
           <div className="p-2 bg-yellow-400 rounded-lg text-slate-900 shadow-lg shadow-yellow-400/50">
             <Crown size={24} fill="currentColor" />
           </div>
           <div>
             <h2 className="text-lg font-bold">VIP Program Status</h2>
             <p className="text-slate-400 text-xs">Real-time equity tracking</p>
           </div>
        </div>
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-slate-400 text-xs font-medium uppercase mb-1">Total Members</p>
            <p className="text-2xl font-bold text-white">{totalMembers}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-slate-400 text-xs font-medium uppercase mb-1">Redeemed Today</p>
            <p className="text-2xl font-bold text-green-400">{benefitsUsedToday}</p>
          </div>
        </div>
      </div>

      {/* Active Benefits List */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 mb-3 px-1 flex items-center">
          <Gift size={16} className="mr-2 text-purple-500" />
          Active Member Benefits
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {BENEFITS.map(benefit => (
            <div key={benefit.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-4">
               <div className={`p-3 rounded-xl ${benefit.bg} ${benefit.color}`}>
                 <benefit.icon size={20} />
               </div>
               <div>
                 <h4 className="font-bold text-gray-900 text-sm">{benefit.name}</h4>
                 <p className="text-xs text-gray-500 mt-1">{benefit.description}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Usage Log */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 mb-3 px-1 flex items-center">
          <Clock size={16} className="mr-2 text-blue-500" />
          Recent Usage Log
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {RECENT_USAGE.map((log, idx) => (
            <div key={log.id} className={`p-4 flex items-start justify-between ${idx !== RECENT_USAGE.length - 1 ? 'border-b border-gray-50' : ''}`}>
               <div className="flex flex-col">
                 <span className="text-sm font-bold text-gray-900">{log.customer}</span>
                 <span className="text-xs text-gray-500 mt-0.5">Used: <span className="text-blue-600 font-medium">{log.benefit}</span></span>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{log.time}</span>
               </div>
            </div>
          ))}
          <div className="p-3 text-center border-t border-gray-50">
            <button onClick={handleDownloadReport} className="text-xs text-blue-600 font-medium hover:underline">View Full Report</button>
          </div>
        </div>
      </section>

    </div>
  );
};
