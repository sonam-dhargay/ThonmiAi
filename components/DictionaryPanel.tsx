
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TIBETAN_STRINGS, INITIAL_DICTIONARY, INITIAL_TERMINOLOGY } from '../constants';
import { generateTibetanResponse } from '../services/geminiService';
import { DictionaryEntry } from '../types';
import { checkTibetanSpelling } from '../utils/spellChecker';

interface DictionaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
}

type DictionaryType = 'regular' | 'terminology';

const DictionaryPanel: React.FC<DictionaryPanelProps> = ({ isOpen, onClose, initialTerm }) => {
  const [activeDict, setActiveDict] = useState<DictionaryType>('regular');
  const [searchTerm, setSearchTerm] = useState(initialTerm || '');
  const [regularDict, setRegularDict] = useState<DictionaryEntry[]>([]);
  const [terminologyDict, setTerminologyDict] = useState<DictionaryEntry[]>([]);
  const [isDeepLoading, setIsDeepLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<DictionaryEntry>>({});
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const savedReg = localStorage.getItem('bod_skyad_dictionary_reg');
    const savedTerm = localStorage.getItem('bod_skyad_dictionary_term');
    
    if (savedReg) {
      try {
        setRegularDict(JSON.parse(savedReg));
      } catch (e) {
        setRegularDict(INITIAL_DICTIONARY);
      }
    } else {
      setRegularDict(INITIAL_DICTIONARY);
    }

    if (savedTerm) {
      try {
        setTerminologyDict(JSON.parse(savedTerm));
      } catch (e) {
        setTerminologyDict(INITIAL_TERMINOLOGY);
      }
    } else {
      setTerminologyDict(INITIAL_TERMINOLOGY);
    }
    
    hasLoadedRef.current = true;
  }, []);

  useEffect(() => {
    if (hasLoadedRef.current) {
      localStorage.setItem('bod_skyad_dictionary_reg', JSON.stringify(regularDict));
    }
  }, [regularDict]);

  useEffect(() => {
    if (hasLoadedRef.current) {
      localStorage.setItem('bod_skyad_dictionary_term', JSON.stringify(terminologyDict));
    }
  }, [terminologyDict]);

  useEffect(() => {
    if (initialTerm) {
      setSearchTerm(initialTerm);
      if (/[a-zA-Z]/.test(initialTerm)) {
        setActiveDict('terminology');
        setNewEntry(prev => ({ ...prev, englishTerm: initialTerm }));
      } else {
        setActiveDict('regular');
        setNewEntry(prev => ({ ...prev, term: initialTerm }));
      }
      setShowAddForm(true);
    }
  }, [initialTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEntries = useMemo(() => {
    const currentDict = activeDict === 'regular' ? regularDict : terminologyDict;
    
    return [...currentDict]
      .filter(entry => {
        const s = searchTerm.toLowerCase();
        const matchesSearch = 
          entry.term.includes(searchTerm) || 
          entry.definition.includes(searchTerm) ||
          (entry.englishTerm && entry.englishTerm.toLowerCase().includes(s));
        return matchesSearch;
      })
      .sort((a, b) => {
        if (activeDict === 'terminology') {
          const termA = a.englishTerm?.toLowerCase() || '';
          const termB = b.englishTerm?.toLowerCase() || '';
          return termA.localeCompare(termB);
        } else {
          return a.term.localeCompare(b.term, 'bo');
        }
      });
  }, [activeDict, regularDict, terminologyDict, searchTerm]);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => (
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-0.5 rounded-sm">{part}</span>
          ) : part
        ))}
      </>
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(text);
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  const newEntrySpellCheck = useMemo(() => {
    if (!newEntry.term) return { isValid: true };
    return checkTibetanSpelling(newEntry.term);
  }, [newEntry.term]);

  const handleAddTerm = () => {
    if ((activeDict === 'regular' && newEntry.term && newEntry.definition) ||
        (activeDict === 'terminology' && newEntry.englishTerm && newEntry.term && newEntry.definition)) {
      
      const entry: DictionaryEntry = {
        term: newEntry.term || '',
        englishTerm: newEntry.englishTerm,
        definition: newEntry.definition || '',
        isUserAdded: true
      };
      
      if (activeDict === 'regular') setRegularDict(prev => [entry, ...prev]);
      else setTerminologyDict(prev => [entry, ...prev]);
      
      setNewEntry({});
      setShowAddForm(false);
    }
  };

  const handleDeleteTerm = (term: string, englishTerm?: string) => {
    if (activeDict === 'regular') setRegularDict(prev => prev.filter(e => e.term !== term));
    else setTerminologyDict(prev => prev.filter(e => e.term !== term || e.englishTerm !== englishTerm));
  };

  const handleDeepLookup = async () => {
    if (!searchTerm) return;
    setIsDeepLoading(true);
    try {
      const isEnglish = /[a-zA-Z]/.test(searchTerm);
      let prompt = "";
      
      if (activeDict === 'terminology') {
        prompt = `Provide the Tibetan equivalent and a precise dictionary definition for the English term "${searchTerm}" entirely in Tibetan language. List the primary Tibetan term clearly.`;
      } else {
        prompt = `Please provide a lexicographical definition, spelling notes (orthography), and grammatical usage for the Tibetan word "${searchTerm}" entirely in Tibetan language.`;
      }
      
      const res = await generateTibetanResponse(prompt, []);
      
      if (isEnglish) {
        setNewEntry({ englishTerm: searchTerm, definition: res });
      } else {
        setNewEntry({ term: searchTerm, definition: res });
      }
      setShowAddForm(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeepLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 md:w-[32rem] glass-panel dark:bg-stone-950/95 shadow-[-25px_0_80px_rgba(0,0,0,0.15)] z-50 flex flex-col border-l border-red-100/30 dark:border-stone-800 animate-slide-in transition-all duration-300">
      <div className="p-7 border-b border-red-50/50 dark:border-stone-800 flex items-center justify-between bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-stone-100 flex items-center gap-3">
           <div className={`w-3 h-3 rounded-full ring-4 ring-opacity-20 ${activeDict === 'regular' ? 'bg-red-800 ring-red-800' : 'bg-amber-500 ring-amber-500'}`}></div>
           {activeDict === 'regular' ? TIBETAN_STRINGS.dictionary : TIBETAN_STRINGS.terminologyDict}
        </h3>
        <button onClick={onClose} className="p-2.5 hover:bg-red-50 dark:hover:bg-stone-800 rounded-full transition-all text-slate-400 hover:text-red-900 dark:hover:text-red-400 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex px-5 py-2 gap-1.5 bg-red-50/20 dark:bg-stone-900/50 mx-6 mt-6 rounded-2xl border border-red-100/30 dark:border-stone-800 shadow-inner">
        <button
          onClick={() => setActiveDict('regular')}
          className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-all rounded-xl ${
            activeDict === 'regular' ? 'bg-white dark:bg-stone-800 shadow-md text-red-900 dark:text-red-400' : 'text-slate-400 dark:text-stone-600 hover:text-slate-600 dark:hover:text-stone-400'
          }`}
        >
          Tibetan
        </button>
        <button
          onClick={() => setActiveDict('terminology')}
          className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-all rounded-xl ${
            activeDict === 'terminology' ? 'bg-white dark:bg-stone-800 shadow-md text-amber-600 dark:text-amber-500' : 'text-slate-400 dark:text-stone-600 hover:text-slate-600 dark:hover:text-stone-400'
          }`}
        >
          Terminology
        </button>
      </div>

      <div className="p-7 flex flex-col flex-1 overflow-hidden">
        <div className="relative mb-6 mt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={activeDict === 'regular' ? TIBETAN_STRINGS.searchPlaceholder : "དབྱིན་ཡིག་གི་ཚིག་འཚོལ་བ། (Search English...)"}
            className="w-full pl-14 pr-6 py-4.5 bg-white dark:bg-stone-900 focus:bg-white dark:focus:bg-stone-800 border-2 border-red-50/50 dark:border-stone-800 focus:border-red-900/50 dark:focus:border-red-700/50 rounded-[2rem] outline-none transition-all text-xl font-medium shadow-xl shadow-red-50/10 dark:shadow-black/20 dark:text-stone-100 Tibetan-text"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-5 top-5 text-slate-300 dark:text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-5 top-5 text-slate-300 hover:text-red-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {showAddForm ? (
          <div className="bg-white dark:bg-stone-800 p-7 rounded-[2.2rem] border-2 border-amber-100 dark:border-amber-900/30 mb-8 animate-slide-up shadow-2xl shadow-red-100/30 dark:shadow-black/50 overflow-y-auto max-h-[60vh] transition-all">
            <div className="space-y-5">
              {activeDict === 'terminology' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest px-1">{TIBETAN_STRINGS.englishTerm}</label>
                  <input
                    value={newEntry.englishTerm || ''}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, englishTerm: e.target.value }))}
                    placeholder="English Word"
                    className="w-full p-4 bg-red-50/30 dark:bg-stone-900 border border-red-100 dark:border-stone-700 rounded-2xl outline-none text-lg font-bold focus:bg-white dark:focus:bg-stone-700 focus:ring-4 focus:ring-amber-500/10 transition-all dark:text-stone-100"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-red-400 dark:text-red-500 uppercase tracking-widest px-1">{TIBETAN_STRINGS.tibetanTerm}</label>
                <div className="relative">
                  <input
                    value={newEntry.term || ''}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, term: e.target.value }))}
                    placeholder="བོད་ཡིག་གི་མིང་།"
                    className={`w-full p-4 bg-red-50/30 dark:bg-stone-900 border ${!newEntrySpellCheck.isValid ? 'border-red-500' : 'border-red-100 dark:border-stone-700'} rounded-2xl outline-none text-2xl font-bold focus:bg-white dark:focus:bg-stone-700 focus:ring-4 focus:ring-red-500/10 transition-all dark:text-stone-100 Tibetan-text`}
                  />
                  {!newEntrySpellCheck.isValid && (
                    <div className="absolute top-full left-0 mt-1 text-[10px] text-red-500 font-bold Tibetan-text animate-pulse">
                      {TIBETAN_STRINGS.spellCheckFail}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1.5 pt-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Definition</label>
                <textarea
                  value={newEntry.definition || ''}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, definition: e.target.value }))}
                  placeholder="འགྲེལ་བཤད།"
                  rows={4}
                  className="w-full p-4 bg-red-50/30 dark:bg-stone-900 border border-red-100 dark:border-stone-700 rounded-2xl outline-none text-lg focus:bg-white dark:focus:bg-stone-700 transition-all resize-none dark:text-stone-200 Tibetan-text leading-relaxed"
                />
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleAddTerm}
                  className="flex-1 py-4 bg-gradient-to-r from-red-950 to-red-800 dark:from-red-800 dark:to-red-700 text-white rounded-[1.4rem] font-bold shadow-xl shadow-red-900/10 active:scale-95 transition-all"
                >
                  {TIBETAN_STRINGS.saveToDict}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-4 bg-red-50 dark:bg-stone-700 text-red-600 dark:text-red-400 rounded-[1.4rem] font-bold hover:bg-red-100 dark:hover:bg-stone-600 transition-all"
                >
                  ✖
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4.5 mb-8 bg-white/50 dark:bg-stone-800/50 border-2 border-dashed border-red-100 dark:border-stone-800 text-red-200 dark:text-stone-600 rounded-[2.2rem] hover:border-red-400 dark:hover:border-red-800 hover:text-red-900 dark:hover:text-red-400 font-black tracking-widest uppercase transition-all text-xs group"
          >
            <span className="inline-block group-hover:scale-125 transition-transform mr-3 text-lg leading-none">+</span> {TIBETAN_STRINGS.addTerm}
          </button>
        )}

        <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar pb-10">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry, idx) => {
              const spellCheck = checkTibetanSpelling(entry.term);
              const isCopied = copyStatus === entry.term;
              
              return (
                <div 
                  key={`${entry.term}-${idx}`}
                  className={`relative p-7 border-2 rounded-[2.5rem] shadow-sm group transition-all duration-500 transform ${
                    entry.isUserAdded 
                      ? 'bg-gradient-to-br from-amber-50/50 to-white dark:from-amber-900/10 dark:to-stone-800/60 border-amber-100 dark:border-amber-900/30' 
                      : 'bg-white dark:bg-stone-800 border-red-50/50 dark:border-stone-700'
                  } hover:border-red-100 dark:hover:border-red-900/40 hover:shadow-2xl hover:shadow-red-900/5 hover:-translate-y-1.5`}
                >
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-5 right-6 flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => handleCopy(entry.term)}
                      className={`p-2 rounded-xl transition-all ${isCopied ? 'bg-emerald-50 text-emerald-600' : 'bg-white/80 dark:bg-stone-700/80 text-slate-400 hover:text-red-900 shadow-sm border border-red-50 dark:border-stone-600'}`}
                      title="Copy"
                    >
                      {isCopied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                      )}
                    </button>
                    {entry.isUserAdded && (
                      <button 
                        onClick={() => handleDeleteTerm(entry.term, entry.englishTerm)}
                        className="p-2 bg-red-50 dark:bg-red-900/20 text-red-400 hover:text-red-700 dark:hover:text-red-400 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 transition-all"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>

                  {entry.isUserAdded && (
                    <div className="absolute -top-3 left-8 px-3 py-1 bg-amber-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 border-2 border-white dark:border-stone-800">
                      User Contribution
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5 mb-4">
                    {entry.englishTerm && (
                      <span className="text-xs font-black text-amber-600 dark:text-amber-500 tracking-widest uppercase">
                        {highlightText(entry.englishTerm, searchTerm)}
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <h4 className="text-[1.6rem] font-bold text-slate-900 dark:text-stone-100 leading-tight Tibetan-text group-hover:text-red-950 dark:group-hover:text-red-400 transition-colors">
                        {highlightText(entry.term, searchTerm)}
                      </h4>
                      {activeDict === 'regular' && (
                        <div 
                          className={`w-2.5 h-2.5 rounded-full ${spellCheck.isValid ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]'}`} 
                          title={spellCheck.isValid ? TIBETAN_STRINGS.spellCheckPass : TIBETAN_STRINGS.spellCheckFail}
                        ></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-stone-400 leading-relaxed Tibetan-text text-[1.25rem]">
                    {highlightText(entry.definition, searchTerm)}
                  </div>
                </div>
              );
            })
          ) : searchTerm ? (
            <div className="text-center py-20 bg-red-50/30 dark:bg-stone-800/30 rounded-[3rem] border-2 border-dashed border-red-100 dark:border-stone-800 transition-all">
              <div className="w-20 h-20 bg-white dark:bg-stone-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300 dark:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
              </div>
              <p className="text-slate-400 dark:text-stone-500 mb-8 text-sm font-bold tracking-widest uppercase px-10 leading-relaxed">
                "{searchTerm}" {TIBETAN_STRINGS.noDefinition}
              </p>
              <button 
                onClick={handleDeepLookup}
                disabled={isDeepLoading}
                className="mx-auto py-4.5 px-12 bg-red-950 dark:bg-red-700 text-white rounded-[1.8rem] hover:bg-red-900 dark:hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-4 shadow-2xl shadow-red-900/20 font-black tracking-widest uppercase text-xs active:scale-95"
              >
                 {isDeepLoading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 )}
                 {TIBETAN_STRINGS.deepLookup}
              </button>
            </div>
          ) : (
            <div className="text-center py-32 opacity-40 group cursor-default">
               <div className="w-24 h-24 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-900/40 dark:text-stone-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
               </div>
               <p className="text-sm font-black text-slate-400 dark:text-stone-600 tracking-[0.3em] uppercase">{TIBETAN_STRINGS.dictInitialHint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DictionaryPanel;
