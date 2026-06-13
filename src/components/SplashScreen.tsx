"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fade out at 2.2 seconds
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 2200);

    // Completely remove splash at 2.6 seconds
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2600);

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
          backgroundColor: '#000000',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          opacity: fade ? 0 : 1,
          pointerEvents: fade ? 'none' : 'auto'
        }}
      >
        {/* Deep ambient glow in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        {/* Top spacer */}
        <div className="flex-1"></div>

        {/* Center Logo Animation */}
        <div className="relative flex flex-col items-center justify-center animate-pulse">
          <Logo className="w-[120px] h-[120px] transition-transform duration-1000 scale-100" />
        </div>

        {/* Bottom Partners / Sponsors Area */}
        <div className="flex-1 flex items-end w-full pb-14 justify-center relative z-10">
          <div className="flex items-center gap-12 opacity-80">
            {/* Fake Partner 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <span className="text-white text-[12px] font-bold italic">O</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#8e93a6] font-medium">OshXona</span>
            </div>

            {/* Fake Partner 2 (Like the Government seal in the screenshot) */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-blue-500 flex items-center justify-center border border-white/20">
                <span className="text-white text-[10px] font-bold">UZ</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-[#8e93a6] font-medium text-center leading-tight">Taomlar<br/>Agentligi</span>
            </div>

            {/* Fake Partner 3 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <div className="w-4 h-4 rounded-full border-2 border-red-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#8e93a6] font-medium">PayNet</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* The main app content renders normally underneath the splash screen */}
      {children}
    </>
  );
}
