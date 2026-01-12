
import React from 'react';

interface PredictiveBarProps {
  suggestions: string[];
  onSelect: (word: string) => void;
  isVisible: boolean;
}

const PredictiveBar: React.FC<PredictiveBarProps> = ({ suggestions, onSelect, isVisible }) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-4 no-scrollbar bg-white/40 dark:bg-stone-900/40 backdrop-blur-md rounded-2xl border border-red-50 dark:border-stone-800 shadow-inner mb-2 animate-fade-in transition-colors duration-300">
      {suggestions.map((word, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(word)}
          className="whitespace-nowrap px-5 py-2.5 bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-amber-700 dark:text-amber-400 font-bold rounded-xl shadow-sm hover:shadow-md border border-amber-50 dark:border-stone-700 transition-all active:scale-95 Tibetan-text text-base"
        >
          {word}
        </button>
      ))}
    </div>
  );
};

export default PredictiveBar;
