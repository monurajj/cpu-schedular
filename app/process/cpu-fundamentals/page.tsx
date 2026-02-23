'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Cpu,
  Zap,
  Clock,
  BarChart3,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Target,
  Layers,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const schedulingMoments = [
  { id: 'run-wait', label: 'Running → Waiting', desc: 'Process blocks for I/O.' },
  { id: 'terminate', label: 'Terminates', desc: 'Process finishes execution.' },
  { id: 'run-ready', label: 'Running → Ready', desc: 'Time quantum expires (Preemption).' },
  { id: 'wait-ready', label: 'Waiting → Ready', desc: 'I/O completion.' },
];

const metrics = [
  { id: 'util', label: 'CPU Utilization', target: '40–90%', desc: 'Keeping the CPU busy.', icon: Cpu },
  { id: 'throughput', label: 'Throughput', target: 'Higher is better', desc: 'Number of processes completed per time unit.', icon: Zap },
  { id: 'tat', label: 'Turnaround Time', target: 'Lower is better', desc: 'Total time from submission to completion.', icon: Clock },
  { id: 'wt', label: 'Waiting Time', target: 'Lower is better', desc: 'Total time spent in the Ready Queue.', icon: Layers },
  { id: 'rt', label: 'Response Time', target: 'Lower is better', desc: 'Time from submission to first output (crucial for UI).', icon: Target },
];

export default function CPUFundamentalsPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">CPU Scheduling Fundamentals</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Lecture 6: The Traffic Controller</p>
          </div>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </header>

        <AnimatePresence mode="wait">
          {mode === 'lecture' ? (
            <motion.div
              key="lecture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  The Impossible Multitasking Trick
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  How do 4–8 CPU cores run 100+ processes simultaneously? Through <strong className="text-cyan-400">rapid switching</strong>—the scheduler switches between processes 10–100 times per second, creating the illusion of parallel execution.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Scheduling Moments
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  The scheduler makes decisions when a process:
                </p>
                <motion.ul className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                  {schedulingMoments.map((m) => (
                    <motion.li key={m.id} variants={itemVariants} className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/40">
                      <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono text-cyan-400">{m.label}</span>
                        <span className="text-gray-500 mx-2">—</span>
                        <span className="text-gray-400">{m.desc}</span>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Critical Metrics (The Evaluation Framework)
                </h2>
                <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                  {metrics.map((m) => (
                    <motion.div key={m.id} variants={itemVariants} className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                      <div className="flex items-center gap-3 mb-2">
                        <m.icon className="w-6 h-6 text-cyan-400" />
                        <h3 className="font-semibold text-gray-200">{m.label}</h3>
                        <span className="text-xs font-mono text-cyan-400/80">Target: {m.target}</span>
                      </div>
                      <p className="text-sm text-gray-400">{m.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/cpu-scheduling"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors text-sm font-mono"
                >
                  Try the Gantt Chart Visualizer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  Metrics Explorer
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Click each metric to learn its role in evaluating schedulers.
                </p>
                <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                  {metrics.map((m) => (
                    <motion.button
                      key={m.id}
                      variants={itemVariants}
                      onClick={() => setExpandedMetric(expandedMetric === m.id ? null : m.id)}
                      className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
                        expandedMetric === m.id ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-gray-900/40 border-white/5 hover:border-white/10'
                      }`}
                      whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <m.icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-200">{m.label}</span>
                          <span className="text-xs font-mono text-cyan-400/80 ml-2">Target: {m.target}</span>
                        </div>
                      </div>
                      {expandedMetric === m.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </motion.button>
                  ))}
                </motion.div>
                <AnimatePresence>
                  {expandedMetric && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-4 rounded-xl bg-gray-900/60 border border-cyan-500/20"
                    >
                      {metrics
                        .filter((m) => m.id === expandedMetric)
                        .map((m) => (
                          <p key={m.id} className="text-sm text-gray-400">
                            {m.desc}
                          </p>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Scheduling Moments
                </h2>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={containerVariants} initial="hidden" animate="visible">
                  {schedulingMoments.map((m) => (
                    <motion.div key={m.id} variants={itemVariants} className="p-4 rounded-xl bg-gray-900/40 border border-white/5" whileHover={{ scale: 1.02 }}>
                      <span className="font-mono text-cyan-400 text-sm">{m.label}</span>
                      <p className="text-sm text-gray-400 mt-1">{m.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <Link
                href="/cpu-scheduling"
                className="block w-full p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center text-cyan-400 font-mono hover:bg-cyan-500/20 transition-colors"
              >
                Open Gantt Chart Visualizer →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
