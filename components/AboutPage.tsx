
import React, { useState, useEffect } from 'react';
import { TIBETAN_STRINGS } from '../constants';
import Logo from './Logo';

const STORAGE_KEY = 'bod_skyad_about_v3';

const AboutPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  
  // Load initial state from localStorage or use defaults
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse about content", e);
      }
    }
    return {
      title: TIBETAN_STRINGS.manifestoTitle,
      manifesto: TIBETAN_STRINGS.manifestoContent,
      goalTitle: TIBETAN_STRINGS.aboutMainGoal,
      goalDesc: TIBETAN_STRINGS.aboutMainGoalDesc,
      usersTitle: TIBETAN_STRINGS.aboutUsers,
      usersDesc: TIBETAN_STRINGS.aboutUsersDesc,
    };
  });

  // Auto-save effect: Whenever content changes, persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const handleFinishEditing = () => {
    setIsEditing(false);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-14 px-7 transition-colors duration-300">
      <div className="bg-white dark:bg-stone-800 rounded-[2.5rem] shadow-xl p-10 md:p-14 border border-red-50 dark:border-stone-700 relative transition-colors duration-300">
        <div className="absolute top-10 right-10 flex gap-2 z-30">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm ${
                isSavedFeedback 
                ? 'bg-emerald-500 text-white' 
                : 'bg-red-50 dark:bg-stone-700 text-red-900 dark:text-red-400 hover:bg-red-100'
              }`}
            >
              {isSavedFeedback ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  {TIBETAN_STRINGS.edit}
                </>
              )}
            </button>
          ) : (
            <button 
              onClick={handleFinishEditing}
              className="px-6 py-2 bg-red-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-800 transition-all shadow-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {TIBETAN_STRINGS.save}
            </button>
          )}
        </div>

        <Logo className="w-20 h-20 mb-12 drop-shadow-lg" />

        {isEditing ? (
          <input 
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="w-full text-3xl font-bold text-slate-900 dark:text-stone-100 mb-8 bg-slate-50 dark:bg-stone-900 border border-red-100 dark:border-stone-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-red-400 Tibetan-text"
          />
        ) : (
          <h1 className="text-3xl font-bold text-slate-900 dark:text-stone-100 mb-8 leading-tight">
            {content.title}
          </h1>
        )}

        <div className="prose prose-xl prose-slate dark:prose-invert max-w-none">
          {isEditing ? (
            <textarea 
              value={content.manifesto}
              onChange={(e) => setContent({ ...content, manifesto: e.target.value })}
              rows={8}
              className="w-full text-xl text-slate-700 dark:text-stone-200 leading-relaxed bg-slate-50 dark:bg-stone-900 border border-red-100 dark:border-stone-700 rounded-2xl p-6 outline-none focus:ring-2 focus:ring-red-400 Tibetan-text"
            />
          ) : (
            <p className="text-xl text-slate-700 dark:text-stone-200 leading-relaxed whitespace-pre-wrap font-medium Tibetan-text">
              {content.manifesto}
            </p>
          )}
        </div>
        
        <div className="mt-14 pt-10 border-t border-red-50 dark:border-stone-700 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            {isEditing ? (
              <input 
                value={content.goalTitle}
                onChange={(e) => setContent({ ...content, goalTitle: e.target.value })}
                className="w-full font-bold text-slate-800 dark:text-stone-200 mb-2 bg-slate-50 dark:bg-stone-900 border border-red-100 dark:border-stone-700 rounded-xl p-2 outline-none focus:ring-2 focus:ring-red-400 Tibetan-text"
              />
            ) : (
              <h3 className="text-lg font-bold text-slate-800 dark:text-stone-200 mb-4">{content.goalTitle}</h3>
            )}
            {isEditing ? (
              <textarea 
                value={content.goalDesc}
                onChange={(e) => setContent({ ...content, goalDesc: e.target.value })}
                className="w-full text-base text-slate-600 dark:text-stone-400 leading-relaxed bg-slate-50 dark:bg-stone-900 border border-red-100 dark:border-stone-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-400 Tibetan-text"
                rows={3}
              />
            ) : (
              <p className="text-base text-slate-600 dark:text-stone-400 leading-relaxed Tibetan-text">{content.goalDesc}</p>
            )}
          </div>
          <div>
            {isEditing ? (
              <input 
                value={content.usersTitle}
                onChange={(e) => setContent({ ...content, usersTitle: e.target.value })}
                className="w-full font-bold text-slate-800 dark:text-stone-200 mb-2 bg-slate-50 dark:bg-stone-900 border border-red-100 dark:border-stone-700 rounded-xl p-2 outline-none focus:ring-2 focus:ring-red-400 Tibetan-text"
              />
            ) : (
              <h3 className="text-lg font-bold text-slate-800 dark:text-stone-200 mb-4">{content.usersTitle}</h3>
            )}
            {isEditing ? (
              <textarea 
                value={content.usersDesc}
                onChange={(e) => setContent({ ...content, usersDesc: e.target.value })}
                className="w-full text-base text-slate-600 dark:text-stone-400 leading-relaxed bg-slate-50 dark:bg-stone-900 border border-red-100 dark:border-stone-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-400 Tibetan-text"
                rows={3}
              />
            ) : (
              <p className="text-base text-slate-600 dark:text-stone-400 leading-relaxed Tibetan-text">{content.usersDesc}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
