
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`${className} flex items-center justify-center select-none relative group`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="wisdomGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#800000" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#800000" />
          </linearGradient>

          {/* Enhanced Red Neon Glow Filter */}
          <filter id="neonWisdom" x="-50%" y="-50%" width="200%" height="200%">
            {/* Primary soft glow */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur1" />
            <feFlood floodColor="#ef4444" floodOpacity="0.6" result="glowColor1" />
            <feComposite in="glowColor1" in2="blur1" operator="in" result="softGlow" />
            
            {/* Inner intense glow */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" result="blur2" />
            <feFlood floodColor="#ffffff" floodOpacity="0.4" result="glowColor2" />
            <feComposite in="glowColor2" in2="blur2" operator="in" result="innerGlow" />
            
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="innerGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Halo */}
        <circle cx="50" cy="50" r="45" fill="url(#wisdomGlow)" className="animate-pulse" />
        
        {/* Luminous Decorative Ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          fill="none" 
          stroke="#ef4444" 
          strokeWidth="0.75" 
          strokeDasharray="1 3" 
          opacity="0.5"
          className="animate-spin-slow"
        />

        {/* The Seed Syllable Dhih (དྷཱིཿ) with Red Neon Styling */}
        <text
          x="50%"
          y="52%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="url(#neonGradient)"
          className="wisdom-syllable neon-text"
          style={{ 
            fontSize: '56px', 
            fontWeight: 'bold',
            fontFamily: "'Noto Sans Tibetan', 'Microsoft Himalaya', 'Jomolhari', sans-serif",
            filter: 'url(#neonWisdom)'
          }}
        >
          དྷཱིཿ
        </text>

        {/* Shimmering Red Corner Accents */}
        <g opacity="0.4" fill="#ef4444">
           <circle cx="50" cy="8" r="1.8" className="animate-pulse" />
           <circle cx="50" cy="92" r="1.8" className="animate-pulse" />
           <circle cx="8" cy="50" r="1.8" className="animate-pulse" />
           <circle cx="92" cy="50" r="1.8" className="animate-pulse" />
        </g>
      </svg>
      <style>{`
        @keyframes subtleWisdomPulse {
          0%, 100% { 
            transform: scale(1); 
            filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.4)) url(#neonWisdom);
          }
          50% { 
            transform: scale(1.03); 
            filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.7)) url(#neonWisdom);
          }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
          transform-origin: center;
        }
        .wisdom-syllable {
          animation: subtleWisdomPulse 3s ease-in-out infinite;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .group:hover .wisdom-syllable {
           fill: #fff;
           filter: drop-shadow(0 0 15px rgba(239, 68, 68, 1)) drop-shadow(0 0 30px rgba(239, 68, 68, 0.5));
        }
        .neon-text {
          /* Additional CSS-based glow for browser consistency */
          text-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Logo;
