'use client';

import React, { useState, useEffect } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { MOTIVATION_QUOTES } from '@/constants/quotes';
import { RefreshCw, Flame, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MotivationWall: React.FC = () => {
  const { theme } = useFocusStore();
  const isLight = theme === 'light';
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Pick random quote index on mount
    const randomIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    setQuoteIndex(randomIndex);
  }, []);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATION_QUOTES.length);
  };

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(MOTIVATION_QUOTES[quoteIndex]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentQuote = MOTIVATION_QUOTES[quoteIndex];

  return (
    <div
      className={`relative w-full min-h-[170px] md:min-h-[210px] flex flex-col justify-center px-6 md:px-12 py-8 overflow-hidden select-none transition-colors duration-300 border-b ${
        isLight
          ? 'bg-gradient-to-r from-indigo-50/90 via-white to-indigo-50/90 border-slate-200 text-slate-900'
          : 'bg-[#070707] border-red-600/30 text-white'
      }`}
    >
      {/* Background Ambient Aura */}
      <div
        className={`absolute -top-24 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isLight ? 'bg-[#4946FF]/10' : 'bg-red-600/10'
        }`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

      {/* Top Bar / Progress */}
      <div
        className={`flex items-center justify-between z-10 mb-4 font-mono text-xs tracking-widest ${
          isLight ? 'text-slate-500' : 'text-neutral-400'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div
            className={`p-1 border rounded ${
              isLight
                ? 'bg-[#4946FF]/10 border-[#4946FF]/30 text-[#4946FF]'
                : 'bg-red-950/80 border-red-800/80 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
            }`}
          >
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <span className={`font-extrabold uppercase tracking-widest text-[11px] ${isLight ? 'text-[#4946FF]' : 'text-red-500'}`}>
            MOTIVATION SLAP FORCEFIELD
          </span>
          <span className={`hidden sm:inline ${isLight ? 'text-slate-300' : 'text-neutral-600'}`}>&bull;</span>
          <span className={`hidden sm:inline text-[10px] ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
            NO EXCUSES ALLOWED
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Index indicator */}
          <div
            className={`flex items-center space-x-1.5 border px-3 py-1 rounded text-[11px] ${
              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-neutral-900/90 border-neutral-800 text-neutral-400'
            }`}
          >
            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{quoteIndex + 1}</span>
            <span className={isLight ? 'text-slate-300' : 'text-neutral-600'}>/</span>
            <span className={isLight ? 'text-slate-400' : 'text-neutral-500'}>{MOTIVATION_QUOTES.length}</span>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopyQuote}
            className={`p-1.5 border rounded transition-colors cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-600'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Copy quote"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Shuffle button */}
          <button
            onClick={handleNextQuote}
            className={`px-3 py-1 text-white font-bold rounded flex items-center space-x-1.5 transition-colors text-[11px] cursor-pointer shadow-md ${
              isLight
                ? 'bg-[#4946FF] hover:bg-[#3B38EC] shadow-[#4946FF]/20'
                : 'bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
            }`}
            title="Shuffle Slap Quote"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">NEXT SLAP</span>
          </button>
        </div>
      </div>

      {/* Quote Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, y: 10, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.99 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="z-10 max-w-6xl"
        >
          <h1
            className={`text-xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight uppercase font-sans border-l-4 pl-5 py-1 ${
              isLight
                ? 'border-[#4946FF] text-slate-900'
                : 'border-red-600 text-neutral-100 drop-shadow-md'
            }`}
          >
            "{currentQuote}"
          </h1>
        </motion.div>
      </AnimatePresence>

      {/* Tagline Footer */}
      <div
        className={`z-10 mt-4 flex items-center justify-between font-mono text-[10px] border-t pt-2 ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-neutral-900 text-neutral-500'
        }`}
      >
        <div>// FOCUS VAULT CORE RULE &bull; DISCIPLINE OVER MOTIVATION</div>
        <div className={`hidden md:block ${isLight ? 'text-slate-400' : 'text-neutral-600'}`}>PRESS SHUFFLE FOR NEXT DIRECTIVE</div>
      </div>
    </div>
  );
};
