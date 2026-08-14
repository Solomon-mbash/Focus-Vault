'use client';

import React, { useState } from 'react';
import { useFocusStore, useStreakCount } from '@/store/useFocusStore';
import { BackupModal } from '@/components/BackupModal';
import {
  Flame,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  RotateCcw,
  Shield,
  Database,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, dayLogs, resetAllData, theme, toggleTheme } = useFocusStore();
  const streak = useStreakCount(dayLogs);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const isLight = theme === 'light';

  const handleResetData = () => {
    if (confirm('⚠️ Are you sure you want to reset all Focus Vault data to initial empty state?')) {
      resetAllData();
    }
  };

  return (
    <>
      <header
        className={`w-full sticky top-0 z-40 select-none transition-colors duration-200 backdrop-blur-xl border-b ${
          isLight
            ? 'bg-white/80 border-neutral-200/80 text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
            : 'bg-[#09090B]/85 border-neutral-800/80 text-neutral-100'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-15 flex items-center justify-between gap-4">
          {/* Brand */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => setActiveTab('board')}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                isLight
                  ? 'bg-neutral-900 text-white shadow-sm group-hover:bg-[#4946FF]'
                  : 'bg-white text-neutral-950 shadow-sm group-hover:bg-neutral-200'
              }`}
            >
              <Shield className="w-4 h-4 fill-current/15 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-bold tracking-tight leading-none flex items-center gap-1">
                <span>FOCUS</span>
                <span className={isLight ? 'text-[#4946FF]' : 'text-neutral-400'}>VAULT</span>
              </div>
              <span className={`text-[10px] font-mono tracking-wider mt-0.5 uppercase ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                EXECUTION SYSTEM
              </span>
            </div>
          </div>

          {/* Segmented Tab Navigation */}
          <nav
            className={`hidden md:flex items-center p-1 rounded-full border transition-colors ${
              isLight
                ? 'bg-neutral-100/80 border-neutral-200/90 text-neutral-600'
                : 'bg-neutral-900/80 border-neutral-800/90 text-neutral-400'
            }`}
          >
            <button
              onClick={() => setActiveTab('board')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'board'
                  ? isLight
                    ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                    : 'bg-neutral-800 text-white shadow-sm font-semibold'
                  : 'hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Execution</span>
            </button>

            <button
              onClick={() => setActiveTab('journal')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'journal'
                  ? isLight
                    ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                    : 'bg-neutral-800 text-white shadow-sm font-semibold'
                  : 'hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trades</span>
            </button>

            <button
              onClick={() => setActiveTab('later')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'later'
                  ? isLight
                    ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                    : 'bg-neutral-800 text-white shadow-sm font-semibold'
                  : 'hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Later</span>
            </button>
          </nav>

          {/* Right side stats & actions */}
          <div className="flex items-center space-x-2">
            {/* Streak Counter */}
            <div
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                isLight
                  ? 'bg-neutral-50 border-neutral-200/80 text-neutral-700'
                  : 'bg-neutral-900/90 border-neutral-800 text-neutral-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              <span className="font-semibold">{streak}d streak</span>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={isLight ? 'Switch to Dark mode' : 'Switch to Light mode'}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isLight
                  ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
              }`}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Database Modal Trigger */}
            <button
              onClick={() => setIsBackupOpen(true)}
              title="Database & Backup"
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isLight
                  ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
              }`}
            >
              <Database className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetData}
              title="Reset All Data"
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isLight
                  ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-400 hover:text-red-600'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-500 hover:text-red-400'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`flex md:hidden border-t font-mono text-[11px] ${
            isLight ? 'bg-neutral-50 border-neutral-200' : 'bg-[#09090B] border-neutral-800'
          }`}
        >
          <button
            onClick={() => setActiveTab('board')}
            className={`flex-1 py-2.5 px-2 text-center transition-colors cursor-pointer ${
              activeTab === 'board'
                ? isLight
                  ? 'text-neutral-900 font-bold bg-white'
                  : 'text-white font-bold bg-neutral-900'
                : 'text-neutral-400'
            }`}
          >
            EXECUTION
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex-1 py-2.5 px-2 text-center transition-colors cursor-pointer ${
              activeTab === 'journal'
                ? isLight
                  ? 'text-neutral-900 font-bold bg-white'
                  : 'text-white font-bold bg-neutral-900'
                : 'text-neutral-400'
            }`}
          >
            TRADES
          </button>
          <button
            onClick={() => setActiveTab('later')}
            className={`flex-1 py-2.5 px-2 text-center transition-colors cursor-pointer ${
              activeTab === 'later'
                ? isLight
                  ? 'text-neutral-900 font-bold bg-white'
                  : 'text-white font-bold bg-neutral-900'
                : 'text-neutral-400'
            }`}
          >
            LATER
          </button>
        </div>
      </header>

      {/* Backup Modal */}
      <BackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />
    </>
  );
};
