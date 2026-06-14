"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fade out at 2.0 seconds
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 2000);

    // Completely remove splash at 2.4 seconds
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!showSplash) return <>{children}</>;

  return (
    <>
      <div 
        className="transition-opacity duration-500 ease-in-out"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 9999,
          backgroundColor: 'var(--bg-deep)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          opacity: fade ? 0 : 1,
          pointerEvents: fade ? 'none' : 'auto'
        }}
      >
        {/* Deep ambient glow in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/20 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
        
        {/* Center Logo Animation */}
        <div className="relative flex flex-col items-center justify-center animate-bounce">
          <Logo className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] shadow-[0_0_50px_rgba(249,115,22,0.4)] rounded-[25%]" />
        </div>
        
        {/* F.Lavash Text */}
        <h1 className="mt-6 text-[32px] font-black text-white tracking-tight drop-shadow-md animate-fade-in">
          F.Lavash
        </h1>
        
        {/* Loading Bar */}
        <div className="mt-8 w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full animate-progress"></div>
        </div>
        
        <style jsx>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: progress 2s ease-in-out forwards;
          }
        `}</style>
      </div>
      
      {/* The main app content renders normally underneath the splash screen */}
      {children}
    </>
  );
}

