
import React from 'react';
import { TIBETAN_STRINGS } from '../constants';

interface WylieGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const WylieGuide: React.FC<WylieGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      title: TIBETAN_STRINGS.wylieConsonants,
      items: [
        { w: 'k', t: 'ཀ' }, { w: 'kh', t: 'ཁ' }, { w: 'g', t: 'ག' }, { w: 'ng', t: 'ང' },
        { w: 'c', t: 'ཅ' }, { w: 'ch', t: 'ཆ' }, { w: 'j', t: 'ཇ' }, { w: 'ny', t: 'ཉ' },
        { w: 't', t: 'ཏ' }, { w: 'th', t: 'ཐ' }, { w: 'd', t: 'ད' }, { w: 'n', t: 'ན' },
        { w: 'p', t: 'པ' }, { w: 'ph', t: 'ཕ' }, { w: 'b', t: 'བ' }, { w: 'm', t: 'མ' },
        { w: 'ts', t: 'ཙ' }, { w: 'tsh', t: 'ཚ' }, { w: 'dz', t: 'ཛ' }, { w: 'w', t: 'ཝ' },
        { w: 'zh', t: 'ཞ' }, { w: 'z', t: 'ཟ' }, { w: "'", t: 'འ' }, { w: 'y', t: 'ཡ' },
        { w: 'r', t: 'ར' }, { w: 'l', t: 'ལ' }, { w: 'sh', t: 'ཤ' }, { w: 's', t: 'ས' },
        { w: 'h', t: 'ཧ' }, { w: 'a', t: 'ཨ' }
      ]
    },
    {
      title: TIBETAN_STRINGS.wylieVowels,
      items: [
        { w: 'i', t: 'ི' }, { w: 'u', t: 'ུ' }, { w: 'e', t: 'ེ' }, { w: 'o', t: 'ོ' }
      ]
    },
    {
      title: TIBETAN_STRINGS.wyliePunctuation,
      items: [
        { w: 'space', t: '་' }, { w: '/', t: '།' }, { w: '//', t: '༎' }
      ]
    },
    {
      title: TIBETAN_STRINGS.wylieExamples,
      items: [
        { w: 'bkra shis', t: 'བཀྲ་ཤིས' },
        { w: 'bde legs', t: 'བདེ་ལེགས' },
        { w: 'nga', t: 'ང་' },
        { w: 'snyan', t: 'སྙན' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-md animate-fade-in transition-colors duration-300">
      <div className="bg-white dark:bg-stone-900 w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/40 dark:border-stone-800 animate-slide-up transition-colors duration-300">
        <div className="p-7 border-b border-slate-100 dark:border-stone-800 flex items-center justify-between bg-slate-50/50 dark:bg-stone-800/50">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-stone-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            {TIBETAN_STRINGS.wylieGuide}
          </h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 dark:hover:bg-stone-800 rounded-full transition-all text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Introduction Section */}
          <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30">
            <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-3 Tibetan-text">
              {TIBETAN_STRINGS.wylieIntroTitle}
            </h4>
            <p className="text-base text-slate-700 dark:text-stone-300 Tibetan-text leading-relaxed mb-4">
              {TIBETAN_STRINGS.wylieIntroContent}
            </p>
            <p className="text-base text-slate-700 dark:text-stone-300 Tibetan-text leading-relaxed italic border-l-4 border-indigo-200 dark:border-indigo-800 pl-4">
              {TIBETAN_STRINGS.wyliePurpose}
            </p>
          </div>

          {sections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-[11px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                {section.title}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {section.items.map((item, i) => (
                  <div key={i} className="flex flex-col items-center p-4 bg-slate-50 dark:bg-stone-800 border border-slate-100 dark:border-stone-700 rounded-[1.5rem] hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg transition-all group">
                    <span className="text-sm font-mono text-indigo-500 dark:text-indigo-400 font-bold mb-2 group-hover:scale-110 transition-transform">{item.w}</span>
                    <span className="text-3xl text-slate-800 dark:text-stone-100 Tibetan-text">{item.t}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-slate-50 dark:bg-stone-950 border-t border-slate-100 dark:border-stone-800 text-center text-slate-400 dark:text-stone-600 text-xs font-bold tracking-widest uppercase">
          Extended Wylie Transliteration Scheme (EWTS) Reference
        </div>
      </div>
    </div>
  );
};

export default WylieGuide;
