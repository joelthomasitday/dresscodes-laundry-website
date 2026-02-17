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
          "relative h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300",
          "group overflow-hidden shadow-lg hover:shadow-xl",
          "bg-[#0F3F36] border border-white/10"
        )}
      >
        {/* Subtle Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent" />
        
        {/* Minimal Content: Sparkle Icon + AI Label */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <Sparkles className="h-6 w-6 text-white" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 -mt-0.5">
            AI
          </span>
        </div>

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
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
