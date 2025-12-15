
import React, { useState } from 'react';
import { Wrench, ArrowRight, Loader2, MapPin, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginViewProps {
  onLogin: (name: string, location: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [staffName, setStaffName] = useState('');
  const [location, setLocation] = useState<'Eastwood' | 'Parramatta'>('Eastwood');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!staffName.trim()) {
      setError('Please enter your name to clock in');
      return;
    }

    setIsLoading(true);

    // Simulate system access
    setTimeout(() => {
      setIsLoading(false);
      onLogin(staffName, location);
    }, 600);
  };

  const isEastwood = location === 'Eastwood';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-700 ${isEastwood ? 'bg-slate-900' : 'bg-indigo-950'}`}>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] transition-colors duration-700 ${isEastwood ? 'bg-blue-600' : 'bg-purple-600'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] transition-colors duration-700 ${isEastwood ? 'bg-cyan-600' : 'bg-orange-600'}`}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 rotate-3 transform transition-colors duration-500 ${isEastwood ? 'bg-blue-600 shadow-blue-500/30' : 'bg-indigo-500 shadow-indigo-500/30'}`}>
            <Wrench className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Phone Mechanic</h1>
          <p className="text-white/60 text-sm font-medium">Select Portal Location</p>
        </div>

        {/* Location Switcher */}
        <div className="bg-black/20 p-1 rounded-xl flex mb-6 relative">
          <button 
            type="button"
            onClick={() => setLocation('Eastwood')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 relative z-10 ${isEastwood ? 'text-blue-900 bg-white shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            Eastwood
          </button>
          <button 
            type="button"
            onClick={() => setLocation('Parramatta')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 relative z-10 ${!isEastwood ? 'text-indigo-900 bg-white shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            Parramatta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-2">
             <span className="inline-flex items-center text-xs font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/10">
               <MapPin size={12} className="mr-1" />
               Current Shop: {location}
             </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1.5 ml-1">Technician Name</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                <UserCircle2 size={18} />
              </div>
              <input 
                type="text" 
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                placeholder="Enter your name"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-300 text-xs text-center font-medium bg-red-900/20 py-1 rounded"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center space-x-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed text-white ${isEastwood ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/50' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/50'}`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Start Session</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/30 text-xs">No password required for internal staff.</p>
        </div>
      </motion.div>
    </div>
  );
};
