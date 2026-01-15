
import React from 'react';
import { TIBETAN_STRINGS } from '../constants';
import Logo from './Logo';

const WhyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-14 px-7 transition-colors duration-300">
      <div className="bg-white dark:bg-stone-800 rounded-[2.5rem] shadow-xl p-10 md:p-14 border border-red-50 dark:border-stone-700 relative transition-colors duration-300">
        <div className="absolute top-10 right-10 opacity-10">
          <Logo className="w-32 h-32" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-stone-100 mb-8 leading-tight">
          {TIBETAN_STRINGS.whyThonmiTitle}
        </h1>
        <div className="prose prose-xl prose-slate dark:prose-invert max-w-none">
          <p className="text-xl text-slate-700 dark:text-stone-200 leading-relaxed whitespace-pre-wrap font-medium Tibetan-text">
            {TIBETAN_STRINGS.whyThonmiContent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyPage;
