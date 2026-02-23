'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  FileCode,
  ArrowRight,
  Zap,
  Info,
  RefreshCw,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';
import ProcessStateDiagram from '@/components/ProcessStateDiagram';

const processStates = [
  { id: 'new', label: 'New', description: 'Process being created.', color: 'bg-gray-500', trigger: 'Program loaded' },
  { id: 'ready', label: 'Ready', description: 'Waiting to be assigned to a processor.', color: 'bg-amber-500', trigger: 'Admitted, or preempted' },
  { id: 'running', label: 'Running', description: 'Instructions are being executed.', color: 'bg-green-500', trigger: 'Scheduler selects it' },
  { id: 'waiting', label: 'Waiting', description: 'Waiting for an event (like I/O completion).', color: 'bg-orange-500', trigger: 'I/O request, event wait' },
  { id: 'terminated', label: 'Terminated', description: 'Finished execution.', color: 'bg-red-500', trigger: 'exit() called' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: -8 },
};

const stateTransitions = [
  { from: 'New', to: 'Ready', trigger: 'OS admits process' },
  { from: 'Ready', to: 'Running', trigger: 'Scheduler dispatch' },
  { from: 'Running', to: 'Ready', trigger: 'Time quantum expires (preemption)' },
  { from: 'Running', to: 'Waiting', trigger: 'I/O request, wait for event' },
  { from: 'Waiting', to: 'Ready', trigger: 'I/O complete, event occurs' },
  { from: 'Running', to: 'Terminated', trigger: 'Process exits' },
];

export default function ProcessConceptPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Process Concept & States</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Lecture 2: OS Foundations II</p>
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
                  Program vs. Process
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  A <strong className="text-gray-300">program</strong> is a passive entity—a file on disk (e.g., <code className="text-cyan-400">chrome.exe</code>). A <strong className="text-cyan-400">process</strong> is an active entity—that same program loaded into memory and executing. One program can spawn many processes (e.g., multiple Chrome tabs).
                </p>
                <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                  <p className="text-sm text-gray-400">
                    <strong className="text-cyan-400">Definition:</strong> A process is a &quot;program in execution.&quot; It has its own <strong className="text-gray-300">state</strong>, <strong className="text-gray-300">memory</strong>, <strong className="text-gray-300">Program Counter</strong>, and <strong className="text-gray-300">CPU registers</strong>.
                  </p>
                </div>
              </div>

              {/* PCB */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-cyan-400" />
                  Process Control Block (PCB)
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  The OS maintains a <strong className="text-cyan-400">PCB</strong> for each process—its &quot;memory&quot; of that process. The PCB stores everything needed to stop a process and resume it later (context switching).
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• <strong className="text-gray-300">Process State</strong> — New, Ready, Running, Waiting, Terminated</li>
                  <li>• <strong className="text-gray-300">Program Counter (PC)</strong> — Address of next instruction</li>
                  <li>• <strong className="text-gray-300">CPU Registers</strong> — Accumulators, stack pointer, etc.</li>
                  <li>• <strong className="text-gray-300">Memory Limits</strong> — Base/limit registers, page tables</li>
                </ul>
              </div>

              {/* Process States */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-cyan-400" />
                  Process States
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  A process moves through five states during its lifetime. The scheduler decides transitions between Ready and Running; I/O and events drive Waiting.
                </p>
                <div className="mb-8">
                  <ProcessStateDiagram interactive={false} />
                </div>
                <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
                  {processStates.map((s) => (
                    <motion.div key={s.id} variants={itemVariants} className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                      <div className={`w-4 h-4 rounded-full ${s.color} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-gray-200 font-semibold">{s.label}</span>
                        <p className="text-sm text-gray-400 mt-0.5">{s.description}</p>
                      </div>
                      <span className="text-xs font-mono text-cyan-400/80 shrink-0">→ {s.trigger}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* State Transitions */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                  State Transition Triggers
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Understanding what causes each transition is key to understanding scheduling and I/O.
                </p>
                <div className="space-y-2">
                  {stateTransitions.map((t, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-900/40 border border-white/5">
                      <span className="font-mono text-amber-400 w-20">{t.from}</span>
                      <ArrowRight className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="font-mono text-emerald-400 w-24">{t.to}</span>
                      <span className="text-sm text-gray-400 flex-1">— {t.trigger}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  What&apos;s Next?
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Dive into the <strong className="text-cyan-400">PCB</strong> in detail, learn how processes are <strong className="text-cyan-400">created</strong> (fork, exec), and see <strong className="text-cyan-400">CPU Scheduling</strong> in action.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/process/pcb"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-sm font-mono"
                  >
                    PCB Deep Dive <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/process/creation"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 transition-colors text-sm font-mono"
                  >
                    Process Creation
                  </Link>
                  <Link
                    href="/process/cpu-fundamentals"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 transition-colors text-sm font-mono"
                  >
                    CPU Scheduling
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
                  <GitBranch className="w-5 h-5 text-cyan-400" />
                  Process State Diagram
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Click each state to learn its meaning. Arrows show transitions (admit, dispatch, preempt, I/O wait, I/O done, exit).
                </p>
                <div className="mb-8">
                  <ProcessStateDiagram selectedState={selectedState} onStateSelect={(id) => setSelectedState(selectedState === id ? null : id)} interactive />
                </div>
                <AnimatePresence>
                  {selectedState && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                      className="p-4 rounded-xl bg-gray-900/60 border border-white/10"
                    >
                      {processStates
                        .filter((s) => s.id === selectedState)
                        .map((s) => (
                          <div key={s.id} className="flex items-start gap-3">
                            <div className={`w-4 h-4 rounded-full ${s.color} shrink-0 mt-0.5`} />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-200">{s.label}</h4>
                              <p className="text-sm text-gray-400 mt-1">{s.description}</p>
                              <p className="text-xs text-cyan-400/80 font-mono mt-2">Trigger: {s.trigger}</p>
                            </div>
                          </div>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                  State Transition Triggers
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  What causes each transition? Understanding this is key to scheduling.
                </p>
                <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                  {stateTransitions.map((t, i) => (
                    <motion.div key={i} variants={itemVariants} className="flex items-center gap-4 p-3 rounded-lg bg-gray-900/40 border border-white/5">
                      <span className="font-mono text-amber-400 w-20">{t.from}</span>
                      <ArrowRight className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="font-mono text-emerald-400 w-24">{t.to}</span>
                      <span className="text-sm text-gray-400 flex-1">— {t.trigger}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Explore Further
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/process/pcb"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-sm font-mono"
                  >
                    PCB <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/process/creation"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 transition-colors text-sm font-mono"
                  >
                    Process Creation
                  </Link>
                  <Link
                    href="/cpu-scheduling"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 transition-colors text-sm font-mono"
                  >
                    CPU Scheduling Visualizer
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
