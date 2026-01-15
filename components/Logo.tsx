
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`${className} flex items-center justify-center select-none`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="haloGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="syllableGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b91c1c" /> {/* Vibrant Crimson */}
            <stop offset="100%" stopColor="#7f1d1d" /> {/* Deep Maroon */}
          </linearGradient>

          {/* Sharp drop shadow instead of heavy blur */}
          <filter id="sharpShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feOffset in="SourceAlpha" dx="0.5" dy="1" result="offset" />
            <feGaussianBlur in="offset" stdDeviation="0.4" result="blur" />
            <feComponentTransfer in="blur" result="shadow">
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Halo Bloom */}
        <circle cx="50" cy="50" r="45" fill="url(#haloGradient)" />

        {/* Stylized Tibetan Seed Syllable 'Dhih' (དྷཱིཿ) */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="url(#syllableGradient)"
          filter="url(#sharpShadow)"
          className="font-bold"
          style={{ 
            fontSize: '62px', 
            fontFamily: "'Noto Sans Tibetan', 'Microsoft Himalaya', 'Jomolhari', sans-serif",
            paintOrder: 'stroke',
            stroke: 'rgba(255,255,255,0.1)',
            strokeWidth: '0.5px'
          }}
        >
          དྷཱིཿ
        </text>

        {/* Decorative elements representing the 'flame' of wisdom */}
        <g opacity="0.3" fill="#b91c1c">
          <path d="M 50,15 C 52,10 48,10 50,5 C 52,10 54,12 50,15" />
          <path d="M 85,50 C 90,52 90,48 95,50 C 90,52 88,54 85,50" transform="rotate(90, 85, 50)" />
        </g>
      </svg>
    </div>
  );
};

export default Logo;
