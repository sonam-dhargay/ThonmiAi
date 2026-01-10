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
    <div className="bg-slate-200/60 backdrop-blur-2xl p-3 md:p-4 rounded-[2.5rem] border border-white/50 mt-3 flex flex-col gap-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] max-w-full overflow-hidden select-none animate-slide-up">
      {currentLayout.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5 md:gap-2">
          {((!isEnglish && i === 2) || (isEnglish && i === 2)) && (
            <button
              type="button"
              onClick={() => setIsShifted(!isShifted)}
              className={`w-14 h-12 md:w-20 md:h-16 border-2 rounded-[1.2rem] flex items-center justify-center text-xs font-bold transition-all shadow-md active:scale-95 shrink-0 ${
                isShifted 
                ? 'bg-indigo-600 border-indigo-700 text-white shadow-indigo-100' 
                : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
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
              className={`min-w-[34px] h-12 md:min-w-[48px] md:h-16 bg-white border border-slate-100 rounded-[1.2rem] flex items-center justify-center text-2xl font-medium transition-all shadow-sm active:scale-90 hover:shadow-lg hover:border-indigo-100 flex-1 max-w-[60px] text-slate-800`}
            >
              {key}
            </button>
          ))}

          {((!isEnglish && i === 3) || (isEnglish && i === 2)) && (
            <button
              type="button"
              onClick={onBackspace}
              className="w-14 h-12 md:w-20 md:h-16 bg-slate-300/80 hover:bg-red-500 hover:text-white border border-slate-300/40 rounded-[1.2rem] flex items-center justify-center text-slate-600 active:scale-95 transition-all shadow-md shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414A2 2 0 0010.828 19H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            </button>
          )}
        </div>
      ))}
      
      <div className="flex justify-center gap-3 px-3">
        <button
          type="button"
          onClick={() => onKeyPress(' ')}
          className={`h-12 md:h-16 bg-white/95 border border-slate-100 rounded-[1.2rem] flex items-center justify-center text-slate-400 hover:bg-white hover:shadow-xl shadow-md active:scale-[0.98] transition-all font-bold text-xs uppercase tracking-[0.25em] ${isEnglish ? 'w-64 md:w-96' : 'w-48 md:w-64'}`}
        >
          {isEnglish ? 'Space' : 'བར་སྟོང་།'}
        </button>
      </div>
    </div>
  );
};

export default VirtualKeyboard;