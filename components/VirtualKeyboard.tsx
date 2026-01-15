
import React, { useState } from 'react';
import { TIBETAN_VIRTUAL_KEYS, TIBETAN_SUBJOINED_KEYS, ENGLISH_VIRTUAL_KEYS } from '../utils/wylie';
import { KeyboardMode } from '../types';

interface VirtualKeyboardProps {
  mode: KeyboardMode;
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ mode, onKeyPress, onBackspace }) => {
  const [isShifted, setIsShifted] = useState(false);

  const getLayout = () => {
    if (mode === 'english') {
      return ENGLISH_VIRTUAL_KEYS.map(row => 
        isShifted ? row.map(key => key.toUpperCase()) : row
      );
    }
    return isShifted ? TIBETAN_SUBJOINED_KEYS : TIBETAN_VIRTUAL_KEYS;
  };

  const currentLayout = getLayout();
  const isEnglish = mode === 'english';

  return (
    <div className="bg-red-50/60 dark:bg-stone-950/60 backdrop-blur-2xl p-1.5 md:p-4 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/50 dark:border-stone-800 mt-2 flex flex-col gap-0.5 md:gap-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-black/50 max-w-full overflow-hidden select-none animate-slide-up transition-colors duration-300">
      {currentLayout.map((row, i) => (
        <div key={i} className="flex justify-center gap-0.5 md:gap-2">
          {((!isEnglish && i === 2) || (isEnglish && i === 2)) && (
            <button
              type="button"
              onClick={() => setIsShifted(!isShifted)}
              className={`w-9 h-10 md:w-20 md:h-16 border-2 rounded-lg md:rounded-[1.2rem] flex items-center justify-center text-[10px] md:text-xs font-bold transition-all shadow-md active:scale-95 shrink-0 ${
                isShifted 
                ? 'bg-red-900 dark:bg-red-700 border-red-950 dark:border-red-800 text-white shadow-red-100 dark:shadow-red-900/20' 
                : 'bg-white dark:bg-stone-800 border-red-50 dark:border-stone-700 text-red-800 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-stone-700/50'
              }`}
            >
              {isEnglish ? '↑' : 'སྒྱུར།'}
            </button>
          )}

          {row.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                onKeyPress(key);
                if (isShifted && !isEnglish) setIsShifted(false);
              }}
              className={`min-w-[24px] h-10 md:min-w-[48px] md:h-16 bg-white dark:bg-stone-800 border border-red-50 dark:border-stone-700 rounded-lg md:rounded-[1.2rem] flex items-center justify-center text-lg md:text-2xl font-medium transition-all shadow-sm active:scale-90 hover:shadow-lg dark:hover:shadow-black/40 hover:border-amber-100 dark:hover:border-amber-900/50 flex-1 max-w-[60px] text-slate-800 dark:text-stone-100`}
            >
              {key}
            </button>
          ))}

          {((!isEnglish && i === 3) || (isEnglish && i === 2)) && (
            <button
              type="button"
              onClick={onBackspace}
              className="w-9 h-10 md:w-20 md:h-16 bg-red-100/80 dark:bg-red-900/40 hover:bg-orange-600 dark:hover:bg-red-600 hover:text-white border border-red-200/40 dark:border-red-900/20 rounded-lg md:rounded-[1.2rem] flex items-center justify-center text-red-900 dark:text-red-400 active:scale-95 transition-all shadow-md shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414A2 2 0 0010.828 19H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            </button>
          )}
        </div>
      ))}
      
      <div className="flex justify-center gap-1.5 md:gap-3 px-1 md:px-3 mt-0.5">
        <button
          type="button"
          onClick={() => onKeyPress(' ')}
          className={`h-10 md:h-16 bg-white/95 dark:bg-stone-800 border border-red-50 dark:border-stone-700 rounded-lg md:rounded-[1.2rem] flex items-center justify-center text-slate-400 dark:text-stone-500 hover:bg-white dark:hover:bg-stone-700 hover:shadow-xl shadow-md active:scale-[0.98] transition-all font-bold text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.25em] ${isEnglish ? 'w-52 md:w-96' : 'w-36 md:w-64'}`}
        >
          {isEnglish ? 'Space' : 'བར་སྟོང་།'}
        </button>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
