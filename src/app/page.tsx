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
      <div className="min-h-screen bg-neutral-950 text-white font-mono flex items-center justify-center">
        <div className="flex items-center space-x-3 text-red-500 font-bold tracking-widest text-sm">
          <span className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
          <span>INITIALIZING FOCUS VAULT EXECUTION PRISON...</span>
        </div>
      </div>
    );
  }

  return (
    <main
      className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
        isLight
          ? 'bg-[#F8FAFC] text-[#0F172A] selection:bg-[#4946FF] selection:text-white'
          : 'bg-[#0A0A0A] text-[#E5E5E5] selection:bg-red-900 selection:text-white'
      }`}
    >
      {/* FEATURE 4: MOTIVATION WALL (Top 30% of screen, shows on EVERY open) */}
      <MotivationWall />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'board' && (
            <motion.div
              key="board"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Pomodoro Execution Prison Clock */}
              <PomodoroTimer />

              {/* Daily Execution Board */}
              <TaskBoard />

              {/* Daily Evening Reflection Checklist (4 Questions) */}
              <DailyReflectionSection />

              {/* Focus Formula & Evening Review & 30-Day Heatmap */}
              <FocusFormulaSection />
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <TradeJournal />
            </motion.div>
          )}

          {activeTab === 'later' && (
            <motion.div
              key="later"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <LaterList />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer
        className={`w-full py-6 text-center text-xs font-mono border-t transition-colors ${
          isLight
            ? 'bg-white border-slate-200 text-slate-500'
            : 'bg-neutral-950 border-neutral-900 text-neutral-600'
        }`}
      >
        <div>FOCUS VAULT &bull; SINGLE PURPOSE EXECUTION ENGINE</div>
        <div className={`mt-1 text-[10px] ${isLight ? 'text-slate-400' : 'text-neutral-700'}`}>
          "only i want is: discipline & focus. And Not more information."
        </div>
      </footer>
    </main>
  );
}
