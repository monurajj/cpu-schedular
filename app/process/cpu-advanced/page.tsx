'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Scale,
  Cpu,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const contextSwitchCosts = [
  { item: 'Saving/restoring registers', cycles: '~200 cycles', icon: Cpu },
  { item: 'TLB Flush', cycles: '~1000 cycles', icon: Layers },
  { item: 'Cache Misses', cycles: '~10,000+ cycles', icon: Zap },
];

const schedulerTypes = [
  { id: 'realtime', label: 'Real-time', desc: 'Critical system updates. Must meet deadlines.' },
  { id: 'batch', label: 'Batch', desc: 'Background renders. Throughput matters.' },
  { id: 'interactive', label: 'Interactive', desc: 'Video calls, UI. Response time matters.' },
];

export default function CPUAdvancedPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">CPU Scheduling Advanced</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Lecture 9: Evaluation & Modern Era</p>
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
                  <Scale className="w-5 h-5 text-cyan-400" />
                  The Scheduler&apos;s Dilemma
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Balancing critical system updates (Real-time) with background renders (Batch) and video calls (Interactive). Each workload has different demands—deadlines, throughput, or response time.
                </p>
                <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={containerVariants} initial="hidden" animate="visible">
                  {schedulerTypes.map((s) => (
                    <motion.div key={s.id} variants={itemVariants} className="p-4 rounded-xl bg-gray-900/40 border border-white/5" whileHover={{ scale: 1.02 }}>
                      <h3 className="font-semibold text-cyan-400 mb-2">{s.label}</h3>
                      <p className="text-sm text-gray-400">{s.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Context Switch Costs
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Every context switch has a price. The scheduler must balance switching often enough to be responsive (low latency) but not so often that overhead dominates (high overhead).
                </p>
                <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
                  {contextSwitchCosts.map((c) => (
                    <motion.div key={c.item} variants={itemVariants} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/40 border border-white/5">
                      <div className="flex items-center gap-3">
                        <c.icon className="w-5 h-5 text-cyan-400" />
                        <span className="font-mono text-gray-200">{c.item}</span>
                      </div>
                      <span className="text-cyan-400 font-mono text-sm">{c.cycles}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Modern Era
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  <strong className="text-cyan-400">CFS (Completely Fair Scheduler)</strong> in Linux uses a red-black tree to track processes by &quot;virtual runtime&quot;—ensuring fairness. <strong className="text-cyan-400">Load Balancing</strong> distributes work across multi-core processors to avoid idle cores.
                </p>
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
                  <Scale className="w-5 h-5 text-cyan-400" />
                  The Scheduler&apos;s Dilemma
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Click each workload type to see how the scheduler prioritizes.
                </p>
                <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                  {schedulerTypes.map((s) => (
                    <motion.button
                      key={s.id}
                      variants={itemVariants}
                      onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                      className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
                        expanded === s.id ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-gray-900/40 border-white/5 hover:border-white/10'
                      }`}
                      whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="font-semibold text-gray-200">{s.label}</span>
                      {expanded === s.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </motion.button>
                  ))}
                </motion.div>
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-4 rounded-xl bg-gray-900/60 border border-cyan-500/20"
                    >
                      {schedulerTypes
                        .filter((s) => s.id === expanded)
                        .map((s) => (
                          <p key={s.id} className="text-sm text-gray-400">
                            {s.desc}
                          </p>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Context Switch Cost Breakdown
                </h2>
                <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
                  {contextSwitchCosts.map((c) => (
                    <motion.div key={c.item} variants={itemVariants} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/40 border border-white/5">
                      <div className="flex items-center gap-3">
                        <c.icon className="w-5 h-5 text-cyan-400" />
                        <span className="font-mono text-gray-200">{c.item}</span>
                      </div>
                      <span className="text-cyan-400 font-mono text-sm">{c.cycles}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
