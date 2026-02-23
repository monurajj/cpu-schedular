'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Cpu,
  Zap,
  Layers,
  ChevronDown,
  ChevronUp,
  Code,
  GitBranch,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';
import ThreadMemoryLayout from '@/components/ThreadMemoryLayout';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const concurrencyVsParallelism = [
  {
    id: 'concurrency',
    title: 'Concurrency',
    icon: Zap,
    description: 'One CPU switching between tasks so fast it looks like they run at once.',
    color: 'from-amber-500/20 to-orange-600/20',
    border: 'border-amber-500/30',
  },
  {
    id: 'parallelism',
    title: 'Parallelism',
    icon: Cpu,
    description: 'Multiple CPUs actually running different tasks at the exact same moment.',
    color: 'from-cyan-500/20 to-blue-600/20',
    border: 'border-cyan-500/30',
  },
];

const threadingModels = [
  {
    id: 'many-one',
    title: 'Many-to-One',
    description: 'Many user threads mapped to one kernel thread. If one blocks, all block.',
    pros: ['Low overhead', 'Simple'],
    cons: ['No parallelism', 'One block blocks all'],
    color: 'from-violet-500/20 to-purple-600/20',
  },
  {
    id: 'one-one',
    title: 'One-to-One',
    description: 'Each user thread gets a kernel thread. True parallelism but high overhead. Used by Linux/Windows.',
    pros: ['True parallelism', 'Better concurrency'],
    cons: ['High overhead', 'Limited threads'],
    color: 'from-cyan-500/20 to-blue-600/20',
  },
  {
    id: 'many-many',
    title: 'Many-to-Many',
    description: 'Flexible multiplexing of user threads to a pool of kernel threads.',
    pros: ['Flexible', 'Best of both'],
    cons: ['Complex', 'Scheduling overhead'],
    color: 'from-emerald-500/20 to-green-600/20',
  },
];

const pthreadFunctions = [
  { name: 'pthread_create()', desc: 'Create a new thread' },
  { name: 'pthread_join()', desc: 'Wait for thread to finish' },
  { name: 'pthread_exit()', desc: 'Terminate calling thread' },
];

export default function ThreadsPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Threads in Depth</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Lecture 4</p>
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
                  <Layers className="w-5 h-5 text-cyan-400" />
                  Thread Memory Layout
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Threads share code, data, and heap. Each has its own stack and program counter.
                </p>
                <div className="mb-8">
                  <ThreadMemoryLayout />
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Concurrency vs. Parallelism
                </h2>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={containerVariants} initial="hidden" animate="visible">
                  <motion.div variants={itemVariants} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30" whileHover={{ scale: 1.02 }}>
                    <h3 className="font-semibold text-amber-200 mb-2">Concurrency</h3>
                    <p className="text-sm text-gray-400">One CPU switching between tasks so fast it looks like they run at once.</p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30" whileHover={{ scale: 1.02 }}>
                    <h3 className="font-semibold text-cyan-200 mb-2">Parallelism</h3>
                    <p className="text-sm text-gray-400">Multiple CPUs actually running different tasks at the exact same moment.</p>
                  </motion.div>
                </motion.div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  Multithreading Models
                </h2>
                <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                  {threadingModels.map((m) => (
                    <motion.div key={m.id} variants={itemVariants} className={`p-4 rounded-xl border ${m.color} border-white/10`}>
                      <h3 className="font-semibold text-gray-200 mb-2">{m.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{m.description}</p>
                      <div className="flex gap-6 text-xs">
                        <span className="text-emerald-400">Pros: {m.pros.join(', ')}</span>
                        <span className="text-amber-400">Cons: {m.cons.join(', ')}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  Pthreads (POSIX Threads)
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  The standard C/C++ API for thread management.
                </p>
                <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                  {pthreadFunctions.map((f) => (
                    <motion.div key={f.name} variants={itemVariants} className="p-3 rounded-lg bg-gray-900/40 font-mono text-sm">
                      <span className="text-cyan-400">{f.name}</span>
                      <span className="text-gray-500 mx-2">—</span>
                      <span className="text-gray-400">{f.desc}</span>
                    </motion.div>
                  ))}
                </motion.div>
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
                  <Layers className="w-5 h-5 text-cyan-400" />
                  Thread Memory Layout
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Visual: shared (code, data, heap) vs per-thread (stack, PC)
                </p>
                <div className="mb-8">
                  <ThreadMemoryLayout />
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Concurrency vs Parallelism
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Understand the difference: concurrency is about structure; parallelism is about execution.
                </p>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={containerVariants} initial="hidden" animate="visible">
                  {concurrencyVsParallelism.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      className={`p-6 rounded-xl border ${item.color} ${item.border}`}
                      whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className="w-8 h-8 text-gray-300 mb-3" />
                      <h3 className="font-semibold text-gray-200 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  Multithreading Models
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Click each model to expand and compare.
                </p>
                <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                  {threadingModels.map((m) => (
                    <motion.div
                      key={m.id}
                      variants={itemVariants}
                      className={`rounded-xl border overflow-hidden ${m.color} border-white/10`}
                      layout
                    >
                      <button
                        onClick={() => setExpandedModel(expandedModel === m.id ? null : m.id)}
                        className="w-full text-left p-4 flex items-center justify-between"
                      >
                        <span className="font-semibold text-gray-200">{m.title}</span>
                        {expandedModel === m.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <AnimatePresence>
                        {expandedModel === m.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-0 space-y-2">
                              <p className="text-sm text-gray-400">{m.description}</p>
                              <div className="flex gap-6 text-xs">
                                <span className="text-emerald-400">Pros: {m.pros.join(', ')}</span>
                                <span className="text-amber-400">Cons: {m.cons.join(', ')}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  Pthreads Quick Reference
                </h2>
                <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                  {pthreadFunctions.map((f, i) => (
                    <motion.div key={f.name} variants={itemVariants} className="p-3 rounded-lg bg-gray-900/40 font-mono text-sm flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-cyan-400">{f.name}</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-gray-400">{f.desc}</span>
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
