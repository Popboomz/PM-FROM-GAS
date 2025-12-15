
import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SideMenu } from './components/SideMenu';
import { HomeView } from './views/HomeView';
import { HistoryView } from './views/HistoryView';
import { CreateOrderView } from './views/CreateOrderView';
import { CustomersView } from './views/CustomersView';
import { MembershipView } from './views/MembershipView';
import { AiAssistantView } from './views/AiAssistantView';
import { LoginView } from './views/LoginView';
import { Tab, Order, OrderType } from './types';
import { MOCK_ORDERS, MOCK_CUSTOMERS } from './constants';
import { User, LogOut, Settings, Printer, Database, MapPin, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<{name: string, location: string} | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Profile States
  const [printerConnected, setPrinterConnected] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleLogin = (name: string, location: string) => {
    setSession({ name, location });
  };

  const handleLogout = () => {
    setSession(null);
    setActiveTab(Tab.DASHBOARD);
    setIsMenuOpen(false);
  };

  const handleCreateOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
        setIsBackingUp(false);
        alert("System backup completed successfully to Cloud Storage.");
    }, 2000);
  };

  if (!session) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <HomeView onNavigate={setActiveTab} recentOrders={orders} />;
      case Tab.HISTORY:
        return <HistoryView key="history" orders={orders} />;
      case Tab.PREORDERS:
        return <HistoryView key="preorders" orders={orders.filter(o => o.type === OrderType.PREORDER)} />;
      case Tab.POS:
        return (
          <CreateOrderView 
            onCreateOrder={handleCreateOrder} 
            staffName={session.name}
            location={session.location}
          />
        );
      case Tab.REPAIRS:
        return <HistoryView key="repairs" orders={orders.filter(o => o.type === OrderType.REPAIR)} />;
      case Tab.CUSTOMERS:
        return <CustomersView customers={MOCK_CUSTOMERS} orders={orders} />;
      case Tab.MEMBERSHIP:
        return <MembershipView />;
      case Tab.AI_ASSISTANT:
        return <AiAssistantView />;
      case Tab.PROFILE:
        return (
          <div className="px-6 pt-8 max-w-lg mx-auto">
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center mb-6">
                <div className="w-20 h-20 bg-slate-900 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                  <User size={32} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{session.name}</h2>
                <div className="flex items-center justify-center space-x-1 text-gray-500 mt-1">
                  <MapPin size={12} />
                  <p className="text-sm">{session.location} Branch</p>
                </div>
             </div>

             <div className="space-y-3">
               <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl active:bg-gray-50 transition-colors">
                 <div className="flex items-center space-x-3 text-gray-700">
                   <Settings size={20} />
                   <span className="font-medium text-sm">Shop Settings</span>
                 </div>
               </button>

               <button 
                 onClick={() => setPrinterConnected(!printerConnected)}
                 className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl active:bg-gray-50 transition-colors"
               >
                 <div className="flex items-center space-x-3 text-gray-700">
                   <Printer size={20} />
                   <span className="font-medium text-sm">Printer Configuration</span>
                 </div>
                 <span className={`text-xs px-2 py-1 rounded transition-colors ${printerConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                   {printerConnected ? '80mm Connected' : 'Disconnected'}
                 </span>
               </button>

               <button 
                 onClick={handleBackup}
                 disabled={isBackingUp}
                 className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl active:bg-gray-50 transition-colors"
               >
                 <div className="flex items-center space-x-3 text-gray-700">
                   <Database size={20} />
                   <span className="font-medium text-sm">Data & Backup</span>
                 </div>
                 {isBackingUp ? (
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                 ) : (
                    <span className="text-xs text-gray-400">Last: Today</span>
                 )}
               </button>
             </div>

             <button 
                onClick={handleLogout}
                className="mt-8 flex items-center justify-center w-full py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 font-medium active:scale-95 transition-transform"
             >
                <LogOut size={18} className="mr-2" />
                Clock Out
             </button>
             <div className="mt-8 text-center text-xs text-gray-300">
               Phone Mechanic Staff OS v2.1
             </div>
          </div>
        );
      default:
        return <HomeView onNavigate={setActiveTab} recentOrders={orders} />;
    }
  };

  return (
    <div className="h-[100dvh] bg-gray-50 flex flex-col md:flex-row shadow-2xl overflow-hidden relative border-x border-gray-100 group">
      
      {/* Desktop Sidebar (Visible on md+) */}
      <div className="hidden md:block w-72 h-full relative">
        <SideMenu 
          isOpen={true} 
          isDesktopMode={true}
          onClose={() => {}} 
          session={session}
          onLogout={handleLogout}
          onNavigate={setActiveTab}
          activeTab={activeTab}
        />
      </div>

      {/* Mobile Header (Hidden on md+) */}
      <div className="md:hidden">
         <Header activeTab={activeTab} onMenuClick={() => setIsMenuOpen(true)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth w-full md:max-w-4xl md:mx-auto md:border-l md:border-gray-200 md:shadow-lg bg-gray-50">
        {renderContent()}
      </main>

      {/* Mobile Drawer (Hidden on desktop) */}
      <div className="md:hidden">
         <SideMenu 
           isOpen={isMenuOpen} 
           onClose={() => setIsMenuOpen(false)} 
           session={session}
           onLogout={handleLogout}
           onNavigate={setActiveTab}
           activeTab={activeTab}
         />
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden absolute bottom-0 w-full z-50 transition-transform duration-300 ease-in-out group-focus-within:translate-y-full">
        <BottomNav activeTab={activeTab} onNavigate={setActiveTab} />
      </div>
    </div>
  );
};

export default App;
