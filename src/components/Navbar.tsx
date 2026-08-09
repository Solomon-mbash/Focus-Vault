'use client';

import React, { useState } from 'react';
import { useFocusStore, useStreakCount } from '@/store/useFocusStore';
import { BackupModal } from '@/components/BackupModal';
import {
  Flame,
  LayoutDashboard,
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
        className={`w-full sticky top-0 z-40 select-none transition-colors duration-300 ${
          isLight
            ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm text-slate-800'
            : 'bg-[#070707]/90 backdrop-blur-md border-b border-neutral-800/90 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('board')}>
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                isLight
                  ? 'bg-[#4946FF] border-[#3B38EC] shadow-[0_0_15px_rgba(73,70,255,0.4)]'
                  : 'bg-red-600 border-red-500/80 shadow-[0_0_18px_rgba(239,68,68,0.5)]'
              }`}
            >
              <Shield className="w-5 h-5 text-white fill-white/20" />
            </div>
            <div>
              <div className="text-base font-black font-mono tracking-wider leading-none">
                FOCUS
                <span className={isLight ? 'text-[#4946FF]' : 'text-red-500'}>VAULT</span>
              </div>
              <div className="text-[9px] font-mono text-neutral-400 tracking-widest mt-0.5 uppercase">
                EXECUTION PRISON
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav
            className={`hidden md:flex items-center space-x-1.5 p-1.5 rounded-xl border font-mono text-xs shadow-inner transition-colors ${
              isLight
                ? 'bg-slate-100/90 border-slate-200'
                : 'bg-[#111111] border-neutral-800/90'
            }`}
          >
            <button
              onClick={() => setActiveTab('board')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'board'
                  ? isLight
                    ? 'bg-[#4946FF] text-white font-bold shadow-md shadow-[#4946FF]/30'
                    : 'bg-neutral-800 text-white font-bold border border-neutral-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <LayoutDashboard className={`w-3.5 h-3.5 ${isLight ? 'text-white' : 'text-red-500'}`} />
              <span>EXECUTION BOARD</span>
            </button>

            <button
              onClick={() => setActiveTab('journal')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'journal'
                  ? isLight
                    ? 'bg-[#4946FF] text-white font-bold shadow-md shadow-[#4946FF]/30'
                    : 'bg-neutral-800 text-white font-bold border border-neutral-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <TrendingUp className={`w-3.5 h-3.5 ${isLight ? 'text-white' : 'text-emerald-400'}`} />
              <span>TRADE JOURNAL</span>
            </button>

            <button
              onClick={() => setActiveTab('later')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'later'
                  ? isLight
                    ? 'bg-[#4946FF] text-white font-bold shadow-md shadow-[#4946FF]/30'
                    : 'bg-neutral-800 text-white font-bold border border-neutral-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <Lightbulb className={`w-3.5 h-3.5 ${isLight ? 'text-white' : 'text-amber-300'}`} />
              <span>LATER LIST</span>
            </button>
          </nav>

          {/* Right side stats & actions */}
          <div className="flex items-center space-x-2.5">
            {/* Streak Counter */}
            <div
              className={`flex items-center space-x-2 border px-3.5 py-1.5 rounded-lg text-xs font-mono shadow-inner ${
                isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-[#111111] border-neutral-800 text-neutral-300'
              }`}
            >
              <Flame className={`w-4 h-4 animate-pulse ${isLight ? 'text-[#4946FF] fill-[#4946FF]/20' : 'text-red-500 fill-red-500/20'}`} />
              <span className={`font-bold ${isLight ? 'text-[#4946FF]' : 'text-red-400'}`}>{streak}D STREAK</span>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={isLight ? 'Switch to Obsidian Dark Mode' : 'Switch to Electric Light Mode'}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-[#4946FF]'
                  : 'bg-[#111111] hover:bg-neutral-800 border-neutral-800 text-amber-400'
              }`}
            >
              {isLight ? <Moon className="w-4 h-4 fill-[#4946FF]/20" /> : <Sun className="w-4 h-4 fill-amber-400/20" />}
            </button>

            {/* Database Modal Trigger */}
            <button
              onClick={() => setIsBackupOpen(true)}
              title="Database & Backup Options"
              className={`px-3 py-1.5 border rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 text-xs font-mono font-bold ${
                isLight
                  ? 'bg-[#4946FF]/10 hover:bg-[#4946FF]/20 border-[#4946FF]/30 text-[#4946FF]'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <Database className={`w-3.5 h-3.5 ${isLight ? 'text-[#4946FF]' : 'text-emerald-400'}`} />
              <span className="hidden sm:inline">DATABASE</span>
            </button>

            <button
              onClick={handleResetData}
              title="Reset All Local Data"
              className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600'
                  : 'bg-[#111111] hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`flex md:hidden border-t font-mono text-[10px] overflow-x-auto ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0A0A0A] border-neutral-800/80'
          }`}
        >
          <button
            onClick={() => setActiveTab('board')}
            className={`flex-1 py-2.5 px-2 text-center whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === 'board'
                ? isLight
                  ? 'border-[#4946FF] text-[#4946FF] font-bold bg-white'
                  : 'border-red-500 text-white font-bold bg-[#111111]'
                : 'border-transparent text-neutral-400'
            }`}
          >
            BOARD
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex-1 py-2.5 px-2 text-center whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === 'journal'
                ? isLight
                  ? 'border-[#4946FF] text-[#4946FF] font-bold bg-white'
                  : 'border-emerald-500 text-white font-bold bg-[#111111]'
                : 'border-transparent text-neutral-400'
            }`}
          >
            TRADES
          </button>
          <button
            onClick={() => setActiveTab('later')}
            className={`flex-1 py-2.5 px-2 text-center whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === 'later'
                ? isLight
                  ? 'border-[#4946FF] text-[#4946FF] font-bold bg-white'
                  : 'border-amber-300 text-white font-bold bg-[#111111]'
                : 'border-transparent text-neutral-400'
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
