'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutList,
  Info,
  Zap,
  ArrowRight,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';

const TOTAL = 16;
const COLORS = ['#22d3ee', '#a3e635', '#f472b6', '#fbbf24', '#94a3b8'];

export default function ContiguousPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [blocks, setBlocks] = useState<{ id: number; start: number; size: number; name: string }[]>([
    { id: 1, start: 0, size: 4, name: 'P1' },
    { id: 2, start: 5, size: 3, name: 'P2' },
    { id: 3, start: 10, size: 3, name: 'P3' },
  ]);
  const [nextId, setNextId] = useState(4);
  const [reqSize, setReqSize] = useState(2);

  const freeRanges: [number, number][] = [];
  let pos = 0;
  const sorted = [...blocks].sort((a, b) => a.start - b.start);
  for (const b of sorted) {
    if (pos < b.start) freeRanges.push([pos, b.start - 1]);
    pos = b.start + b.size;
  }
  if (pos < TOTAL) freeRanges.push([pos, TOTAL - 1]);

  const totalFree = freeRanges.reduce((s, [a, b]) => s + (b - a + 1), 0);
  const canAllocate = freeRanges.some(([a, b]) => b - a + 1 >= reqSize);
  const externalFrag = totalFree >= reqSize && !canAllocate;

  const allocate = () => {
    if (!canAllocate) return;
    for (const [start, end] of freeRanges) {
      const size = end - start + 1;
      if (size >= reqSize) {
        setBlocks((prev) => [...prev, { id: nextId, start, size: reqSize, name: `P${nextId}` }].sort((a, b) => a.start - b.start));
        setNextId((n) => n + 1);
        return;
      }
    }
  };

  const deallocate = (id: number) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const reset = () => {
    setBlocks([
      { id: 1, start: 0, size: 4, name: 'P1' },
      { id: 2, start: 5, size: 3, name: 'P2' },
      { id: 3, start: 10, size: 3, name: 'P3' },
    ]);
    setNextId(4);
  };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Contiguous Allocation</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Memory Management • Lecture 19</p>
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
                  Contiguous Allocation
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Each process gets a <strong className="text-cyan-400">single contiguous block</strong> of memory. Simple but leads to <strong className="text-amber-400">external fragmentation</strong>: free memory is scattered in small holes that may be unusable.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Fixed Partitioning</h4>
                    <p className="text-sm text-gray-400">Memory divided into fixed-size partitions. Internal fragmentation (wasted inside partition).</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Dynamic Partitioning</h4>
                    <p className="text-sm text-gray-400">Variable-sized blocks. First-fit, best-fit, worst-fit. External fragmentation.</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  Allocation Strategies
                </h2>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-1">First-fit</h4>
                    <p className="text-sm text-gray-400">Allocate first hole that fits. Fast but may fragment.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-1">Best-fit</h4>
                    <p className="text-sm text-gray-400">Allocate smallest hole that fits. Minimizes waste but leaves tiny fragments.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-1">Worst-fit</h4>
                    <p className="text-sm text-gray-400">Allocate largest hole. Leaves larger remaining fragments.</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/memory/overview" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Memory Overview
                  </Link>
                  <Link href="/memory/paging" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Paging <ArrowRight className="w-3.5 h-3.5" />
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
                  <LayoutList className="w-5 h-5 text-cyan-400" />
                  Contiguous Memory Simulator
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Allocate blocks (first-fit) or free them. Watch external fragmentation when total free &gt; requested but no single hole fits.
                </p>

                <div className="mb-6 flex flex-wrap gap-3 items-center">
                  <input
                    type="number"
                    min={1}
                    max={TOTAL}
                    value={reqSize}
                    onChange={(e) => setReqSize(Math.max(1, Math.min(TOTAL, +e.target.value)))}
                    className="w-20 px-3 py-2 rounded-lg bg-gray-900/60 border border-white/10 font-mono text-sm text-gray-200"
                  />
                  <motion.button
                    onClick={allocate}
                    disabled={!canAllocate}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-sm"
                    whileHover={canAllocate ? { scale: 1.02 } : {}}
                    whileTap={canAllocate ? { scale: 0.98 } : {}}
                  >
                    <Plus className="w-4 h-4" /> Allocate {reqSize} block(s)
                  </motion.button>
                  <button onClick={reset} className="px-4 py-2 rounded-lg bg-gray-800/60 text-gray-400 border border-white/10 hover:border-white/20 font-mono text-sm">
                    Reset
                  </button>
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: TOTAL }).map((_, i) => {
                    const block = sorted.find((b) => i >= b.start && i < b.start + b.size);
                    const free = freeRanges.some(([a, b]) => i >= a && i <= b);
                    return (
                      <motion.div
                        key={i}
                        className={`flex-1 h-12 rounded border flex items-center justify-center text-xs font-mono ${
                          block
                            ? 'border-cyan-500/40'
                            : free
                            ? 'bg-gray-800/60 border-dashed border-gray-600'
                            : 'bg-gray-900/40 border-white/5'
                        }`}
                        style={block ? { backgroundColor: COLORS[(block.id - 1) % COLORS.length] + '30' } : {}}
                        title={block ? `${block.name} (${block.size})` : free ? 'Free' : ''}
                      >
                        {block && block.start === i ? block.name : ''}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {blocks.map((b) => (
                    <motion.button
                      key={b.id}
                      onClick={() => deallocate(b.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/60 border border-white/10 hover:border-red-500/40 font-mono text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {b.name} <Trash2 className="w-3 h-3 text-red-400" />
                    </motion.button>
                  ))}
                </div>

                {externalFrag && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-sm"
                  >
                    ⚠ External fragmentation: {totalFree} free total, but no single hole ≥ {reqSize}
                  </motion.div>
                )}
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-wrap gap-3">
                  <Link href="/memory/overview" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Memory Overview
                  </Link>
                  <Link href="/memory/paging" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Paging <ArrowRight className="w-3.5 h-3.5" />
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
