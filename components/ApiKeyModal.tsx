import React, { useState } from 'react';
import { Key, Lock, ChevronRight, AlertCircle } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim().length < 30) {
      setError('Invalid API Key format');
      return;
    }
    onSave(inputKey.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <div className="p-6">
          <div className="w-12 h-12 bg-cyan-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Key className="text-cyan-400" size={24} />
          </div>
          
          <h2 className="text-xl font-bold text-center text-white mb-2">Enter API Key</h2>
          <p className="text-sm text-slate-400 text-center mb-6">
            To use DevMate AI, you need a Google Gemini API Key. Your key is stored locally in your browser.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                Gemini API Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={16} />
                </div>
                <input
                  id="apiKey"
                  type="password"
                  value={inputKey}
                  onChange={(e) => {
                    setInputKey(e.target.value);
                    setError('');
                  }}
                  placeholder="AIzaSy..."
                  className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all sm:text-sm"
                  autoFocus
                />
              </div>
              {error && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs mt-1 ml-1">
                  <AlertCircle size={12} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!inputKey}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <span>Connect</span>
              <ChevronRight size={16} />
            </button>
          </form>
        </div>

        <div className="bg-slate-950/50 px-6 py-4 border-t border-slate-800">
          <p className="text-xs text-center text-slate-500">
            Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">Get one for free at Google AI Studio</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;