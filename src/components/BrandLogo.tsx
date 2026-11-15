import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  showSubline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  showWordmark = true,
  showSubline = false,
  className = '',
}) => {
  const dimensions =
    size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';

  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Circularity + Intelligence Mark */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${dimensions} shrink-0 drop-shadow-xs transition-transform duration-200 group-hover:scale-105`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="pxTealGradMark" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#19B5A5" />
            <stop offset="100%" stopColor="#0E8A7D" />
          </linearGradient>
          <linearGradient id="pxVioletGradMark" x1="22" y1="8" x2="34" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7667E8" />
            <stop offset="100%" stopColor="#19B5A5" />
          </linearGradient>
        </defs>

        {/* Adaptive Emblem Container */}
        <rect
          width="40"
          height="40"
          rx="10"
          fill={isDark ? '#1A2942' : '#111C2E'}
          stroke={isDark ? '#2C3E5B' : 'none'}
          strokeWidth={isDark ? '1' : '0'}
        />

        {/* Circularity Loop Arcs */}
        <path
          d="M20 7.5C13.0964 7.5 7.5 13.0964 7.5 20C7.5 26.2584 12.1003 31.4437 18.1 32.3563"
          stroke="url(#pxTealGradMark)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M20 32.5C26.9036 32.5 32.5 26.9036 32.5 20C32.5 13.7416 27.8997 8.55628 21.9 7.6437"
          stroke="url(#pxVioletGradMark)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Subtle Cycle Directional Tips */}
        <path
          d="M16.2 30.1L18.7 32.45L15.9 34.4"
          stroke="#19B5A5"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.8 9.9L21.3 7.55L24.1 5.6"
          stroke="#7667E8"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Architectural 'P' + Circularity 'X' Cross-Stroke */}
        <path
          d="M14.5 25.5V14.5H20.2C23.1 14.5 25.2 16.35 25.2 19C25.2 21.65 23.1 23.5 20.2 23.5H17.3"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.8 18.9L25.5 25.5"
          stroke="#19B5A5"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Precision Intelligence Node */}
        <circle cx="28" cy="14" r="1.75" fill="#19B5A5" />
      </svg>

      {showWordmark && (
        <div className="leading-none">
          <span
            className={`${textSize} font-extrabold tracking-tight font-['Space_Grotesk','Plus_Jakarta_Sans',sans-serif] ${
              isDark ? 'text-white' : 'text-[#111C2E]'
            }`}
          >
            Prithve<span className="text-[#19B5A5]">X</span>
          </span>
          {showSubline && (
            <span
              className={`block text-[10px] font-medium tracking-wide mt-0.5 ${
                isDark ? 'text-[#94A3B8]' : 'text-[#718096]'
              }`}
            >
              CIRCULAR INTELLIGENCE
            </span>
          )}
        </div>
      )}
    </div>
  );
};
