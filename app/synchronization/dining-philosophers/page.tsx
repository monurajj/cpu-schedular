'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  Info,
  Zap,
  ArrowRight,
  AlertTriangle,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';

const solutions = [
  {
    id: 'odd-even',
    title: 'Odd-Even Rule',
    description: 'Odd-numbered philosophers pick left first; even-numbered pick right first. Breaks circular wait.',
  },
  {
    id: 'hierarchy',
    title: 'Resource Hierarchy',
    description: 'Number chopsticks. Always acquire lower-numbered chopstick first. Prevents circular wait.',
  },
  {
    id: 'waiter',
    title: 'Arbitrator (Waiter)',
    description: 'A central authority grants permission. Only allow 4 of 5 to hold chopsticks at once.',
  },
];

export default function DiningPhilosophersPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [holding, setHolding] = useState<Set<number>>(new Set()); // philosopher index holding left chopstick

  const togglePhilosopher = (idx: number) => {
    setHolding((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const hasDeadlock = holding.size === 5; // All holding one = deadlock

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Dining Philosophers</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Process Synchronization</p>
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
                  The Problem
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  N philosophers sit at a round table. Between each pair is one <strong className="text-cyan-400">chopstick</strong>. To eat, a philosopher needs <strong className="text-cyan-400">both</strong> chopsticks (left and right). They alternate between thinking and eating.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Challenge: coordinate access so no one starves, and <strong className="text-amber-400">deadlock</strong> is avoided (e.g., all 5 grab their left chopstick simultaneously—no one can get the right).
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  The Deadlock Scenario
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  If each philosopher picks up the left chopstick first and waits for the right: all 5 hold one chopstick, and everyone waits forever. This is <strong className="text-red-400">deadlock</strong>—a circular wait.
                </p>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-red-200 font-mono">
                    P0 waits for P1&apos;s chopstick, P1 waits for P2&apos;s, ... P4 waits for P0&apos;s → circular wait
                  </p>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Solutions
                </h2>
                <div className="space-y-3">
                  {solutions.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                      <h3 className="font-semibold text-gray-200 mb-1">{s.title}</h3>
                      <p className="text-sm text-gray-400">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/synchronization/semaphores" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Semaphores <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/synchronization/producer-consumer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Producer-Consumer
                  </Link>
                  <Link href="/deadlocks/intro" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Deadlocks
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
                  <UtensilsCrossed className="w-5 h-5 text-cyan-400" />
                  Table Visualization
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Click a philosopher to toggle &quot;holding left chopstick.&quot; When all 5 hold one, deadlock occurs.
                </p>
                <div className="relative w-72 h-72 mx-auto">
                  {/* Table circle */}
                  <div className="absolute inset-0 rounded-full border-4 border-gray-600 bg-gray-900/60 flex items-center justify-center">
                    <span className="text-xs font-mono text-gray-500">TABLE</span>
                  </div>
                  {/* 5 philosophers around the table */}
                  {[0, 1, 2, 3, 4].map((i) => {
                    const angle = (i * 72 - 90) * (Math.PI / 180);
                    const x = 50 + 40 * Math.cos(angle);
                    const y = 50 + 40 * Math.sin(angle);
                    const isHolding = holding.has(i);
                    return (
                      <motion.button
                        key={i}
                        onClick={() => togglePhilosopher(i)}
                        className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm transition-all ${
                          isHolding
                            ? 'bg-amber-500/30 border-2 border-amber-500 text-amber-400'
                            : 'bg-gray-700/60 border-2 border-gray-600 text-gray-400 hover:border-cyan-500/50'
                        }`}
                        style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        P{i}
                      </motion.button>
                    );
                  })}
                </div>
                <div className="mt-6 text-center">
                  {hasDeadlock ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-block p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-sm"
                    >
                      ⚠ DEADLOCK — All 5 hold one chopstick!
                    </motion.div>
                  ) : (
                    <p className="text-sm text-gray-500 font-mono">
                      {holding.size} philosopher(s) holding left chopstick
                    </p>
                  )}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Solutions
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  Click to expand each solution.
                </p>
                <div className="space-y-2">
                  {solutions.map((s) => (
                    <motion.div
                      key={s.id}
                      className="rounded-xl border border-white/10 overflow-hidden bg-gray-900/40"
                      layout
                    >
                      <button
                        onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                      >
                        <span className="font-semibold text-gray-200">{s.title}</span>
                        {expanded === s.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <AnimatePresence>
                        {expanded === s.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0">
                              <p className="text-sm text-gray-400">{s.description}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-wrap gap-3">
                  <Link href="/synchronization/semaphores" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Semaphores <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/synchronization/producer-consumer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Producer-Consumer
                  </Link>
                  <Link href="/deadlocks/intro" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Deadlocks
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
