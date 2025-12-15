
import React from 'react';
import { Tab } from '../types';
import { APP_NAME } from '../constants';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  activeTab: Tab;
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onMenuClick }) => {
  const getTitle = () => {
    switch (activeTab) {
      case Tab.DASHBOARD: return 'Overview';
      case Tab.HISTORY: return 'All History';
      case Tab.PREORDERS: return 'Pre-Orders';
      case Tab.POS: return 'New Order';
      case Tab.REPAIRS: return 'Repair Jobs';
      case Tab.PROFILE: return 'Staff Profile';
      case Tab.CUSTOMERS: return 'Customer List';
      default: return APP_NAME;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 text-white shadow-md">
      <div className="h-14 flex items-center justify-between px-4">
        <button 
          onClick={onMenuClick}
          className="p-1 rounded-lg active:bg-slate-800 transition-colors hover:bg-slate-800"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold tracking-wide">{getTitle()}</h1>
        <button className="p-1 rounded-lg active:bg-slate-800 relative hover:bg-slate-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
        </button>
      </div>
    </header>
  );
};
