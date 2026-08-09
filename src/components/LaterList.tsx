'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { Lightbulb, Plus, Trash2, ShieldAlert, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LaterList: React.FC = () => {
  const { laterIdeas, addLaterIdea, deleteLaterIdea, theme } = useFocusStore();
  const isLight = theme === 'light';
  const [newIdea, setNewIdea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;
    addLaterIdea(newIdea.trim());
    setNewIdea('');
  };

  return (
    <div className="w-full space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div
        className={`p-6 rounded-xl border shadow-xl transition-colors ${
          isLight ? 'bg-white border-slate-200 shadow-slate-200/50 text-slate-800' : 'bg-[#111111] border-neutral-800 text-white'
        }`}
      >
        <div className={`text-xs font-mono uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
          SHINY OBJECT PARKING LOT
        </div>
        <h2 className="text-2xl font-black font-mono tracking-tight mt-0.5 flex items-center space-x-2.5">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          <span>LATER LIST (DO NOT START NOW)</span>
        </h2>
        <p className={`text-xs font-mono mt-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
          Park shiny new ideas here immediately so you don't derail your active 1-Month Boss Fight project.
        </p>
      </div>

      {/* Warning callout */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center space-x-3 text-amber-800 font-mono text-xs shadow-md">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
        <div>
          <span className="font-bold uppercase text-amber-700">DISCIPLINE RULE:</span> Any project not in your active 1-Month Boss Fight belongs in this vault. Do NOT touch them until the current project is shipped!
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Dump shiny new idea here..."
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          className={`flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none font-sans border shadow-inner ${
            isLight
              ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'
              : 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-amber-500'
          }`}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase rounded-xl flex items-center space-x-2 transition-colors shrink-0 shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>PARK IDEA</span>
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        <div className={`text-xs font-mono px-1 uppercase font-bold ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
          PARKED IDEAS ({laterIdeas.length})
        </div>

        {laterIdeas.length === 0 ? (
          <div className={`p-12 text-center border border-dashed rounded-xl font-mono text-xs ${
            isLight ? 'bg-white border-slate-300 text-slate-500' : 'bg-[#111111] border-neutral-800 text-neutral-500'
          }`}>
            No parked ideas. Stay locked in on your current target!
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence>
              {laterIdeas.map((idea) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 font-mono text-xs shadow-sm transition-all ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      : 'bg-[#111111] border-neutral-800 hover:border-neutral-700 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className={`font-sans text-sm truncate ${isLight ? 'text-slate-800' : 'text-neutral-200'}`}>
                      {idea.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteLaterIdea(idea.id)}
                    className={`p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                      isLight ? 'text-slate-400 hover:text-red-600 hover:bg-slate-100' : 'text-neutral-500 hover:text-red-400 hover:bg-neutral-800'
                    }`}
                    title="Delete Idea"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
