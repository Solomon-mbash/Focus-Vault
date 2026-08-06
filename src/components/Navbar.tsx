'use client';

import React, { useState } from 'react';
import { useFocusStore, useStreakCount } from '@/store/useFocusStore';
import { BackupModal } from '@/components/BackupModal';
import {
  Flame,
  LayoutDashboard,
  Crosshair,
  TrendingUp,
  Lightbulb,
  RotateCcw,
  Shield,
  Database,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, dayLogs, resetAllData } = useFocusStore();
  const streak = useStreakCount(dayLogs);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const handleResetData = () => {
    if (confirm('⚠️ Are you sure you want to reset all Focus Vault data to initial empty state?')) {
      resetAllData();
    }
  };

  return (
    <>
      <header className="w-full bg-[#070707]/90 backdrop-blur-md border-b border-neutral-800/90 sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('board')}>
            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-[0_0_18px_rgba(239,68,68,0.5)] border border-red-500/80">
              <Shield className="w-5 h-5 text-white fill-white/20" />
            </div>
            <div>
              <div className="text-base font-black font-mono tracking-wider text-white leading-none">
                FOCUS<span className="text-red-500">VAULT</span>
              </div>
              <div className="text-[9px] font-mono text-neutral-500 tracking-widest mt-0.5 uppercase">
                EXECUTION PRISON
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-[#111111] p-1.5 rounded-xl border border-neutral-800/90 font-mono text-xs shadow-inner">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'board'
                  ? 'bg-neutral-800 text-white font-bold border border-neutral-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-red-500" />
              <span>EXECUTION BOARD</span>
            </button>

            <button
              onClick={() => setActiveTab('vision')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'vision'
                  ? 'bg-neutral-800 text-white font-bold border border-neutral-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>VISION FORCEFIELD</span>
            </button>

            <button
              onClick={() => setActiveTab('journal')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'journal'
                  ? 'bg-neutral-800 text-white font-bold border border-neutral-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>TRADE JOURNAL</span>
            </button>

            <button
              onClick={() => setActiveTab('later')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'later'
                  ? 'bg-neutral-800 text-white font-bold border border-neutral-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>LATER LIST</span>
            </button>
          </nav>

          {/* Right side stats & actions */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-2 bg-[#111111] border border-neutral-800 px-3.5 py-1.5 rounded-lg text-xs font-mono text-neutral-300 shadow-inner">
              <Flame className="w-4 h-4 text-red-500 fill-red-500/20 animate-pulse" />
              <span className="font-bold text-red-400">{streak}D STREAK</span>
            </div>

            <button
              onClick={() => setIsBackupOpen(true)}
              title="Database & Backup Options"
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-emerald-400 hover:text-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 text-xs font-mono font-bold"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">DATABASE</span>
            </button>

            <button
              onClick={handleResetData}
              title="Reset All Local Data"
              className="p-2.5 bg-[#111111] hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden border-t border-neutral-800/80 bg-[#0A0A0A] font-mono text-[10px] overflow-x-auto">
          <button
            onClick={() => setActiveTab('board')}
            className={`flex-1 py-2.5 px-2 text-center whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === 'board'
                ? 'border-red-500 text-white font-bold bg-[#111111]'
                : 'border-transparent text-neutral-400'
            }`}
          >
            BOARD
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`flex-1 py-2.5 px-2 text-center whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === 'vision'
                ? 'border-amber-500 text-white font-bold bg-[#111111]'
                : 'border-transparent text-neutral-400'
            }`}
          >
            FORCEFIELD
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex-1 py-2.5 px-2 text-center whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === 'journal'
                ? 'border-emerald-500 text-white font-bold bg-[#111111]'
                : 'border-transparent text-neutral-400'
            }`}
          >
            TRADES
          </button>
          <button
            onClick={() => setActiveTab('later')}
            className={`flex-1 py-2.5 px-2 text-center whitespace-nowrap border-b-2 cursor-pointer ${
              activeTab === 'later'
                ? 'border-amber-300 text-white font-bold bg-[#111111]'
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
