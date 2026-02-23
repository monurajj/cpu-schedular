'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitFork,
  Copy,
  RefreshCw,
  Clock,
  Home,
  Users,
  Code,
  Database,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Skull,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';
import ProcessTreeVisual from '@/components/ProcessTreeVisual';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const posixCalls = [
  { id: 'fork', name: 'fork()', icon: Copy, description: 'Creates a child process that is an exact copy of the parent (same code, different PID).' },
  { id: 'exec', name: 'exec()', icon: RefreshCw, description: 'Replaces the process\'s memory space with a new program.' },
  { id: 'wait', name: 'wait()', icon: Clock, description: 'Parent waits for the child to finish to collect its "exit status."' },
];

const threadShared = [
  { id: 'code', label: 'Code', icon: Code },
  { id: 'data', label: 'Data (global variables)', icon: Database },
  { id: 'heap', label: 'Heap', icon: Layers },
];

const threadSeparate = [
  { id: 'tid', label: 'Thread ID', icon: Users },
  { id: 'stack', label: 'Stack', icon: Layers },
  { id: 'pc', label: 'Program Counter (PC)', icon: Code },
];

export default function ProcessCreationPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [expandedCall, setExpandedCall] = useState<string | null>(null);
  const [showThreadAnalogy, setShowThreadAnalogy] = useState(false);

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Process Creation & Threads</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Lecture 3</p>
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
                  <GitFork className="w-5 h-5 text-cyan-400" />
                  Process Creation (The POSIX Way)
                </h2>
                <div className="mb-8">
                  <ProcessTreeVisual step={2} interactive={false} />
                </div>
                <motion.div className="space-y-4 mb-8" variants={containerVariants} initial="hidden" animate="visible">
                  {posixCalls.map((c) => (
                    <motion.div key={c.id} variants={itemVariants} className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                      <h3 className="font-mono text-cyan-400 mb-2">{c.name}</h3>
                      <p className="text-sm text-gray-400">{c.description}</p>
                    </motion.div>
                  ))}
                </motion.div>

                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Process Termination
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Processes finish via <code className="text-cyan-400">exit()</code>. If a parent terminates before a child, the child becomes an <strong className="text-amber-400">Orphan</strong>. If a child finishes but the parent hasn&apos;t called <code className="text-cyan-400">wait()</code>, the child is a <strong className="text-red-400">Zombie</strong>.
                </p>

                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Introduction to Threads
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  <strong className="text-gray-300">Analogy:</strong> A Process is a house; Threads are the people living inside sharing the same kitchen (memory).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <h4 className="text-sm font-mono text-emerald-400 mb-2">Shared</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Code</li>
                      <li>• Data (global variables)</li>
                      <li>• Heap</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <h4 className="text-sm font-mono text-amber-400 mb-2">Separate</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Thread ID</li>
                      <li>• Stack</li>
                      <li>• Program Counter (PC)</li>
                    </ul>
                  </div>
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
                  <GitFork className="w-5 h-5 text-cyan-400" />
                  Fork & Exec Flow
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  Step through: Parent → fork() → Child (copy) → exec() → Child (new program)
                </p>
                <div className="mb-8">
                  <ProcessTreeVisual />
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <GitFork className="w-5 h-5 text-cyan-400" />
                  POSIX System Calls
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Click each call to learn its role in process creation.
                </p>
                <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                  {posixCalls.map((c) => (
                    <motion.button
                      key={c.id}
                      variants={itemVariants}
                      onClick={() => setExpandedCall(expandedCall === c.id ? null : c.id)}
                      className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
                        expandedCall === c.id ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-gray-900/40 border-white/5 hover:border-white/10'
                      }`}
                      whileHover={{ x: 4, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <c.icon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="font-mono text-cyan-400">{c.name}</span>
                      </div>
                      {expandedCall === c.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </motion.button>
                  ))}
                </motion.div>
                <AnimatePresence>
                  {expandedCall && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-4 rounded-xl bg-gray-900/60 border border-cyan-500/20"
                    >
                      {posixCalls
                        .filter((c) => c.id === expandedCall)
                        .map((c) => (
                          <p key={c.id} className="text-sm text-gray-400">
                            {c.description}
                          </p>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Home className="w-5 h-5 text-cyan-400" />
                  Process = House, Threads = People
                </h2>
                <button
                  onClick={() => setShowThreadAnalogy(!showThreadAnalogy)}
                  className="mb-6 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-sm font-mono hover:bg-cyan-500/30 transition-colors"
                >
                  {showThreadAnalogy ? 'Hide' : 'Show'} Thread Analogy
                </button>
                {showThreadAnalogy && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <h4 className="text-sm font-mono text-emerald-400 mb-3">Shared (Kitchen)</h4>
                      <div className="space-y-2">
                        {threadShared.map((t) => (
                          <div key={t.id} className="flex items-center gap-2 text-sm text-gray-400">
                            <t.icon className="w-4 h-4 text-emerald-400" />
                            {t.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                      <h4 className="text-sm font-mono text-amber-400 mb-3">Separate (Each Person)</h4>
                      <div className="space-y-2">
                        {threadSeparate.map((t) => (
                          <div key={t.id} className="flex items-center gap-2 text-sm text-gray-400">
                            <t.icon className="w-4 h-4 text-amber-400" />
                            {t.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Skull className="w-5 h-5 text-amber-400" />
                  Orphan vs Zombie
                </h2>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={containerVariants} initial="hidden" animate="visible">
                  <motion.div variants={itemVariants} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30" whileHover={{ scale: 1.02 }}>
                    <h4 className="font-mono text-amber-400">Orphan</h4>
                    <p className="text-sm text-gray-400 mt-1">Parent terminates before child. Child is adopted by init (PID 1).</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="p-4 rounded-xl bg-red-500/10 border border-red-500/30" whileHover={{ scale: 1.02 }}>
                    <h4 className="font-mono text-red-400">Zombie</h4>
                    <p className="text-sm text-gray-400 mt-1">Child finished but parent hasn&apos;t called wait(). Child stays in process table until parent collects.</p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
