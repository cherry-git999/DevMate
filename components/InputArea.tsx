import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, Code2 } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onStop?: () => void; // Optional stop generation functionality
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isLoading, onStop }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-950/90 backdrop-blur-md p-2 sm:p-4 sticky bottom-0 z-10 safe-bottom">
      <div className="max-w-4xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-900 p-1.5 sm:p-2 rounded-xl border border-slate-800 focus-within:border-cyan-700/50 focus-within:ring-1 focus-within:ring-cyan-700/50 transition-all shadow-lg">
          
          <div className="pl-2 pb-2.5 sm:pb-3 text-slate-500 hidden sm:block">
            <Code2 size={20} />
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a coding question..."
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 text-sm sm:text-base resize-none focus:outline-none max-h-[150px] sm:max-h-[200px] py-2 sm:py-3 px-2 custom-scrollbar"
            rows={1}
            disabled={isLoading && !onStop}
          />

          <div className="pb-0.5 pr-0.5 sm:pb-1 sm:pr-1">
            {isLoading ? (
              <button
                type="button"
                className="p-2 rounded-lg bg-slate-800 text-slate-400 cursor-not-allowed"
                disabled
              >
               <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-t-cyan-500 border-slate-600 rounded-full animate-spin"></div>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                  input.trim() 
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/20' 
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Send size={16} className={`sm:w-[18px] sm:h-[18px] ${input.trim() ? 'ml-0.5' : ''}`} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputArea;