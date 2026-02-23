'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlgorithmType } from '@/lib/types';
import { ChevronDown, ChevronUp, Info, AlertTriangle } from 'lucide-react';

const algorithmInfo: Record<AlgorithmType, { title: string; mechanism: string; pros: string[]; cons: string[] }> = {
  FCFS: {
    title: 'First-Come, First-Served',
    mechanism: 'Simple queue-based execution. Processes run in order of arrival.',
    pros: ['Simple', 'No starvation'],
    cons: ['Convoy Effect: one long CPU-bound process blocks many short I/O-bound processes'],
  },
  SJF: {
    title: 'Shortest Job First',
    mechanism: 'Picks the process with the smallest CPU burst. Mathematically optimal for minimum average waiting time.',
    pros: ['Minimum average waiting time (proven)', 'Good for batch systems'],
    cons: ['Starvation for long-running processes', 'Requires predicting burst time'],
  },
  SRTF: {
    title: 'Shortest Remaining Time First',
    mechanism: 'Preemptive SJF. If a new job arrives with shorter remaining time than the current job, it preempts the CPU.',
    pros: ['Optimal for minimizing waiting time', 'Responsive to short jobs'],
    cons: ['Starvation', 'Overhead from preemption'],
  },
  RR: {
    title: 'Round Robin',
    mechanism: 'Each process gets a small time quantum. Fair and responsive.',
    pros: ['Fair', 'Good for time-sharing'],
    cons: ['Quantum too large → becomes FCFS. Too small → context switch overhead destroys performance'],
  },
  'Priority-NP': {
    title: 'Priority (Non-Preemptive)',
    mechanism: 'Each process has a rank. Lower number = higher priority. Runs until completion.',
    pros: ['Important jobs get preference'],
    cons: ['Starvation. Solution: Aging—gradually increase priority of long-waiting processes'],
  },
  'Priority-P': {
    title: 'Priority (Preemptive)',
    mechanism: 'Higher-priority process can preempt lower-priority one.',
    pros: ['Responsive to important jobs'],
    cons: ['Starvation. MLFQ (Multi-Level Feedback Queue) used in macOS: processes move between queues based on behavior. Full quantum → demoted.'],
  },
};

interface AlgorithmGuideProps {
  algorithm: AlgorithmType;
}

export default function AlgorithmGuide({ algorithm }: AlgorithmGuideProps) {
  const [expanded, setExpanded] = useState(true);
  const info = algorithmInfo[algorithm];

  return (
    <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Algorithm Guide (L7–8)</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-3">
              <h3 className="font-semibold text-gray-200 text-sm">{info.title}</h3>
              <p className="text-xs text-gray-400">{info.mechanism}</p>
              <div className="flex gap-4 text-xs">
                <div>
                  <span className="text-emerald-400 font-mono">Pros:</span>
                  <span className="text-gray-400 ml-1">{info.pros.join(', ')}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-mono">Cons:</span>
                  <span className="text-gray-400 ml-1">{info.cons.join(', ')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
