
import React from 'react';
import { TIBETAN_STRINGS } from '../constants';

interface GrammarGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const GrammarGuide: React.FC<GrammarGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      title: TIBETAN_STRINGS.grammarStructure,
      description: "བོད་ཡིག་གི་ཚིག་གི་གོ་རིམ་ནི། བྱེད་པ་པོ་ + ལས་ + བྱ་བ་ (Subject + Object + Verb) བཅས་ཀྱི་རིམ་པ་ཡིན།",
      examples: [
        { label: "དཔེར་ན།", content: "ངས་བོད་ཡིག་སྦྱོང་། (I [Subject] Tibetan [Object] learn [Verb].)" }
      ]
    },
    {
      title: TIBETAN_STRINGS.grammarParticles,
      description: "འབྲེལ་སྒྲ་ (Genitive) དང་བྱེད་སྒྲ་ (Ergative) ནི་བོད་ཡིག་གི་བརྡ་སྤྲོད་ནང་ཤིན་ཏུ་གལ་ཆེ།",
      subsections: [
        {
          name: "འབྲེལ་སྒྲ། (Genitive)",
          content: "གི་ ཀྱི་ གྱི་ འི་ ཡི། (of / 's)",
          examples: [
            { label: "དཔེར་ན།", content: "ངའི་དེབ་ (My book)" },
            { label: "དཔེར་ན།", content: "བོད་ཀྱི་རིག་གནས་ (Tibetan culture)" }
          ]
        },
        {
          name: "བྱེད་སྒྲ། (Ergative)",
          content: "གིས་ ཀྱིས་ གྱིས་ འིས་ ཡིས་ (by / with)",
          examples: [
            { label: "དཔེར་ན།", content: "ངས་བྲིས། (I wrote / Written by me)" }
          ]
        }
      ]
    },
    {
      title: TIBETAN_STRINGS.grammarHonorifics,
      description: "གུས་ཞབས་མཚོན་བྱེད་ཀྱི་ཞེ་ས་ནི་བོད་ཀྱི་སྐད་ཡིག་གི་ཁྱད་ཆོས་ཤིག་ཡིན།",
      examples: [
        { label: "མགོ (Head)", content: "དབུ་ (Honorific)" },
        { label: "མིག (Eye)", content: "སྤྱན་ (Honorific)" },
        { label: "ཁ་ (Mouth)", content: "ཞལ་ (Honorific)" },
        { label: "ལག་པ་ (Hand)", content: "ཕྱག་ (Honorific)" }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-md animate-fade-in transition-colors duration-300">
      <div className="bg-white dark:bg-stone-900 w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/40 dark:border-stone-800 animate-slide-up transition-colors duration-300">
        <div className="p-7 border-b border-slate-100 dark:border-stone-800 flex items-center justify-between bg-slate-50/50 dark:bg-stone-800/50">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-stone-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            {TIBETAN_STRINGS.grammarGuide}
          </h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 dark:hover:bg-stone-800 rounded-full transition-all text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-stone-800 rounded-3xl p-6 border border-slate-100 dark:border-stone-700 shadow-sm transition-colors duration-300">
              <h4 className="text-[11px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {section.title}
              </h4>
              <p className="text-xl text-slate-700 dark:text-stone-200 Tibetan-text mb-6">{section.description}</p>
              
              {section.subsections ? (
                <div className="grid grid-cols-1 gap-6">
                  {section.subsections.map((sub, sidx) => (
                    <div key={sidx} className="bg-slate-50 dark:bg-stone-900/50 p-5 rounded-2xl border border-slate-100 dark:border-stone-800 transition-colors duration-300">
                      <div className="text-lg font-bold text-amber-600 dark:text-amber-500 mb-2">{sub.name}</div>
                      <div className="text-2xl text-slate-800 dark:text-stone-100 Tibetan-text mb-4">{sub.content}</div>
                      <div className="space-y-2">
                        {sub.examples.map((ex, eidx) => (
                          <div key={eidx} className="flex gap-3 text-sm">
                            <span className="text-slate-400 dark:text-stone-500 font-bold shrink-0">{ex.label}</span>
                            <span className="text-slate-700 dark:text-stone-300 Tibetan-text">{ex.content}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.examples.map((ex, eidx) => (
                    <div key={eidx} className="flex flex-col p-4 bg-slate-50 dark:bg-stone-900/50 rounded-2xl border border-slate-100 dark:border-stone-800 transition-colors duration-300">
                      <span className="text-xs font-bold text-slate-400 dark:text-stone-500 uppercase tracking-widest mb-1">{ex.label}</span>
                      <span className="text-xl text-slate-800 dark:text-stone-100 Tibetan-text">{ex.content}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-slate-50 dark:bg-stone-950 border-t border-slate-100 dark:border-stone-800 text-center text-slate-400 dark:text-stone-600 text-xs font-bold tracking-widest uppercase transition-colors duration-300">
          བོད་ཀྱི་བརྡ་སྤྲོད་སྤྱི་དོན་མདོར་བསྡུས།
        </div>
      </div>
    </div>
  );
};

export default GrammarGuide;
