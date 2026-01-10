
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
      } md:translate-x-0 md:relative md:flex transition duration-200 ease-in-out z-30 w-72 bg-white text-slate-900 flex-col shrink-0 border-r border-slate-200`}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{TIBETAN_STRINGS.appTitle}</h1>
      </div>

      <div className="p-4 space-y-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 transition rounded-xl text-white text-lg font-medium shadow-md shadow-blue-100 active:scale-[0.98]"
        >
          <span className="text-2xl leading-none">+</span>
          <span>{TIBETAN_STRINGS.newChat}</span>
        </button>
        
        <button
          onClick={onShowAbout}
          className="w-full flex items-center justify-start gap-3 py-2 px-4 hover:bg-slate-50 transition rounded-lg text-slate-500 hover:text-slate-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{TIBETAN_STRINGS.aboutProject}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <h2 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          {TIBETAN_STRINGS.sidebarTitle}
        </h2>
        {sessions.length === 0 ? (
          <p className="px-3 text-sm text-slate-400 italic">{TIBETAN_STRINGS.emptyHistory}</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-2 px-3 py-3 rounded-xl cursor-pointer transition ${
                activeSessionId === session.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
              onClick={() => onSelectSession(session.id)}
            >
              <div className={`flex-1 truncate text-lg ${activeSessionId === session.id ? 'font-bold' : 'font-medium'}`}>
                {session.title}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className={`opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity ${
                  activeSessionId === session.id ? 'opacity-100' : ''
                }`}
                title={TIBETAN_STRINGS.deleteChat}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
        <button
          onClick={onResetApp}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 text-red-500 hover:bg-red-50 transition rounded-lg text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {TIBETAN_STRINGS.resetApp}
        </button>
        <div className="text-slate-400 text-[10px] text-center font-medium">
          {TIBETAN_STRINGS.versionInfo}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
