'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PagingVisualProps {
  logicalAddr?: number;
  pageSize?: number;
  pageTable?: Record<number, number>;
  showResult?: boolean;
}

export default function PagingVisual({ logicalAddr = 10, pageSize = 4, pageTable = { 0: 2, 1: 5, 2: 0, 3: 7 }, showResult = true }: PagingVisualProps) {
  const page = Math.floor(logicalAddr / pageSize);
  const offset = logicalAddr % pageSize;
  const frame = pageTable[page] ?? -1;
  const physical = frame >= 0 ? frame * pageSize + offset : -1;

  return (
    <motion.div
      className="rounded-xl border border-cyan-500/30 bg-gray-900/60 p-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="grid grid-cols-3 gap-6 items-center">
        {/* Logical Address */}
        <div className="text-center p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <span className="text-xs font-mono text-cyan-400 block mb-2">Logical</span>
          <span className="text-2xl font-mono font-bold text-white">{logicalAddr}</span>
          <div className="mt-2 flex justify-center gap-2 text-xs font-mono">
            <span className="text-amber-400">P{page}</span>
            <span className="text-gray-500">|</span>
            <span className="text-emerald-400">d{offset}</span>
          </div>
        </div>

        {/* Page Table */}
        <div className="p-4 rounded-lg bg-gray-800/60 border border-white/10">
          <span className="text-xs font-mono text-gray-500 block mb-2">Page Table</span>
          <div className="flex flex-wrap gap-1 justify-center">
            {Object.entries(pageTable).map(([p, f]) => (
              <span
                key={p}
                className={`px-2 py-0.5 rounded text-xs font-mono ${
                  Number(p) === page ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50' : 'bg-gray-700/60 text-gray-400'
                }`}
              >
                P{p}→F{f}
              </span>
            ))}
          </div>
        </div>

        {/* Physical Address */}
        <div className="text-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <span className="text-xs font-mono text-emerald-400 block mb-2">Physical</span>
          <span className="text-2xl font-mono font-bold text-white">{physical >= 0 ? physical : '—'}</span>
          {physical >= 0 && (
            <div className="mt-2 text-xs font-mono text-gray-400">
              F{frame} × {pageSize} + {offset}
            </div>
          )}
        </div>
      </div>
      {showResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 pt-4 border-t border-white/10 text-center text-sm font-mono text-gray-400"
        >
          {logicalAddr} ÷ {pageSize} = page {page}, offset {offset}
          {frame >= 0 ? ` → frame ${frame} → physical ${physical}` : ' (page fault)'}
        </motion.div>
      )}
    </motion.div>
  );
}
