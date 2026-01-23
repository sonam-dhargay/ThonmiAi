
import React from 'react';
import { TIBETAN_STRINGS } from '../constants';
import Logo from './Logo';

const SupportPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-14 px-7 transition-colors duration-300">
      <div className="bg-white dark:bg-stone-800 rounded-[2.5rem] shadow-xl p-10 md:p-14 border border-red-50 dark:border-stone-700 relative transition-colors duration-300 text-center overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="p-6 bg-rose-50 dark:bg-rose-900/20 rounded-full shadow-inner animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-stone-100 mb-6 Tibetan-text">
            {TIBETAN_STRINGS.donationTitle}
          </h1>

          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xl text-slate-600 dark:text-stone-300 leading-relaxed Tibetan-text">
              {TIBETAN_STRINGS.donationDesc}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-stone-900/50 border border-red-50 dark:border-stone-700 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center gap-8 justify-center">
            <div className="flex flex-col items-center">
              <span className="text-xs font-black text-rose-500 uppercase tracking-widest mb-4">Support via</span>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center shadow-md">☕</div>
                <div className="w-16 h-16 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center shadow-md">PayPal</div>
                <div className="w-16 h-16 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center shadow-md">Stripe</div>
              </div>
            </div>
            
            <div className="h-px md:h-20 w-full md:w-px bg-red-100 dark:bg-stone-800"></div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2">Scan to Donate</span>
              <div className="w-24 h-24 bg-white p-2 rounded-xl shadow-lg">
                {/* Mock QR Code */}
                <div className="w-full h-full bg-slate-900 rounded flex items-center justify-center">
                   <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-red-900 rounded-[2rem] hover:bg-red-800 shadow-2xl shadow-red-900/20 active:scale-95 overflow-hidden"
            onClick={() => window.open('https://paypal.me/thonmiAI', '_blank')}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-950 via-red-800 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative flex items-center gap-3 Tibetan-text text-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {TIBETAN_STRINGS.donateNow}
            </span>
          </button>
          
          <div className="mt-14 opacity-40">
            <Logo className="w-16 h-16 mx-auto grayscale" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
