'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { format, subDays } from 'date-fns';
import { Sliders, Calendar, Info, CheckCircle2, BarChart2, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FocusFormulaSection: React.FC = () => {
  const { tasks, dayLogs, submitEveningReview } = useFocusStore();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const currentTodayLog = dayLogs[todayStr];
  const initialScores = currentTodayLog?.scores || {
    codeShipped: 5,
    smcPlanFollowed: 5,
    noScrollBefore6pm: 5,
  };

  const [codeShipped, setCodeShipped] = useState<number>(initialScores.codeShipped);
  const [smcPlanFollowed, setSmcPlanFollowed] = useState<number>(initialScores.smcPlanFollowed);
  const [noScrollBefore6pm, setNoScrollBefore6pm] = useState<number>(initialScores.noScrollBefore6pm);
  const [reviewSaved, setReviewSaved] = useState<boolean>(!!currentTodayLog?.scores);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    submitEveningReview(todayStr, {
      codeShipped,
      smcPlanFollowed,
      noScrollBefore6pm,
    });
    setReviewSaved(true);
  };

  const last30Days = Array.from({ length: 30 }).map((_, i) => {
    const d = subDays(new Date(), 29 - i);
    const dateStr = format(d, 'yyyy-MM-dd');

    // Dynamic aggregation directly from tasks array
    const dayTasks = tasks.filter((t) => t.dateStr === dateStr);
    const log = dayLogs[dateStr];

    const totalTasks = dayTasks.length || (log ? log.totalTasks : 0);
    const tasksDone = dayTasks.filter((t) => t.status === 'done').length || (log ? log.tasksDone : 0);
    const rate = totalTasks > 0 ? tasksDone / totalTasks : 0;

    return {
      dateStr,
      dateLabel: format(d, 'MMM d'),
      log,
      totalTasks,
      tasksDone,
      rate,
      dayTasks,
    };
  });

  const selectedDayInfo = selectedDate ? last30Days.find((d) => d.dateStr === selectedDate) : null;

  return (
    <div className="w-full space-y-6">
      {/* Formula Banner */}
      <div className="bg-[#111111] border border-neutral-800 p-5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-2 text-neutral-400 font-mono text-xs">
          <Info className="w-4 h-4 text-red-500 shrink-0" />
          <span className="font-bold text-neutral-300">CORE DISCIPLINE FORMULA:</span>
        </div>
        <div className="font-mono text-xs md:text-sm font-extrabold tracking-wide text-white bg-neutral-950 border border-neutral-800 px-4 py-2 rounded-lg shadow-inner">
          <span className="text-red-400">HIGH-QUALITY WORK</span> = (TIME SPENT) &times; (INTENSITY OF FOCUS)
        </div>
      </div>

      {/* 2-Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily 3-Lever Score Review */}
        <div className="bg-[#111111] border border-neutral-800 p-6 rounded-xl space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-mono font-bold text-white flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-red-500" />
                <span>EVENING DISCIPLINE LEVERS (0 - 10)</span>
              </h3>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Rate execution intensity after 6 PM
              </p>
            </div>
            {reviewSaved && (
              <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold rounded-md flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SAVED TODAY</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveReview} className="space-y-4">
            {/* Lever 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300 font-bold">1. CODE SHIPPED TO PRODUCTION?</span>
                <span className="text-red-400 font-bold">{codeShipped} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={codeShipped}
                onChange={(e) => {
                  setCodeShipped(Number(e.target.value));
                  setReviewSaved(false);
                }}
                className="w-full accent-red-600 bg-neutral-950 h-2 rounded cursor-pointer"
              />
            </div>

            {/* Lever 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300 font-bold">2. SMC TRADING PLAN STRICTLY FOLLOWED?</span>
                <span className="text-amber-400 font-bold">{smcPlanFollowed} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={smcPlanFollowed}
                onChange={(e) => {
                  setSmcPlanFollowed(Number(e.target.value));
                  setReviewSaved(false);
                }}
                className="w-full accent-amber-500 bg-neutral-950 h-2 rounded cursor-pointer"
              />
            </div>

            {/* Lever 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-300 font-bold">3. NO SOCIAL SCROLL BEFORE 6 PM?</span>
                <span className="text-emerald-400 font-bold">{noScrollBefore6pm} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={noScrollBefore6pm}
                onChange={(e) => {
                  setNoScrollBefore6pm(Number(e.target.value));
                  setReviewSaved(false);
                }}
                className="w-full accent-emerald-500 bg-neutral-950 h-2 rounded cursor-pointer"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
              <div className="text-xs font-mono text-neutral-400">
                Composite Score:{' '}
                <span className="text-white font-bold">
                  {((codeShipped + smcPlanFollowed + noScrollBefore6pm) / 3).toFixed(1)} / 10
                </span>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase rounded-lg tracking-wider shadow-md transition-colors cursor-pointer"
              >
                SUBMIT SCORES
              </button>
            </div>
          </form>
        </div>

        {/* 30-Day GitHub Style Heatmap Calendar */}
        <div className="bg-[#111111] border border-neutral-800 p-6 rounded-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-base font-mono font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <span>30-DAY EXECUTION HEATMAP</span>
            </h3>
            <span className="text-xs font-mono text-neutral-500">CLICK DAY FOR DETAILS</span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 pt-2">
            {last30Days.map(({ dateStr, dateLabel, rate, totalTasks, tasksDone }) => {
              let bgClass = 'bg-neutral-950 border-neutral-800/80';
              if (totalTasks > 0) {
                if (rate >= 0.8) bgClass = 'bg-emerald-600 border-emerald-500 text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]';
                else if (rate >= 0.5) bgClass = 'bg-amber-600/90 border-amber-500 text-white';
                else if (rate > 0) bgClass = 'bg-red-900/70 border-red-700 text-neutral-300';
              }

              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-11 rounded-lg border flex flex-col items-center justify-center p-1 text-[10px] font-mono transition-all cursor-pointer ${bgClass} ${
                    isSelected ? 'ring-2 ring-white scale-105 z-10' : 'hover:scale-105'
                  }`}
                  title={`${dateStr}: ${totalTasks > 0 ? `${tasksDone}/${totalTasks} completed` : 'No tasks'}`}
                >
                  <span className="opacity-80 text-[9px]">{dateLabel.split(' ')[1]}</span>
                  <span className="font-bold">
                    {totalTasks > 0 ? `${Math.round(rate * 100)}%` : '0%'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2">
            <span>LESS EXECUTION</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-neutral-950 border border-neutral-800 rounded-sm" />
              <span className="w-3 h-3 bg-red-900/70 border border-red-700 rounded-sm" />
              <span className="w-3 h-3 bg-amber-600/90 border border-amber-500 rounded-sm" />
              <span className="w-3 h-3 bg-emerald-600 border border-emerald-500 rounded-sm" />
            </div>
            <span>80%+ SUCCESS</span>
          </div>
        </div>
      </div>

      {/* Selected Day Log Detail Modal */}
      <AnimatePresence>
        {selectedDate && selectedDayInfo && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111111] border border-neutral-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-base font-mono font-bold text-white flex items-center space-x-2">
                  <BarChart2 className="w-5 h-5 text-red-500" />
                  <span>EXECUTION LOG: {selectedDate}</span>
                </h3>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-neutral-500 hover:text-white text-sm font-mono p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-neutral-800 pb-2">
                  <span className="text-neutral-400">Tasks Completed:</span>
                  <span className="text-white font-bold">
                    {selectedDayInfo.tasksDone} / {selectedDayInfo.totalTasks} (
                    {selectedDayInfo.totalTasks > 0
                      ? Math.round((selectedDayInfo.tasksDone / selectedDayInfo.totalTasks) * 100)
                      : 0}
                    %)
                  </span>
                </div>

                {selectedDayInfo.log && (
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <span className="text-neutral-400">Logged Deep Work Time:</span>
                    <span className="text-amber-400 font-bold">
                      {(selectedDayInfo.log.deepWorkMinutes / 60).toFixed(1)} Hours ({selectedDayInfo.log.deepWorkMinutes} mins)
                    </span>
                  </div>
                )}

                {/* Day Tasks Breakdown */}
                {selectedDayInfo.dayTasks.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-neutral-400 font-bold text-[10px] uppercase">
                      Target Tasks for this Day ({selectedDayInfo.dayTasks.length}):
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {selectedDayInfo.dayTasks.map((t) => (
                        <div
                          key={t.id}
                          className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className={`font-semibold truncate ${t.status === 'done' ? 'text-emerald-400 line-through' : 'text-neutral-200'}`}>
                              {t.title}
                            </div>
                            <div className="text-[10px] text-neutral-500">
                              {t.priority} &bull; {t.category} &bull; Est: {t.estTime}m
                            </div>
                          </div>

                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                            t.status === 'done' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDayInfo.log?.scores && (
                  <div className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-lg space-y-1.5">
                    <div className="text-neutral-400 text-[10px] uppercase font-bold">Evening Discipline Levers:</div>
                    <div className="flex justify-between text-neutral-300">
                      <span>Code Shipped:</span>
                      <span className="font-bold text-red-400">{selectedDayInfo.log.scores.codeShipped}/10</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>SMC Plan Followed:</span>
                      <span className="font-bold text-amber-400">{selectedDayInfo.log.scores.smcPlanFollowed}/10</span>
                    </div>
                    <div className="flex justify-between text-neutral-300">
                      <span>No Scroll Before 6pm:</span>
                      <span className="font-bold text-emerald-400">{selectedDayInfo.log.scores.noScrollBefore6pm}/10</span>
                    </div>
                  </div>
                )}

                {selectedDayInfo.totalTasks === 0 && !selectedDayInfo.log && (
                  <p className="text-xs font-mono text-neutral-500 py-2 text-center">
                    No targets or logs recorded for this date.
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-2 border-t border-neutral-800">
                <button
                  onClick={() => setSelectedDate(null)}
                  className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-mono"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
