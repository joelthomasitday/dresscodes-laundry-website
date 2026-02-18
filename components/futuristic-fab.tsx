"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface FuturisticFabProps {
  onClick: () => void;
  isOpen: boolean;
}

export function FuturisticFab({ onClick, isOpen }: FuturisticFabProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Smooth magnetic pull
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const pullFactor = 0.12;
    setMousePos({ x: distanceX * pullFactor, y: distanceY * pullFactor });
  };

  const resetMousePos = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 sm:bottom-10 sm:right-10 z-[70] transition-all duration-500 ease-premium-ease",
        isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100 pointer-events-auto"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMousePos}
      onMouseEnter={() => setIsHovered(true)}
    >
      {/* Soft Cute Glow */}
      <div className={cn(
        "absolute inset-[-20px] rounded-full bg-[#008c5b]/15 blur-2xl transition-opacity duration-700",
        isHovered ? "opacity-70" : "opacity-30"
      )} />

      <button
        ref={buttonRef}
        onClick={onClick}
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(${isHovered ? 1.1 : 1})`,
        }}
        className={cn(
          "relative h-14 w-14 sm:h-16 sm:w-16 rounded-[18px] sm:rounded-[22px] flex items-center justify-center transition-all duration-500",
          "group overflow-hidden shadow-[0_8px_30px_rgba(0,140,91,0.2)] hover:shadow-[0_15px_45px_rgba(0,140,91,0.35)]",
          "bg-gradient-to-br from-[#008c5b] via-[#00a86b] to-[#008c5b] border-2 border-white/30"
        )}
      >
        {/* Playful Floating Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-3 right-4 w-2 h-2 rounded-full bg-white/10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        </div>
        
        {/* Cute Mascot Icon */}
        <div className="relative z-10 flex flex-col items-center justify-center transform transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-md">
            {/* Friendly Bot Head */}
            <rect x="4" y="6" width="16" height="12" rx="4" className="fill-white/10 stroke-white" strokeWidth="1.5" />
            {/* Happy Eyes */}
            <circle cx="9" cy="11" r="1" fill="white" className="group-hover:scale-y-50 transition-transform" />
            <circle cx="15" cy="11" r="1" fill="white" className="group-hover:scale-y-50 transition-transform" />
            {/* Cute Smile */}
            <path d="M10 14.5C10.5 15.2 11.2 15.5 12 15.5C12.8 15.5 13.5 15.2 14 14.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
            {/* Small Antenna/Sparkle */}
            <line x1="12" y1="3" x2="12" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="3" r="1" fill="white" className="animate-pulse" />
          </svg>
        </div>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none" />
      </button>

      {/* Cute Label */}
      <div className={cn(
        "mt-2 flex justify-center transition-all duration-500 transform pointer-events-none",
        isHovered ? "translate-y-0 opacity-100" : "translate-y-0.5 opacity-90"
      )}>
        <div className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md border border-[#008c5b]/20 shadow-sm flex items-center gap-1 ring-1 ring-[#008c5b]/10">
          <div className="w-1 h-1 rounded-full bg-[#008c5b] animate-ping" />
          <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.15em] text-[#008c5b]">
            Sparky AI
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .group:hover .relative {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
