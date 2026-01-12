
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import VirtualKeyboard from './components/VirtualKeyboard';
import DictionaryPanel from './components/DictionaryPanel';
import WylieGuide from './components/WylieGuide';
import GrammarGuide from './components/GrammarGuide';
import AboutPage from './components/AboutPage';
import PredictiveBar from './components/PredictiveBar';
import { Message, ChatSession, KeyboardMode } from './types';
import { TIBETAN_STRINGS, COMMON_TIBETAN_WORDS } from './constants';
import { generateStreamTibetanResponse, getDynamicExamplePrompts, isImageRequest, generateImage } from './services/geminiService';
import { ewtsToUnicode } from './utils/wylie';
import { checkTibetanSpelling, SpellResult } from './utils/spellChecker';

type ViewMode = 'chat' | 'about';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [inputValue, setInputValue] = useState('');
  const [wylieBuffer, setWylieBuffer] = useState('');
  const [keyboardMode, setKeyboardMode] = useState<KeyboardMode>('ewts');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isWylieGuideOpen, setIsWylieGuideOpen] = useState(false);
  const [isGrammarGuideOpen, setIsGrammarGuideOpen] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [dictionaryInitialTerm, setDictionaryInitialTerm] = useState<string | undefined>(undefined);
  const [spellResult, setSpellResult] = useState<SpellResult>({ isValid: true, errors: [], invalidSyllables: [] });
  const [examplePrompts, setExamplePrompts] = useState<string[]>(TIBETAN_STRINGS.examplePrompts);
  const [isRefreshingPrompts, setIsRefreshingPrompts] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (!hasLoadedRef.current) {
      const saved = localStorage.getItem('bod_skyad_sessions');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSessions(parsed);
            setActiveSessionId(parsed[0].id);
          }
        } catch (e) {
          console.error("Failed to parse sessions", e);
        }
      }
      hasLoadedRef.current = true;
      
      const cached = localStorage.getItem('bod_skyad_cached_prompts');
      const lastUpdate = localStorage.getItem('bod_skyad_last_prompt_update');
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      if (cached && lastUpdate && (now - parseInt(lastUpdate)) < oneDay) {
        try {
          const parsedCached = JSON.parse(cached);
          if (Array.isArray(parsedCached)) {
             setExamplePrompts(parsedCached.slice(0, 4));
          } else {
             refreshPrompts();
          }
        } catch (e) {
          refreshPrompts();
        }
      } else {
        refreshPrompts();
      }
    }
  }, []);

  useEffect(() => {
    if (hasLoadedRef.current) {
      localStorage.setItem('bod_skyad_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (keyboardMode !== 'english') {
      const result = checkTibetanSpelling(inputValue);
      setSpellResult(result);
    } else {
      setSpellResult({ isValid: true, errors: [], invalidSyllables: [] });
    }
  }, [inputValue, keyboardMode]);

  const refreshPrompts = async () => {
    setIsRefreshingPrompts(true);
    try {
      const newPrompts = await getDynamicExamplePrompts();
      const slicedPrompts = newPrompts.slice(0, 4);
      setExamplePrompts(slicedPrompts);
      localStorage.setItem('bod_skyad_cached_prompts', JSON.stringify(slicedPrompts));
      localStorage.setItem('bod_skyad_last_prompt_update', Date.now().toString());
    } catch (e) {
      console.error("Failed to refresh dynamic prompts:", e);
    } finally {
      setIsRefreshingPrompts(false);
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (viewMode === 'chat') {
      scrollToBottom();
    }
  }, [activeSessionId, sessions, viewMode, scrollToBottom]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  // Predictive Text Logic
  const suggestions = useMemo(() => {
    if (keyboardMode === 'english' || !inputValue) return [];
    
    // Get the last partial word (after last space, tsheg, or shad)
    const lastWordMatch = inputValue.match(/[^\u0F0B\u0F0D\s]+$/);
    const lastWord = lastWordMatch ? lastWordMatch[0] : "";
    
    if (lastWord.length < 1) return [];

    return COMMON_TIBETAN_WORDS.filter(w => 
      w.startsWith(lastWord) && w !== lastWord
    ).slice(0, 8);
  }, [inputValue, keyboardMode]);

  const handleSuggestionSelect = (word: string) => {
    const lastWordMatch = inputValue.match(/[^\u0F0B\u0F0D\s]+$/);
    if (lastWordMatch) {
      const index = lastWordMatch.index!;
      const newValue = inputValue.substring(0, index) + word + "་";
      setInputValue(newValue);
      
      if (keyboardMode === 'ewts') {
        setKeyboardMode('tibetan'); 
      }
    }
    textareaRef.current?.focus();
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: TIBETAN_STRINGS.newChat,
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setViewMode('chat');
    setIsSidebarOpen(false);
    setInputValue('');
    setWylieBuffer('');
  };

  const handleShowAbout = () => {
    setViewMode('about');
    setActiveSessionId(null);
    setIsSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setViewMode('chat');
    setIsSidebarOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (keyboardMode === 'ewts') {
      const lastConv = inputValue;
      let newBuffer = wylieBuffer;
      if (val.length < lastConv.length) {
        newBuffer = newBuffer.slice(0, -1);
      } else {
        const added = val.slice(lastConv.length);
        if (/[a-zA-Z0-9'\/\\\[\]+.~;: ]/.test(added)) {
          newBuffer += added;
        }
      }
      setWylieBuffer(newBuffer);
      setInputValue(ewtsToUnicode(newBuffer));
    } else if (keyboardMode === 'tibetan') {
      const convertedVal = val.replace(/ /g, '་');
      setInputValue(convertedVal);
      setWylieBuffer('');
    } else {
      setInputValue(val);
      setWylieBuffer('');
    }
  };

  const handleKeyPress = (key: string) => {
    if (keyboardMode === 'ewts') {
      const newBuffer = wylieBuffer + key;
      setWylieBuffer(newBuffer);
      setInputValue(ewtsToUnicode(newBuffer));
    } else {
      setInputValue(prev => prev + key);
    }
    textareaRef.current?.focus();
  };

  const handleBackspace = () => {
    if (keyboardMode === 'ewts') {
      const newBuffer = wylieBuffer.slice(0, -1);
      setWylieBuffer(newBuffer);
      setInputValue(ewtsToUnicode(newBuffer));
    } else {
      setInputValue(prev => prev.slice(0, -1));
    }
    textareaRef.current?.focus();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const currentPrompt = inputValue;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentPrompt,
      timestamp: Date.now(),
    };

    setInputValue('');
    setWylieBuffer('');
    setIsLoading(true);

    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: sessionId,
        title: currentPrompt.slice(0, 30) || TIBETAN_STRINGS.newChat,
        messages: [userMsg],
        createdAt: Date.now(),
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(sessionId);
    } else {
      setSessions(prev => prev.map(s => 
        s.id === sessionId 
          ? { ...s, messages: [...s.messages, userMsg], title: s.messages.length === 0 ? currentPrompt.slice(0, 30) : s.title } 
          : s
      ));
    }

    try {
      if (isImageMode || isImageRequest(currentPrompt)) {
        const imageUrl = await generateImage(currentPrompt);
        const modelMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: imageUrl ? "འདི་ནི་ཁྱེད་ཀྱིས་རེ་བ་ཞུས་པའི་པར་རིས་དེ་ཡིན།" : "པར་རིས་བཟོ་མ་ཐུབ།",
          timestamp: Date.now(),
          imageUrl: imageUrl || undefined
        };
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, modelMsg] } : s));
        setIsImageMode(false); 
      } else {
        const sessionToQuery = sessions.find(s => s.id === sessionId);
        const history = sessionToQuery 
          ? [...sessionToQuery.messages, userMsg].map(m => ({ role: m.role, parts: [{ text: m.content }] }))
          : [{ role: 'user' as const, parts: [{ text: currentPrompt }] }];

        const stream = generateStreamTibetanResponse(currentPrompt, history);
        let modelText = '';
        const modelMsgId = (Date.now() + 1).toString();
        
        for await (const chunk of stream) {
          modelText += chunk;
          setSessions(prev => prev.map(s => {
            if (s.id === sessionId) {
              const hasModelMsg = s.messages.some(m => m.id === modelMsgId);
              if (hasModelMsg) {
                return { ...s, messages: s.messages.map(m => m.id === modelMsgId ? { ...m, content: modelText } : m) };
              } else {
                return { ...s, messages: [...s.messages, { id: modelMsgId, role: 'model', content: modelText, timestamp: Date.now() }] };
              }
            }
            return s;
          }));
        }
      }
    } catch (err) {
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, { id: Date.now().toString(), role: 'model', content: TIBETAN_STRINGS.errorOccurred, timestamp: Date.now() }] } : s));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId: string, feedback: 'up' | 'down' | null) => {
    setSessions(prev => prev.map(s => ({ ...s, messages: s.messages.map(m => m.id === messageId ? { ...m, feedback } : m) })));
  };

  const handleSaveToDict = (content: string) => {
    const trimmed = content.trim();
    const words = trimmed.split(/[་།\s]+/);
    const term = (trimmed.length <= 15 || words.length <= 1) ? trimmed : words[0] + (trimmed.includes('་') ? '་' : '');
    setDictionaryInitialTerm(term);
    setIsDictionaryOpen(true);
  };

  const handleResetApp = () => {
    if (window.confirm(TIBETAN_STRINGS.resetConfirm)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen bg-[#fffcf9] overflow-hidden font-sans text-xl">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={(id) => setSessions(prev => prev.filter(s => s.id !== id))}
        onShowAbout={handleShowAbout}
        onResetApp={handleResetApp}
        isOpen={isSidebarOpen}
      />

      <main className="flex-1 flex flex-col relative min-w-0 bg-white">
        <header className="h-16 border-b border-red-50 glass-panel flex items-center justify-between px-6 sticky top-0 z-20">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 hover:bg-red-50 rounded-xl transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-1 flex justify-center md:justify-start">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-900 to-amber-600 bg-clip-text text-transparent">
              {TIBETAN_STRINGS.appTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWylieGuideOpen(true)}
              className="p-2.5 text-slate-400 hover:text-red-900 hover:bg-red-50 rounded-xl transition-all"
              title={TIBETAN_STRINGS.wylieGuide}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </button>
            <button
              onClick={() => setIsGrammarGuideOpen(true)}
              className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
              title={TIBETAN_STRINGS.grammarGuide}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </button>
            <button
              onClick={() => { setDictionaryInitialTerm(undefined); setIsDictionaryOpen(true); }}
              className="p-2.5 text-slate-400 hover:text-red-900 hover:bg-red-50 rounded-xl transition-all"
              title={TIBETAN_STRINGS.dictionary}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-red-50/10">
          {viewMode === 'about' ? (
            <AboutPage />
          ) : !activeSession || activeSession.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center pt-48 md:pt-56 pb-12 px-8 text-center max-w-5xl mx-auto overflow-y-visible relative">
              <div className="relative mb-16 animate-float shrink-0 z-10">
                <div className="absolute inset-0 bg-red-500 blur-[120px] opacity-15 rounded-full"></div>
                <div className="w-44 h-44 bg-gradient-to-br from-red-900 to-amber-700 rounded-[3rem] flex items-center justify-center text-white shadow-2xl shadow-red-200 relative overflow-hidden">
                  <span className="text-8xl md:text-9xl leading-none -mt-10 md:-mt-14">དྷྰི༔</span>
                </div>
              </div>
              <h3 className="text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight z-10">{TIBETAN_STRINGS.welcomeTitle}</h3>
              <p className="text-slate-500 max-w-2xl mb-14 text-2xl leading-relaxed font-medium Tibetan-text z-10">{TIBETAN_STRINGS.welcomeSubtitle}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full relative mb-12 z-10">
                {examplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setInputValue(prompt); textareaRef.current?.focus(); }}
                    className={`group p-6 bg-white border border-red-50 rounded-[2.2rem] hover:border-amber-200 hover:shadow-2xl transition-all text-left text-slate-700 font-medium text-xl leading-relaxed shadow-sm transform duration-300 hover:-translate-y-1 Tibetan-text ${isRefreshingPrompts ? 'opacity-50 blur-sm' : 'opacity-100'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-100 mt-3 group-hover:bg-red-900 transition-colors shrink-0"></div>
                      {prompt}
                    </div>
                  </button>
                ))}
                <button onClick={refreshPrompts} disabled={isRefreshingPrompts} className="absolute -top-16 right-4 p-3 text-slate-400 hover:text-red-900 hover:bg-red-50 rounded-full transition-all" title="Refresh">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 ${isRefreshingPrompts ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold tracking-widest uppercase animate-fade-in opacity-70 z-10">
                <span className="w-8 h-px bg-red-100"></span>
                {TIBETAN_STRINGS.examplePromptsNote}
                <span className="w-8 h-px bg-red-100"></span>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full p-6 md:p-10 pb-40">
              {activeSession.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} onFeedback={handleFeedback} onSaveToDict={handleSaveToDict} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-10 animate-pulse">
                  <div className="bg-white border border-red-50 px-8 py-6 rounded-[2rem] rounded-tl-none shadow-md flex items-center gap-5">
                    <div className="flex gap-2.5">
                      <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                    <span className="text-base text-slate-400 font-bold tracking-widest uppercase">{TIBETAN_STRINGS.loading}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {viewMode === 'chat' && (
          <div className="p-6 bg-transparent sticky bottom-0 z-20 pointer-events-none">
            <div className="max-w-4xl mx-auto space-y-4 pointer-events-auto">
              {!spellResult.isValid && keyboardMode !== 'english' && (
                <div className="animate-slide-up bg-red-50/90 backdrop-blur-md border border-red-100 p-4 rounded-[1.8rem] shadow-xl shadow-red-100/50">
                  <div className="flex items-center gap-3 mb-2 text-red-600 font-bold text-xs uppercase tracking-widest">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                    {TIBETAN_STRINGS.spellCheckFail}
                  </div>
                  <ul className="space-y-1">
                    {spellResult.errors.map((err, i) => (
                      <li key={i} className="text-red-700 text-base font-medium Tibetan-text pl-5 relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-300 rounded-full"></span>
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <PredictiveBar 
                suggestions={suggestions} 
                onSelect={handleSuggestionSelect} 
                isVisible={keyboardMode !== 'english'}
              />

              <div className="flex items-center justify-between px-3 bg-white/70 backdrop-blur-xl rounded-[1.5rem] p-2 border border-red-50 shadow-xl">
                <div className="flex items-center gap-2">
                  {(['tibetan', 'ewts', 'english'] as KeyboardMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setKeyboardMode(m)}
                      className={`text-[11px] px-4 py-2 rounded-xl font-bold transition-all ${keyboardMode === m ? 'bg-red-900 text-white shadow-lg' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}
                    >
                      {m === 'ewts' ? TIBETAN_STRINGS.kbEwts : m === 'tibetan' ? TIBETAN_STRINGS.kbTibetan : TIBETAN_STRINGS.kbEnglish}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsImageMode(!isImageMode)} 
                    className={`p-2.5 rounded-xl transition-all ${isImageMode ? 'bg-amber-100 text-amber-600 shadow-inner' : 'text-slate-400 hover:bg-red-50'}`}
                    title={TIBETAN_STRINGS.imageGen}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>

                  <button onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)} className={`p-2.5 rounded-xl transition-all ${showVirtualKeyboard ? 'bg-red-100 text-red-900 shadow-inner' : 'text-slate-400 hover:bg-red-50'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative group">
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                    placeholder={isImageMode ? TIBETAN_STRINGS.imageGenPlaceholder : (keyboardMode === 'ewts' ? TIBETAN_STRINGS.wyliePlaceholder : TIBETAN_STRINGS.inputPlaceholder)}
                    rows={1}
                    className={`w-full bg-white border ${isImageMode ? 'border-amber-200 ring-amber-50' : (!spellResult.isValid && keyboardMode !== 'english' ? 'border-red-200 ring-red-100' : 'border-red-100 ring-red-900/5')} focus:border-red-900 focus:ring-8 rounded-[2.5rem] py-6 pl-8 pr-20 text-2xl outline-none transition-all resize-none shadow-2xl Tibetan-text`}
                    style={{ minHeight: '84px' }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className={`absolute right-3.5 bottom-3.5 p-4 text-white rounded-[1.8rem] transition-all shadow-xl active:scale-90 ${isImageMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-900 hover:bg-red-800'} disabled:bg-slate-100 disabled:text-slate-300`}
                    aria-label="Send Message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </form>
              </div>

              {showVirtualKeyboard && (
                <div className="animate-slide-up">
                  <VirtualKeyboard mode={keyboardMode} onKeyPress={handleKeyPress} onBackspace={handleBackspace} />
                </div>
              )}
            </div>
          </div>
        )}

        <DictionaryPanel isOpen={isDictionaryOpen} onClose={() => setIsDictionaryOpen(false)} initialTerm={dictionaryInitialTerm} />
        <WylieGuide isOpen={isWylieGuideOpen} onClose={() => setIsWylieGuideOpen(false)} />
        <GrammarGuide isOpen={isGrammarGuideOpen} onClose={() => setIsGrammarGuideOpen(false)} />
      </main>
    </div>
  );
};

export default App;
