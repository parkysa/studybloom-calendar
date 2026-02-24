import { Cat } from 'lucide-react';

const CatMascot = ({ className = "", size = 120 }: { className?: string; size?: number }) => {
  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cat ears */}
        <path d="M55 85 L40 30 L80 65 Z" fill="hsl(var(--bloom-pink))" stroke="hsl(var(--bloom-pink-dark))" strokeWidth="2"/>
        <path d="M145 85 L160 30 L120 65 Z" fill="hsl(var(--bloom-pink))" stroke="hsl(var(--bloom-pink-dark))" strokeWidth="2"/>
        {/* Inner ears */}
        <path d="M58 78 L48 40 L75 68 Z" fill="hsl(var(--bloom-pink-light))"/>
        <path d="M142 78 L152 40 L125 68 Z" fill="hsl(var(--bloom-pink-light))"/>
        {/* Head */}
        <circle cx="100" cy="110" r="60" fill="hsl(var(--bloom-pink-light))" stroke="hsl(var(--bloom-pink))" strokeWidth="2"/>
        {/* Eyes */}
        <ellipse cx="78" cy="105" rx="8" ry="10" fill="hsl(var(--foreground))"/>
        <ellipse cx="122" cy="105" rx="8" ry="10" fill="hsl(var(--foreground))"/>
        {/* Eye shine */}
        <circle cx="82" cy="101" r="3" fill="white"/>
        <circle cx="126" cy="101" r="3" fill="white"/>
        {/* Nose */}
        <ellipse cx="100" cy="118" rx="4" ry="3" fill="hsl(var(--bloom-pink-dark))"/>
        {/* Mouth */}
        <path d="M92 122 Q100 130 108 122" stroke="hsl(var(--bloom-pink-dark))" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Whiskers */}
        <line x1="50" y1="112" x2="72" y2="115" stroke="hsl(var(--bloom-pink-dark))" strokeWidth="1" strokeLinecap="round"/>
        <line x1="50" y1="120" x2="72" y2="120" stroke="hsl(var(--bloom-pink-dark))" strokeWidth="1" strokeLinecap="round"/>
        <line x1="128" y1="115" x2="150" y2="112" stroke="hsl(var(--bloom-pink-dark))" strokeWidth="1" strokeLinecap="round"/>
        <line x1="128" y1="120" x2="150" y2="120" stroke="hsl(var(--bloom-pink-dark))" strokeWidth="1" strokeLinecap="round"/>
        {/* Cheeks */}
        <circle cx="70" cy="125" r="8" fill="hsl(var(--bloom-pink))" opacity="0.3"/>
        <circle cx="130" cy="125" r="8" fill="hsl(var(--bloom-pink))" opacity="0.3"/>
        {/* Flower on head */}
        <circle cx="135" cy="65" r="8" fill="hsl(var(--bloom-pink))"/>
        <circle cx="135" cy="65" r="4" fill="hsl(var(--bloom-yellow))"/>
      </svg>
    </div>
  );
};

export default CatMascot;
