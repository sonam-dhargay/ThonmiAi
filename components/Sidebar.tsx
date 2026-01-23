
import React from 'react';
import { ChatSession } from '../types';
import { TIBETAN_STRINGS } from '../constants';
import Logo from './Logo';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onShowAbout: () => void;
  onShowWhy: () => void;
  onShowHow: () => void;
  onResetApp: () => void;
  onLogin?: () => void;
  onSignup?: () => void;
  onOpenKeySelection?: () => void;
  isOpen: boolean;
  isLoggedIn?: boolean;
  hasSelectedKey?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onShowAbout,
  onShowWhy,
  onShowHow,
  onResetApp,
  onLogin,
  onSignup,
  isOpen,
  isLoggedIn = false,
}) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:relative md:flex transition-all duration-500 ease-in-out z-30 w-80 glass-panel text-slate-900 dark:text-stone-100 flex-col shrink-0 border-r border-red-100/30 dark:border-stone-800 shadow-2xl md:shadow-none overflow-hidden`}
    >
      <div className="p-7 border-b border-red-50/50 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <Logo className="w-10 h-10" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-stone-100 bg-gradient-to-r from-red-950 to-red-800 dark:from-red-300 dark:to-stone-100 bg-clip-text text-transparent">{TIBETAN_STRINGS.appTitle}</h1>
        </div>
      </div>

      <div className="p-5 space-y-2">
        <button
          onClick={onShowAbout}
          className="w-full flex items-center justify-start gap-4 py-2.5 px-4 hover:bg-white dark:hover:bg-stone-800 hover:shadow-md transition-all rounded-2xl text-slate-500 dark:text-stone-400 hover:text-red-900 dark:hover:text-red-400 font-bold text-sm border border-transparent hover:border-red-50 dark:hover:border-stone-700 group"
        >
          <div className="w-8 h-8 rounded-xl bg-red-50/50 dark:bg-stone-800/50 flex items-center justify-center transition-all group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="Tibetan-text text-base">{TIBETAN_STRINGS.aboutProject}</span>
        </button>

        <button
          onClick={onShowWhy}
          className="w-full flex items-center justify-start gap-4 py-2.5 px-4 hover:bg-white dark:hover:bg-stone-800 hover:shadow-md transition-all rounded-2xl text-slate-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 font-bold text-sm border border-transparent hover:border-red-50 dark:hover:border-stone-700 group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50/50 dark:bg-amber-900/20 flex items-center justify-center transition-all group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
          </div>
          <span className="Tibetan-text text-base">{TIBETAN_STRINGS.whyThonmi}</span>
        </button>

        <button
          onClick={onShowHow}
          className="w-full flex items-center justify-start gap-4 py-2.5 px-4 hover:bg-white dark:hover:bg-stone-800 hover:shadow-md transition-all rounded-2xl text-slate-500 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-sm border border-transparent hover:border-red-50 dark:hover:border-stone-700 group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/20 flex items-center justify-center transition-all group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="Tibetan-text text-base">{TIBETAN_STRINGS.howItWorks}</span>
        </button>

        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-3 py-4 px-5 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 transition-all rounded-[1.5rem] text-white text-lg font-bold shadow-2xl shadow-amber-100 dark:shadow-black/50 active:scale-[0.96] group mt-2"
        >
          <span className="text-2xl leading-none group-hover:rotate-90 transition-transform duration-500">+</span>
          <span className="Tibetan-text">{TIBETAN_STRINGS.newChat}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
        <h2 className="px-4 text-[11px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-sm shadow-amber-100 dark:shadow-black"></span>
          {TIBETAN_STRINGS.sidebarTitle}
        </h2>
        
        {sessions.length === 0 ? (
          <div className="px-6 py-12 text-center bg-red-50/20 dark:bg-stone-800/20 rounded-3xl border border-dashed border-red-100 dark:border-stone-800 mx-2">
            <p className="text-sm text-slate-400 dark:text-stone-500 font-bold italic Tibetan-text">{TIBETAN_STRINGS.emptyHistory}</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-4 px-5 py-4 rounded-[1.5rem] cursor-pointer transition-all duration-300 mb-1 border-2 ${
                activeSessionId === session.id
                  ? 'bg-white dark:bg-stone-800 shadow-xl shadow-red-50/50 dark:shadow-black/50 border-red-50 dark:border-stone-700 text-red-950 dark:text-red-400'
                  : 'hover:bg-white/60 dark:hover:bg-stone-800/60 text-slate-600 dark:text-stone-400 hover:text-red-900 dark:hover:text-red-400 border-transparent hover:border-red-50 dark:hover:border-stone-800 hover:shadow-md'
              }`}
              onClick={() => onSelectSession(session.id)}
            >
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${
                activeSessionId === session.id 
                  ? 'bg-red-900 dark:bg-red-400 scale-125 shadow-lg shadow-red-100 dark:shadow-red-900/50' 
                  : 'bg-slate-200 dark:bg-stone-700 group-hover:bg-red-300 dark:group-hover:bg-red-500'
              }`}></div>
              <div className={`flex-1 truncate text-lg Tibetan-text ${activeSessionId === session.id ? 'font-bold' : 'font-medium'}`}>
                {session.title}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 dark:text-stone-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-stone-700 rounded-xl transition-all active:scale-90"
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

      <div className="p-6 bg-red-50/30 dark:bg-stone-900/50 backdrop-blur-md border-t border-red-50/50 dark:border-stone-800 flex flex-col gap-3">
        {/* Auth Section - Re-Redesigned for Maximum Visual Appeal */}
        {!isLoggedIn ? (
          <div className="flex flex-col gap-3 mb-2">
            <button
              onClick={onSignup}
              className="group relative w-full overflow-hidden py-4 px-6 rounded-[1.8rem] font-bold transition-all duration-500 active:scale-95 shadow-[0_10px_30px_-10px_rgba(128,0,0,0.5)] dark:shadow-black"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-950 via-red-800 to-amber-600 transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center gap-3.5 text-white">
                <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <span className="Tibetan-text text-lg tracking-wide group-hover:tracking-wider transition-all duration-500">{TIBETAN_STRINGS.signup}</span>
              </div>
            </button>

            <button
              onClick={onLogin}
              className="group relative w-full overflow-hidden py-4 px-6 rounded-[1.8rem] font-bold transition-all duration-500 active:scale-95 bg-white/40 dark:bg-stone-800/40 backdrop-blur-xl border-2 border-red-100/50 dark:border-stone-700/50 shadow-sm"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/20 dark:to-stone-800/20 transition-opacity duration-500"></div>
              <div className="relative flex items-center justify-center gap-3.5 text-red-900 dark:text-red-400 group-hover:text-red-950 dark:group-hover:text-red-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70 group-hover:rotate-12 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="Tibetan-text text-lg transition-all duration-500">{TIBETAN_STRINGS.login}</span>
              </div>
            </button>
          </div>
        ) : (
          <div className="bg-white/50 dark:bg-stone-800/50 p-4 rounded-[2rem] border border-red-50/50 dark:border-stone-700 shadow-sm mb-1 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-900 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform duration-500">
               👤
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-red-900/50 dark:text-stone-500 uppercase tracking-widest leading-none mb-1.5">{TIBETAN_STRINGS.account}</span>
              <span className="text-base font-bold Tibetan-text text-slate-800 dark:text-stone-100 leading-none">User Profile</span>
            </div>
          </div>
        )}

        <button
          onClick={onResetApp}
          className="w-full flex items-center justify-start gap-4 py-3.5 px-6 text-slate-400 dark:text-stone-600 hover:text-red-700 dark:hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-stone-800/50 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] border border-transparent hover:border-red-100/50 dark:hover:border-stone-700/50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {TIBETAN_STRINGS.resetApp}
        </button>
        <div className="px-5">
           <div className="h-px bg-red-100/30 dark:bg-stone-800/30 w-full mb-4"></div>
           <div className="text-slate-400 dark:text-stone-700 text-[10px] text-center font-black tracking-[0.3em] uppercase opacity-50">
            {TIBETAN_STRINGS.versionInfo}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
