import React from 'react';

interface VmsLogoProps {
  className?: string;
  customUrl?: string;
}

export const VmsLogo: React.FC<VmsLogoProps> = ({ className = "w-14 h-14", customUrl }) => {
  if (customUrl) {
    return (
      <img 
        src={customUrl} 
        alt="Company Logo" 
        className={`${className} object-contain rounded-full shadow-sm`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className={`${className} relative inline-flex items-center justify-center rounded-full select-none overflow-hidden bg-[#11100c] shadow-sm shrink-0`}>
      {/* Sunburst subtle background */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
        <g stroke="#D4AF37" strokeWidth="0.8">
          {[...Array(24)].map((_, i) => {
            const angle = (i * 360) / 24;
            return (
              <line 
                key={i}
                x1="50" 
                y1="50" 
                x2={50 + 44 * Math.cos((angle * Math.PI) / 180)} 
                y2={50 + 44 * Math.sin((angle * Math.PI) / 180)}
              />
            );
          })}
        </g>
      </svg>

      {/* VMS Text */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <span className="font-extrabold tracking-wider text-[#D4AF37] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] text-base sm:text-lg leading-none font-serif">
          VMS
        </span>
      </div>
    </div>
  );
};

