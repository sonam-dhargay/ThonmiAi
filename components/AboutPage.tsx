
import React from 'react';
import { TIBETAN_STRINGS } from '../constants';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-14 px-7 transition-colors duration-300">
      <div className="bg-white dark:bg-stone-800 rounded-[2.5rem] shadow-xl p-10 md:p-14 border border-red-50 dark:border-stone-700 relative transition-colors duration-300">
        <div className="w-20 h-20 mb-12 flex items-center justify-center bg-gradient-to-br from-red-900 to-amber-700 rounded-3xl text-white shadow-xl relative overflow-hidden select-none">
          <span className="text-5xl leading-none -mt-3 font-bold">དྷྰི༔</span>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-stone-100 mb-8 leading-tight">
          {TIBETAN_STRINGS.manifestoTitle}
        </h1>
        <div className="prose prose-xl prose-slate dark:prose-invert max-w-none">
          <p className="text-xl text-slate-700 dark:text-stone-200 leading-relaxed whitespace-pre-wrap font-medium Tibetan-text">
            {TIBETAN_STRINGS.manifestoContent}
          </p>
        </div>
        
        <div className="mt-14 pt-10 border-t border-red-50 dark:border-stone-700 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-stone-200 mb-4">{TIBETAN_STRINGS.aboutMainGoal}</h3>
            <p className="text-base text-slate-600 dark:text-stone-400 leading-relaxed Tibetan-text">{TIBETAN_STRINGS.aboutMainGoalDesc}</p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-stone-200 mb-4">{TIBETAN_STRINGS.aboutUsers}</h3>
            <p className="text-base text-slate-600 dark:text-stone-400 leading-relaxed Tibetan-text">{TIBETAN_STRINGS.aboutUsersDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
