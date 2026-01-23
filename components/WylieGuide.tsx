
import React, { useState, useMemo } from 'react';
import { TIBETAN_STRINGS } from '../constants';

interface WylieGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const WylieGuide: React.FC<WylieGuideProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = useMemo(() => [
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
  ], []);

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return sections;
    const lowerSearch = searchTerm.toLowerCase();
    
    return sections.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.w.toLowerCase().includes(lowerSearch) || 
        item.t.includes(searchTerm)
      )
    })).filter(section => section.items.length > 0);
  }, [searchTerm, sections]);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => (
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-amber-200 dark:bg-amber-600/50 rounded-sm">{part}</span>
          ) : part
        ))}
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-md animate-fade-in transition-colors duration-300">
      <div className="bg-white dark:bg-stone-900 w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/40 dark:border-stone-800 animate-slide-up transition-colors duration-300">
        <div className="p-7 border-b border-slate-100 dark:border-stone-800 flex items-center justify-between bg-slate-50/50 dark:bg-stone-800/50">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-stone-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
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

        <div className="px-8 pt-6 pb-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ཝ་ལིའམ་བོད་ཡིག་འཚོལ་བ། (Search Wylie or Tibetan...)"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition-all text-base dark:text-stone-100"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4 space-y-10 custom-scrollbar">
          {/* Introduction Section - Only show when not searching */}
          {!searchTerm && (
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
          )}

          {filteredSections.length > 0 ? (
            filteredSections.map((section, idx) => (
              <div key={idx} className="animate-fade-in">
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {section.title}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex flex-col items-center p-4 bg-slate-50 dark:bg-stone-800 border border-slate-100 dark:border-stone-700 rounded-[1.5rem] hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg transition-all group">
                      <span className="text-sm font-mono text-indigo-500 dark:text-indigo-400 font-bold mb-2 group-hover:scale-110 transition-transform">
                        {highlightText(item.w, searchTerm)}
                      </span>
                      <span className="text-3xl text-slate-800 dark:text-stone-100 Tibetan-text">
                        {highlightText(item.t, searchTerm)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50/50 dark:bg-stone-800/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-stone-700">
               <p className="text-slate-400 dark:text-stone-500 font-bold tracking-wide">
                 "{searchTerm}" རྙེད་མ་སོང་། (No matches found)
               </p>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-slate-50 dark:bg-stone-950 border-t border-slate-100 dark:border-stone-800 text-center text-slate-400 dark:text-stone-600 text-xs font-bold tracking-widest uppercase">
          Extended Wylie Transliteration Scheme (EWTS) Reference
        </div>
      </div>
    </div>
  );
};

export default WylieGuide;
