'use client';

import React, { useState, useEffect } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { MOTIVATION_QUOTES } from '@/constants/quotes';
import { RefreshCw, Copy, Check, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MotivationWall: React.FC = () => {
  const { theme } = useFocusStore();
  const isLight = theme === 'light';
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
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
      className={`w-full transition-colors duration-200 border-b ${
        isLight
          ? 'bg-neutral-50/70 border-neutral-200/80 text-neutral-900'
          : 'bg-[#09090B] border-neutral-800/80 text-neutral-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Quote Content */}
        <div className="flex items-start space-x-3.5 flex-1 min-w-0">
          <div
            className={`p-2 rounded-lg shrink-0 transition-colors ${
              isLight
                ? 'bg-white border border-neutral-200/80 text-neutral-600 shadow-xs'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider uppercase mb-1">
              <span className={isLight ? 'text-neutral-400 font-semibold' : 'text-neutral-500 font-semibold'}>
                Daily Directive
              </span>
              <span className={isLight ? 'text-neutral-300' : 'text-neutral-700'}>&bull;</span>
              <span className={`text-[10px] ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {quoteIndex + 1}/{MOTIVATION_QUOTES.length}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <p className="text-sm md:text-base font-medium tracking-tight leading-relaxed">
                  "{currentQuote}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 shrink-0 self-end md:self-center">
          <button
            onClick={handleCopyQuote}
            className={`p-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-neutral-100 border-neutral-200/90 text-neutral-600 shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400'
            }`}
            title="Copy Quote"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleNextQuote}
            className={`px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors cursor-pointer flex items-center space-x-1.5 ${
              isLight
                ? 'bg-white hover:bg-neutral-100 border-neutral-200/90 text-neutral-700 shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
            }`}
            title="Next Directive"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};
