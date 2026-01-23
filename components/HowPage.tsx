
import React, { useState, useEffect } from 'react';
import { TIBETAN_STRINGS } from '../constants';
import Logo from './Logo';

const STORAGE_KEY = 'bod_skyad_how_v3';

const HowPage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse how content", e);
      }
    }
    return {
      title: TIBETAN_STRINGS.howItWorksTitle,
      steps: JSON.parse(JSON.stringify(TIBETAN_STRINGS.howItWorksSteps)),
    };
  });

  // Auto-save effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const handleFinishEditing = () => {
    setIsEditing(false);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2000);
  };

  const updateStep = (idx: number, field: 'title' | 'desc', val: string) => {
    const newSteps = [...content.steps];
    newSteps[idx] = { ...newSteps[idx], [field]: val };
    setContent(prev => ({ ...prev, steps: newSteps }));
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

        {isEditing ? (
          <input 
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="w-full text-3xl font-bold text-slate-900 dark:text-stone-100 mb-12 bg-slate-50 dark:bg-stone-900 border border-red-100 dark:border-stone-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-red-400 Tibetan-text"
          />
        ) : (
          <h1 className="text-3xl font-bold text-slate-900 dark:text-stone-100 mb-12 leading-tight">
            {content.title}
          </h1>
        )}
        
        <div className="space-y-10">
          {content.steps.map((step: any, idx: number) => (
            <div key={idx} className="flex gap-6 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-xl border border-amber-100 dark:border-amber-800 transition-all group-hover:scale-110">
                {idx + 1}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input 
                      value={step.title}
                      onChange={(e) => updateStep(idx, 'title', e.target.value)}
                      className="w-full text-xl font-bold text-slate-800 dark:text-stone-100 bg-slate-50 dark:bg-stone-900 border border-red-100 dark:border-stone-700 rounded-xl p-2 outline-none focus:ring-2 focus:ring-red-400"
                    />
                    <textarea 
                      value={step.desc}
                      onChange={(e) => updateStep(idx, 'desc', e.target.value)}
                      rows={2}
                      className="w-full text-lg text-slate-600 dark:text-stone-400 bg-slate-50 dark:bg-stone-900 border border-red-100 dark:border-stone-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-400 Tibetan-text"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-stone-100 mb-2">{step.title}</h3>
                    <p className="text-lg text-slate-600 dark:text-stone-400 leading-relaxed Tibetan-text">{step.desc}</p>
                  </>
                )}
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
