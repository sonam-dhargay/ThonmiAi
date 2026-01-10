
import React from 'react';
import { ChatSession } from '../types';
import { TIBETAN_STRINGS } from '../constants';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onShowAbout: () => void;
  onResetApp: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onShowAbout,
  onResetApp,
  isOpen
}) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:relative md:flex transition-all duration-500 ease-in-out z-30 w-80 glass-panel text-slate-900 flex-col shrink-0 border-r border-slate-200/50 shadow-2xl md:shadow-none overflow-hidden`}
    >
      {/* Sidebar Header */}
      <div className="p-7 flex items-center justify-between border-b border-slate-100/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 select-none overflow-hidden">
            <span className="text-2xl leading-none -mt-2.5 font-bold">དྷྰི༔</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">{TIBETAN_STRINGS.appTitle}</h1>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="p-5 space-y-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-3 py-4 px-5 bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 transition-all rounded-[1.5rem] text-white text-lg font-bold shadow-2xl shadow-indigo-200 active:scale-[0.96] group"
        >
          <span className="text-2xl leading-none group-hover:rotate-90 transition-transform duration-500">+</span>
          <span>{TIBETAN_STRINGS.newChat}</span>
        </button>
        
        <button
          onClick={onShowAbout}
          className="w-full flex items-center justify-start gap-4 py-3 px-5 hover:bg-white hover:shadow-md transition-all rounded-2xl text-slate-500 hover:text-indigo-600 font-bold text-sm border border-transparent hover:border-slate-100"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span>{TIBETAN_STRINGS.aboutProject}</span>
        </button>
      </div>

      {/* Session History */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
        <h2 className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-sm shadow-indigo-200"></span>
          {TIBETAN_STRINGS.sidebarTitle}
        </h2>
        
        {sessions.length === 0 ? (
          <div className="px-6 py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200/50 mx-2">
            <p className="text-sm text-slate-400 font-bold italic Tibetan-text">{TIBETAN_STRINGS.emptyHistory}</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-4 px-5 py-4 rounded-[1.5rem] cursor-pointer transition-all duration-300 mb-1 border-2 ${
                activeSessionId === session.id
                  ? 'bg-white shadow-xl shadow-indigo-50/50 border-indigo-100 text-indigo-700'
                  : 'hover:bg-white/60 text-slate-600 hover:text-indigo-600 border-transparent hover:border-slate-100 hover:shadow-md'
              }`}
              onClick={() => onSelectSession(session.id)}
            >
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${
                activeSessionId === session.id 
                  ? 'bg-indigo-500 scale-125 shadow-lg shadow-indigo-200' 
                  : 'bg-slate-200 group-hover:bg-indigo-300'
              }`}></div>
              <div className={`flex-1 truncate text-lg Tibetan-text ${activeSessionId === session.id ? 'font-bold' : 'font-medium'}`}>
                {session.title}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                title={TIBETAN_STRINGS.deleteChat}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-6 bg-slate-50/80 backdrop-blur-md border-t border-slate-200/50 flex flex-col gap-3">
        <button
          onClick={onResetApp}
          className="w-full flex items-center justify-start gap-4 py-3 px-5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all rounded-2xl text-xs font-bold uppercase tracking-widest border border-transparent hover:border-red-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {TIBETAN_STRINGS.resetApp}
        </button>
        <div className="px-5">
           <div className="h-px bg-slate-200/50 w-full mb-3"></div>
           <div className="text-slate-400 text-[10px] text-center font-bold tracking-[0.2em] uppercase opacity-70">
            {TIBETAN_STRINGS.versionInfo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
