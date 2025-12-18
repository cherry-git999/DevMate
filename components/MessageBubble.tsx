import React, { memo } from 'react';
import { ChatMessage, Role } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { User, Bot, Terminal } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = memo(({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4 sm:mb-6`}>
      <div className={`flex max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] gap-2 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mt-1 shadow-lg ${isUser ? 'bg-cyan-600' : 'bg-indigo-600'}`}>
          {isUser ? <User size={14} className="text-white sm:w-4 sm:h-4" /> : <Terminal size={14} className="text-white sm:w-4 sm:h-4" />}
        </div>

        {/* Bubble Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
          <div className="flex items-center gap-2 mb-1 px-1">
             <span className="text-[10px] sm:text-xs font-medium text-slate-400">
               {isUser ? 'You' : 'DevMate AI'}
             </span>
             <span className="text-[9px] sm:text-[10px] text-slate-600">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
          </div>
          
          <div 
            className={`w-full sm:w-auto rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-sm break-words ${
              isUser 
                ? 'bg-cyan-900/40 border border-cyan-800/50 text-cyan-50 rounded-tr-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}
          >
            {message.role === Role.USER ? (
              <p className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
            ) : (
              <div className="min-w-[0px] overflow-hidden">
                 <MarkdownRenderer content={message.content} />
                 {message.isStreaming && (
                   <span className="inline-block w-2 h-4 ml-1 align-middle bg-cyan-400 animate-pulse"></span>
                 )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';
export default MessageBubble;