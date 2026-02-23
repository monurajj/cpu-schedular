'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ThreadMemoryLayout() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        className="rounded-xl border-2 border-cyan-500/30 overflow-hidden bg-gray-900/60"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <div className="px-4 py-2 bg-cyan-500/10 border-b border-cyan-500/20">
          <span className="text-xs font-mono text-cyan-400 font-semibold">Process Address Space</span>
        </div>
        <div className="p-4 space-y-2">
          {/* Shared: Code, Data, Heap */}
          <motion.div
            className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-2 h-12 rounded bg-emerald-500/50" />
            <div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">Shared</span>
              <p className="text-[10px] text-gray-500 mt-0.5">Code • Data • Heap</p>
            </div>
          </motion.div>
          {/* Separate: Stack per thread */}
          <div className="flex gap-4">
            {['T1', 'T2', 'T3'].map((t, i) => (
              <motion.div
                key={t}
                className="flex-1 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <div className="w-full h-8 rounded bg-amber-500/30 mb-1" />
                <span className="text-[10px] font-mono text-amber-400">{t} Stack</span>
              </motion.div>
            ))}
          </div>
          <p className="text-[10px] text-gray-500 text-center mt-2">
            Each thread has its own stack & PC; all share code, data, heap
          </p>
        </div>
      </motion.div>
    </div>
  );
}
