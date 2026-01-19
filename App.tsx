
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import VirtualKeyboard from './components/VirtualKeyboard';
import DictionaryPanel from './components/DictionaryPanel';
import WylieGuide from './components/WylieGuide';
import GrammarGuide from './components/GrammarGuide';
import AboutPage from './components/AboutPage';
import WhyPage from './components/WhyPage';
import HowPage from './components/HowPage';
import PredictiveBar from './components/PredictiveBar';
import Logo from './components/Logo';
import ToneSelector from './components/ToneSelector';
import { Message, ChatSession, KeyboardMode, Tone } from './types';
import { TIBETAN_STRINGS, COMMON_TIBETAN_WORDS, TIBETAN_STARTERS, TIBETAN_PARTICLES } from './constants';
import { generateStreamTibetanResponse, getDynamicExamplePrompts, isImageRequest, generateImage, generateChatTitle } from './services/geminiService';
import { ewtsToUnicode } from './utils/wylie';
import { checkTibetanSpelling, SpellResult } from './utils/spellChecker';

type ViewMode = 'chat' | 'about' | 'why' | 'how';
type ThemeMode = 'light' | 'dark';

interface User {
  name: string;
}

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [user, setUser] = useState<User | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [wylieBuffer, setWylieBuffer] = useState('');
  const [keyboardMode, setKeyboardMode] = useState<KeyboardMode>('tibetan');
  const [responseTone, setResponseTone] = useState<Tone>('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isWylieGuideOpen, setIsWylieGuideOpen] = useState(false);
  const [isGrammarGuideOpen, setIsGrammarGuideOpen] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const [hasSelectedKey, setHasSelectedKey] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [dictionaryInitialTerm, setDictionaryInitialTerm] = useState<string | undefined>(undefined);
  const [spellResult, setSpellResult] = useState<SpellResult>({ isValid: true, errors: [], invalidSyllables: [] });
  const [examplePrompts, setExamplePrompts] = useState<string[]>(TIBETAN_STRINGS.examplePrompts);
  const [isRefreshingPrompts, setIsRefreshingPrompts] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const hasLoadedRef = useRef(false);

  const checkKeyStatus = async () => {
    try {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        const hasKey = await aistudio.hasSelectedApiKey();
        setHasSelectedKey(hasKey);
        return hasKey;
      }
    } catch (e) {
      console.error("Failed to check API key status", e);
    }
    return false;
  };

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const handleOpenKeySelection = async () => {
    try {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        await aistudio.openSelectKey();
        setHasSelectedKey(true);
      }
    } catch (e) {
      console.error("Failed to open key selection", e);
    }
  };

  const handlePermissionDenied = (sessionId: string) => {
    setHasSelectedKey(false);
    const modelMsg: Message = {
      id: Date.now().toString(),
      role: 'model',
      content: "ནོར་འཁྲུལ་བྱུང་སོང་། ཁྱེད་ལ་ལས་འགན་འདི་བསྒྲུབ་པའི་ཆོག་མཆན་མི་འདུག ཟུར་གྱི་ཐོ་གཞུང་ནང་ནས་ API Key འདེམས་རོགས།",
      timestamp: Date.now(),
    };
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, modelMsg] } : s));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('bod_skyad_theme') as ThemeMode | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bod_skyad_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

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
    const result = checkTibetanSpelling(inputValue);
    setSpellResult(result);
  }, [inputValue]);

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
    setShowScrollButton(false);
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 200;
      setShowScrollButton(isFarFromBottom);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (viewMode === 'chat') {
      scrollToBottom();
    }
  }, [activeSessionId, sessions, viewMode, scrollToBottom]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const suggestions = useMemo(() => {
    if (!inputValue) {
      return TIBETAN_STARTERS.slice(0, 8);
    }
    
    if (inputValue.endsWith('་')) {
      return TIBETAN_PARTICLES.slice(0, 8);
    }

    const lastWordMatch = inputValue.match(/[^\u0F0B\u0F0D\s]+$/);
    const lastWord = lastWordMatch ? lastWordMatch[0] : "";
    if (lastWord.length < 1) return [];

    return COMMON_TIBETAN_WORDS.filter(w => 
      w.startsWith(lastWord) && w !== lastWord
    ).slice(0, 8);
  }, [inputValue]);

  const handleSuggestionSelect = (word: string) => {
    const lastWordMatch = inputValue.match(/[^\u0F0B\u0F0D\s]+$/);
    if (lastWordMatch) {
      const index = lastWordMatch.index!;
      const newValue = inputValue.substring(0, index) + word + (word.endsWith('་') ? '' : '་');
      setInputValue(newValue);
      if (keyboardMode === 'ewts') {
        setKeyboardMode('tibetan'); 
      }
    } else {
      const newValue = inputValue + word + (word.endsWith('་') ? '' : '་');
      setInputValue(newValue);
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

  const handleShowWhy = () => {
    setViewMode('why');
    setActiveSessionId(null);
    setIsSidebarOpen(false);
  };

  const handleShowHow = () => {
    setViewMode('how');
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
    } else {
      const convertedVal = val.replace(/ /g, '་');
      setInputValue(convertedVal);
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

  const handleClearInput = () => {
    setInputValue('');
    setWylieBuffer('');
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
    let isNewSession = false;

    if (!sessionId) {
      isNewSession = true;
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
      const session = sessions.find(s => s.id === sessionId);
      if (session && session.messages.length === 0) {
        isNewSession = true;
      }
      setSessions(prev => prev.map(s => 
        s.id === sessionId 
          ? { ...s, messages: [...s.messages, userMsg], title: s.messages.length === 0 ? currentPrompt.slice(0, 30) : s.title } 
          : s
      ));
    }

    if (isNewSession) {
      generateChatTitle(currentPrompt).then(newTitle => {
        if (newTitle === "PERMISSION_DENIED") return;
        setSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, title: newTitle } : s
        ));
      });
    }

    try {
      const wantsImage = isImageRequest(currentPrompt);
      if (wantsImage) {
        try {
          const imageUrl = await generateImage(currentPrompt);
          if (imageUrl) {
            const modelMsg: Message = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              content: "འདི་ནི་ཁྱེད་ཀྱིས་རེ་བ་ཞུས་པའི་པར་རིས་དེ་ཡིན།",
              timestamp: Date.now(),
              imageUrl: imageUrl
            };
            setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, modelMsg] } : s));
          } else {
            const modelMsg: Message = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              content: "པར་རིས་བཟོ་མ་ཐུབ། སླར་ཡང་གནང་རོགས།",
              timestamp: Date.now(),
            };
            setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, modelMsg] } : s));
          }
        } catch (imgErr: any) {
          if (imgErr.message === "PERMISSION_DENIED") {
            handlePermissionDenied(sessionId!);
          } else {
            throw imgErr;
          }
        }
        setIsImageMode(false); 
      } else {
        const sessionToQuery = sessions.find(s => s.id === sessionId);
        const history = sessionToQuery 
          ? [...sessionToQuery.messages, userMsg].map(m => ({ role: m.role, parts: [{ text: m.content }] }))
          : [{ role: 'user' as const, parts: [{ text: currentPrompt }] }];
        const stream = generateStreamTibetanResponse(currentPrompt, history, responseTone);
        let modelText = '';
        const modelMsgId = (Date.now() + 1).toString();
        for await (const chunk of stream) {
          if (chunk === "PERMISSION_DENIED") {
            handlePermissionDenied(sessionId!);
            return;
          }
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
    } catch (err: any) {
      console.error(err);
      if (err.message === "PERMISSION_DENIED") {
        handlePermissionDenied(sessionId!);
      } else {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, { id: Date.now().toString(), role: 'model', content: TIBETAN_STRINGS.errorOccurred, timestamp: Date.now() }] } : s));
      }
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

  const handleMockLogin = () => {
    const name = window.prompt("ཁྱེད་ཀྱི་མཚན་ལ་ཅི་ཟེར། (Enter your name):", "བཀྲ་ཤིས");
    if (name) {
      setUser({ name });
      setIsSidebarOpen(false);
      setViewMode('chat');
      if (!activeSession || activeSession.messages.length > 0) {
        setActiveSessionId(null);
      }
    }
  };

  const handleMockSignup = () => {
    const name = window.prompt("ཁྱེད་ཀྱི་མཚན་ལ་ཅི་ཟེར། (Enter your name):", "");
    if (name) {
      setUser({ name });
      setIsSidebarOpen(false);
      setViewMode('chat');
      setActiveSessionId(null);
      alert(`${name}ལགས། ཐོན་མི་AI ཡི་ཁོངས་སུ་ཕེབས་པར་དགའ་བསུ་ཞུ།`);
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'about': return <AboutPage />;
      case 'why': return <WhyPage />;
      case 'how': return <HowPage />;
      default:
        return !activeSession || activeSession.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center pt-2 md:pt-6 pb-8 px-6 text-center max-w-5xl mx-auto overflow-y-visible relative animate-fade-in">
            <div className="relative mb-2 md:mb-4 animate-float shrink-0 z-10">
              <div className="absolute inset-0 bg-red-800 blur-[40px] opacity-5 rounded-full"></div>
              <Logo className="w-16 h-16 md:w-20 md:h-20 drop-shadow-md relative z-10 transition-all duration-500" />
            </div>
            <h3 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-stone-100 mb-1 md:mb-2 tracking-tight leading-tight z-10 transition-all Tibetan-text animate-slide-down">
              {user ? `${user.name}ལགས། ${TIBETAN_STRINGS.welcomeTitle}` : TIBETAN_STRINGS.welcomeTitle}
            </h3>
            <p className="text-slate-500 dark:text-stone-400 max-w-2xl mb-4 md:mb-8 text-base md:text-lg leading-relaxed font-medium Tibetan-text z-10 transition-all">
              {TIBETAN_STRINGS.welcomeSubtitle}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full relative mb-6 md:mb-12 z-10">
              {examplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => { setInputValue(prompt); textareaRef.current?.focus(); }}
                  className={`group p-4 md:p-5 bg-white dark:bg-stone-800 border border-red-50 dark:border-stone-700 rounded-[1.8rem] md:rounded-[2rem] hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-2xl transition-all text-left text-slate-700 dark:text-stone-300 font-medium text-lg md:text-xl leading-relaxed shadow-sm transform duration-300 hover:-translate-y-1 Tibetan-text ${isRefreshingPrompts ? 'opacity-50 blur-sm' : 'opacity-100'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-100 dark:bg-red-900/40 mt-3 group-hover:bg-red-900 dark:group-hover:bg-red-400 transition-colors shrink-0"></div>
                    {prompt}
                  </div>
                </button>
              ))}
              <button onClick={refreshPrompts} disabled={isRefreshingPrompts} className="absolute -top-10 md:-top-12 right-0 md:right-4 p-2.5 text-slate-400 hover:text-red-900 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-stone-800 rounded-full transition-all" title="Refresh">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 md:h-6 md:w-6 ${isRefreshingPrompts ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full p-6 md:p-10 pb-48">
            {activeSession.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onFeedback={handleFeedback} onSaveToDict={handleSaveToDict} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-10 animate-pulse">
                <div className="bg-white dark:bg-stone-800 border border-red-50 dark:border-stone-700 px-8 py-6 rounded-[2rem] rounded-tl-none shadow-md flex items-center gap-5">
                  <div className="flex gap-2.5">
                    <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  </div>
                  <span className="text-base text-slate-400 dark:text-stone-500 font-bold tracking-widest uppercase">{TIBETAN_STRINGS.loading}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#fffcf9] dark:bg-stone-950 overflow-hidden font-sans text-xl transition-colors duration-300">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={(id) => setSessions(prev => prev.filter(s => s.id !== id))}
        onShowAbout={handleShowAbout}
        onShowWhy={handleShowWhy}
        onShowHow={handleShowHow}
        onResetApp={handleResetApp}
        onLogin={handleMockLogin}
        onSignup={handleMockSignup}
        onOpenKeySelection={handleOpenKeySelection}
        isOpen={isSidebarOpen}
        isLoggedIn={!!user}
        hasSelectedKey={hasSelectedKey}
      />

      <main className="flex-1 flex flex-col relative min-w-0 bg-white dark:bg-stone-900 transition-colors duration-300">
        <header className="h-16 border-b border-red-50 dark:border-stone-800 glass-panel flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 hover:bg-red-50 dark:hover:bg-stone-800 rounded-xl transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-900 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-900 to-amber-600 dark:from-red-400 dark:to-amber-400 bg-clip-text text-transparent">
              {TIBETAN_STRINGS.appTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 text-slate-400 hover:text-red-900 dark:hover:text-amber-400 hover:bg-red-50 dark:hover:bg-stone-800 rounded-xl transition-all"
              title="Theme Toggle"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsWylieGuideOpen(true)}
              className="p-2.5 text-slate-400 hover:text-red-900 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-stone-800 rounded-xl transition-all"
              title={TIBETAN_STRINGS.wylieGuide}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </button>
            <button
              onClick={() => setIsGrammarGuideOpen(true)}
              className="p-2.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-stone-800 rounded-xl transition-all"
              title={TIBETAN_STRINGS.tenseChart}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </button>
            <button
              onClick={() => { setDictionaryInitialTerm(undefined); setIsDictionaryOpen(true); }}
              className="p-2.5 text-slate-400 hover:text-red-900 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-stone-800 rounded-xl transition-all"
              title={TIBETAN_STRINGS.dictionary}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </button>
          </div>
        </header>

        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto relative custom-scrollbar bg-red-50/10 dark:bg-stone-900 transition-colors duration-300"
        >
          {renderContent()}
          
          {viewMode === 'chat' && (
            <button
              onClick={scrollToBottom}
              className={`fixed right-8 md:right-12 bottom-32 md:bottom-40 p-3.5 rounded-full bg-white/70 dark:bg-stone-800/70 backdrop-blur-xl border border-red-50/50 dark:border-stone-700 shadow-2xl transition-all duration-500 transform z-40 hover:scale-110 active:scale-90 ${
                showScrollButton ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
              }`}
              aria-label="Scroll to bottom"
            >
              <div className="bg-gradient-to-br from-red-900 to-amber-600 dark:from-red-600 dark:to-amber-500 p-1 rounded-full shadow-inner animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </button>
          )}
        </div>

        {viewMode === 'chat' && (
          <div className="p-4 md:p-6 bg-transparent sticky bottom-0 z-20 pointer-events-none">
            <div className="max-w-4xl mx-auto space-y-3 pointer-events-auto flex flex-col">
              {!spellResult.isValid && (
                <div className="animate-slide-up bg-red-50/90 dark:bg-stone-900/90 backdrop-blur-md border border-red-100 dark:border-red-900/30 p-4 rounded-[1.8rem] shadow-xl shadow-red-100/50 dark:shadow-black/50 mb-2">
                  <div className="flex items-center gap-3 mb-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-widest">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                    {TIBETAN_STRINGS.spellCheckFail}
                  </div>
                  <ul className="space-y-1">
                    {spellResult.errors.map((err, i) => (
                      <li key={i} className="text-red-700 dark:text-red-300 text-base font-medium Tibetan-text pl-5 relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-300 dark:bg-red-700 rounded-full"></span>
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="order-1 flex items-center justify-between px-3 bg-white/70 dark:bg-stone-800/70 backdrop-blur-xl rounded-[1.5rem] p-2 border border-red-50 dark:border-stone-700 shadow-xl transition-colors duration-300 relative">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[50%] sm:max-w-none">
                  {(['tibetan', 'ewts'] as KeyboardMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setKeyboardMode(m)}
                      className={`text-[10px] md:text-[11px] px-3 md:px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${keyboardMode === m ? 'bg-red-900 dark:bg-red-700 text-white shadow-lg' : 'text-slate-500 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-700'}`}
                    >
                      {m === 'ewts' ? TIBETAN_STRINGS.kbEwts : TIBETAN_STRINGS.kbTibetan}
                    </button>
                  ))}
                  <div className="h-6 w-px bg-red-100 dark:bg-stone-700 mx-1 hidden sm:block"></div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-stone-500 uppercase tracking-tighter whitespace-nowrap hidden sm:inline mr-1">{TIBETAN_STRINGS.toneLabel}</span>
                    <ToneSelector value={responseTone} onChange={setResponseTone} />
                  </div>
                  
                  <div className="h-6 w-px bg-red-100 dark:bg-stone-700 mx-1"></div>

                  <div className="flex items-center gap-1 md:gap-2 shrink-0">
                    <button 
                      onClick={() => setIsImageMode(!isImageMode)} 
                      className={`p-2 md:p-2.5 rounded-xl transition-all ${isImageMode ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shadow-inner' : 'text-slate-400 hover:bg-red-50 dark:hover:bg-stone-700'}`}
                      title={TIBETAN_STRINGS.imageGen}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)} className={`p-2 md:p-2.5 rounded-xl transition-all ${showVirtualKeyboard ? 'bg-red-100 dark:bg-stone-700 text-red-900 dark:text-stone-100 shadow-inner' : 'text-slate-400 hover:bg-red-50 dark:hover:bg-stone-700'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v8a2 2 0 00-2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="order-2">
                <PredictiveBar 
                  suggestions={suggestions} 
                  onSelect={handleSuggestionSelect} 
                  isVisible={true}
                />
              </div>

              <div className="relative group order-3">
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                    placeholder={isImageMode ? TIBETAN_STRINGS.imageGenPlaceholder : (keyboardMode === 'ewts' ? TIBETAN_STRINGS.wyliePlaceholder : TIBETAN_STRINGS.inputPlaceholder)}
                    rows={1}
                    className={`w-full bg-white dark:bg-stone-800 border ${isImageMode ? 'border-amber-200 dark:border-amber-700' : (!spellResult.isValid ? 'border-red-200 dark:border-red-900/50' : 'border-red-100 dark:border-stone-700')} focus:border-red-900 dark:focus:border-red-600 focus:ring-4 md:focus:ring-8 rounded-[2rem] md:rounded-[2.5rem] py-4 md:py-6 pl-6 md:pl-8 pr-24 md:pr-32 text-xl md:text-2xl dark:text-stone-100 outline-none transition-all resize-none shadow-2xl Tibetan-text`}
                    style={{ minHeight: '64px', maxHeight: '200px' }}
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={handleClearInput}
                      className="absolute right-14 md:right-20 bottom-3 md:bottom-4.5 p-2 text-slate-400 hover:text-red-600 dark:text-stone-500 dark:hover:text-red-400 transition-all rounded-full hover:bg-red-50 dark:hover:bg-stone-700/50"
                      title="Clear"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className={`absolute right-2 md:right-3.5 bottom-2 md:bottom-3.5 p-3 md:p-4 text-white rounded-[1.4rem] md:rounded-[1.8rem] transition-all shadow-xl active:scale-90 ${isImageMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-red-900 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600'} disabled:bg-slate-100 dark:disabled:bg-stone-800 disabled:text-slate-300`}
                    aria-label="Send Message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </form>
              </div>

              {showVirtualKeyboard && (
                <div className="animate-slide-up order-4">
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
