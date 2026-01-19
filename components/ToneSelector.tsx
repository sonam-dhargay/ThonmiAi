
import React, { useState, useRef, useEffect } from 'react';
import { Tone } from '../types';
import { TIBETAN_STRINGS } from '../constants';

interface ToneOption {
  value: Tone;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface ToneSelectorProps {
  value: Tone;
  onChange: (tone: Tone) => void;
}

const TONE_OPTIONS: ToneOption[] = [
  {
    value: 'neutral',
    label: TIBETAN_STRINGS.tones.neutral,
    color: 'text-slate-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.2" />
      </svg>
    )
  },
  {
    value: 'formal',
    label: TIBETAN_STRINGS.tones.formal,
    color: 'text-red-900 dark:text-red-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    )
  },
  {
    value: 'informal',
    label: TIBETAN_STRINGS.tones.informal,
    color: 'text-amber-600 dark:text-amber-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    value: 'humorous',
    label: TIBETAN_STRINGS.tones.humorous,
    color: 'text-orange-600 dark:text-orange-500',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    )
  }
];

const ToneSelector: React.FC<ToneSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption = TONE_OPTIONS.find(o => o.value === value) || TONE_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-2 bg-white/70 dark:bg-stone-800/70 backdrop-blur-md border border-red-50 dark:border-stone-700 rounded-xl transition-all hover:border-red-200 dark:hover:border-red-900/50 shadow-sm active:scale-95 ${isOpen ? 'ring-2 ring-red-100 dark:ring-red-900/30' : ''}`}
      >
        <div className={`${activeOption.color}`}>
          {activeOption.icon}
        </div>
        <span className="text-[11px] md:text-xs font-bold Tibetan-text text-slate-700 dark:text-stone-200 whitespace-nowrap hidden xs:inline">
          {activeOption.label}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 sm:left-0 mb-3 w-48 bg-white/95 dark:bg-stone-800/95 backdrop-blur-xl border border-red-100 dark:border-stone-700 rounded-2xl shadow-2xl shadow-red-200/50 dark:shadow-black/70 overflow-hidden z-[100] animate-slide-up ring-1 ring-black/5 dark:ring-white/5">
          <div className="p-1.5 flex flex-col gap-1">
            {TONE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all text-left group ${
                  value === option.value
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-950 dark:text-red-400'
                    : 'text-slate-600 dark:text-stone-400 hover:bg-red-50/50 dark:hover:bg-stone-700/50'
                }`}
              >
                <div className={`${option.color} group-hover:scale-110 transition-transform`}>
                  {option.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold Tibetan-text leading-tight">{option.label}</span>
                </div>
                {value === option.value && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-auto h-4 w-4 text-red-900 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToneSelector;
