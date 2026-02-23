'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FlaskConical } from 'lucide-react';

type Mode = 'lecture' | 'sandbox';

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex gap-1 p-1 rounded-lg bg-gray-900/60 border border-white/10">
      {(['lecture', 'sandbox'] as const).map((m) => (
        <motion.button
          key={m}
          onClick={() => onModeChange(m)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono uppercase tracking-wider
            transition-colors
            ${mode === m
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'text-gray-500 hover:text-gray-300 border border-transparent'}
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {m === 'lecture' ? <BookOpen className="w-3.5 h-3.5" /> : <FlaskConical className="w-3.5 h-3.5" />}
          {m === 'lecture' ? 'Lecture' : 'Sandbox'}
        </motion.button>
      ))}
    </div>
  );
}
