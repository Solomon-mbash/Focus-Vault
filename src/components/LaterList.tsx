'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { Lightbulb, Plus, Trash2, ShieldAlert, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LaterList: React.FC = () => {
  const { laterIdeas, addLaterIdea, deleteLaterIdea } = useFocusStore();
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
      <div className="bg-[#111111] border border-neutral-800 p-6 rounded-xl shadow-xl">
        <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
          SHINY OBJECT PARKING LOT
        </div>
        <h2 className="text-2xl font-black font-mono tracking-tight text-white mt-0.5 flex items-center space-x-2.5">
          <Lightbulb className="w-6 h-6 text-amber-400" />
          <span>LATER LIST (DO NOT START NOW)</span>
        </h2>
        <p className="text-xs text-neutral-400 font-mono mt-1">
          Park shiny new ideas here immediately so you don't derail your active 1-Month Boss Fight project.
        </p>
      </div>

      {/* Warning callout */}
      <div className="bg-amber-950/50 border border-amber-800/80 p-4 rounded-xl flex items-center space-x-3 text-amber-200 font-mono text-xs shadow-lg">
        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
        <div>
          <span className="font-bold uppercase text-amber-400">DISCIPLINE RULE:</span> Any project not in your active 1-Month Boss Fight belongs in this vault. Do NOT touch them until the current project is shipped!
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Dump shiny new idea here..."
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 font-sans shadow-inner"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase rounded-xl flex items-center space-x-2 transition-colors shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>PARK IDEA</span>
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-neutral-400 px-1 uppercase font-bold">
          PARKED IDEAS ({laterIdeas.length})
        </div>

        {laterIdeas.length === 0 ? (
          <div className="p-12 text-center bg-[#111111] border border-dashed border-neutral-800 rounded-xl font-mono text-xs text-neutral-500">
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
                  className="p-4 bg-[#111111] border border-neutral-800 hover:border-neutral-700 rounded-xl flex items-center justify-between gap-4 font-mono text-xs shadow-md transition-all"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <Lock className="w-4 h-4 text-amber-400/80 shrink-0" />
                    <span className="text-neutral-200 font-sans text-sm truncate">
                      {idea.text}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteLaterIdea(idea.id)}
                    className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors shrink-0 cursor-pointer"
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
