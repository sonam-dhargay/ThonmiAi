
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import { TIBETAN_STRINGS } from '../constants';

interface ChatMessageProps {
  message: Message;
  onFeedback?: (messageId: string, feedback: 'up' | 'down' | null) => void;
  onSaveToDict?: (text: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onFeedback, onSaveToDict }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`flex w-full mb-10 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className={`max-w-[85%] md:max-w-[75%] px-7 py-5 rounded-3xl relative group transition-all duration-300 ${
          isUser
            ? 'bg-gradient-to-br from-red-900 to-amber-800 text-white rounded-tr-none shadow-xl shadow-red-100'
            : 'bg-white text-slate-800 border border-red-50 rounded-tl-none shadow-md hover:shadow-lg'
        }`}
      >
        {message.imageUrl && (
          <div className="mb-4 overflow-hidden rounded-2xl shadow-inner border border-red-50">
            <img 
              src={message.imageUrl} 
              alt="Generated Content" 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in"
              onClick={() => window.open(message.imageUrl, '_blank')}
            />
          </div>
        )}
        
        <div className={`prose prose-xl ${isUser ? 'prose-invert' : 'prose-red'} max-w-none Tibetan-text leading-relaxed`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>

        {!isUser && (
          <div className="mt-4 pt-3 border-t border-red-50 text-[11px] text-slate-400 font-medium italic opacity-70 Tibetan-text leading-tight">
            {TIBETAN_STRINGS.aiCaveat}
          </div>
        )}
        
        <div className={`flex items-center justify-between mt-5 pt-4 border-t ${isUser ? 'border-white/10 flex-row-reverse' : 'border-red-50 flex-row'}`}>
          <div className={`text-[11px] font-bold tracking-wider opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          {!isUser && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
              <button
                onClick={handleCopy}
                className={`p-1.5 rounded-lg transition-all ${copied ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:text-red-900 hover:bg-red-50'}`}
                title={copied ? "བཤུས་ཟིན།" : "བཤུ་བ།"}
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>

              {onSaveToDict && (
                <button
                  onClick={() => onSaveToDict(message.content)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition-all text-slate-400 hover:text-red-900"
                  title="ཚིག་མཛོད་དུ་ཉར་བ།"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              )}
              {onFeedback && (
                <div className="flex items-center gap-0.5 bg-red-50/50 rounded-lg p-0.5">
                  <button
                    onClick={() => onFeedback(message.id, message.feedback === 'up' ? null : 'up')}
                    className={`p-1 rounded-md transition-all ${message.feedback === 'up' ? 'text-red-900 bg-white shadow-sm' : 'text-slate-300 hover:text-red-400'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={message.feedback === 'up' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.704a2 2 0 011.94 2.415l-1.619 7.288A2 2 0 0117.086 21H7M14 10V5a2 2 0 00-2-2H9.378a1 1 0 00-.994.89l-1 9A1 1 0 008.378 14H14z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onFeedback(message.id, message.feedback === 'down' ? null : 'down')}
                    className={`p-1 rounded-md transition-all ${message.feedback === 'down' ? 'text-orange-600 bg-white shadow-sm' : 'text-slate-300 hover:text-orange-400'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={message.feedback === 'down' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.296a2 2 0 01-1.94-2.415l1.619-7.288A2 2 0 016.914 3H17M10 14v5a2 2 0 002 2h2.622a1 1 0 00.994-.89l1-9A1 1 0 0015.622 10H10z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
