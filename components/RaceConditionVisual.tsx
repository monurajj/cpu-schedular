'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function RaceConditionVisual() {
  return (
    <motion.div
      className="rounded-xl border border-amber-500/30 bg-gray-900/60 p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="flex items-center justify-between gap-8">
        {/* T1 */}
        <div className="flex-1 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <span className="text-xs font-mono text-cyan-400 block mb-2">Thread 1</span>
          <div className="space-y-1 text-xs font-mono">
            <div className="text-gray-400">temp = count <span className="text-amber-400">// READ</span></div>
            <div className="text-gray-500">... context switch ...</div>
            <div className="text-gray-400">count = temp + 1 <span className="text-emerald-400">// WRITE</span></div>
          </div>
        </div>

        {/* Shared variable */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center">
            <span className="text-lg font-mono font-bold text-amber-400">count</span>
          </div>
          <span className="text-[10px] text-gray-500 mt-2">Shared</span>
        </div>

        {/* T2 */}
        <div className="flex-1 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <span className="text-xs font-mono text-emerald-400 block mb-2">Thread 2</span>
          <div className="space-y-1 text-xs font-mono">
            <div className="text-gray-400">temp = count <span className="text-amber-400">// READ</span></div>
            <div className="text-gray-500">... context switch ...</div>
            <div className="text-gray-400">count = temp + 1 <span className="text-emerald-400">// WRITE</span></div>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-4 font-mono">
        Both read same value → both write → one update lost
      </p>
    </motion.div>
  );
}
