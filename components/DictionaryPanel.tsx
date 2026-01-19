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
  
  const hasLoadedRef = useRef(false);

  // Initial Load from LocalStorage
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

  // Save to LocalStorage immediately on any change
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
      // Heuristic: if it contains ASCII, assume it's English/Wylie for terminology
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

  // Automatic sorting logic
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
        // Try to extract a likely Tibetan term from the AI response if it follows a pattern
        // For simplicity, we just put the whole response in the definition for now
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
    <div className="fixed inset-y-0 right-0 w-80 md:w-[30rem] glass-panel dark:bg-stone-950/90 shadow-[-15px_0_60px_rgba(0,0,0,0.12)] z-50 flex flex-col border-l border-red-100/40 dark:border-stone-800 animate-slide-in transition-colors duration-300">
      <div className="p-7 border-b border-red-50/50 dark:border-stone-800 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-stone-100 flex items-center gap-3">
           <span className={`w-2.5 h-2.5 rounded-full shadow-lg ${activeDict === 'regular' ? 'bg-red-800 dark:bg-red-600 shadow-red-100' : 'bg-amber-600 dark:bg-amber-500 shadow-amber-100'}`}></span>
           {activeDict === 'regular' ? TIBETAN_STRINGS.dictionary : TIBETAN_STRINGS.terminologyDict}
        </h3>
        <button onClick={onClose} className="p-2.5 hover:bg-white dark:hover:bg-stone-800 hover:shadow-md rounded-full transition-all text-slate-400 hover:text-red-900 dark:hover:text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex px-5 py-2.5 gap-1.5 bg-red-50/30 dark:bg-stone-900 mx-6 mt-4 rounded-2xl border border-red-50/50 dark:border-stone-800 shadow-inner">
        <button
          onClick={() => setActiveDict('regular')}
          className={`flex-1 py-2.5 text-xs font-bold transition-all rounded-xl ${
            activeDict === 'regular' ? 'bg-white dark:bg-stone-800 shadow-md text-red-900 dark:text-red-400' : 'text-slate-400 dark:text-stone-600 hover:text-slate-600 dark:hover:text-stone-400'
          }`}
        >
          བོད་ཡིག་ཚིག་མཛོད།
        </button>
        <button
          onClick={() => setActiveDict('terminology')}
          className={`flex-1 py-2.5 text-xs font-bold transition-all rounded-xl ${
            activeDict === 'terminology' ? 'bg-white dark:bg-stone-800 shadow-md text-amber-600 dark:text-amber-500' : 'text-slate-400 dark:text-stone-600 hover:text-slate-600 dark:hover:text-stone-400'
          }`}
        >
          དབྱིན་བོད་ཚིག་མཛོད།
        </button>
      </div>

      <div className="p-7 flex flex-col flex-1 overflow-hidden">
        <div className="relative mb-7 mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={activeDict === 'regular' ? TIBETAN_STRINGS.searchPlaceholder : "དབྱིན་ཡིག་གི་ཚིག་འཚོལ་བ། (Search English...)"}
            className="w-full pl-14 pr-6 py-4.5 bg-red-50/50 dark:bg-stone-900 focus:bg-white dark:focus:bg-stone-800 border-2 border-transparent focus:border-red-900 dark:focus:border-red-700 rounded-[1.8rem] outline-none transition-all text-xl font-medium shadow-inner dark:text-stone-100 Tibetan-text"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-5 top-4.5 text-slate-300 dark:text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {showAddForm ? (
          <div className="bg-white dark:bg-stone-800 p-6 rounded-[2rem] border-2 border-red-50 dark:border-stone-700 mb-8 animate-slide-up shadow-2xl shadow-red-50/50 dark:shadow-black/50 overflow-y-auto max-h-[60vh] transition-colors duration-300">
            <div className="space-y-4">
              {activeDict === 'terminology' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest px-2">{TIBETAN_STRINGS.englishTerm}</label>
                  <input
                    value={newEntry.englishTerm || ''}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, englishTerm: e.target.value }))}
                    placeholder="English Word"
                    className="w-full p-3 bg-red-50 dark:bg-stone-900 border border-red-50 dark:border-stone-700 rounded-2xl outline-none text-lg font-bold focus:bg-white dark:focus:bg-stone-700 focus:border-red-900 transition-all dark:text-stone-100"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest px-2">{TIBETAN_STRINGS.tibetanTerm}</label>
                <div className="relative">
                  <input
                    value={newEntry.term || ''}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, term: e.target.value }))}
                    placeholder="བོད་ཡིག་གི་མིང་།"
                    className={`w-full p-3 bg-red-50 dark:bg-stone-900 border ${!newEntrySpellCheck.isValid ? 'border-red-500' : 'border-red-50 dark:border-stone-700'} rounded-2xl outline-none text-2xl font-bold focus:bg-white dark:focus:bg-stone-700 focus:border-red-900 transition-all dark:text-stone-100`}
                  />
                  {!newEntrySpellCheck.isValid && (
                    <div className="absolute top-full left-0 mt-1 text-[10px] text-red-500 font-bold Tibetan-text animate-fade-in">
                      {TIBETAN_STRINGS.spellCheckFail}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1 pt-2">
                <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest px-2">འགྲེལ་བཤད། (Definition)</label>
                <textarea
                  value={newEntry.definition || ''}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, definition: e.target.value }))}
                  placeholder="འགྲེལ་བཤད།"
                  rows={4}
                  className="w-full p-3 bg-red-50 dark:bg-stone-900 border border-red-50 dark:border-stone-700 rounded-2xl outline-none text-lg focus:bg-white dark:focus:bg-stone-700 focus:border-red-900 transition-all resize-none dark:text-stone-200 Tibetan-text"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddTerm}
                  className="flex-1 py-3.5 bg-gradient-to-r from-red-900 to-red-800 dark:from-red-700 dark:to-red-600 text-white rounded-[1.2rem] font-bold shadow-xl shadow-red-100 dark:shadow-black hover:shadow-red-200 active:scale-95 transition-all"
                >
                  {TIBETAN_STRINGS.saveToDict}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-3.5 bg-red-50 dark:bg-stone-700 text-red-500 dark:text-red-400 rounded-[1.2rem] font-bold hover:bg-red-100 dark:hover:bg-stone-600 transition-all"
                >
                  ✖
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 mb-8 bg-white dark:bg-stone-800 border-2 border-dashed border-red-50 dark:border-stone-700 text-red-200 dark:text-stone-600 rounded-[1.8rem] hover:border-red-400 dark:hover:border-red-800 hover:text-red-900 dark:hover:text-red-400 font-bold transition-all text-sm group"
          >
            <span className="inline-block group-hover:scale-125 transition-transform mr-2">+</span> {TIBETAN_STRINGS.addTerm}
          </button>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-10">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry, idx) => {
              const spellCheck = checkTibetanSpelling(entry.term);
              
              return (
                <div 
                  key={`${entry.term}-${idx}`}
                  className={`relative p-6 border rounded-[2.2rem] shadow-sm group transition-all transform duration-300 ${
                    entry.isUserAdded 
                      ? 'bg-amber-50/40 dark:bg-stone-800/60 border-amber-100 dark:border-amber-900/30' 
                      : 'bg-white dark:bg-stone-800 border-red-50 dark:border-stone-700'
                  } hover:border-red-100 dark:hover:border-red-800 hover:shadow-xl hover:-translate-y-1`}
                >
                  {entry.isUserAdded && (
                    <div className="absolute top-4 right-6 flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 rounded-full border border-amber-200 dark:border-amber-900/50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-600 dark:text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[8px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-tighter">User</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 mb-3">
                    {entry.englishTerm && (
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-500 tracking-wide uppercase">{entry.englishTerm}</span>
                    )}
                    <div className="flex items-center gap-3">
                      <h4 className="text-2xl font-bold text-slate-900 dark:text-stone-100 leading-tight group-hover:text-red-900 dark:group-hover:text-red-400 transition-colors">{entry.term}</h4>
                      {activeDict === 'regular' && (
                        <div className={`w-2 h-2 rounded-full ${spellCheck.isValid ? 'bg-green-400' : 'bg-red-400'} opacity-0 group-hover:opacity-100 transition-opacity`} title={spellCheck.isValid ? TIBETAN_STRINGS.spellCheckPass : TIBETAN_STRINGS.spellCheckFail}></div>
                      )}
                    </div>
                  </div>
                  <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-stone-400 leading-relaxed Tibetan-text">
                    {entry.definition}
                  </div>
                  {entry.isUserAdded && (
                    <button 
                      onClick={() => handleDeleteTerm(entry.term, entry.englishTerm)}
                      className="mt-5 text-[10px] text-red-400 dark:text-red-600 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 font-bold uppercase tracking-widest"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      གསུབ་པ།
                    </button>
                  )}
                </div>
              );
            })
          ) : searchTerm ? (
            <div className="text-center py-20 bg-red-50/20 dark:bg-stone-800/20 rounded-[2.5rem] border border-red-50 dark:border-stone-800 transition-colors duration-300">
              <p className="text-slate-400 dark:text-stone-600 mb-8 text-sm font-bold tracking-wide">{TIBETAN_STRINGS.noDefinition}</p>
              <button 
                onClick={handleDeepLookup}
                disabled={isDeepLoading}
                className="mx-auto py-4 px-10 bg-red-900 dark:bg-red-700 text-white rounded-[1.5rem] hover:bg-red-800 dark:hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-red-100 dark:shadow-black font-bold active:scale-95"
              >
                 {isDeepLoading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                 {TIBETAN_STRINGS.deepLookup}
              </button>
            </div>
          ) : (
            <div className="text-center py-24 opacity-30">
               <div className="w-24 h-24 bg-red-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-8 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-900/30 dark:text-stone-400/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
               </div>
               <p className="text-base font-bold text-slate-400 dark:text-stone-600 tracking-wide uppercase">{TIBETAN_STRINGS.dictInitialHint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DictionaryPanel;