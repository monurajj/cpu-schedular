'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Info,
  Zap,
  ArrowRight,
  RotateCcw,
  Skull,
  AlertTriangle,
  Play,
  CheckCircle,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';

const WAIT_FOR = [
  { p: 'P0', waits: 'P1' },
  { p: 'P1', waits: 'P2' },
  { p: 'P2', waits: 'P3' },
  { p: 'P3', waits: 'P0' },
];

export default function DeadlockDetectionPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [step, setStep] = useState<'idle' | 'detecting' | 'found' | 'recovered'>('idle');
  const [aborted, setAborted] = useState<Set<number>>(new Set());

  const runDetection = () => {
    setStep('detecting');
    setTimeout(() => setStep('found'), 800);
  };

  const recover = (strategy: 'abort-one' | 'abort-all') => {
    if (strategy === 'abort-one') {
      setAborted(new Set([0]));
    } else {
      setAborted(new Set([0, 1, 2, 3]));
    }
    setStep('recovered');
  };

  const reset = () => {
    setStep('idle');
    setAborted(new Set());
  };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Deadlock Detection & Recovery</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Deadlocks • Lecture 17</p>
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
                  Detection
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  The OS periodically builds a <strong className="text-cyan-400">wait-for graph</strong>: nodes are processes, edge P→Q means P waits for Q. A cycle in this graph indicates deadlock.
                </p>
                <p className="text-gray-400 leading-relaxed mb-4">
                  <strong className="text-amber-400">Banker&apos;s algorithm</strong> is used for avoidance (before granting a resource, check if the resulting state is safe). Detection runs after the fact to find existing deadlocks.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-cyan-400" />
                  Recovery Strategies
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Process Termination</h4>
                    <p className="text-sm text-gray-400 mb-2">Abort one or more processes in the deadlock cycle. Options:</p>
                    <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                      <li>Abort all deadlocked processes</li>
                      <li>Abort one at a time until cycle breaks (minimize cost)</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Resource Preemption</h4>
                    <p className="text-sm text-gray-400">Take resources from a process (rollback, restart). Requires checkpointing and rollback support.</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/deadlocks/intro" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Deadlock Introduction
                  </Link>
                  <Link href="/deadlocks/rag" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Resource Allocation Graph
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
                  <Search className="w-5 h-5 text-cyan-400" />
                  Detection & Recovery Simulator
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Wait-for graph: P0→P1→P2→P3→P0 (cycle). Run detection, then choose a recovery strategy.
                </p>

                <div className="mb-6 p-4 rounded-xl bg-gray-900/40 border border-white/5">
                  <h4 className="font-mono text-gray-400 mb-3">Wait-for graph</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {WAIT_FOR.map((e, i) => (
                      <React.Fragment key={i}>
                        <span className={`px-3 py-1 rounded-lg font-mono text-sm ${aborted.has(i) ? 'bg-red-500/20 text-red-400 line-through' : 'bg-cyan-500/10 text-cyan-400'}`}>
                          {e.p}
                        </span>
                        <span className="text-gray-500">→</span>
                      </React.Fragment>
                    ))}
                    <span className={`px-3 py-1 rounded-lg font-mono text-sm ${aborted.has(0) ? 'bg-red-500/20 text-red-400 line-through' : 'bg-cyan-500/10 text-cyan-400'}`}>
                      P0
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  {step === 'idle' && (
                    <motion.button
                      onClick={runDetection}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 font-mono text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-4 h-4" /> Run Detection
                    </motion.button>
                  )}
                  {step === 'detecting' && (
                    <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 font-mono text-sm animate-pulse">
                      Detecting...
                    </span>
                  )}
                  {step === 'found' && (
                    <>
                      <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 font-mono text-sm">
                        <AlertTriangle className="w-4 h-4" /> Deadlock found!
                      </span>
                      <motion.button
                        onClick={() => recover('abort-one')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 font-mono text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Skull className="w-4 h-4" /> Abort P0
                      </motion.button>
                      <motion.button
                        onClick={() => recover('abort-all')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 font-mono text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Skull className="w-4 h-4" /> Abort All
                      </motion.button>
                    </>
                  )}
                  {step === 'recovered' && (
                    <>
                      <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-sm">
                        <CheckCircle className="w-4 h-4" /> Recovered
                      </span>
                      <motion.button
                        onClick={reset}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 font-mono text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RotateCcw className="w-4 h-4" /> Reset
                      </motion.button>
                    </>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5">
                  <p className="text-xs text-gray-500 font-mono">
                    {step === 'idle' && 'Click "Run Detection" to simulate the OS detecting the deadlock cycle.'}
                    {step === 'detecting' && 'Building wait-for graph and checking for cycles...'}
                    {step === 'found' && 'Choose: abort one process (P0) to break the cycle, or abort all.'}
                    {step === 'recovered' && 'Deadlock resolved. Aborted processes are marked. Reset to try again.'}
                  </p>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-wrap gap-3">
                  <Link href="/deadlocks/intro" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Deadlock Introduction
                  </Link>
                  <Link href="/deadlocks/rag" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Resource Allocation Graph
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
