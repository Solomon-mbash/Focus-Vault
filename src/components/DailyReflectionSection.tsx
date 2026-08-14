'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { format } from 'date-fns';
import {
  CheckCircle2,
  Trophy,
  Lightbulb,
  AlertCircle,
  Target,
} from 'lucide-react';

export const DailyReflectionSection: React.FC = () => {
  const { dayLogs, submitDailyReflection, theme } = useFocusStore();
  const isLight = theme === 'light';
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
    <div
      className={`w-full rounded-2xl p-6 md:p-7 space-y-6 transition-colors duration-200 border ${
        isLight
          ? 'bg-white border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-neutral-900'
          : 'bg-[#101014] border-neutral-800/80 text-neutral-100 shadow-xl'
      }`}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-neutral-200/60 dark:border-neutral-800/60">
        <div>
          <div className={`text-[11px] font-mono uppercase tracking-wider ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Evening Routine
          </div>
          <h3 className="text-lg font-bold tracking-tight mt-0.5">
            Daily Reflection
          </h3>
        </div>

        {saved && (
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium rounded-md flex items-center space-x-1.5 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Saved Today</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Question 1: Accomplished */}
          <div
            className={`p-4 rounded-xl border transition-colors ${
              isLight
                ? 'bg-neutral-50/70 border-neutral-200/80 focus-within:border-neutral-400'
                : 'bg-neutral-900/60 border-neutral-800 focus-within:border-neutral-700'
            }`}
          >
            <label className="block text-xs font-semibold uppercase tracking-wide mb-2 flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
              <Trophy className="w-3.5 h-3.5" />
              <span>1. What did I accomplish?</span>
            </label>
            <textarea
              rows={3}
              placeholder="Key tasks completed, features shipped, trades executed..."
              value={accomplished}
              onChange={(e) => {
                setAccomplished(e.target.value);
                setSaved(false);
              }}
              className={`w-full rounded-lg p-2.5 text-xs font-sans focus:outline-none border ${
                isLight
                  ? 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900'
                  : 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-600'
              }`}
            />
          </div>

          {/* Question 2: Learned */}
          <div
            className={`p-4 rounded-xl border transition-colors ${
              isLight
                ? 'bg-neutral-50/70 border-neutral-200/80 focus-within:border-neutral-400'
                : 'bg-neutral-900/60 border-neutral-800 focus-within:border-neutral-700'
            }`}
          >
            <label className="block text-xs font-semibold uppercase tracking-wide mb-2 flex items-center space-x-1.5 text-amber-600 dark:text-amber-400">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>2. What did I learn?</span>
            </label>
            <textarea
              rows={3}
              placeholder="Technical insights, market structure takeaways..."
              value={learned}
              onChange={(e) => {
                setLearned(e.target.value);
                setSaved(false);
              }}
              className={`w-full rounded-lg p-2.5 text-xs font-sans focus:outline-none border ${
                isLight
                  ? 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900'
                  : 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-600'
              }`}
            />
          </div>

          {/* Question 3: Went Wrong */}
          <div
            className={`p-4 rounded-xl border transition-colors ${
              isLight
                ? 'bg-neutral-50/70 border-neutral-200/80 focus-within:border-neutral-400'
                : 'bg-neutral-900/60 border-neutral-800 focus-within:border-neutral-700'
            }`}
          >
            <label className="block text-xs font-semibold uppercase tracking-wide mb-2 flex items-center space-x-1.5 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>3. What went wrong?</span>
            </label>
            <textarea
              rows={3}
              placeholder="Distractions, FOMO, broken focus blocks..."
              value={wentWrong}
              onChange={(e) => {
                setWentWrong(e.target.value);
                setSaved(false);
              }}
              className={`w-full rounded-lg p-2.5 text-xs font-sans focus:outline-none border ${
                isLight
                  ? 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900'
                  : 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-600'
              }`}
            />
          </div>

          {/* Question 4: Tomorrow Priority */}
          <div
            className={`p-4 rounded-xl border transition-colors ${
              isLight
                ? 'bg-neutral-50/70 border-neutral-200/80 focus-within:border-neutral-400'
                : 'bg-neutral-900/60 border-neutral-800 focus-within:border-neutral-700'
            }`}
          >
            <label className="block text-xs font-semibold uppercase tracking-wide mb-2 flex items-center space-x-1.5 text-[#4946FF] dark:text-indigo-400">
              <Target className="w-3.5 h-3.5" />
              <span>4. Tomorrow's #1 Priority?</span>
            </label>
            <textarea
              rows={3}
              placeholder="Single most vital P1 target to tackle first..."
              value={tomorrowPriority}
              onChange={(e) => {
                setTomorrowPriority(e.target.value);
                setSaved(false);
              }}
              className={`w-full rounded-lg p-2.5 text-xs font-sans focus:outline-none border ${
                isLight
                  ? 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900'
                  : 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-600'
              }`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4 border-neutral-200/60 dark:border-neutral-800/60">
          <div className={`text-xs ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Review daily to maintain consistent discipline.
          </div>
          <button
            type="submit"
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs ${
              isLight ? 'bg-neutral-900 hover:bg-neutral-800 text-white' : 'bg-white hover:bg-neutral-100 text-neutral-950'
            }`}
          >
            Save Reflection
          </button>
        </div>
      </form>
    </div>
  );
};
