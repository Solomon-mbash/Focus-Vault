'use client';

import React, { useState, useEffect } from 'react';
import { MOTIVATION_QUOTES } from '@/constants/quotes';
import { RefreshCw, Flame, Copy, Check, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MotivationWall: React.FC = () => {
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
    <div className="relative w-full min-h-[170px] md:min-h-[210px] bg-[#070707] border-b border-red-600/30 flex flex-col justify-center px-6 md:px-12 py-8 overflow-hidden select-none">
      {/* Background Ambient Aura */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

      {/* Top Bar / Progress */}
      <div className="flex items-center justify-between z-10 mb-4 font-mono text-xs tracking-widest text-neutral-400">
        <div className="flex items-center space-x-2.5">
          <div className="p-1 bg-red-950/80 border border-red-800/80 rounded text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <span className="font-extrabold text-red-500 uppercase tracking-widest text-[11px]">
            MOTIVATION SLAP FORCEFIELD
          </span>
          <span className="hidden sm:inline text-neutral-600">&bull;</span>
          <span className="hidden sm:inline text-[10px] text-neutral-500">
            NO EXCUSES ALLOWED
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Index indicator */}
          <div className="flex items-center space-x-1.5 bg-neutral-900/90 border border-neutral-800 px-3 py-1 rounded text-[11px]">
            <span className="text-white font-bold">{quoteIndex + 1}</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-500">{MOTIVATION_QUOTES.length}</span>
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopyQuote}
            className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded transition-colors"
            title="Copy quote"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Shuffle button */}
          <button
            onClick={handleNextQuote}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded flex items-center space-x-1.5 shadow-[0_0_15px_rgba(239,68,68,0.25)] transition-colors text-[11px]"
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
          <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight uppercase font-sans border-l-4 border-red-600 pl-5 py-1 text-neutral-100 drop-shadow-md">
            "{currentQuote}"
          </h1>
        </motion.div>
      </AnimatePresence>

      {/* Obsidian Tagline Footer */}
      <div className="z-10 mt-4 flex items-center justify-between font-mono text-[10px] text-neutral-500 border-t border-neutral-900 pt-2">
        <div>// FOCUS VAULT CORE RULE &bull; DISCIPLINE OVER MOTIVATION</div>
        <div className="hidden md:block text-neutral-600">PRESS SHUFFLE FOR NEXT DIRECTIVE</div>
      </div>
    </div>
  );
};
