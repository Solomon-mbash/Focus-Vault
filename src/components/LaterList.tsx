'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { Lightbulb, Plus, Trash2, Lock } from 'lucide-react';
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
    <div className="w-full space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div
        className={`p-5 md:p-6 rounded-2xl border transition-colors ${
          isLight
            ? 'bg-white border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-neutral-900'
            : 'bg-[#101014] border-neutral-800/80 text-neutral-100 shadow-xl'
        }`}
      >
        <div className={`text-[11px] font-mono uppercase tracking-wider ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Parking Lot
        </div>
        <h2 className="text-xl font-bold tracking-tight mt-0.5 flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>Later List</span>
        </h2>
        <p className={`text-xs mt-1 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
          Park shiny new ideas here immediately so they don't distract your current focus targets.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Dump shiny new idea here..."
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none border transition-colors ${
            isLight
              ? 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 shadow-xs'
              : 'bg-[#101014] border-neutral-800 text-white placeholder-neutral-600 focus:border-neutral-600'
          }`}
        />
        <button
          type="submit"
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0 shadow-xs ${
            isLight ? 'bg-neutral-900 hover:bg-neutral-800 text-white' : 'bg-white hover:bg-neutral-100 text-neutral-950'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Park</span>
        </button>
      </form>

      {/* List */}
      <div className="space-y-2">
        <div className={`text-xs font-mono uppercase px-1 font-semibold ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Parked Ideas ({laterIdeas.length})
        </div>

        {laterIdeas.length === 0 ? (
          <div
            className={`p-10 text-center border rounded-2xl text-xs font-mono transition-colors ${
              isLight ? 'bg-white border-neutral-200/80 text-neutral-400' : 'bg-[#101014] border-neutral-800/80 text-neutral-500'
            }`}
          >
            No parked ideas. Stay locked in on your current target!
          </div>
        ) : (
          <div className="space-y-1.5">
            <AnimatePresence>
              {laterIdeas.map((idea) => (
                <motion.div
                  key={idea.id}
                  layout
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                    isLight
                      ? 'bg-white border-neutral-200/80 hover:border-neutral-300 text-neutral-800 shadow-xs'
                      : 'bg-[#101014] border-neutral-800/80 hover:border-neutral-700 text-neutral-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{idea.text}</span>
                  </div>
                  <button
                    onClick={() => deleteLaterIdea(idea.id)}
                    className={`p-1 rounded-lg transition-colors shrink-0 cursor-pointer ${
                      isLight ? 'text-neutral-400 hover:text-rose-600 hover:bg-neutral-100' : 'text-neutral-500 hover:text-rose-400 hover:bg-neutral-800'
                    }`}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
