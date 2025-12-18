import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

const CopyButton = ({ text }: { text: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors p-1 rounded hover:bg-slate-700/50"
      aria-label="Copy code"
    >
      {isCopied ? (
        <>
          <Check size={14} className="text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-sm sm:prose-base max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = inline || !match;
            
            if (isInline) {
              return (
                <code className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }

            const codeText = String(children).replace(/\n$/, '');

            return (
              <div className="relative group my-4 rounded-lg overflow-hidden border border-slate-700 bg-[#0d1117]">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700 text-xs text-slate-400 select-none">
                  <span className="font-mono uppercase">{match?.[1] || 'code'}</span>
                  <CopyButton text={codeText} />
                </div>
                <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-200 leading-relaxed">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          ul: ({children}) => <ul className="list-disc pl-5 my-3 space-y-1 text-slate-300">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal pl-5 my-3 space-y-1 text-slate-300">{children}</ol>,
          li: ({children}) => <li className="pl-1">{children}</li>,
          h1: ({children}) => <h1 className="text-2xl font-bold text-white mt-6 mb-3 border-b border-slate-700 pb-2">{children}</h1>,
          h2: ({children}) => <h2 className="text-xl font-bold text-white mt-5 mb-3">{children}</h2>,
          h3: ({children}) => <h3 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h3>,
          p: ({children}) => <p className="mb-3 leading-7 text-slate-300">{children}</p>,
          a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">{children}</a>,
          blockquote: ({children}) => <blockquote className="border-l-4 border-cyan-500 pl-4 py-1 my-3 bg-slate-800/30 rounded-r text-slate-400 italic">{children}</blockquote>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;