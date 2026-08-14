'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { format, subDays } from 'date-fns';
import { Sliders, Calendar, Info, CheckCircle2, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FocusFormulaSection: React.FC = () => {
  const { tasks, dayLogs, submitEveningReview, theme } = useFocusStore();
  const isLight = theme === 'light';
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
    <div className="w-full space-y-5">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Daily Discipline Levers */}
        <div
          className={`p-6 rounded-2xl border space-y-5 transition-colors duration-200 ${
            isLight
              ? 'bg-white border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-neutral-900'
              : 'bg-[#101014] border-neutral-800/80 text-neutral-100 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-neutral-200/60 dark:border-neutral-800/60">
            <div>
              <h3 className="text-base font-bold flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-neutral-500" />
                <span>Discipline Levers</span>
              </h3>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Rate execution score (0 - 10)
              </p>
            </div>
            {reviewSaved && (
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium rounded-md flex items-center space-x-1 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                <span>Saved</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveReview} className="space-y-4">
            {/* Lever 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span>1. Code Shipped to Production</span>
                <span className="font-mono font-bold">{codeShipped}/10</span>
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
                className={`w-full h-1.5 rounded-lg cursor-pointer ${
                  isLight ? 'accent-neutral-900 bg-neutral-200' : 'accent-white bg-neutral-800'
                }`}
              />
            </div>

            {/* Lever 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span>2. SMC Trading Plan Followed</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{smcPlanFollowed}/10</span>
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
                className={`w-full h-1.5 rounded-lg cursor-pointer ${
                  isLight ? 'accent-amber-500 bg-neutral-200' : 'accent-amber-500 bg-neutral-800'
                }`}
              />
            </div>

            {/* Lever 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span>3. No Social Scroll Before 6 PM</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{noScrollBefore6pm}/10</span>
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
                className={`w-full h-1.5 rounded-lg cursor-pointer ${
                  isLight ? 'accent-emerald-500 bg-neutral-200' : 'accent-emerald-500 bg-neutral-800'
                }`}
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-neutral-200/60 dark:border-neutral-800/60">
              <div className={`text-xs font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Avg:{' '}
                <strong className={isLight ? 'text-neutral-800' : 'text-white'}>
                  {((codeShipped + smcPlanFollowed + noScrollBefore6pm) / 3).toFixed(1)} / 10
                </strong>
              </div>
              <button
                type="submit"
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs ${
                  isLight ? 'bg-neutral-900 hover:bg-neutral-800 text-white' : 'bg-white hover:bg-neutral-100 text-neutral-950'
                }`}
              >
                Submit Scores
              </button>
            </div>
          </form>
        </div>

        {/* 30-Day Minimalist Heatmap Calendar */}
        <div
          className={`p-6 rounded-2xl border space-y-4 transition-colors duration-200 ${
            isLight
              ? 'bg-white border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-neutral-900'
              : 'bg-[#101014] border-neutral-800/80 text-neutral-100 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-neutral-200/60 dark:border-neutral-800/60">
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span>30-Day Execution History</span>
            </h3>
            <span className={`text-[11px] font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Click day for log
            </span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 pt-1">
            {last30Days.map(({ dateStr, dateLabel, rate, totalTasks, tasksDone }) => {
              let cellStyle = isLight ? 'bg-neutral-100 text-neutral-400' : 'bg-neutral-900 text-neutral-500';
              if (totalTasks > 0) {
                if (rate >= 0.8) cellStyle = 'bg-emerald-600 text-white font-semibold';
                else if (rate >= 0.5) cellStyle = 'bg-amber-500 text-white font-semibold';
                else if (rate > 0) cellStyle = isLight ? 'bg-neutral-300 text-neutral-800' : 'bg-neutral-700 text-neutral-200';
              }

              const isSelected = selectedDate === dateStr;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center p-1 text-[10px] font-mono transition-all cursor-pointer ${cellStyle} ${
                    isSelected ? 'ring-2 ring-neutral-900 dark:ring-white scale-105 z-10' : 'hover:opacity-90'
                  }`}
                  title={`${dateStr}: ${totalTasks > 0 ? `${tasksDone}/${totalTasks} targets` : 'No tasks'}`}
                >
                  <span className="opacity-70 text-[8px]">{dateLabel.split(' ')[1]}</span>
                  <span className="font-semibold text-[9px]">
                    {totalTasks > 0 ? `${Math.round(rate * 100)}%` : '0%'}
                  </span>
                </button>
              );
            })}
          </div>

          <div className={`flex items-center justify-between text-[11px] font-mono pt-2 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
            <span>Less</span>
            <div className="flex items-center space-x-1">
              <span className={`w-2.5 h-2.5 rounded-xs ${isLight ? 'bg-neutral-100' : 'bg-neutral-900'}`} />
              <span className={`w-2.5 h-2.5 rounded-xs ${isLight ? 'bg-neutral-300' : 'bg-neutral-700'}`} />
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600" />
            </div>
            <span>80%+ Done</span>
          </div>
        </div>
      </div>

      {/* Selected Day Log Detail Modal */}
      <AnimatePresence>
        {selectedDate && selectedDayInfo && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className={`rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border ${
                isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#101014] border-neutral-800 text-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-neutral-200/60 dark:border-neutral-800/60">
                <h3 className="text-base font-bold flex items-center space-x-2">
                  <BarChart2 className="w-4 h-4 text-neutral-500" />
                  <span>Log: {selectedDate}</span>
                </h3>
                <button
                  onClick={() => setSelectedDate(null)}
                  className={`text-sm ${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-white'}`}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between border-b pb-2 border-neutral-200/60 dark:border-neutral-800/60">
                  <span className={isLight ? 'text-neutral-500' : 'text-neutral-400'}>Targets Completed:</span>
                  <span className="font-bold">
                    {selectedDayInfo.tasksDone} / {selectedDayInfo.totalTasks} (
                    {selectedDayInfo.totalTasks > 0
                      ? Math.round((selectedDayInfo.tasksDone / selectedDayInfo.totalTasks) * 100)
                      : 0}
                    %)
                  </span>
                </div>

                {selectedDayInfo.log && (
                  <div className="flex justify-between border-b pb-2 border-neutral-200/60 dark:border-neutral-800/60">
                    <span className={isLight ? 'text-neutral-500' : 'text-neutral-400'}>Deep Work Time:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {(selectedDayInfo.log.deepWorkMinutes / 60).toFixed(1)}h ({selectedDayInfo.log.deepWorkMinutes} mins)
                    </span>
                  </div>
                )}

                {/* Day Tasks Breakdown */}
                {selectedDayInfo.dayTasks.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className={`font-semibold uppercase text-[10px] ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Targets for this day:
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {selectedDayInfo.dayTasks.map((t) => (
                        <div
                          key={t.id}
                          className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                            isLight ? 'bg-neutral-50 border-neutral-200/80' : 'bg-neutral-900 border-neutral-800'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className={`font-medium truncate ${t.status === 'done' ? 'text-emerald-600 line-through' : ''}`}>
                              {t.title}
                            </div>
                            <div className={`text-[10px] ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                              {t.priority} &bull; {t.estTime}m
                            </div>
                          </div>

                          <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                            t.status === 'done'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : 'bg-neutral-500/10 text-neutral-500'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
                <button
                  onClick={() => setSelectedDate(null)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium border ${
                    isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-600' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
