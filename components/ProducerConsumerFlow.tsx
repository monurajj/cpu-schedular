'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Package } from 'lucide-react';

interface ProducerConsumerFlowProps {
  buffer: number[];
  bufferSize?: number;
}

export default function ProducerConsumerFlow({ buffer, bufferSize = 5 }: ProducerConsumerFlowProps) {
  return (
    <motion.div
      className="flex items-center gap-6 p-6 rounded-xl border border-cyan-500/30 bg-gray-900/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center">
          <Plus className="w-6 h-6 text-emerald-400" />
        </div>
        <span className="text-xs font-mono text-emerald-400">Producer</span>
      </div>
      <div className="text-2xl text-gray-600">→</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400">Bounded Buffer ({buffer.length}/{bufferSize})</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {buffer.map((item, i) => (
            <motion.div
              key={`${item}-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-mono text-sm text-cyan-400"
            >
              {item}
            </motion.div>
          ))}
          {Array.from({ length: bufferSize - buffer.length }).map((_, i) => (
            <div key={`e-${i}`} className="w-10 h-10 rounded-lg border border-dashed border-gray-600 flex items-center justify-center text-gray-600 text-xs">
              —
            </div>
          ))}
        </div>
      </div>
      <div className="text-2xl text-gray-600">→</div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center">
          <Minus className="w-6 h-6 text-amber-400" />
        </div>
        <span className="text-xs font-mono text-amber-400">Consumer</span>
      </div>
    </motion.div>
  );
}
