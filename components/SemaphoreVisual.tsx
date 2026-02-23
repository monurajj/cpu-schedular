'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SemaphoreVisualProps {
  value: number;
  label?: string;
  waiting?: number;
  type?: 'binary' | 'counting';
}

export default function SemaphoreVisual({ value, label = 'S', waiting = 0, type = 'counting' }: SemaphoreVisualProps) {
  const maxVal = type === 'binary' ? 1 : 5;
  const displayVal = Math.min(value, maxVal);

  return (
    <motion.div
      className="inline-flex flex-col items-center p-4 rounded-xl bg-gray-900/60 border border-cyan-500/30"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <span className="text-xs font-mono text-cyan-400 mb-2">{label}</span>
      <div className="w-16 h-16 rounded-lg bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center">
        <span className="text-2xl font-mono font-bold text-cyan-400">{displayVal}</span>
      </div>
      <span className="text-[10px] font-mono text-gray-500 mt-2">
        {type === 'binary' ? (value ? 'Available' : 'Locked') : `${value} slots`}
      </span>
      {waiting > 0 && (
        <div className="mt-2 flex gap-1">
          {Array.from({ length: Math.min(waiting, 3) }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-amber-500/60"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
          {waiting > 3 && <span className="text-[10px] text-amber-400">+{waiting - 3}</span>}
        </div>
      )}
    </motion.div>
  );
}
