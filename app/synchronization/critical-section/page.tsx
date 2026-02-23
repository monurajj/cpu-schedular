'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  Zap,
  Clock,
  ChevronDown,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';
import RaceConditionVisual from '@/components/RaceConditionVisual';
import BankAccountVisual from '@/components/BankAccountVisual';

export default function CriticalSectionPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [runMode, setRunMode] = useState<'with-mutex' | 'without-mutex'>('without-mutex');
  const [counter, setCounter] = useState(0);
  const [expectedCounter, setExpectedCounter] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const runSimulation = async () => {
    setIsRunning(true);
    setLog([]);
    setCounter(0);
    const iterations = 50; // Each "thread" increments this many times
    setExpectedCounter(iterations * 2); // Expected: 100

    if (runMode === 'without-mutex') {
      // Simulate race: two "threads" both read-modify-write with yield between read and write
      let count = 0;
      const delay = () => new Promise((r) => setTimeout(r, 2));

      const threadIncrement = async (threadId: string) => {
        for (let i = 0; i < iterations; i++) {
          const temp = count; // READ
          await delay(); // Simulate context switch / other work
          count = temp + 1; // WRITE (may overwrite!)
          setCounter(count);
          setLog((prev) => [...prev.slice(-4), `${threadId}: ${count} (expected ${(i + 1) * 2})`]);
        }
      };

      await Promise.all([threadIncrement('T1'), threadIncrement('T2')]);
      setCounter(count);
    } else {
      // With mutex: serialize updates
      let count = 0;
      for (let i = 0; i < iterations * 2; i++) {
        count += 1;
        setCounter(count);
        if (i % 10 === 0) {
          setLog((prev) => [...prev.slice(-4), `Step ${i + 1}: ${count}`]);
        }
      }
    }
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Critical Section & Race Conditions</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Lecture 10: Process Synchronization I</p>
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
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  The Race Condition (The &quot;Lost Update&quot; Problem)
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  When two threads access and modify the same variable simultaneously, the final value depends on the timing of execution. Updates can get &quot;overwritten.&quot;
                </p>
                <p className="text-gray-400 leading-relaxed mb-4">
                  <strong className="text-amber-400">Example:</strong> Two threads incrementing a counter 1 million times each might result in 1.4 million instead of 2 million because reads and writes interleave incorrectly.
                </p>
                <div className="mt-6">
                  <RaceConditionVisual />
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                  The Context Switch
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  The mechanism of saving the state (context) of a running process/thread and loading the state of the next one. The <strong className="text-cyan-400">Dispatcher</strong> is the part of the OS that physically performs the swap.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Overhead vs. Latency
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <h3 className="font-semibold text-amber-200 mb-2">High Overhead</h3>
                    <p className="text-sm text-gray-400">Switching too often—the CPU spends more time &quot;swapping&quot; than &quot;working.&quot;</p>
                  </div>
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <h3 className="font-semibold text-cyan-200 mb-2">High Latency</h3>
                    <p className="text-sm text-gray-400">Switching too slowly—one process hogs the CPU, making the system feel laggy or frozen.</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  The Critical Section
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  A segment of code where a process accesses shared variables or files. Concurrent access leads to <strong className="text-amber-400">Race Conditions</strong>.
                </p>
                <h3 className="text-lg font-semibold text-gray-200 mb-3">The Three Sacred Requirements (MPB)</h3>
                <p className="text-gray-400 text-sm mb-4">Any solution must satisfy:</p>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <h4 className="font-semibold text-cyan-400 mb-1">Mutual Exclusion</h4>
                    <p className="text-sm text-gray-400">If Process A is in its Critical Section, no other process can enter theirs.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <h4 className="font-semibold text-cyan-400 mb-1">Progress</h4>
                    <p className="text-sm text-gray-400">If the Critical Section is free, only those waiting to enter can participate in the decision of who goes next.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <h4 className="font-semibold text-cyan-400 mb-1">Bounded Waiting</h4>
                    <p className="text-sm text-gray-400">There must be a limit on how many times other processes can enter before a specific process&apos;s request is granted (prevents starvation).</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Real-World Example
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  A joint bank account where two people withdraw money at the exact same millisecond. Without synchronization, both read the same balance, both subtract, and both write—corrupting the final value. The withdrawal logic is a <strong className="text-cyan-400">Critical Section</strong> that must be protected.
                </p>
                <BankAccountVisual />
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
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Race Condition Simulator (Lost Update)
                </h2>
                <div className="mb-6">
                  <RaceConditionVisual />
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  Two &quot;threads&quot; each increment 50 times. Expected: 100. Without lock, interleaved read-modify-write causes lost updates.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <button
                    onClick={() => setRunMode('without-mutex')}
                    className={`px-4 py-2 rounded-lg text-sm font-mono border transition-colors flex items-center gap-2 ${
                      runMode === 'without-mutex' ? 'border-red-500/50 text-red-400 bg-red-500/10' : 'border-gray-600 text-gray-400'
                    }`}
                  >
                    <Unlock className="w-4 h-4" />
                    Run without Lock
                  </button>
                  <button
                    onClick={() => setRunMode('with-mutex')}
                    className={`px-4 py-2 rounded-lg text-sm font-mono border transition-colors flex items-center gap-2 ${
                      runMode === 'with-mutex' ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10' : 'border-gray-600 text-gray-400'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    Run with Mutex
                  </button>
                  <button
                    onClick={runSimulation}
                    disabled={isRunning}
                    className="px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-mono hover:bg-cyan-500 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isRunning ? 'Running...' : 'Run Simulation'}
                  </button>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-gray-500 font-mono text-sm block">Result:</span>
                    <span className={`text-2xl font-bold font-mono ${counter === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {counter}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-mono text-sm block">Expected:</span>
                    <span className="text-2xl font-bold font-mono text-gray-400">{expectedCounter || 100}</span>
                  </div>
                </div>
                {log.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-900/50 rounded-lg font-mono text-xs text-gray-400 max-h-24 overflow-y-auto">
                    {log.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                  Context Switch & Dispatcher
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  The context switch saves the current process state (PC, registers) and loads the next. The Dispatcher performs the actual swap. Balance overhead (too many switches) vs latency (too few).
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  MPB Requirements
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  Mutual Exclusion • Progress • Bounded Waiting
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  <strong className="text-amber-400">Bank Account Example:</strong> Two people withdraw at the same millisecond. Without a lock, both read $100, both subtract $50, both write $50—one withdrawal is lost. The balance becomes corrupt.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
