'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid3X3,
  Info,
  Zap,
  ArrowRight,
  Calculator,
  Layers,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';
import PagingVisual from '@/components/PagingVisual';

const PAGE_SIZE = 4;
const PAGE_TABLE: Record<number, number> = { 0: 2, 1: 5, 2: 0, 3: 7, 4: 1, 5: 3 };

export default function PagingPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [logicalAddr, setLogicalAddr] = useState(10);
  const [result, setResult] = useState<{ page: number; offset: number; frame: number; physical: number } | null>(null);

  const translate = () => {
    const page = Math.floor(logicalAddr / PAGE_SIZE);
    const offset = logicalAddr % PAGE_SIZE;
    const frame = PAGE_TABLE[page] ?? -1;
    const physical = frame >= 0 ? frame * PAGE_SIZE + offset : -1;
    setResult({ page, offset, frame, physical });
  };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Paging & Address Translation</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Memory Management • Lecture 20</p>
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
                  Paging
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Memory is divided into fixed-size <strong className="text-cyan-400">pages</strong> (logical) and <strong className="text-cyan-400">frames</strong> (physical). The <strong className="text-cyan-400">page table</strong> maps page numbers to frame numbers. Eliminates external fragmentation.
                </p>
                <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5 font-mono text-sm mb-6">
                  <p className="text-cyan-400 mb-2">Address split: logical_addr = (page_num, offset)</p>
                  <p className="text-gray-400">physical_addr = frame_num × page_size + offset</p>
                </div>
                <PagingVisual logicalAddr={10} pageSize={4} pageTable={PAGE_TABLE} showResult />
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  TLB (Translation Lookaside Buffer)
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  A small hardware cache for recent page-table entries. On TLB hit, translation is fast; on miss, the full page table is consulted (and the TLB is updated).
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/memory/contiguous" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Contiguous Allocation
                  </Link>
                  <Link href="/memory/virtual" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Virtual Memory <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/memory/page-replacement" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Page Replacement
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
                  <Calculator className="w-5 h-5 text-cyan-400" />
                  Address Translation Simulator
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Page size = {PAGE_SIZE}. Enter a logical address to compute page, offset, frame, and physical address.
                </p>

                <div className="mb-6 flex flex-wrap gap-3 items-center">
                  <input
                    type="number"
                    min={0}
                    value={logicalAddr}
                    onChange={(e) => {
                      setLogicalAddr(Math.max(0, +e.target.value));
                      setResult(null);
                    }}
                    className="w-24 px-3 py-2 rounded-lg bg-gray-900/60 border border-white/10 font-mono text-sm text-gray-200"
                  />
                  <motion.button
                    onClick={translate}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 font-mono text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Translate
                  </motion.button>
                </div>

                <div className="mb-6">
                  <PagingVisual logicalAddr={logicalAddr} pageSize={PAGE_SIZE} pageTable={PAGE_TABLE} showResult />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Page Table</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(PAGE_TABLE).map(([p, f]) => (
                        <span key={p} className="px-2 py-1 rounded bg-gray-800/60 font-mono text-xs">
                          P{p}→F{f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Formula</h4>
                    <p className="text-xs text-gray-400 font-mono">
                      page = addr ÷ {PAGE_SIZE}<br />
                      offset = addr mod {PAGE_SIZE}<br />
                      physical = frame × {PAGE_SIZE} + offset
                    </p>
                  </div>
                </div>

                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30"
                  >
                    <h4 className="font-mono text-cyan-400 mb-2">Result</h4>
                    <p className="text-sm text-gray-300 font-mono">
                      Logical {logicalAddr} → page={result.page}, offset={result.offset}
                      {result.frame >= 0 ? (
                        <> → frame={result.frame} → physical={result.physical}</>
                      ) : (
                        <> → invalid (page not in table)</>
                      )}
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-wrap gap-3">
                  <Link href="/memory/contiguous" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Contiguous Allocation
                  </Link>
                  <Link href="/memory/virtual" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Virtual Memory <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/memory/page-replacement" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Page Replacement
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
