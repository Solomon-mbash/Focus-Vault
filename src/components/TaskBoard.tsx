'use client';

import React, { useState } from 'react';
import { useFocusStore, useStreakCount } from '@/store/useFocusStore';
import { Priority, TaskCategory, Task } from '@/types';
import { format, subDays, parseISO } from 'date-fns';
import {
  Flame,
  Plus,
  Play,
  CheckCircle2,
  XCircle,
  Trash2,
  Check,
  Zap,
  Clock,
  Code,
  TrendingUp,
  Heart,
  Target,
  Sparkles,
  ArrowRightLeft,
  Calendar,
  History,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TaskBoard: React.FC = () => {
  const {
    tasks,
    dayLogs,
    addTask,
    startTask,
    completeTask,
    failTask,
    deleteTask,
    carryOverUnfinishedTasks,
  } = useFocusStore();

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const streak = useStreakCount(dayLogs);

  // Date Filter View mode: 'today' | 'yesterday' | 'all' | custom string date
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
    return true; // 'all'
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
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111111] border border-neutral-800 p-5 rounded-xl shadow-xl">
        <div>
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            {format(new Date(), 'EEEE')} &bull; {format(new Date(), 'MMMM d, yyyy')}
          </div>
          <h2 className="text-2xl font-black font-mono tracking-tight text-white mt-0.5 flex items-center space-x-2">
            <span>DAILY EXECUTION BOARD</span>
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Streak Counter */}
          <div className="flex items-center space-x-2.5 bg-neutral-950 px-4 py-2 rounded-lg border border-neutral-800 shadow-inner">
            <Flame className="w-5 h-5 text-red-500 fill-red-500/20 animate-pulse" />
            <div>
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                DISCIPLINE STREAK
              </div>
              <div className="text-base font-extrabold font-mono text-red-400 leading-none">
                {streak} DAYS <span className="text-xs text-neutral-500 font-normal">(&ge;80%)</span>
              </div>
            </div>
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-lg flex items-center space-x-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ADD TODAY TARGET</span>
          </button>
        </div>
      </div>

      {/* CARRY OVER UNFINISHED TASKS BANNER */}
      {unfinishedPastTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-950/70 border-2 border-amber-500/80 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xl"
        >
          <div className="flex items-center space-x-3 text-amber-200 font-mono text-xs md:text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
            <div>
              <span className="font-bold text-amber-400 uppercase">UNFINISHED PAST TARGETS DETECTED:</span>{' '}
              You have <span className="underline font-bold text-white bg-amber-900 px-2 py-0.5 rounded">{unfinishedPastTasks.length} unfinished tasks</span> from previous days.
            </div>
          </div>

          <button
            onClick={carryOverUnfinishedTasks}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold uppercase rounded-lg flex items-center space-x-1.5 shadow-[0_0_12px_rgba(245,158,11,0.4)] transition-all cursor-pointer shrink-0"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>CARRY OVER TO TODAY</span>
          </button>
        </motion.div>
      )}

      {/* Date View Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111111] border border-neutral-800/80 p-3 rounded-xl">
        <div className="flex items-center space-x-2 font-mono text-xs">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-400 font-bold uppercase">VIEW TARGETS:</span>
        </div>

        <div className="flex items-center space-x-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setViewDateMode('today')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
              viewDateMode === 'today'
                ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            TODAY ({todayTasks.length})
          </button>

          <button
            onClick={() => setViewDateMode('yesterday')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
              viewDateMode === 'yesterday'
                ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            YESTERDAY ({tasks.filter((t) => t.dateStr === yesterdayStr).length})
          </button>

          <button
            onClick={() => setViewDateMode('all')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
              viewDateMode === 'all'
                ? 'bg-neutral-700 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ALL HISTORY ({tasks.length})
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
          <span className="font-bold text-neutral-300">
            {viewDateMode === 'today' ? "TODAY'S TARGETS" : viewDateMode === 'yesterday' ? "YESTERDAY'S TARGETS" : "ALL HISTORICAL TARGETS"} ({sortedTasks.length})
          </span>
          <span className="text-neutral-500">SORT: P1 MUST &gt; P2 SHOULD &gt; P3 NICE</span>
        </div>

        {sortedTasks.length === 0 ? (
          <div className="p-12 text-center bg-[#111111]/60 border border-dashed border-neutral-800 rounded-xl">
            <Target className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <div className="text-neutral-200 font-mono font-bold text-base">NO TARGETS IN THIS VIEW</div>
            <p className="text-neutral-500 text-xs mt-1 max-w-sm mx-auto">
              {viewDateMode === 'today'
                ? 'Execution starts with clear intent. Click "ADD TODAY TARGET" to set your focus targets.'
                : 'No targets recorded for this date view.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedTasks.map((task) => {
              const isP1 = task.priority === 'P1';
              const isP2 = task.priority === 'P2';
              const isDoing = task.status === 'doing';
              const isDone = task.status === 'done';
              const isFailed = task.status === 'failed';

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-xl border transition-all flex flex-wrap items-center justify-between gap-4 cursor-pointer ${
                    isDoing
                      ? 'bg-[#141414] border-red-500/90 shadow-[0_0_20px_rgba(239,68,68,0.2)] ring-1 ring-red-500/60'
                      : isDone
                      ? 'bg-neutral-950/70 border-neutral-800/80 opacity-70'
                      : isFailed
                      ? 'bg-neutral-950/40 border-neutral-900 opacity-50 line-through'
                      : 'bg-[#111111] border-neutral-800 hover:border-neutral-700 hover:bg-[#151515]'
                  }`}
                >
                  <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                    {/* Priority Badge */}
                    <div
                      className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md shrink-0 shadow-sm ${
                        isP1
                          ? 'bg-red-950/90 text-red-400 border border-red-800'
                          : isP2
                          ? 'bg-amber-950/90 text-amber-400 border border-amber-800'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {task.priority}
                    </div>

                    {/* Category Pill */}
                    <div className="p-1.5 bg-neutral-950 border border-neutral-800 rounded-md shrink-0 text-neutral-400 flex items-center space-x-1">
                      {task.category === 'CODE' && <Code className="w-3.5 h-3.5 text-blue-400" />}
                      {task.category === 'TRADE' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                      {task.category === 'LIFE' && <Heart className="w-3.5 h-3.5 text-pink-400" />}
                      <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase hidden sm:inline">
                        {task.category}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm md:text-base font-semibold text-white">
                        <span
                          className={
                            isDone
                              ? 'line-through text-neutral-500'
                              : isFailed
                              ? 'line-through text-neutral-600'
                              : 'text-neutral-100'
                          }
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-xs font-mono text-neutral-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          <span>Est: {task.estTime}m</span>
                        </span>
                        <span className="text-neutral-500 font-bold">
                          Date: {task.dateStr}
                        </span>
                        {task.actualTime && (
                          <span className="text-emerald-400 font-bold">
                            Logged: {task.actualTime}m
                          </span>
                        )}
                        {task.focusScore && (
                          <span className="text-amber-400 font-bold flex items-center space-x-0.5">
                            <Zap className="w-3 h-3 fill-amber-400" />
                            <span>Score: {task.focusScore}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {task.status === 'todo' && (
                      <button
                        onClick={() => startTask(task.id)}
                        className="px-3.5 py-1.5 bg-neutral-800 hover:bg-red-900/60 text-neutral-200 hover:text-white border border-neutral-700 hover:border-red-600 text-xs font-mono font-bold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>FOCUS NOW</span>
                      </button>
                    )}

                    {isDoing && (
                      <button
                        onClick={() => {
                          setCompletingTask(task);
                          setActualTimeInput(task.estTime);
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-lg flex items-center space-x-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>MARK DONE</span>
                      </button>
                    )}

                    {!isDone && (
                      <button
                        onClick={() => failTask(task.id)}
                        title="Mark Failed"
                        className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => deleteTask(task.id)}
                      title="Delete Task"
                      className="p-1.5 text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="bg-[#111111] border border-neutral-800 p-5 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-neutral-400 font-bold">TODAY TARGET COMPLETION RATE</span>
            <span className="font-bold text-white font-mono">
              {doneCount} / {totalCount} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
            <div
              className={`h-full transition-all duration-500 shadow-sm ${
                progressPercent >= 80
                  ? 'bg-emerald-500'
                  : progressPercent >= 50
                  ? 'bg-amber-500'
                  : 'bg-red-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Deep Work Hours */}
        <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800 p-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-md text-amber-400">
              <Zap className="w-5 h-5 fill-amber-400/20" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                DEEP WORK LOGGED TODAY
              </div>
              <div className="text-lg font-bold font-mono text-white">
                {deepWorkHours} <span className="text-xs text-neutral-400 font-normal">HOURS</span>
              </div>
            </div>
          </div>

          <div className="text-right font-mono text-[11px] text-neutral-500">
            <div className="font-bold text-neutral-400">HIGH INTENSITY WORK</div>
            <div className="text-red-400 font-bold">NO MULTITASKING</div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111111] border border-neutral-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-lg font-mono font-bold text-white flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-red-500" />
                  <span>ADD TODAY EXECUTION TARGET</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-neutral-500 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">TASK TITLE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Build SMC Trade Scanner Module"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">PRIORITY</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                    >
                      <option value="P1">P1 (Red - Must)</option>
                      <option value="P2">P2 (Yellow - Should)</option>
                      <option value="P3">P3 (Gray - Nice)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">CATEGORY</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TaskCategory)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                    >
                      <option value="CODE">CODE</option>
                      <option value="TRADE">TRADE</option>
                      <option value="LIFE">LIFE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">ESTIMATED TIME</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 30, 60, 90].map((mins) => (
                      <button
                        type="button"
                        key={mins}
                        onClick={() => setEstTime(mins)}
                        className={`py-2 text-xs font-mono font-bold rounded-lg border transition-all ${
                          estTime === mins
                            ? 'bg-red-600 text-white border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                            : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        {mins}M
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-3 border-t border-neutral-800/80">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-mono"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider shadow-lg"
                  >
                    ADD TARGET
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Log Done Modal */}
      <AnimatePresence>
        {completingTask && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111111] border border-neutral-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-lg font-mono font-bold text-emerald-400 flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>LOG TASK COMPLETION</span>
                </h3>
                <button
                  onClick={() => setCompletingTask(null)}
                  className="text-neutral-500 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="text-sm font-semibold text-white">
                "{completingTask.title}"
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">
                  ACTUAL TIME SPENT (MINUTES)
                </label>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={actualTimeInput}
                  onChange={(e) => setActualTimeInput(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono space-y-1 text-neutral-400">
                <div className="flex justify-between">
                  <span>Priority Multiplier:</span>
                  <span className="text-white font-bold">
                    {completingTask.priority === 'P1'
                      ? '1.5x (P1 Must)'
                      : completingTask.priority === 'P2'
                      ? '1.2x (P2 Should)'
                      : '1.0x (P3 Nice)'}
                  </span>
                </div>
                <div className="flex justify-between text-amber-400 font-bold">
                  <span>Calculated Focus Score:</span>
                  <span>
                    {Math.round(
                      actualTimeInput *
                        (completingTask.priority === 'P1'
                          ? 1.5
                          : completingTask.priority === 'P2'
                          ? 1.2
                          : 1.0)
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setCompletingTask(null)}
                  className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-mono"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleConfirmComplete}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider shadow-lg"
                >
                  CONFIRM & LOG
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
