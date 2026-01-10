
import React, { useState, useEffect } from 'react';
import { TIBETAN_STRINGS, INITIAL_DICTIONARY, INITIAL_TERMINOLOGY } from '../constants';
import { generateTibetanResponse } from '../services/geminiService';
import { DictionaryEntry } from '../types';
import { ewtsToUnicode } from '../utils/wylie';

interface DictionaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialTerm?: string;
}

type DictionaryType = 'regular' | 'terminology';
type SearchMode = 'tibetan' | 'ewts';

const DictionaryPanel: React.FC<DictionaryPanelProps> = ({ isOpen, onClose, initialTerm }) => {
  const [activeDict, setActiveDict] = useState<DictionaryType>('regular');
  const [searchTerm, setSearchTerm] = useState(initialTerm || '');
  const [searchMode, setSearchMode] = useState<SearchMode>('tibetan');
  const [wylieSearchBuffer, setWylieSearchBuffer] = useState('');
  const [regularDict, setRegularDict] = useState<DictionaryEntry[]>([]);
  const [terminologyDict, setTerminologyDict] = useState<DictionaryEntry[]>([]);
  const [isDeepLoading, setIsDeepLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<DictionaryEntry>>({});

  useEffect(() => {
    const savedReg = localStorage.getItem('bod_skyad_dictionary_reg');
    const savedTerm = localStorage.getItem('bod_skyad_dictionary_term');
    if (savedReg) setRegularDict(JSON.parse(savedReg)); else setRegularDict(INITIAL_DICTIONARY);
    if (savedTerm) setTerminologyDict(JSON.parse(savedTerm)); else setTerminologyDict(INITIAL_TERMINOLOGY);
  }, []);

  useEffect(() => {
    if (regularDict.length > 0) localStorage.setItem('bod_skyad_dictionary_reg', JSON.stringify(regularDict));
  }, [regularDict]);

  useEffect(() => {
    if (terminologyDict.length > 0) localStorage.setItem('bod_skyad_dictionary_term', JSON.stringify(terminologyDict));
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
    const val = e.target.value;
    if (searchMode === 'ewts') {
      const lastConv = searchTerm;
      let newBuffer = wylieSearchBuffer;
      if (val.length < lastConv.length) {
        newBuffer = newBuffer.slice(0, -1);
      } else {
        const added = val.slice(lastConv.length);
        if (/[a-zA-Z0-9'\/\\\[\]+.~;: ]/.test(added)) {
          newBuffer += added;
        }
      }
      setWylieSearchBuffer(newBuffer);
      setSearchTerm(ewtsToUnicode(newBuffer));
    } else {
      setSearchTerm(val);
      setWylieSearchBuffer('');
    }
  };

  const currentDict = activeDict === 'regular' ? regularDict : terminologyDict;

  const filteredEntries = currentDict
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
        prompt = `Provide the Tibetan scientific equivalent and a precise technical definition for the terminology "${searchTerm}" entirely in Tibetan language.`;
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
    <div className="fixed inset-y-0 right-0 w-80 md:w-[30rem] glass-panel shadow-[-15px_0_60px_rgba(0,0,0,0.12)] z-50 flex flex-col border-l border-red-100/40 animate-slide-in">
      <div className="p-7 border-b border-red-50/50 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
           <span className={`w-2.5 h-2.5 rounded-full shadow-lg ${activeDict === 'regular' ? 'bg-red-800 shadow-red-100' : 'bg-amber-600 shadow-amber-100'}`}></span>
           {activeDict === 'regular' ? TIBETAN_STRINGS.dictionary : TIBETAN_STRINGS.terminologyDict}
        </h3>
        <button onClick={onClose} className="p-2.5 hover:bg-white hover:shadow-md rounded-full transition-all text-slate-400 hover:text-red-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex px-5 py-2.5 gap-1.5 bg-red-50/30 mx-6 mt-4 rounded-2xl border border-red-50/50 shadow-inner">
        <button
          onClick={() => setActiveDict('regular')}
          className={`flex-1 py-2.5 text-sm font-bold transition-all rounded-xl ${
            activeDict === 'regular' ? 'bg-white shadow-md text-red-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {TIBETAN_STRINGS.dictionary}
        </button>
        <button
          onClick={() => setActiveDict('terminology')}
          className={`flex-1 py-2.5 text-sm font-bold transition-all rounded-xl ${
            activeDict === 'terminology' ? 'bg-white shadow-md text-red-900' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {TIBETAN_STRINGS.terminologyDict}
        </button>
      </div>

      <div className="p-7 flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center gap-2 mb-3 px-1">
          <button 
            onClick={() => {setSearchMode('tibetan'); setWylieSearchBuffer('');}}
            className={`text-[10px] px-3 py-1.5 rounded-lg font-bold transition-all uppercase tracking-wider ${searchMode === 'tibetan' ? 'bg-red-900 text-white shadow-md' : 'bg-red-50 text-red-800 hover:bg-red-100'}`}
          >
            {TIBETAN_STRINGS.kbTibetan}
          </button>
          <button 
            onClick={() => setSearchMode('ewts')}
            className={`text-[10px] px-3 py-1.5 rounded-lg font-bold transition-all uppercase tracking-wider ${searchMode === 'ewts' ? 'bg-red-900 text-white shadow-md' : 'bg-red-50 text-red-800 hover:bg-red-100'}`}
          >
            Wylie
          </button>
        </div>

        <div className="relative mb-7">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={searchMode === 'ewts' ? TIBETAN_STRINGS.wyliePlaceholder : TIBETAN_STRINGS.searchPlaceholder}
            className="w-full pl-14 pr-6 py-4.5 bg-red-50/50 focus:bg-white border-2 border-transparent focus:border-red-900 rounded-[1.8rem] outline-none transition-all text-xl font-medium shadow-inner Tibetan-text"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-5 top-4.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {showAddForm ? (
          <div className="bg-white p-6 rounded-[2rem] border-2 border-red-50 mb-8 animate-slide-up shadow-2xl shadow-red-50/50 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {activeDict === 'terminology' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest px-2">{TIBETAN_STRINGS.englishTerm}</label>
                  <input
                    value={newEntry.englishTerm || ''}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, englishTerm: e.target.value }))}
                    placeholder="English Term"
                    className="w-full p-3 bg-red-50 border border-red-50 rounded-2xl outline-none text-lg font-bold focus:bg-white focus:border-red-900 transition-all"
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest px-2">{TIBETAN_STRINGS.tibetanTerm}</label>
                <input
                  value={newEntry.term || ''}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, term: e.target.value }))}
                  placeholder="མིང་།"
                  className="w-full p-3 bg-red-50 border border-red-50 rounded-2xl outline-none text-2xl font-bold focus:bg-white focus:border-red-900 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-red-400 uppercase tracking-widest px-2">འགྲེལ་བཤད། (Definition)</label>
                <textarea
                  value={newEntry.definition || ''}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, definition: e.target.value }))}
                  placeholder="འགྲེལ་བཤད།"
                  rows={4}
                  className="w-full p-3 bg-red-50 border border-red-50 rounded-2xl outline-none text-lg focus:bg-white focus:border-red-900 transition-all resize-none Tibetan-text"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddTerm}
                  className="flex-1 py-3.5 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-[1.2rem] font-bold shadow-xl shadow-red-100 hover:shadow-red-200 active:scale-95 transition-all"
                >
                  {TIBETAN_STRINGS.saveToDict}
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-3.5 bg-red-50 text-red-500 rounded-[1.2rem] font-bold hover:bg-red-100 transition-all"
                >
                  ✖
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 mb-8 bg-white border-2 border-dashed border-red-50 text-red-200 rounded-[1.8rem] hover:border-red-400 hover:text-red-900 font-bold transition-all text-sm group"
          >
            <span className="inline-block group-hover:scale-125 transition-transform mr-2">+</span> {TIBETAN_STRINGS.addTerm}
          </button>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry, idx) => (
              <div key={idx} className="p-6 bg-white border border-red-50 rounded-[2.2rem] shadow-sm group hover:border-red-100 hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300">
                <div className="flex flex-col gap-1 mb-3">
                  {entry.englishTerm && (
                    <span className="text-sm font-bold text-amber-600 tracking-wide uppercase">{entry.englishTerm}</span>
                  )}
                  <h4 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-red-900 transition-colors">{entry.term}</h4>
                </div>
                <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed Tibetan-text">
                   {entry.definition}
                </div>
                {entry.isUserAdded && (
                  <button 
                    onClick={() => handleDeleteTerm(entry.term, entry.englishTerm)}
                    className="mt-5 text-[10px] text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 font-bold uppercase tracking-widest"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    གསུབ་པ།
                  </button>
                )}
              </div>
            ))
          ) : searchTerm ? (
            <div className="text-center py-20 bg-red-50/20 rounded-[2.5rem] border border-red-50">
              <p className="text-slate-400 mb-8 text-sm font-bold tracking-wide">{TIBETAN_STRINGS.noDefinition}</p>
              <button 
                onClick={handleDeepLookup}
                disabled={isDeepLoading}
                className="mx-auto py-4 px-10 bg-red-900 text-white rounded-[1.5rem] hover:bg-red-800 transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-red-100 font-bold active:scale-95"
              >
                 {isDeepLoading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                 {TIBETAN_STRINGS.deepLookup}
              </button>
            </div>
          ) : (
            <div className="text-center py-24 opacity-30">
               <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-900/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
               </div>
               <p className="text-base font-bold text-slate-400 tracking-wide uppercase">{TIBETAN_STRINGS.dictInitialHint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DictionaryPanel;
