'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Info,
  Zap,
  ArrowRight,
  Lock,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react';
import DeadlockCycleVisual from '@/components/DeadlockCycleVisual';
import ModeToggle from '@/components/ModeToggle';

const CONDITIONS = [
  { id: 'mutual', name: 'Mutual Exclusion', short: 'ME', desc: 'Resource cannot be shared; only one process at a time.' },
  { id: 'hold', name: 'Hold and Wait', short: 'HW', desc: 'Process holds resources while waiting for more.' },
  { id: 'noPreempt', name: 'No Preemption', short: 'NP', desc: 'Resources cannot be forcibly taken away.' },
  { id: 'circular', name: 'Circular Wait', short: 'CW', desc: 'Circular chain: P0 waits for P1, P1 for P2, ... Pn for P0.' },
];

export default function DeadlockIntroPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [active, setActive] = useState<Set<string>>(new Set(['mutual', 'hold', 'noPreempt', 'circular']));

  const toggle = (id: string) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allFour = active.size === 4;
  const hasDeadlock = allFour;

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Deadlock Introduction</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Deadlocks • Lecture 15</p>
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
                  <Info className="w-5 h-5 text-cyan-400" />
                  What is Deadlock?
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  <strong className="text-cyan-400">Deadlock</strong> occurs when two or more processes are blocked forever, each holding resources that another needs. No process can proceed; the system is stuck.
                </p>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-red-200 font-mono">
                    Example: P1 holds A, waits for B. P2 holds B, waits for A. Both wait forever.
                  </p>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  Four Necessary Conditions
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  All four must hold simultaneously for deadlock to occur. Break any one to prevent deadlock.
                </p>
                <div className="space-y-4">
                  {CONDITIONS.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                      <h3 className="font-semibold text-gray-200 mb-1">{c.name}</h3>
                      <p className="text-sm text-gray-400">{c.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <DeadlockCycleVisual processes={['P0', 'P1', 'P2', 'P3']} />
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Handling Deadlocks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Prevention</h4>
                    <p className="text-sm text-gray-400">Design to ensure one of the four conditions never holds.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Avoidance</h4>
                    <p className="text-sm text-gray-400">Banker&apos;s algorithm: grant resources only if safe.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Detection & Recovery</h4>
                    <p className="text-sm text-gray-400">Periodically detect deadlock; recover by aborting or preempting.</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/deadlocks/rag" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Resource Allocation Graph <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/deadlocks/detection" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Detection & Recovery
                  </Link>
                  <Link href="/synchronization/dining-philosophers" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Dining Philosophers
                  </Link>
                </div>
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
                  <AlertCircle className="w-5 h-5 text-cyan-400" />
                  Four Conditions Simulator
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Toggle each condition on/off. Deadlock occurs only when all four are active.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {CONDITIONS.map((c) => {
                    const isOn = active.has(c.id);
                    return (
                      <motion.button
                        key={c.id}
                        onClick={() => toggle(c.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          isOn
                            ? 'bg-amber-500/10 border-amber-500/40'
                            : 'bg-gray-900/40 border-gray-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-cyan-400">{c.short}</span>
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${isOn ? 'bg-amber-500/30' : 'bg-gray-700'}`}>
                            {isOn ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <X className="w-3.5 h-3.5 text-gray-500" />}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-200 text-sm mb-1">{c.name}</h3>
                        <p className="text-xs text-gray-500">{c.desc}</p>
                      </motion.button>
                    );
                  })}
                </div>
                <div className="text-center">
                  {hasDeadlock ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-block p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-sm"
                    >
                      ⚠ DEADLOCK — All 4 conditions hold!
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-block p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-sm"
                    >
                      ✓ No deadlock — {4 - active.size} condition(s) broken
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-wrap gap-3">
                  <Link href="/deadlocks/rag" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Resource Allocation Graph <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/deadlocks/detection" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Detection & Recovery
                  </Link>
                  <Link href="/synchronization/dining-philosophers" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Dining Philosophers
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
