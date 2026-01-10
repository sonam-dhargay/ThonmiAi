
import React from 'react';

interface PredictiveBarProps {
  suggestions: string[];
  onSelect: (word: string) => void;
  isVisible: boolean;
}

const PredictiveBar: React.FC<PredictiveBarProps> = ({ suggestions, onSelect, isVisible }) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-4 no-scrollbar bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-inner mb-2 animate-fade-in">
      {suggestions.map((word, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(word)}
          className="whitespace-nowrap px-5 py-2.5 bg-white hover:bg-indigo-50 text-indigo-700 font-bold rounded-xl shadow-sm hover:shadow-md border border-indigo-50 transition-all active:scale-95 Tibetan-text text-base"
        >
          {word}
        </button>
      ))}
    </div>
  );
};

export default PredictiveBar;
