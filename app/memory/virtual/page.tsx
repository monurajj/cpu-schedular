'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud,
  Info,
  Zap,
  ArrowRight,
  AlertCircle,
  HardDrive,
  Cpu,
} from 'lucide-react';
import VirtualMemoryVisual from '@/components/VirtualMemoryVisual';
import ModeToggle from '@/components/ModeToggle';

const PAGES = 8;
const FRAMES = 4;
const IN_MEMORY = [0, 1, 2, 3];

export default function VirtualMemoryPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [accessPage, setAccessPage] = useState(0);
  const [lastResult, setLastResult] = useState<'hit' | 'fault' | null>(null);

  const inMem = IN_MEMORY.includes(accessPage);

  const simulateAccess = () => {
    setLastResult(inMem ? 'hit' : 'fault');
  };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Virtual Memory</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Memory Management • Lecture 21</p>
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
                  Virtual Memory
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Processes can use an address space <strong className="text-cyan-400">larger than physical RAM</strong>. Only needed pages reside in memory; the rest stay on disk. Enables multiprogramming and memory abstraction.
                </p>
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mb-6">
                  <h4 className="font-mono text-cyan-400 mb-2">Demand Paging</h4>
                  <p className="text-sm text-gray-400">Pages are loaded only when accessed (on demand). Reduces initial load time and memory use.</p>
                </div>
                <VirtualMemoryVisual inRAM={[0, 1, 2, 3]} onDisk={[4, 5, 6, 7]} accessing={4} />
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  Page Fault
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  When a process accesses a page not in memory: <strong className="text-amber-400">page fault</strong>. The OS loads the page from disk, may evict another page if no free frame exists, then restarts the instruction.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <h4 className="font-mono text-emerald-400 mb-1">Page hit</h4>
                    <p className="text-sm text-gray-400">Page in memory → fast access.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <h4 className="font-mono text-amber-400 mb-1">Page fault</h4>
                    <p className="text-sm text-gray-400">Page on disk → load, then retry.</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/memory/paging" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Paging
                  </Link>
                  <Link href="/memory/page-replacement" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Page Replacement <ArrowRight className="w-3.5 h-3.5" />
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
                  <Cloud className="w-5 h-5 text-cyan-400" />
                  Page Fault Simulator
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Pages 0–3 are in memory; 4–7 are on disk. Access a page to see hit or fault.
                </p>

                <div className="flex gap-4 mb-6 items-end">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-mono">Page to access</label>
                    <input
                      type="number"
                      min={0}
                      max={PAGES - 1}
                      value={accessPage}
                      onChange={(e) => {
                        setAccessPage(Math.max(0, Math.min(PAGES - 1, +e.target.value)));
                        setLastResult(null);
                      }}
                      className="w-20 px-3 py-2 rounded-lg bg-gray-900/60 border border-white/10 font-mono text-sm text-gray-200"
                    />
                  </div>
                  <motion.button
                    onClick={simulateAccess}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 font-mono text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Access Page
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      <h4 className="font-mono text-cyan-400">RAM (Frames)</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {IN_MEMORY.map((p) => (
                        <span key={p} className={`px-3 py-1.5 rounded-lg font-mono text-sm ${accessPage === p ? 'bg-cyan-500/30 border border-cyan-500' : 'bg-cyan-500/10 border border-cyan-500/30'}`}>
                          P{p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <HardDrive className="w-4 h-4 text-gray-500" />
                      <h4 className="font-mono text-gray-400">Disk (Backing Store)</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[4, 5, 6, 7].map((p) => (
                        <span key={p} className={`px-3 py-1.5 rounded-lg font-mono text-sm bg-gray-800/60 border border-gray-600 ${accessPage === p ? 'border-amber-500' : ''}`}>
                          P{p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {lastResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl font-mono text-sm ${
                      lastResult === 'hit'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    }`}
                  >
                    {lastResult === 'hit' ? '✓ Page hit — page in memory, fast access' : '⚠ Page fault — page on disk, must load from backing store'}
                  </motion.div>
                )}
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-wrap gap-3">
                  <Link href="/memory/paging" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Paging
                  </Link>
                  <Link href="/memory/page-replacement" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Page Replacement <ArrowRight className="w-3.5 h-3.5" />
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
