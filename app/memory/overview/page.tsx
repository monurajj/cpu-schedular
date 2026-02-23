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
  Play,
} from 'lucide-react';
import MemoryHierarchyPyramid from '@/components/MemoryHierarchyPyramid';
import ModeToggle from '@/components/ModeToggle';

const HIERARCHY_LEVELS = [
  { name: 'SSD/HDD', delay: 0 },
  { name: 'RAM', delay: 1 },
  { name: 'L2 Cache', delay: 2 },
  { name: 'L1 Cache', delay: 3 },
  { name: 'Registers', delay: 4 },
];

export default function MemoryOverviewPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [simulating, setSimulating] = useState(false);
  const [simulatingLevel, setSimulatingLevel] = useState<number>(-1);

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
                <div className="mb-4">
                  <MemoryHierarchyPyramid interactive={true} />
                </div>
                <div className="mt-6 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-sm text-gray-300">
                    <strong className="text-cyan-400">Key insight:</strong> A cache hit in L1 is ~100× faster than a RAM access. 
                    When data isn&apos;t in cache, the CPU must fetch from lower levels—this is why cache-friendly code matters.
                  </p>
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
                  Click levels to expand details. Use the simulation to see how data moves up the hierarchy on a cache miss.
                </p>
                <div className="mb-6">
                  <MemoryHierarchyPyramid interactive={true} />
                </div>
                <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-gray-900/40 border border-white/5">
                  <h3 className="text-sm font-semibold text-gray-300">Simulate cache miss</h3>
                  <p className="text-xs text-gray-500 text-center max-w-md">
                    When data isn&apos;t in cache, the CPU fetches from lower levels. Watch the path from disk to registers.
                  </p>
                  <motion.button
                    onClick={() => {
                      if (simulating) return;
                      setSimulating(true);
                      setSimulatingLevel(-1);
                      HIERARCHY_LEVELS.forEach((_, i) => {
                        setTimeout(() => setSimulatingLevel(i), i * 400);
                      });
                      setTimeout(() => {
                        setSimulating(false);
                        setSimulatingLevel(-1);
                      }, HIERARCHY_LEVELS.length * 400 + 500);
                    }}
                    disabled={simulating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" />
                    {simulating ? 'Fetching...' : 'Run simulation'}
                  </motion.button>
                  {simulating && simulatingLevel >= 0 && (
                    <motion.p
                      key={simulatingLevel}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-cyan-400 font-mono"
                    >
                      → {HIERARCHY_LEVELS[simulatingLevel].name}
                    </motion.p>
                  )}
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
