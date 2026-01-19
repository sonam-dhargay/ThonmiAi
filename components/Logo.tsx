
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
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#800000" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff7b7b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>

          {/* Sharpened Neon Glow Filter */}
          <filter id="neonWisdom" x="-20%" y="-20%" width="140%" height="140%">
            {/* Reduced outer blur for sharpness */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur1" />
            <feFlood floodColor="#ef4444" floodOpacity="0.8" result="glowColor1" />
            <feComposite in="glowColor1" in2="blur1" operator="in" result="softGlow" />
            
            {/* Very tight inner glow for crisp edges */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.3" result="blur2" />
            <feFlood floodColor="#ffffff" floodOpacity="0.5" result="glowColor2" />
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
          strokeWidth="0.5" 
          strokeDasharray="1 3" 
          opacity="0.4"
          className="animate-spin-slow"
        />

        {/* The Seed Syllable Dhih (དྷཱིཿ) - Sharpened */}
        <text
          x="50%"
          y="52%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="url(#neonGradient)"
          className="wisdom-syllable neon-text"
          textRendering="optimizeLegibility"
          style={{ 
            fontSize: '56px', 
            fontWeight: 'bold',
            fontFamily: "'Noto Sans Tibetan', 'Microsoft Himalaya', 'Jomolhari', sans-serif",
            filter: 'url(#neonWisdom)',
            // Removing CSS text-shadow which often causes blur in some browsers
          }}
        >
          དྷཱིཿ
        </text>

        {/* Shimmering Red Corner Accents */}
        <g opacity="0.3" fill="#ef4444">
           <circle cx="50" cy="8" r="1.5" className="animate-pulse" />
           <circle cx="50" cy="92" r="1.5" className="animate-pulse" />
           <circle cx="8" cy="50" r="1.5" className="animate-pulse" />
           <circle cx="92" cy="50" r="1.5" className="animate-pulse" />
        </g>
      </svg>
      <style>{`
        @keyframes subtleWisdomPulse {
          0%, 100% { 
            transform: scale(1); 
            filter: drop-shadow(0 0 3px rgba(239, 68, 68, 0.4)) url(#neonWisdom);
          }
          50% { 
            transform: scale(1.02); 
            filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6)) url(#neonWisdom);
          }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
          transform-origin: center;
        }
        .wisdom-syllable {
          animation: subtleWisdomPulse 4s ease-in-out infinite;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .group:hover .wisdom-syllable {
           fill: #ffffff;
           filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.9));
        }
        .neon-text {
          /* Tightening the shadow for clarity */
          text-shadow: 0 0 2px rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Logo;
