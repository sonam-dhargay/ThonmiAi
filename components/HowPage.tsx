
import React from 'react';
import { TIBETAN_STRINGS } from '../constants';
import Logo from './Logo';

const HowPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-14 px-7 transition-colors duration-300">
      <div className="bg-white dark:bg-stone-800 rounded-[2.5rem] shadow-xl p-10 md:p-14 border border-red-50 dark:border-stone-700 relative transition-colors duration-300">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-stone-100 mb-12 leading-tight">
          {TIBETAN_STRINGS.howItWorksTitle}
        </h1>
        
        <div className="space-y-10">
          {TIBETAN_STRINGS.howItWorksSteps.map((step, idx) => (
            <div key={idx} className="flex gap-6 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-xl border border-amber-100 dark:border-amber-800 transition-all group-hover:scale-110">
                {idx + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-stone-100 mb-2">{step.title}</h3>
                <p className="text-lg text-slate-600 dark:text-stone-400 leading-relaxed Tibetan-text">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-14 p-8 bg-red-50/30 dark:bg-stone-900 rounded-3xl border border-red-50 dark:border-stone-800">
          <p className="text-base text-slate-500 dark:text-stone-400 leading-relaxed italic text-center">
            ཐོན་མི་AI ནི་བོད་ཀྱི་སྐད་ཡིག་སྲུང་སྐྱོབ་དང་དེང་རབས་ཅན་དུ་བསྒྱུར་བའི་ལམ་བུ་ཞིག་ཡིན།
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowPage;
