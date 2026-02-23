'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCode,
  Cpu,
  MemoryStick,
  ListChecks,
  ChevronDown,
  RefreshCw,
  Info,
  Zap,
  ArrowRight,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';
import PCBVisual from '@/components/PCBVisual';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const pcbFields = [
  { id: 'state', label: 'Process State', icon: ListChecks, description: 'Current state: New, Ready, Running, Waiting, or Terminated. Determines which queue the process is in.', category: 'Execution' },
  { id: 'pc', label: 'Program Counter (PC)', icon: Cpu, description: 'Address of the next instruction to execute. Must be saved/restored on every context switch.', category: 'CPU State' },
  { id: 'registers', label: 'CPU Registers', icon: Cpu, description: 'Contents of accumulators, index registers, stack pointer, general-purpose registers. Each process has its own copy.', category: 'CPU State' },
  { id: 'memory', label: 'Memory Limits', icon: MemoryStick, description: 'Base and limit registers, page tables, segment tables. Defines the process\'s address space.', category: 'Memory' },
  { id: 'io', label: 'I/O Status', icon: FileCode, description: 'List of open files, I/O devices allocated, pending I/O requests. Needed to resume I/O after switch.', category: 'I/O' },
  { id: 'accounting', label: 'Accounting Info', icon: FileCode, description: 'Process ID (PID), parent PID, CPU time used, time limits. Used for scheduling and resource management.', category: 'Accounting' },
];

export default function PCBPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Process Control Block (PCB)</h1>
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
                  Why the PCB Matters
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  The <strong className="text-cyan-400">Process Control Block</strong> is the OS&apos;s &quot;memory&quot; for each process. When the CPU switches from Process A to Process B, it must <strong className="text-gray-300">save A&apos;s state</strong> (into A&apos;s PCB) and <strong className="text-gray-300">load B&apos;s state</strong> (from B&apos;s PCB). Without the PCB, resuming a process would be impossible.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  One PCB exists per process. When a process is created, the OS allocates a PCB; when it terminates, the PCB is freed.
                </p>
              </div>

              {/* PCB Fields by Category */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-cyan-400" />
                  PCB Contents
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  The PCB stores everything needed to pause and resume a process. Fields are often grouped by purpose.
                </p>
                <div className="mb-8">
                  <PCBVisual highlightedField={hoveredField} onFieldHover={setHoveredField} />
                </div>
                <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                  {pcbFields.map((f) => (
                    <motion.div key={f.id} variants={itemVariants} className="p-4 rounded-xl bg-gray-900/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                          <f.icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-200">{f.label}</h3>
                            <span className="text-xs font-mono text-cyan-400/80 px-2 py-0.5 rounded bg-cyan-500/10">{f.category}</span>
                          </div>
                          <p className="text-sm text-gray-400">{f.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Context Switch */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                  Context Switch: Save & Restore
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  When the scheduler switches from Process A to Process B:
                </p>
                <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
                  <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <span className="font-mono text-amber-400 w-8">1</span>
                    <div>
                      <h4 className="font-semibold text-gray-200">Save A&apos;s state</h4>
                      <p className="text-sm text-gray-400">PC, registers, and other CPU state → A&apos;s PCB</p>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <span className="font-mono text-emerald-400 w-8">2</span>
                    <div>
                      <h4 className="font-semibold text-gray-200">Load B&apos;s state</h4>
                      <p className="text-sm text-gray-400">B&apos;s PCB → PC, registers into CPU</p>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <span className="font-mono text-cyan-400 w-8">3</span>
                    <div>
                      <h4 className="font-semibold text-gray-200">Resume execution</h4>
                      <p className="text-sm text-gray-400">CPU continues from B&apos;s saved PC</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Next Steps */}
              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  What&apos;s Next?
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Learn how processes are <strong className="text-cyan-400">created</strong> (fork, exec) and how the <strong className="text-cyan-400">CPU Scheduler</strong> decides which process runs next.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/process/creation"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-sm font-mono"
                  >
                    Process Creation <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/process/cpu-fundamentals"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 transition-colors text-sm font-mono"
                  >
                    CPU Scheduling
                  </Link>
                  <Link
                    href="/cpu-scheduling"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 transition-colors text-sm font-mono"
                  >
                    Gantt Chart Visualizer
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
                  <FileCode className="w-5 h-5 text-cyan-400" />
                  Explore PCB Fields
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Click each field to see what the OS stores for context switching. Fields are grouped by category.
                </p>
                <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                  {pcbFields.map((f) => (
                    <motion.button
                      key={f.id}
                      variants={itemVariants}
                      onClick={() => setExpanded(expanded === f.id ? null : f.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                        expanded === f.id ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-gray-900/40 border-white/5 hover:border-white/10'
                      }`}
                      whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <f.icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-gray-200">{f.label}</span>
                          <span className="text-xs font-mono text-cyan-400/80 ml-2">({f.category})</span>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform shrink-0 ${expanded === f.id ? 'rotate-180' : ''}`} />
                    </motion.button>
                  ))}
                </motion.div>
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 rounded-xl bg-gray-900/60 border border-cyan-500/20"
                    >
                      {pcbFields
                        .filter((f) => f.id === expanded)
                        .map((f) => (
                          <p key={f.id} className="text-sm text-gray-400">
                            {f.description}
                          </p>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                  Context Switch Flow
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  Save current process → Load next process → Resume
                </p>
                <motion.div
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/40 border border-white/5"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <motion.div
                    className="flex-1 text-center p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-mono text-amber-400 text-sm">Save to PCB</span>
                  </motion.div>
                  <ArrowRight className="w-5 h-5 text-gray-500 shrink-0" />
                  <motion.div
                    className="flex-1 text-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-mono text-emerald-400 text-sm">Load from PCB</span>
                  </motion.div>
                  <ArrowRight className="w-5 h-5 text-gray-500 shrink-0" />
                  <motion.div
                    className="flex-1 text-center p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-mono text-cyan-400 text-sm">Resume</span>
                  </motion.div>
                </motion.div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Explore Further
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/process/creation"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-sm font-mono"
                  >
                    Process Creation <ArrowRight className="w-3.5 h-3.5" />
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
