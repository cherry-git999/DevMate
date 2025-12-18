import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Wifi, WifiOff } from 'lucide-react';

const Header: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 safe-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-indigo-900/20">
            <Terminal className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">DevMate AI</h1>
            <p className="hidden sm:flex text-xs text-slate-400 items-center gap-1">
              <Cpu size={10} className="text-cyan-500" />
              <span>Made By Charan</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <a 
            href="#" 
            className="hidden sm:block text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            Documentation
          </a>
          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>
          
          {/* Dynamic Status Indicator */}
          <div className={`flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border transition-colors ${
            isOnline 
              ? 'bg-slate-900 border-slate-800' 
              : 'bg-red-900/20 border-red-900/50'
          }`}>
            {isOnline ? (
              <>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] sm:text-xs font-medium text-slate-300">Online</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-red-400" />
                <span className="text-[10px] sm:text-xs font-medium text-red-300">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;