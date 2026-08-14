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

  // Wall-Clock Timer tick
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

  // Browser Tab Title
  useEffect(() => {
    if (isPomodoroRunning) {
      const modeTag = timerMode === 'break' ? '[BREAK]' : '[WORK]';
      document.title = `(${formattedTime}) ${modeTag} FOCUS VAULT`;
    } else {
      document.title = 'FOCUS VAULT';
    }
  }, [formattedTime, isPomodoroRunning, timerMode]);

  const totalSeconds = (timerMode === 'break' ? 5 : pomodoroDuration) * 60;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalSeconds - pomodoroSecondsLeft) / totalSeconds) * 100)
  );

  return (
    <div
      className={`w-full rounded-2xl p-6 md:p-8 transition-colors duration-200 border relative overflow-hidden select-none ${
        isLight
          ? 'bg-white border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.02)] text-neutral-900'
          : 'bg-[#101014] border-neutral-800/80 shadow-xl text-neutral-100'
      }`}
    >
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 mb-6 border-neutral-200/60 dark:border-neutral-800/60">
        <div className="flex items-center space-x-2 text-xs font-mono">
          <div
            className={`w-2 h-2 rounded-full ${
              timerMode === 'break'
                ? 'bg-amber-500'
                : isPomodoroRunning
                ? 'bg-emerald-500 animate-pulse'
                : isLight
                ? 'bg-neutral-400'
                : 'bg-neutral-600'
            }`}
          />
          <span className="font-semibold tracking-wider uppercase text-[11px]">
            {timerMode === 'break' ? 'Recovery Break (5m)' : 'Deep Work Session'}
          </span>
        </div>

        {/* Duration Selectors */}
        <div
          className={`flex items-center p-1 rounded-lg border text-xs font-mono ${
            isLight ? 'bg-neutral-100/70 border-neutral-200/80' : 'bg-neutral-900 border-neutral-800'
          }`}
        >
          {[15, 25, 30, 50, 60, 90].map((m) => (
            <button
              key={m}
              onClick={() => setPomodoroDuration(m)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                pomodoroDuration === m && timerMode === 'work'
                  ? isLight
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'bg-neutral-800 text-white shadow-xs font-semibold'
                  : isLight
                  ? 'text-neutral-500 hover:text-neutral-800'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {m}m
            </button>
          ))}
        </div>
      </div>

      {/* Active Target Banner */}
      <div
        className={`mb-6 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 border transition-colors ${
          isLight
            ? 'bg-neutral-50/80 border-neutral-200/80'
            : 'bg-neutral-900/60 border-neutral-800/80'
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-wider mb-0.5">
            {timerMode === 'break' ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <Coffee className="w-3 h-3" />
                <span>Break Period</span>
              </span>
            ) : (
              <span className="text-neutral-500 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#4946FF]" />
                <span>Active Target</span>
              </span>
            )}
          </div>

          <div className="text-sm md:text-base font-semibold truncate">
            {timerMode === 'break'
              ? '5-minute rest. Step away from the screen or skip break.'
              : activeTask
              ? activeTask.title
              : 'No target locked. Select a task below or press start.'}
          </div>
        </div>

        {activeTask && timerMode === 'work' && (
          <div className="flex items-center space-x-2 shrink-0">
            <span
              className={`px-2 py-0.5 text-xs font-mono font-medium rounded border ${
                activeTask.priority === 'P1'
                  ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                  : activeTask.priority === 'P2'
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  : 'bg-neutral-500/10 text-neutral-600 border-neutral-500/20'
              }`}
            >
              {activeTask.priority}
            </span>
            <button
              onClick={() => completeTask(activeTask.id, activeTask.estTime)}
              className="px-3 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-md flex items-center space-x-1 transition-colors cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Done</span>
            </button>
          </div>
        )}
      </div>

      {/* Big Digital Clock */}
      <div className="flex flex-col items-center justify-center my-4">
        <div
          className={`text-7xl md:text-9xl font-extrabold font-mono tracking-tighter tabular-nums ${
            timerMode === 'break'
              ? 'text-amber-500'
              : isLight
              ? 'text-neutral-900'
              : 'text-white'
          }`}
        >
          {formattedTime}
        </div>

        {/* Minimal Progress Bar */}
        <div
          className={`w-full max-w-md h-1.5 rounded-full overflow-hidden my-6 ${
            isLight ? 'bg-neutral-100' : 'bg-neutral-800'
          }`}
        >
          <div
            className={`h-full transition-all duration-500 ease-linear rounded-full ${
              timerMode === 'break'
                ? 'bg-amber-500'
                : isLight
                ? 'bg-neutral-900'
                : 'bg-white'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Minimal Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={togglePomodoro}
            disabled={!activeTask && timerMode === 'work'}
            className={`px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wide flex items-center space-x-2 transition-all cursor-pointer ${
              !activeTask && timerMode === 'work'
                ? isLight
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
                : isPomodoroRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                : isLight
                ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs'
                : 'bg-white hover:bg-neutral-100 text-neutral-950 shadow-xs'
            }`}
          >
            {isPomodoroRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{timerMode === 'break' ? 'Start Break' : 'Start Focus'}</span>
              </>
            )}
          </button>

          {/* Skip Break */}
          <button
            onClick={skipBreak}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-medium border flex items-center space-x-1.5 transition-colors cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-neutral-50 border-neutral-200/90 text-neutral-700'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
            }`}
            title="Skip Break [Alt+S]"
          >
            <FastForward className="w-3.5 h-3.5 text-amber-500" />
            <span>Skip</span>
          </button>

          {/* Reset */}
          <button
            onClick={resetPomodoro}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'bg-white hover:bg-neutral-50 border-neutral-200/90 text-neutral-500 hover:text-neutral-900'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
            title="Reset Timer [Alt+R]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? isLight
                  ? 'bg-white hover:bg-neutral-50 border-neutral-200/90 text-neutral-600'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            }`}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Shortcuts Caption */}
        <div className={`mt-5 text-[11px] font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
          <span className="font-semibold">[Space]</span> Toggle &bull;{' '}
          <span className="font-semibold">[Alt+S]</span> Skip &bull;{' '}
          <span className="font-semibold">[Alt+R]</span> Reset
        </div>
      </div>
    </div>
  );
};
