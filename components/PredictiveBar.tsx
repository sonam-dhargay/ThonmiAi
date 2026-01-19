
import React from 'react';

interface PredictiveBarProps {
  suggestions: string[];
  onSelect: (word: string) => void;
  isVisible: boolean;
}

const PredictiveBar: React.FC<PredictiveBarProps> = ({ suggestions, onSelect, isVisible }) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 no-scrollbar bg-transparent rounded-2xl mb-1 animate-fade-in transition-colors duration-300">
      {suggestions.map((word, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(word)}
          className="whitespace-nowrap px-4 py-2 bg-white/80 dark:bg-stone-800/80 backdrop-blur-md hover:bg-amber-50 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-300 font-bold rounded-2xl shadow-sm hover:shadow-md border border-red-50/50 dark:border-stone-700/50 transition-all active:scale-95 Tibetan-text text-base"
        >
          {word}
        </button>
      ))}
    </div>
  );
};

export default PredictiveBar;
