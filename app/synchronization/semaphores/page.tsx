'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key,
  Lock,
  Minus,
  Plus,
  Info,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Shield,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';
import SemaphoreVisual from '@/components/SemaphoreVisual';

const semaphoreTypes = [
  {
    id: 'binary',
    title: 'Binary Semaphore (Mutex)',
    icon: Lock,
    value: '0 or 1',
    description: 'Ensures mutual exclusion. Only one process can hold it. Used to protect critical sections.',
    useCase: 'Protecting shared variables, critical sections',
  },
  {
    id: 'counting',
    title: 'Counting Semaphore',
    icon: Key,
    value: '0 to N',
    description: 'Represents N available resources. wait() acquires one; signal() releases one. Blocks when count is 0.',
    useCase: 'Bounded buffer (N slots), resource pools',
  },
];

export default function SemaphoresPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [semValue, setSemValue] = useState(2);
  const [log, setLog] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleWait = () => {
    if (semValue <= 0) {
      setLog((prev) => [...prev.slice(-4), `wait() — blocked (S=${semValue})`]);
      return;
    }
    setSemValue((v) => v - 1);
    setLog((prev) => [...prev.slice(-4), `wait() — S: ${semValue} → ${semValue - 1}`]);
  };

  const handleSignal = () => {
    setSemValue((v) => v + 1);
    setLog((prev) => [...prev.slice(-4), `signal() — S: ${semValue} → ${semValue + 1}`]);
  };

  const resetSim = () => {
    setSemValue(2);
    setLog([]);
  };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Semaphores & Mutexes</h1>
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
              {/* Intro */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-cyan-400" />
                  What is a Semaphore?
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  A <strong className="text-cyan-400">semaphore</strong> is an integer variable with two <strong className="text-gray-300">atomic</strong> operations. It solves the critical section problem without busy-waiting. Invented by Dijkstra; the names P and V come from Dutch (Proberen = try, Verhogen = increment).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <h4 className="font-mono text-amber-400 mb-2">wait() / P()</h4>
                    <p className="text-sm text-gray-400">Decrements the semaphore. If value becomes negative, the process blocks until another process does signal().</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <h4 className="font-mono text-emerald-400 mb-2">signal() / V()</h4>
                    <p className="text-sm text-gray-400">Increments the semaphore. Wakes up one waiting process (if any).</p>
                  </div>
                </div>
              </div>

              {/* Types */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-cyan-400" />
                  Binary vs Counting Semaphores
                </h2>
                <div className="space-y-4">
                  {semaphoreTypes.map((t) => (
                    <div key={t.id} className="p-5 rounded-xl bg-gray-900/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                          <t.icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-200 mb-1">{t.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">{t.description}</p>
                          <p className="text-xs text-cyan-400/80 font-mono">Value: {t.value} • Use: {t.useCase}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mutex */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  Mutex (Mutual Exclusion)
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  A <strong className="text-cyan-400">Mutex</strong> is a binary semaphore (0 or 1) used to protect critical sections. Before entering the critical section, a process calls <code className="text-amber-400">wait(mutex)</code>; after leaving, it calls <code className="text-emerald-400">signal(mutex)</code>. Only one process can hold the mutex at a time.
                </p>
                <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5 font-mono text-sm">
                  <pre className="text-gray-400 overflow-x-auto">
{`do {
  wait(mutex);    // acquire lock
  // critical section
  signal(mutex); // release lock
  // remainder section
} while (true);`}
                  </pre>
                </div>
              </div>

              {/* Next Steps */}
              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  What&apos;s Next?
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  See semaphores in action: <strong className="text-cyan-400">Producer-Consumer</strong> (bounded buffer) and <strong className="text-cyan-400">Dining Philosophers</strong> (deadlock prevention).
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/synchronization/producer-consumer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-sm font-mono"
                  >
                    Producer-Consumer <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/synchronization/dining-philosophers"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 transition-colors text-sm font-mono"
                  >
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
              {/* Semaphore Simulator */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Key className="w-5 h-5 text-cyan-400" />
                  Semaphore Simulator
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Click wait() and signal() to see how the semaphore value changes. When S=0, wait() would block.
                </p>
                <div className="flex items-center gap-6 mb-6 flex-wrap">
                  <SemaphoreVisual value={semValue} label="S" type="counting" waiting={semValue <= 0 ? 1 : 0} />
                  <div className="flex gap-3 items-center">
                    <motion.button
                      onClick={handleWait}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 transition-colors font-mono text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Minus className="w-4 h-4" /> wait()
                    </motion.button>
                    <motion.button
                      onClick={handleSignal}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors font-mono text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-4 h-4" /> signal()
                    </motion.button>
                    <button
                      onClick={resetSim}
                      className="px-4 py-2 rounded-lg bg-gray-800/60 text-gray-400 border border-white/10 hover:border-white/20 font-mono text-sm"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                {log.length > 0 && (
                  <div className="p-4 rounded-xl bg-gray-900/50 font-mono text-xs text-gray-400 max-h-24 overflow-y-auto">
                    {log.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Types Explorer */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Semaphore Types
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Click to expand and compare.
                </p>
                <div className="space-y-2">
                  {semaphoreTypes.map((t) => (
                    <motion.div
                      key={t.id}
                      className="rounded-xl border border-white/10 overflow-hidden bg-gray-900/40"
                      layout
                    >
                      <button
                        onClick={() => setExpanded(expanded === t.id ? null : t.id)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <t.icon className="w-5 h-5 text-cyan-400" />
                          <span className="font-semibold text-gray-200">{t.title}</span>
                        </div>
                        {expanded === t.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <AnimatePresence>
                        {expanded === t.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0 space-y-2">
                              <p className="text-sm text-gray-400">{t.description}</p>
                              <p className="text-xs text-cyan-400/80 font-mono">Use case: {t.useCase}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Explore Further
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/synchronization/producer-consumer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-sm font-mono"
                  >
                    Producer-Consumer <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/synchronization/dining-philosophers"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 transition-colors text-sm font-mono"
                  >
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
