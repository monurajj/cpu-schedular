'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageFramesVisualProps {
  frames: (number | null)[];
  reference?: number;
  victim?: number;
}

export default function PageFramesVisual({ frames, reference, victim }: PageFramesVisualProps) {
  return (
    <motion.div
      className="flex gap-3 flex-wrap justify-center p-4 rounded-xl bg-gray-900/60 border border-cyan-500/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {frames.map((page, i) => (
        <motion.div
          key={i}
          className={`w-14 h-14 rounded-xl flex items-center justify-center font-mono font-bold text-sm border-2 transition-all ${
            victim === i
              ? 'bg-red-500/20 border-red-500'
              : reference === i
              ? 'bg-cyan-500/30 border-cyan-500'
              : page !== null
              ? 'bg-cyan-500/10 border-cyan-500/40'
              : 'bg-gray-800/60 border-gray-700'
          }`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {page !== null ? `P${page}` : '—'}
        </motion.div>
      ))}
      <div className="w-full text-center text-xs text-gray-500 font-mono mt-2">
        {victim !== undefined && `Victim: Frame ${victim}`}
        {reference !== undefined && victim === undefined && `Referenced: P${frames[reference]}`}
      </div>
    </motion.div>
  );
}
