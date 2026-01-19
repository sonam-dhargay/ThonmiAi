
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`${className} flex items-center justify-center select-none relative group`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="neonHalo" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#ff4d00" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff4d00" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#fff7ed" />
            <stop offset="100%" stopColor="#ffedd5" />
          </linearGradient>

          <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur" />
            <feFlood floodColor="#ff4d00" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx="50" cy="50" r="48" fill="url(#neonHalo)" className="animate-pulse" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#ff4d00" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.2" />

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="url(#electricGradient)"
          className="neon-text"
          style={{ 
            fontSize: '60px', 
            fontWeight: 'bold',
            fontFamily: "'Noto Sans Tibetan', 'Microsoft Himalaya', 'Jomolhari', sans-serif",
            stroke: '#ff4d00',
            strokeWidth: '1px',
            filter: 'url(#outerGlow)'
          }}
        >
          དྷཱིཿ
        </text>

        <g opacity="0.6">
           <rect x="49" y="5" width="2" height="10" rx="1" fill="#ff4d00" />
           <rect x="85" y="49" width="10" height="2" rx="1" fill="#ff4d00" opacity="0.4" />
           <rect x="5" y="49" width="10" height="2" rx="1" fill="#ff4d00" opacity="0.4" />
        </g>
      </svg>
      <style>{`
        @keyframes neonPulse {
          0%, 100% { filter: drop-shadow(0 0 2px #ff4d00) drop-shadow(0 0 5px #ff4d00) drop-shadow(0 0 10px #ff4d00); opacity: 0.95; }
          50% { filter: drop-shadow(0 0 4px #ff4d00) drop-shadow(0 0 8px #ff4d00) drop-shadow(0 0 15px #ff4d00); opacity: 1; }
        }
        .neon-text {
          animation: neonPulse 3s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        .group:hover .neon-text {
           animation: neonPulse 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Logo;
