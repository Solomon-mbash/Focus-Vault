'use client';

import React, { useState } from 'react';
import { useFocusStore, useStreakCount } from '@/store/useFocusStore';
import { Priority, TaskCategory, Task } from '@/types';
import { format, subDays } from 'date-fns';
import {
  Plus,
  Play,
  CheckCircle2,
  Trash2,
  Check,
  Zap,
  Clock,
  Code,
  TrendingUp,
  Heart,
  Target,
  ArrowRightLeft,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TaskBoard: React.FC = () => {
  const {
    tasks,
    dayLogs,
    theme,
    addTask,
    startTask,
    completeTask,
    failTask,
    deleteTask,
    carryOverUnfinishedTasks,
  } = useFocusStore();

  const isLight = theme === 'light';
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const streak = useStreakCount(dayLogs);

  const [viewDateMode, setViewDateMode] = useState<'today' | 'yesterday' | 'all'>('today');

  // Form State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('P1');
  const [estTime, setEstTime] = useState<number>(30);
  const [category, setCategory] = useState<TaskCategory>('CODE');

  // Complete Log Modal State
  const [completingTask, setCompletingTask] = useState<Task | null>(null);
  const [actualTimeInput, setActualTimeInput] = useState<number>(30);

  // Check for unfinished tasks from previous days
  const unfinishedPastTasks = tasks.filter(
    (t) => t.status !== 'done' && t.dateStr !== todayStr
  );

  // Filter tasks based on selected view mode
  const filteredTasks = tasks.filter((t) => {
    if (viewDateMode === 'today') return t.dateStr === todayStr;
    if (viewDateMode === 'yesterday') return t.dateStr === yesterdayStr;
    return true;
  });

  // Auto-sort tasks by Priority P1 > P2 > P3
  const priorityWeight: Record<Priority, number> = { P1: 1, P2: 2, P3: 3 };
  const sortedTasks = [...filteredTasks].sort(
    (a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]
  );

  const todayTasks = tasks.filter((t) => t.dateStr === todayStr);
  const doneCount = todayTasks.filter((t) => t.status === 'done').length;
  const totalCount = todayTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const todayLog = dayLogs[todayStr];
  const deepWorkMinutes = todayLog ? todayLog.deepWorkMinutes : 0;
  const deepWorkHours = (deepWorkMinutes / 60).toFixed(1);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      priority,
      estTime,
      category,
    });
    setTitle('');
    setIsAddModalOpen(false);
  };

  const handleConfirmComplete = () => {
    if (!completingTask) return;
    completeTask(completingTask.id, Number(actualTimeInput));
    setCompletingTask(null);
  };

  return (
    <div className="w-full space-y-5">
      {/* Header Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
          isLight
            ? 'bg-white border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-neutral-900'
            : 'bg-[#101014] border-neutral-800/80 text-neutral-100 shadow-lg'
        }`}
      >
        <div>
          <div className={`text-[11px] font-mono uppercase tracking-wider ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </div>
          <h2 className="text-xl font-bold tracking-tight mt-0.5">
            Daily Targets
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Progress Pill */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono ${
              isLight ? 'bg-neutral-50 border-neutral-200/80 text-neutral-600' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
            }`}
          >
            <span>Completion:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {doneCount}/{totalCount} ({progressPercent}%)
            </span>
          </div>

          {/* Add Target Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs ${
              isLight
                ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                : 'bg-white hover:bg-neutral-100 text-neutral-950 font-semibold'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Target</span>
          </button>
        </div>
      </div>

      {/* Unfinished Tasks Notice */}
      {unfinishedPastTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 border transition-colors ${
            isLight
              ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
              : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
          }`}
        >
          <div className="flex items-center space-x-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              You have <strong className="font-semibold">{unfinishedPastTasks.length} unfinished tasks</strong> from previous days.
            </span>
          </div>

          <button
            onClick={carryOverUnfinishedTasks}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Carry Over</span>
          </button>
        </motion.div>
      )}

      {/* Date View Filters */}
      <div className="flex items-center justify-between">
        <div
          className={`inline-flex p-1 rounded-xl border text-xs font-mono transition-colors ${
            isLight ? 'bg-neutral-100/70 border-neutral-200/80' : 'bg-neutral-900 border-neutral-800'
          }`}
        >
          <button
            onClick={() => setViewDateMode('today')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              viewDateMode === 'today'
                ? isLight
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'bg-neutral-800 text-white shadow-xs font-semibold'
                : isLight
                ? 'text-neutral-500 hover:text-neutral-900'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Today ({todayTasks.length})
          </button>

          <button
            onClick={() => setViewDateMode('yesterday')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              viewDateMode === 'yesterday'
                ? isLight
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'bg-neutral-800 text-white shadow-xs font-semibold'
                : isLight
                ? 'text-neutral-500 hover:text-neutral-900'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Yesterday ({tasks.filter((t) => t.dateStr === yesterdayStr).length})
          </button>

          <button
            onClick={() => setViewDateMode('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              viewDateMode === 'all'
                ? isLight
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'bg-neutral-800 text-white shadow-xs font-semibold'
                : isLight
                ? 'text-neutral-500 hover:text-neutral-900'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All ({tasks.length})
          </button>
        </div>

        <div className={`text-[11px] font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Deep Work Logged: <strong className="font-semibold">{deepWorkHours}h</strong>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <div
            className={`p-12 text-center border rounded-2xl transition-colors ${
              isLight ? 'bg-white border-neutral-200/80 text-neutral-600' : 'bg-[#101014] border-neutral-800/80 text-neutral-400'
            }`}
          >
            <Target className="w-8 h-8 mx-auto mb-2.5 opacity-40" />
            <div className="font-semibold text-sm">No targets logged</div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Click "New Target" to set your focus targets for execution.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedTasks.map((task) => {
              const isP1 = task.priority === 'P1';
              const isP2 = task.priority === 'P2';
              const isDoing = task.status === 'doing';
              const isDone = task.status === 'done';

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3.5 md:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isDoing
                      ? isLight
                        ? 'bg-neutral-50/90 border-[#4946FF] shadow-xs'
                        : 'bg-neutral-900 border-[#4946FF] shadow-xs'
                      : isDone
                      ? isLight
                        ? 'bg-neutral-50/50 border-neutral-200/50 opacity-60'
                        : 'bg-neutral-900/30 border-neutral-800/40 opacity-50'
                      : isLight
                      ? 'bg-white border-neutral-200/80 hover:border-neutral-300 shadow-xs'
                      : 'bg-[#101014] border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {/* Priority Badge */}
                    <span
                      className={`px-2 py-0.5 text-[11px] font-mono font-semibold rounded shrink-0 ${
                        isP1
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : isP2
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20'
                      }`}
                    >
                      {task.priority}
                    </span>

                    {/* Category Icon */}
                    <div className={`p-1 rounded shrink-0 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {task.category === 'CODE' && <Code className="w-3.5 h-3.5" />}
                      {task.category === 'TRADE' && <TrendingUp className="w-3.5 h-3.5" />}
                      {task.category === 'LIFE' && <Heart className="w-3.5 h-3.5" />}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-medium tracking-tight truncate ${isDone ? 'line-through text-neutral-400' : ''}`}>
                        {task.title}
                      </div>

                      <div className={`flex items-center space-x-3 text-[11px] font-mono mt-0.5 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.estTime}m</span>
                        </span>
                        <span>{task.dateStr}</span>
                        {task.actualTime && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            Logged: {task.actualTime}m
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1.5 shrink-0">
                    {task.status === 'todo' && (
                      <button
                        onClick={() => startTask(task.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center space-x-1 transition-colors cursor-pointer border ${
                          isLight
                            ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200/90 text-neutral-800'
                            : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                        }`}
                      >
                        <Play className="w-3 h-3" />
                        <span>Focus</span>
                      </button>
                    )}

                    {isDoing && (
                      <button
                        onClick={() => {
                          setCompletingTask(task);
                          setActualTimeInput(task.estTime);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>
                    )}

                    <button
                      onClick={() => deleteTask(task.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isLight ? 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100' : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
                      }`}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
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
                <h3 className="text-base font-bold">New Daily Target</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className={`text-sm ${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-white'}`}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Target Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Implement SMC Trade Scanner"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm focus:outline-none border ${
                      isLight
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900'
                        : 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-600 focus:border-white'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      className={`w-full rounded-xl px-3 py-2 text-xs font-mono focus:outline-none border ${
                        isLight
                          ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
                          : 'bg-neutral-900 border-neutral-800 text-white'
                      }`}
                    >
                      <option value="P1">P1 (Must Do)</option>
                      <option value="P2">P2 (Should Do)</option>
                      <option value="P3">P3 (Nice To Have)</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TaskCategory)}
                      className={`w-full rounded-xl px-3 py-2 text-xs font-mono focus:outline-none border ${
                        isLight
                          ? 'bg-neutral-50 border-neutral-200 text-neutral-900'
                          : 'bg-neutral-900 border-neutral-800 text-white'
                      }`}
                    >
                      <option value="CODE">Code</option>
                      <option value="TRADE">Trade</option>
                      <option value="LIFE">Life</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Estimated Duration
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 30, 60, 90].map((mins) => (
                      <button
                        type="button"
                        key={mins}
                        onClick={() => setEstTime(mins)}
                        className={`py-2 text-xs font-mono font-semibold rounded-lg border transition-all ${
                          estTime === mins
                            ? isLight
                              ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                              : 'bg-white text-neutral-950 border-white shadow-xs'
                            : isLight
                            ? 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex justify-end space-x-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border ${
                      isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-600' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wide ${
                      isLight ? 'bg-neutral-900 hover:bg-neutral-800 text-white' : 'bg-white hover:bg-neutral-100 text-neutral-950'
                    }`}
                  >
                    Add Target
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Complete Task Modal */}
      <AnimatePresence>
        {completingTask && (
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
                <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Log Completion</span>
                </h3>
                <button
                  onClick={() => setCompletingTask(null)}
                  className={`text-sm ${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-white'}`}
                >
                  ✕
                </button>
              </div>

              <div className="text-sm font-medium">
                "{completingTask.title}"
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Actual Time Spent (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={actualTimeInput}
                  onChange={(e) => setActualTimeInput(Number(e.target.value))}
                  className={`w-full rounded-xl px-3.5 py-2 text-sm font-mono focus:outline-none border ${
                    isLight
                      ? 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-emerald-500'
                      : 'bg-neutral-900 border-neutral-800 text-white focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60">
                <button
                  onClick={() => setCompletingTask(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border ${
                    isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-600' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmComplete}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                >
                  Confirm & Log
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
