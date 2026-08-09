'use client';

import React, { useEffect } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Timer, CheckCircle2, Zap, FastForward, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export const PomodoroTimer: React.FC = () => {
  const {
    tasks,
    activeTaskId,
    pomodoroDuration,
    pomodoroSecondsLeft,
    isPomodoroRunning,
    timerMode,
    soundEnabled,
    theme,
    setPomodoroDuration,
    togglePomodoro,
    resetPomodoro,
    skipBreak,
    tickPomodoro,
    setSoundEnabled,
    completeTask,
  } = useFocusStore();

  const isLight = theme === 'light';
  const activeTask = tasks.find((t) => t.id === activeTaskId);

  // Keyboard shortcuts (Space = toggle, Alt+R = reset, Alt+S = skip break)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (activeTask || timerMode === 'break') togglePomodoro();
      } else if (e.code === 'KeyR' && e.altKey) {
        e.preventDefault();
        resetPomodoro();
      } else if (e.code === 'KeyS' && e.altKey) {
        e.preventDefault();
        skipBreak();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTask, timerMode, togglePomodoro, resetPomodoro, skipBreak]);

  // Wall-Clock Timer interval tick & Background Tab Visibility Sync
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPomodoroRunning) {
      tickPomodoro();
      interval = setInterval(() => {
        tickPomodoro();
      }, 500);
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isPomodoroRunning) {
        tickPomodoro();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPomodoroRunning, tickPomodoro]);

  const minutes = Math.floor(pomodoroSecondsLeft / 60);
  const seconds = pomodoroSecondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Live Browser Tab Title Update
  useEffect(() => {
    if (isPomodoroRunning) {
      const modeTag = timerMode === 'break' ? '[BREAK]' : '[WORK]';
      document.title = `(${formattedTime}) ${modeTag} FOCUS VAULT`;
    } else {
      document.title = 'FOCUS VAULT | Discipline Execution Engine';
    }
  }, [formattedTime, isPomodoroRunning, timerMode]);

  const totalSeconds = (timerMode === 'break' ? 5 : pomodoroDuration) * 60;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalSeconds - pomodoroSecondsLeft) / totalSeconds) * 100)
  );

  return (
    <div
      className={`w-full rounded-xl p-6 transition-all duration-300 relative overflow-hidden select-none border ${
        isLight
          ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50 text-slate-800'
          : 'bg-[#111111] border-neutral-800 shadow-2xl text-white'
      } ${
        timerMode === 'break'
          ? isLight
            ? 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
            : 'border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
          : isPomodoroRunning
          ? isLight
            ? 'border-[#4946FF] shadow-[0_0_30px_rgba(73,70,255,0.25)]'
            : 'border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
          : ''
      }`}
    >
      {/* Ambient Radial Glow */}
      {isPomodoroRunning && (
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse ${
            timerMode === 'break'
              ? 'bg-amber-500/15'
              : isLight
              ? 'bg-[#4946FF]/15'
              : 'bg-red-600/10'
          }`}
        />
      )}

      {/* Top Header */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 mb-6 z-10 relative ${
          isLight ? 'border-slate-200' : 'border-neutral-800/80'
        }`}
      >
        <div className="flex items-center space-x-2.5 font-mono text-xs tracking-wider">
          <div
            className={`p-1 border rounded ${
              timerMode === 'break'
                ? isLight
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-amber-950/80 border-amber-800 text-amber-400'
                : isLight
                ? 'bg-[#4946FF]/10 border-[#4946FF]/30 text-[#4946FF]'
                : 'bg-red-950/80 border-red-800 text-red-500'
            }`}
          >
            {timerMode === 'break' ? <Coffee className="w-4 h-4" /> : <Timer className="w-4 h-4" />}
          </div>
          <span
            className={`uppercase font-bold tracking-widest text-[12px] ${
              isLight ? 'text-slate-800' : 'text-white'
            }`}
          >
            {timerMode === 'break' ? 'RECOVERY BREAK TIME (5M)' : 'POMODORO EXECUTION PRISON'}
          </span>
          <span className={`hidden sm:inline ${isLight ? 'text-slate-300' : 'text-neutral-600'}`}>
            &bull;
          </span>
          <span
            className={`hidden sm:inline text-[10px] font-bold uppercase ${
              isLight ? 'text-slate-400' : 'text-neutral-400'
            }`}
          >
            {timerMode === 'break' ? 'RECHARGE OR SKIP' : 'WALL-CLOCK SYNCED'}
          </span>
        </div>

        {/* Duration Selectors (15m, 25m, 30m, 50m, 60m, 90m) */}
        <div
          className={`flex flex-wrap items-center gap-1 p-1 rounded-lg border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          {[15, 25, 30, 50, 60, 90].map((m) => (
            <button
              key={m}
              onClick={() => setPomodoroDuration(m)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
                pomodoroDuration === m && timerMode === 'work'
                  ? isLight
                    ? 'bg-[#4946FF] text-white shadow-md shadow-[#4946FF]/30'
                    : 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
              }`}
            >
              {m}M
            </button>
          ))}
        </div>
      </div>

      {/* Active Task Lock-In Banner */}
      <div
        className={`mb-6 p-4 border-l-4 rounded-r-lg flex flex-wrap items-center justify-between gap-3 shadow-inner z-10 relative ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950/90 border-neutral-800'
        } ${
          timerMode === 'break'
            ? 'border-l-amber-500'
            : isLight
            ? 'border-l-[#4946FF]'
            : 'border-l-red-500'
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest">
            {timerMode === 'break' ? (
              <span className="text-amber-500 font-bold flex items-center space-x-1">
                <Coffee className="w-3.5 h-3.5" />
                <span>SHORT BREAK PERIOD</span>
              </span>
            ) : (
              <span className={`font-bold flex items-center space-x-1 ${isLight ? 'text-[#4946FF]' : 'text-red-500'}`}>
                <Zap className="w-3.5 h-3.5" />
                <span>ACTIVE TARGET LOCK-IN</span>
              </span>
            )}
          </div>
          <div className={`text-base md:text-lg font-bold truncate mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {timerMode === 'break'
              ? '5-Minute Short Recovery Break. Rest your eyes or skip break to continue.'
              : activeTask
              ? activeTask.title
              : 'No Task Locked In. Select a task below or pick a duration above to focus.'}
          </div>
        </div>

        {activeTask && timerMode === 'work' && (
          <div className="flex items-center space-x-3 shrink-0">
            <span
              className={`px-2.5 py-1 text-xs font-mono uppercase font-bold rounded border ${
                activeTask.priority === 'P1'
                  ? 'bg-red-500/10 text-red-600 border-red-500/30'
                  : activeTask.priority === 'P2'
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                  : isLight
                  ? 'bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-neutral-800 text-neutral-400 border-neutral-700'
              }`}
            >
              {activeTask.priority} ({activeTask.estTime}m)
            </span>
            <button
              onClick={() => completeTask(activeTask.id, activeTask.estTime)}
              className="px-3.5 py-1.5 text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>MARK DONE</span>
            </button>
          </div>
        )}
      </div>

      {/* Digital Clock Display */}
      <div className="flex flex-col items-center justify-center my-6 z-10 relative">
        <motion.div
          animate={isPomodoroRunning ? { scale: [1, 1.015, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`text-7xl md:text-9xl font-black font-mono tracking-tighter py-1 ${
            timerMode === 'break'
              ? 'text-amber-500'
              : isLight
              ? 'text-[#0F172A]'
              : 'text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.1)]'
          }`}
        >
          {formattedTime}
        </motion.div>

        {/* Progress Bar */}
        <div
          className={`w-full max-w-lg h-2.5 rounded-full overflow-hidden border my-4 shadow-inner ${
            isLight ? 'bg-slate-200 border-slate-300' : 'bg-neutral-950 border-neutral-800/80'
          }`}
        >
          <div
            className={`h-full transition-all duration-1000 ease-linear shadow-sm ${
              timerMode === 'break'
                ? 'bg-gradient-to-r from-amber-500 to-amber-300'
                : isLight
                ? 'bg-gradient-to-r from-[#4946FF] via-amber-500 to-emerald-500'
                : 'bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          <button
            onClick={togglePomodoro}
            disabled={!activeTask && timerMode === 'work'}
            className={`px-7 py-3 rounded-lg text-sm font-bold font-mono uppercase tracking-wider flex items-center space-x-2.5 shadow-xl transition-all cursor-pointer ${
              !activeTask && timerMode === 'work'
                ? isLight
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-700'
                : isPomodoroRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white border border-amber-500 shadow-amber-500/30'
                : isLight
                ? 'bg-[#4946FF] hover:bg-[#3B38EC] text-white border border-[#3B38EC] shadow-[0_0_20px_rgba(73,70,255,0.4)]'
                : 'bg-red-600 hover:bg-red-500 text-white border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
            }`}
          >
            {isPomodoroRunning ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{timerMode === 'break' ? 'START BREAK' : 'START FOCUS'}</span>
              </>
            )}
          </button>

          {/* SKIP BREAK BUTTON */}
          <button
            onClick={skipBreak}
            className={`px-5 py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer shadow-md border ${
              isLight
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-700'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-amber-400'
            }`}
            title="Skip Break & Resume Work Block [Alt+S]"
          >
            <FastForward className={`w-4 h-4 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
            <span>SKIP BREAK</span>
          </button>

          <button
            onClick={resetPomodoro}
            className={`p-3.5 rounded-lg border transition-colors cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                : 'bg-neutral-950 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Reset Timer [Alt+R]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3.5 rounded-lg border transition-colors cursor-pointer ${
              soundEnabled
                ? isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-700'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-white'
                : 'bg-red-500/10 border-red-500/30 text-red-500'
            }`}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Keyboard shortcut & Live tab indicator */}
        <div className={`mt-4 text-[10px] font-mono text-center ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
          SHORTCUTS:{' '}
          <span className={`px-1.5 py-0.5 rounded border ${isLight ? 'bg-slate-200 border-slate-300 text-slate-700' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}`}>
            [SPACE]
          </span>{' '}
          TOGGLE &bull;{' '}
          <span className={`px-1.5 py-0.5 rounded border ${isLight ? 'bg-slate-200 border-slate-300 text-slate-700' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}`}>
            [ALT+S]
          </span>{' '}
          SKIP BREAK &bull;{' '}
          <span className={`px-1.5 py-0.5 rounded border ${isLight ? 'bg-slate-200 border-slate-300 text-slate-700' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}`}>
            [ALT+R]
          </span>{' '}
          RESET
        </div>
      </div>
    </div>
  );
};
