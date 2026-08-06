'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { AGGRESSIVE_REDUCE_ITEMS } from '@/constants/quotes';
import {
  ShieldAlert,
  Target,
  Crosshair,
  Lock,
  CheckSquare,
  Square,
  Edit3,
  Check,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const VisionForcefield: React.FC = () => {
  const { vision, updateVision, avoidChecklist, toggleAvoidItem, tasks } = useFocusStore();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const p1Tasks = tasks.filter((t) => t.priority === 'P1' && t.status !== 'done');

  const startEdit = (field: keyof typeof vision, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = (field: keyof typeof vision) => {
    if (field === 'oneMonthProject') {
      if (
        tempValue.trim() !== '' &&
        vision.oneMonthProject.trim() !== '' &&
        tempValue.trim() !== vision.oneMonthProject.trim()
      ) {
        alert(
          '⚠️ STRICT RULE ENFORCED: Only ONE 1-Month Boss Fight Project is allowed! Clear or finish your current project before starting another.'
        );
        setEditingField(null);
        return;
      }
    }

    updateVision({ [field]: tempValue.trim() });
    setEditingField(null);
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Banner */}
      <div className="bg-[#111111] border border-neutral-800 p-6 rounded-xl shadow-xl">
        <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
          FRAMEWORK ARCHITECTURE
        </div>
        <h2 className="text-2xl font-black font-mono tracking-tight text-white mt-0.5 flex items-center space-x-2.5">
          <Crosshair className="w-6 h-6 text-red-500" />
          <span>VISION FORCEFIELD & CONSTRAINTS</span>
        </h2>
        <p className="text-xs text-neutral-400 font-mono mt-1">
          Eliminate distraction. Enforce singular focus on the single active 1-Month project.
        </p>
      </div>

      {/* Concentric Circle Visual Diagram & Edit Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Concentric Circle Orbit Graphic (Left column) */}
        <div className="lg:col-span-5 bg-[#0B0B0B] border border-neutral-800 p-6 rounded-xl flex flex-col items-center justify-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          <div className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-widest z-10 flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-red-500" />
            <span>CONCENTRIC FORCEFIELD ORBIT</span>
          </div>

          {/* Concentric Orbit Visual */}
          <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center select-none z-10 my-2">
            {/* Outer Ring: Constraints */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-neutral-700/60 flex items-center justify-center p-2 animate-[spin_80s_linear_infinite]" />
            <div className="absolute top-2 text-[9px] font-mono text-neutral-400 font-bold uppercase tracking-wider bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
              OUTER: CONSTRAINTS
            </div>

            {/* Ring 4: Daily Levers */}
            <div className="absolute inset-6 rounded-full border border-red-900/40 flex items-center justify-center" />
            <div className="absolute top-8 text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider">
              DAILY LEVERS (P1)
            </div>

            {/* Ring 3: 1-Month Boss Fight */}
            <div className="absolute inset-14 rounded-full border-2 border-red-600/70 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.15)]" />

            {/* Ring 2: 1-Year Mission */}
            <div className="absolute inset-22 rounded-full border border-amber-500/50 flex items-center justify-center" />

            {/* Ring 1: Vision */}
            <div className="absolute inset-28 rounded-full border border-neutral-600 flex items-center justify-center" />

            {/* Center Core: Anti-Vision */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="w-20 h-20 bg-red-950/90 border-2 border-red-600 rounded-full flex flex-col items-center justify-center text-center p-1 shadow-[0_0_25px_rgba(239,68,68,0.4)] z-20 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-[9px] font-mono font-black text-red-200 leading-tight mt-0.5">
                ANTI-VISION CORE
              </span>
            </motion.div>
          </div>

          <div className="text-[11px] font-mono text-neutral-500 text-center max-w-xs z-10">
            // Anti-Vision core generates discipline pressure. Outer constraints shield your focus.
          </div>
        </div>

        {/* Interactive Framework Cards (Right column) */}
        <div className="lg:col-span-7 space-y-4">
          {/* CENTER: ANTI-VISION */}
          <div className="bg-[#111111] border-l-4 border-red-600 border-y border-r border-neutral-800 p-5 rounded-r-xl space-y-2 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-red-400 font-bold uppercase tracking-wider flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span>CENTER CORE: ANTI-VISION (WHAT I NEVER WANT AGAIN)</span>
              </span>
              {editingField !== 'antiVision' && (
                <button
                  onClick={() => startEdit('antiVision', vision.antiVision)}
                  className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {editingField === 'antiVision' ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs font-sans text-white focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={() => saveEdit('antiVision')}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-lg flex items-center space-x-1 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>SAVE ANTI-VISION</span>
                </button>
              </div>
            ) : (
              <p className="text-xs font-sans text-neutral-200 leading-relaxed font-medium bg-neutral-950/70 p-3.5 rounded-lg border border-neutral-800/80">
                {vision.antiVision}
              </p>
            )}
          </div>

          {/* NEXT: VISION */}
          <div className="bg-[#111111] border-l-4 border-amber-500 border-y border-r border-neutral-800 p-5 rounded-r-xl space-y-2 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center space-x-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span>NEXT: VISION (IDEAL FREE LIFE & TECH GOALS)</span>
              </span>
              {editingField !== 'vision' && (
                <button
                  onClick={() => startEdit('vision', vision.vision)}
                  className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {editingField === 'vision' ? (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs font-sans text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => saveEdit('vision')}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold rounded-lg flex items-center space-x-1 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>SAVE VISION</span>
                </button>
              </div>
            ) : (
              <p className="text-xs font-sans text-neutral-200 leading-relaxed bg-neutral-950/70 p-3.5 rounded-lg border border-neutral-800/80">
                {vision.vision}
              </p>
            )}
          </div>

          {/* NEXT: 1-YEAR MISSION */}
          <div className="bg-[#111111] border-l-4 border-neutral-400 border-y border-r border-neutral-800 p-5 rounded-r-xl space-y-2 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-300 font-bold uppercase tracking-wider">
                NEXT: 1-YEAR GOAL & MISSION
              </span>
              {editingField !== 'oneYearGoal' && (
                <button
                  onClick={() => startEdit('oneYearGoal', vision.oneYearGoal)}
                  className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {editingField === 'oneYearGoal' ? (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs font-sans text-white focus:outline-none focus:border-neutral-400"
                />
                <button
                  onClick={() => saveEdit('oneYearGoal')}
                  className="px-3.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white font-mono text-xs font-bold rounded-lg flex items-center space-x-1 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>SAVE GOAL</span>
                </button>
              </div>
            ) : (
              <p className="text-xs font-sans text-neutral-200 leading-relaxed bg-neutral-950/70 p-3.5 rounded-lg border border-neutral-800/80">
                {vision.oneYearGoal}
              </p>
            )}
          </div>

          {/* NEXT: 1-MONTH PROJECT (BOSS FIGHT - STRICT ONLY ONE) */}
          <div className="bg-[#111111] border-l-4 border-red-500 border-y border-r border-neutral-800 p-5 rounded-r-xl space-y-2 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-red-400 font-bold uppercase tracking-wider flex items-center space-x-2">
                <Lock className="w-4 h-4 text-red-500" />
                <span>NEXT: 1-MONTH PROJECT (ONLY 1 BOSS FIGHT ALLOWED)</span>
              </span>
              {editingField !== 'oneMonthProject' && (
                <button
                  onClick={() => startEdit('oneMonthProject', vision.oneMonthProject)}
                  className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {editingField === 'oneMonthProject' ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  placeholder="Single Active Project Name..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                />
                <div className="flex justify-between items-center text-[10px] font-mono text-red-400">
                  <span>⚠️ Rule: Clear current project string before adding new project!</span>
                  <button
                    onClick={() => saveEdit('oneMonthProject')}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-lg flex items-center space-x-1 shadow-md"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>UPDATE PROJECT</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-red-950/40 border border-red-800/80 rounded-lg flex items-center justify-between font-mono text-xs font-bold text-red-200 shadow-inner">
                <span>{vision.oneMonthProject || 'NO ACTIVE PROJECT - CLICK EDIT TO LOCK IN'}</span>
                <span className="px-2.5 py-0.5 bg-red-900 border border-red-600 rounded-md text-[10px]">
                  SINGLE FOCUS
                </span>
              </div>
            )}
          </div>

          {/* NEXT: DAILY LEVERS (AUTO-LINKED FROM P1 TASKS) */}
          <div className="bg-[#111111] border-l-4 border-emerald-500 border-y border-r border-neutral-800 p-5 rounded-r-xl space-y-2 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>NEXT: DAILY LEVERS (AUTO-LINKED P1 TODAY TASKS)</span>
              </span>
              <span className="text-[10px] text-neutral-500">AUTO-UPDATED FROM BOARD</span>
            </div>

            <div className="space-y-2">
              {p1Tasks.length === 0 ? (
                <div className="text-xs font-mono text-neutral-500 p-2.5 bg-neutral-950 rounded-lg border border-neutral-800/60">
                  No active P1 tasks set for today.
                </div>
              ) : (
                p1Tasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-between font-mono text-xs"
                  >
                    <span className="font-semibold text-white truncate max-w-sm">{t.title}</span>
                    <span className="text-red-400 font-bold text-[10px] bg-red-950 px-2 py-0.5 rounded border border-red-900">
                      P1 MUST ({t.estTime}m)
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* OUTER: CONSTRAINTS */}
          <div className="bg-[#111111] border-l-4 border-neutral-600 border-y border-r border-neutral-800 p-5 rounded-r-xl space-y-2 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400 font-bold uppercase tracking-wider">
                OUTER BOUNDARY: CONSTRAINTS (WHAT I WILL NOT SACRIFICE)
              </span>
              {editingField !== 'constraints' && (
                <button
                  onClick={() => startEdit('constraints', vision.constraints)}
                  className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {editingField === 'constraints' ? (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-xs font-sans text-white focus:outline-none focus:border-neutral-500"
                />
                <button
                  onClick={() => saveEdit('constraints')}
                  className="px-3.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white font-mono text-xs font-bold rounded-lg flex items-center space-x-1 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>SAVE CONSTRAINTS</span>
                </button>
              </div>
            ) : (
              <p className="text-xs font-sans text-neutral-300 leading-relaxed bg-neutral-950/70 p-3.5 rounded-lg border border-neutral-800/80">
                {vision.constraints}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* AGGRESSIVE REDUCTION CHECKLIST FOR NEXT 90 DAYS */}
      <div className="bg-[#111111] border border-neutral-800 p-6 rounded-xl space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div>
            <h3 className="text-lg font-mono font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>FOR NEXT 90 DAYS: AGGRESSIVELY REDUCE</span>
            </h3>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              Check off behaviors to actively suppress and eliminate from daily existence
            </p>
          </div>

          <div className="text-xs font-mono font-bold text-red-400 bg-red-950 border border-red-800 px-3.5 py-1.5 rounded-lg shadow-sm">
            {Object.values(avoidChecklist).filter(Boolean).length} / {AGGRESSIVE_REDUCE_ITEMS.length} ACTIVE BANS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {AGGRESSIVE_REDUCE_ITEMS.map((item) => {
            const isChecked = !!avoidChecklist[item];
            return (
              <button
                key={item}
                onClick={() => toggleAvoidItem(item)}
                className={`p-3.5 rounded-xl border font-mono text-xs text-left flex items-start space-x-3 transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-neutral-950 border-red-900/90 text-red-400 shadow-inner'
                    : 'bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <span className="shrink-0 mt-0.5">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-red-500" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-600" />
                  )}
                </span>
                <span className={isChecked ? 'line-through font-bold text-red-400' : ''}>
                  ❌ {item}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
