
import React from 'react';
import { Tab } from '../types';
import { LayoutDashboard, Clock, PlusCircle, Wrench, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: Tab;
  onNavigate: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate }) => {
  const navItems = [
    { id: Tab.DASHBOARD, icon: LayoutDashboard, label: 'Dash' },
    { id: Tab.PREORDERS, icon: Clock, label: 'Pre-Order' },
    { id: Tab.POS, icon: PlusCircle, label: 'POS', highlight: true },
    { id: Tab.REPAIRS, icon: Wrench, label: 'Repairs' },
    { id: Tab.PROFILE, icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="w-full bg-white border-t border-gray-200 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative -top-5 active:scale-95 transition-transform focus:outline-none"
              >
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-300 border-4 border-gray-50">
                  <item.icon size={26} />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-2 relative active:scale-95 transition-transform focus:outline-none"
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium mt-0.5 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
