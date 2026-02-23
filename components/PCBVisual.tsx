'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, MemoryStick, FileCode, ListChecks } from 'lucide-react';

interface PCBVisualProps {
  highlightedField?: string | null;
  onFieldHover?: (id: string | null) => void;
}

const fields = [
  { id: 'state', label: 'State', value: 'READY', icon: ListChecks, color: '#22c55e' },
  { id: 'pc', label: 'PC', value: '0x0042', icon: Cpu, color: '#3b82f6' },
  { id: 'registers', label: 'Registers', value: 'AX,BX,...', icon: Cpu, color: '#8b5cf6' },
  { id: 'memory', label: 'Memory', value: 'Base/Limit', icon: MemoryStick, color: '#f59e0b' },
  { id: 'io', label: 'I/O', value: 'Open files', icon: FileCode, color: '#ec4899' },
];

export default function PCBVisual({ highlightedField, onFieldHover }: PCBVisualProps) {
  return (
    <motion.div
      className="relative p-4 rounded-xl border-2 border-cyan-500/30 bg-gray-900/80 backdrop-blur"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="absolute -top-2 left-4 px-2 py-0.5 bg-cyan-500/20 rounded text-xs font-mono text-cyan-400 border border-cyan-500/40">
        PCB
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {fields.map((f, i) => {
          const isHighlighted = highlightedField === f.id;
          return (
            <motion.div
              key={f.id}
              className={`p-3 rounded-lg border transition-all cursor-default ${
                isHighlighted ? 'border-cyan-500/60 bg-cyan-500/10' : 'border-white/10 bg-gray-800/40 hover:border-white/20'
              }`}
              onMouseEnter={() => onFieldHover?.(f.id)}
              onMouseLeave={() => onFieldHover?.(null)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 25 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <f.icon className="w-3.5 h-3.5" style={{ color: f.color }} />
                <span className="text-xs font-mono text-gray-400">{f.label}</span>
              </div>
              <span className="text-xs font-mono text-gray-300 truncate block">{f.value}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
