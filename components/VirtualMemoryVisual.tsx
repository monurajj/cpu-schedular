'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive } from 'lucide-react';

interface VirtualMemoryVisualProps {
  inRAM?: number[];
  onDisk?: number[];
  accessing?: number;
}

export default function VirtualMemoryVisual({ inRAM = [0, 1, 2, 3], onDisk = [4, 5, 6, 7], accessing = 4 }: VirtualMemoryVisualProps) {
  const isHit = inRAM.includes(accessing);
  return (
    <motion.div
      className="grid grid-cols-2 gap-6 p-6 rounded-xl border border-cyan-500/30 bg-gray-900/60"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-cyan-400">RAM (Physical Frames)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {inRAM.map((p) => (
            <div
              key={p}
              className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono text-sm font-bold border-2 ${
                accessing === p ? 'bg-cyan-500/30 border-cyan-500' : 'bg-cyan-500/10 border-cyan-500/40'
              }`}
            >
              P{p}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <HardDrive className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-mono text-gray-500">Disk (Backing Store)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {onDisk.map((p) => (
            <div
              key={p}
              className={`w-12 h-12 rounded-lg flex items-center justify-center font-mono text-sm font-bold border-2 ${
                accessing === p ? 'bg-amber-500/30 border-amber-500 animate-pulse' : 'bg-gray-800/60 border-gray-600'
              }`}
            >
              P{p}
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-2 text-center">
        <p className="text-xs font-mono text-gray-500">
          Accessing P{accessing} → {isHit ? '✓ Page hit (in RAM)' : '⚠ Page fault (load from disk)'}
        </p>
      </div>
    </motion.div>
  );
}
