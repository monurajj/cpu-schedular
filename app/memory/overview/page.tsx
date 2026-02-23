'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Info,
  Zap,
  ArrowRight,
  Layers,
  Cpu,
  HardDrive,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';

const HIERARCHY = [
  { name: 'Registers', speed: '~1 ns', size: 'KB', color: 'cyan' },
  { name: 'L1 Cache', speed: '~1 ns', size: 'KB', color: 'cyan' },
  { name: 'L2 Cache', speed: '~4 ns', size: 'MB', color: 'cyan' },
  { name: 'RAM', speed: '~100 ns', size: 'GB', color: 'amber' },
  { name: 'SSD/HDD', speed: '~100 μs', size: 'TB', color: 'gray' },
];

export default function MemoryOverviewPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Memory Management Overview</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Memory Management • Lecture 18</p>
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
                  Goals of Memory Management
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  The OS must allocate memory to processes, protect them from each other, and enable sharing when needed. Key responsibilities: <strong className="text-cyan-400">allocation</strong>, <strong className="text-cyan-400">address translation</strong>, <strong className="text-cyan-400">protection</strong>, and <strong className="text-cyan-400">swapping</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Logical vs Physical</h4>
                    <p className="text-sm text-gray-400">Logical addresses (CPU-generated) are translated to physical addresses (RAM).</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Address Binding</h4>
                    <p className="text-sm text-gray-400">Compile time, load time, or execution time (MMU).</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  Memory Hierarchy
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Faster memory is smaller and closer to the CPU. The OS manages movement between levels (caching, paging).
                </p>
                <div className="space-y-2">
                  {HIERARCHY.map((level, i) => (
                    <div
                      key={level.name}
                      className="flex items-center gap-4 p-3 rounded-xl bg-gray-900/40 border border-white/5"
                    >
                      <div className={`w-2 h-8 rounded ${level.color === 'cyan' ? 'bg-cyan-500/50' : level.color === 'amber' ? 'bg-amber-500/50' : 'bg-gray-500/50'}`} />
                      <div className="flex-1">
                        <span className="font-mono text-gray-200">{level.name}</span>
                        <span className="text-gray-500 text-sm ml-2">— {level.speed} • {level.size}</span>
                      </div>
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
                  <Link href="/memory/contiguous" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Contiguous Allocation <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/memory/paging" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Paging
                  </Link>
                  <Link href="/memory/virtual" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Virtual Memory
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
                  <Database className="w-5 h-5 text-cyan-400" />
                  Memory Hierarchy Visualizer
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Hover over each level to see speed and size. Faster = closer to CPU.
                </p>
                <div className="flex flex-col items-center gap-2">
                  <Cpu className="w-8 h-8 text-cyan-400 mb-2" />
                  {HIERARCHY.map((level, i) => (
                    <motion.div
                      key={level.name}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      className={`w-full max-w-sm p-4 rounded-xl border transition-all cursor-default ${
                        hovered === i ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-gray-900/40 border-white/5'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-gray-200">{level.name}</span>
                        <span className="text-xs text-gray-500">{level.speed} • {level.size}</span>
                      </div>
                      {hovered === i && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-gray-500 mt-2"
                        >
                          {level.name === 'RAM' && 'Main memory for processes. OS manages allocation.'}
                          {level.name === 'L1 Cache' && 'Fastest cache, on-chip. Typically 32–64 KB.'}
                          {level.name === 'L2 Cache' && 'Larger cache, shared between cores.'}
                          {level.name === 'Registers' && 'Fastest storage, directly in CPU.'}
                          {level.name === 'SSD/HDD' && 'Backing store for virtual memory.'}
                        </motion.p>
                      )}
                    </motion.div>
                  ))}
                  <HardDrive className="w-8 h-8 text-gray-500 mt-2" />
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-wrap gap-3">
                  <Link href="/memory/contiguous" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Contiguous Allocation <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/memory/paging" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Paging
                  </Link>
                  <Link href="/memory/virtual" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Virtual Memory
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
