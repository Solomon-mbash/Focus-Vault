'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { format } from 'date-fns';
import {
  CheckCircle2,
  Trophy,
  Lightbulb,
  AlertOctagon,
  Target,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DailyReflectionSection: React.FC = () => {
  const { dayLogs, submitDailyReflection } = useFocusStore();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const currentTodayLog = dayLogs[todayStr];
  const initialReflection = currentTodayLog?.reflection || {
    accomplished: '',
    learned: '',
    wentWrong: '',
    tomorrowPriority: '',
  };

  const [accomplished, setAccomplished] = useState(initialReflection.accomplished);
  const [learned, setLearned] = useState(initialReflection.learned);
  const [wentWrong, setWentWrong] = useState(initialReflection.wentWrong);
  const [tomorrowPriority, setTomorrowPriority] = useState(initialReflection.tomorrowPriority);
  const [saved, setSaved] = useState(!!currentTodayLog?.reflection);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitDailyReflection(todayStr, {
      accomplished: accomplished.trim(),
      learned: learned.trim(),
      wentWrong: wentWrong.trim(),
      tomorrowPriority: tomorrowPriority.trim(),
    });
    setSaved(true);
  };

  return (
    <div className="w-full bg-[#111111] border border-neutral-800 p-6 rounded-xl space-y-6 shadow-xl relative overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>DAILY EXECUTION REVIEW & RECAP</span>
          </div>
          <h3 className="text-lg font-mono font-bold text-white mt-0.5 flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-red-500" />
            <span>DAILY REFLECTION CHECKLIST</span>
          </h3>
        </div>

        {saved && (
          <span className="px-3 py-1 bg-emerald-950/90 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold rounded-lg flex items-center space-x-1.5 shadow-inner">
            <CheckCircle2 className="w-4 h-4" />
            <span>SAVED FOR TODAY</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Question 1: Accomplished */}
          <div className="bg-neutral-950/80 border border-neutral-800/90 p-4 rounded-xl space-y-2 focus-within:border-emerald-500/80 transition-colors">
            <label className="block text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>1. WHAT DID I ACCOMPLISH?</span>
            </label>
            <textarea
              rows={3}
              placeholder="List key tasks completed, features shipped, trades executed..."
              value={accomplished}
              onChange={(e) => {
                setAccomplished(e.target.value);
                setSaved(false);
              }}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs font-sans text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Question 2: Learned */}
          <div className="bg-neutral-950/80 border border-neutral-800/90 p-4 rounded-xl space-y-2 focus-within:border-amber-500/80 transition-colors">
            <label className="block text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              <span>2. WHAT DID I LEARN?</span>
            </label>
            <textarea
              rows={3}
              placeholder="Technical insights, market structure takeaways, productivity discoveries..."
              value={learned}
              onChange={(e) => {
                setLearned(e.target.value);
                setSaved(false);
              }}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs font-sans text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Question 3: Went Wrong */}
          <div className="bg-neutral-950/80 border border-neutral-800/90 p-4 rounded-xl space-y-2 focus-within:border-red-500/80 transition-colors">
            <label className="block text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-red-500 shrink-0" />
              <span>3. WHAT WENT WRONG?</span>
            </label>
            <textarea
              rows={3}
              placeholder="Distractions, FOMO trades, broken focus blocks, time leaks..."
              value={wentWrong}
              onChange={(e) => {
                setWentWrong(e.target.value);
                setSaved(false);
              }}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs font-sans text-white placeholder-neutral-600 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Question 4: Tomorrow's #1 Priority */}
          <div className="bg-neutral-950/80 border border-neutral-800/90 p-4 rounded-xl space-y-2 focus-within:border-blue-500/80 transition-colors">
            <label className="block text-xs font-mono font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-400 shrink-0" />
              <span>4. WHAT IS TOMORROW'S #1 PRIORITY?</span>
            </label>
            <textarea
              rows={3}
              placeholder="Single most vital P1 target to tackle first thing tomorrow..."
              value={tomorrowPriority}
              onChange={(e) => {
                setTomorrowPriority(e.target.value);
                setSaved(false);
              }}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs font-sans text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
          <div className="text-xs font-mono text-neutral-500">
            Review every evening to lock in continuous daily discipline.
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase rounded-lg tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-colors cursor-pointer"
          >
            SAVE DAILY REFLECTION
          </button>
        </div>
      </form>
    </div>
  );
};
