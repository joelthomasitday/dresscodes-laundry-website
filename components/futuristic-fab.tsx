"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

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
    
    // Magnetic pull
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const pullFactor = 0.15;
    setMousePos({ x: distanceX * pullFactor, y: distanceY * pullFactor });
  };

  const resetMousePos = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div 
      className={cn(
        "fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[70] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100 pointer-events-auto"
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMousePos}
      onMouseEnter={() => setIsHovered(true)}
    >
      {/* Subtle Outer Pulse */}
      <div className="absolute inset-[-15px] rounded-full bg-emerald-500/10 blur-2xl animate-breathing opacity-40" />

      <button
        ref={buttonRef}
        onClick={onClick}
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(${isHovered ? 1.05 : 1})`,
        }}
        className={cn(
          "relative h-[70px] w-[70px] rounded-full flex items-center justify-center transition-transform duration-200 ease-out",
          "group overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)]",
          "bg-gradient-to-br from-[#134e43] via-[#0F3F36] to-[#0a2e28] border border-white/10"
        )}
      >
        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-40" />
        
        {/* Minimal Content: Sparkle Icon + AI Label */}
        <div className="relative z-10 flex flex-col items-center justify-center -gap-0.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          </svg>
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-50 drop-shadow-sm ml-0.5">
            AI
          </span>
        </div>

        {/* High-end Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-150%] skew-x-[-25deg] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
      </button>

      <style jsx>{`
        @keyframes breathing {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
        .animate-breathing {
          animation: breathing 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
