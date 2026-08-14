'use client';

import React, { useState, useEffect } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { MotivationWall } from '@/components/MotivationWall';
import { Navbar } from '@/components/Navbar';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { TaskBoard } from '@/components/TaskBoard';
import { DailyReflectionSection } from '@/components/DailyReflectionSection';
import { FocusFormulaSection } from '@/components/FocusFormulaSection';
import { TradeJournal } from '@/components/TradeJournal';
import { LaterList } from '@/components/LaterList';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { activeTab, theme, fetchDatabaseData } = useFocusStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const isLight = theme === 'light';

  // Hydration & SQLite Database Sync on mount
  useEffect(() => {
    setIsHydrated(true);
    fetchDatabaseData();
  }, [fetchDatabaseData]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white font-mono flex items-center justify-center">
        <div className="flex items-center space-x-3 text-neutral-400 font-semibold tracking-wider text-xs">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span>INITIALIZING FOCUS VAULT...</span>
        </div>
      </div>
    );
  }

  return (
    <main
      className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${
        isLight
          ? 'bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-900 selection:text-white'
          : 'bg-[#09090B] text-neutral-100 selection:bg-neutral-100 selection:text-neutral-900'
      }`}
    >
      {/* MOTIVATION DIRECTIVE (Top strip) */}
      <MotivationWall />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-6 md:py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'board' && (
            <motion.div
              key="board"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
            >
              {/* Pomodoro Focus Clock */}
              <PomodoroTimer />

              {/* Daily Execution Board */}
              <TaskBoard />

              {/* Daily Evening Reflection */}
              <DailyReflectionSection />

              {/* Focus Formula & 30-Day Heatmap */}
              <FocusFormulaSection />
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <TradeJournal />
            </motion.div>
          )}

          {activeTab === 'later' && (
            <motion.div
              key="later"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <LaterList />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Minimal Footer */}
      <footer
        className={`w-full py-6 text-center text-xs font-mono border-t transition-colors ${
          isLight
            ? 'bg-white border-neutral-200/80 text-neutral-400'
            : 'bg-[#09090B] border-neutral-800/80 text-neutral-600'
        }`}
      >
        <div>FOCUS VAULT &bull; SINGLE PURPOSE EXECUTION ENGINE</div>
        <div className={`mt-0.5 text-[10px] ${isLight ? 'text-neutral-400' : 'text-neutral-600'}`}>
          discipline &bull; focus &bull; execution
        </div>
      </footer>
    </main>
  );
}
