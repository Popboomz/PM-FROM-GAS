
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, User, MapPin, ChevronRight, LayoutDashboard, PlusCircle, Users, History, Settings, Smartphone, Clock } from 'lucide-react';
import { Tab } from '../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  session: { name: string; location: string } | null;
  onLogout: () => void;
  onNavigate: (tab: Tab) => void;
  activeTab: Tab;
  isDesktopMode?: boolean;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, session, onLogout, onNavigate, activeTab, isDesktopMode = false }) => {
  const menuItems = [
    { id: Tab.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { id: Tab.POS, icon: PlusCircle, label: 'New Order' },
    { id: Tab.CUSTOMERS, icon: Users, label: 'Customers' },
    { id: Tab.HISTORY, icon: History, label: 'Order History' },
    { id: Tab.REPAIRS, icon: Smartphone, label: 'Repair Jobs' },
    { id: Tab.PREORDERS, icon: Clock, label: 'Pre-Orders' },
    { id: Tab.PROFILE, icon: Settings, label: 'Settings' },
  ];

  const handleNavClick = (tab: Tab) => {
    onNavigate(tab);
    if (!isDesktopMode) onClose();
  };

  const Content = (
    <div className={`h-full bg-slate-900 text-white flex flex-col ${isDesktopMode ? '' : 'max-w-[300px] w-[80%] shadow-2xl'}`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800 h-16">
        <span className="font-bold text-lg tracking-tight">Phone Mechanic</span>
        {!isDesktopMode && (
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* User Profile Card */}
      {session && (
        <div className="p-6 bg-slate-800/50 m-4 rounded-2xl border border-slate-700/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
              <User size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white truncate">{session.name}</h3>
              <div className="flex items-center text-slate-400 text-xs mt-1">
                <MapPin size={10} className="mr-1" />
                {session.location}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        <div className="text-xs font-bold text-slate-500 uppercase px-3 py-2">Menu</div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => {
            onLogout();
            if (!isDesktopMode) onClose();
          }}
          className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-900/20 hover:text-red-400 text-slate-300 py-3 rounded-xl transition-colors border border-transparent hover:border-red-900/30"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Clock Out</span>
        </button>
        <div className="text-center mt-4 text-[10px] text-slate-600">
          <p>Version 2.1.0 (Build 2024)</p>
          <p>System Status: Online</p>
        </div>
      </div>
    </div>
  );

  if (isDesktopMode) {
    return Content;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 z-50 flex flex-col"
          >
            {Content}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
