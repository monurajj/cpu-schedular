'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Minus,
  Info,
  Zap,
  ArrowRight,
  Lock,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';

const BUFFER_SIZE = 5;

export default function ProducerConsumerPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [buffer, setBuffer] = useState<number[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const produce = () => {
    if (buffer.length >= BUFFER_SIZE) {
      setLog((prev) => [...prev.slice(-3), 'Producer: BLOCKED (buffer full)']);
      return;
    }
    const item = Math.floor(Math.random() * 100);
    setBuffer((b) => [...b, item]);
    setLog((prev) => [...prev.slice(-3), `Producer: added ${item} (buffer: ${buffer.length + 1}/${BUFFER_SIZE})`]);
  };

  const consume = () => {
    if (buffer.length === 0) {
      setLog((prev) => [...prev.slice(-3), 'Consumer: BLOCKED (buffer empty)']);
      return;
    }
    const [first, ...rest] = buffer;
    setBuffer(rest);
    setLog((prev) => [...prev.slice(-3), `Consumer: removed ${first} (buffer: ${buffer.length - 1}/${BUFFER_SIZE})`]);
  };

  const reset = () => {
    setBuffer([]);
    setLog([]);
  };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Producer-Consumer Problem</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Process Synchronization</p>
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
                  The Problem
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  <strong className="text-cyan-400">Producers</strong> add items to a shared buffer; <strong className="text-cyan-400">consumers</strong> remove them. Without synchronization: buffer overflow (producer adds when full) or underflow (consumer removes when empty). The buffer has a fixed size N.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <h4 className="font-mono text-amber-400 mb-2">Overflow</h4>
                    <p className="text-sm text-gray-400">Producer adds when buffer is full → data loss or corruption.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <h4 className="font-mono text-red-400 mb-2">Underflow</h4>
                    <p className="text-sm text-gray-400">Consumer removes when buffer is empty → invalid read.</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-cyan-400" />
                  The Solution: Three Semaphores
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-1">empty = N</h4>
                    <p className="text-sm text-gray-400">Counts free slots. Producer waits on empty; consumer signals it.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-1">full = 0</h4>
                    <p className="text-sm text-gray-400">Counts filled slots. Consumer waits on full; producer signals it.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-1">mutex = 1</h4>
                    <p className="text-sm text-gray-400">Protects the buffer. Both producer and consumer use it around buffer access.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-400">
{`// Producer
while (true) {
  item = produce();
  wait(empty);   // block if buffer full
  wait(mutex);
  add(item);
  signal(mutex);
  signal(full);
}

// Consumer
while (true) {
  wait(full);    // block if buffer empty
  wait(mutex);
  item = remove();
  signal(mutex);
  signal(empty);
  consume(item);
}`}
                  </pre>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/synchronization/semaphores" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Semaphores <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/synchronization/dining-philosophers" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Dining Philosophers
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
                  <Package className="w-5 h-5 text-cyan-400" />
                  Bounded Buffer Simulator
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Simulate producer (add) and consumer (remove). Buffer size: {BUFFER_SIZE}. Producer blocks when full; consumer blocks when empty.
                </p>
                <div className="flex gap-4 mb-6">
                  <motion.button
                    onClick={produce}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 font-mono text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" /> Produce
                  </motion.button>
                  <motion.button
                    onClick={consume}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30 font-mono text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Minus className="w-4 h-4" /> Consume
                  </motion.button>
                  <button onClick={reset} className="px-4 py-2 rounded-lg bg-gray-800/60 text-gray-400 border border-white/10 hover:border-white/20 font-mono text-sm">
                    Reset
                  </button>
                </div>
                <div className="p-6 rounded-xl bg-gray-900/40 border border-white/5">
                  <p className="text-xs font-mono text-gray-500 mb-3">Buffer [{buffer.length}/{BUFFER_SIZE}]</p>
                  <div className="flex gap-2 flex-wrap min-h-[48px]">
                    <AnimatePresence mode="popLayout">
                      {buffer.map((item, i) => (
                      <motion.div
                        key={`${item}-${i}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="w-12 h-12 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-mono text-cyan-400 text-sm"
                      >
                        {item}
                      </motion.div>
                    ))}
                    </AnimatePresence>
                    {Array.from({ length: BUFFER_SIZE - buffer.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="w-12 h-12 rounded-lg bg-gray-800/60 border border-dashed border-gray-600 flex items-center justify-center text-gray-600 text-xs">
                        —
                      </div>
                    ))}
                  </div>
                </div>
                {log.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-gray-900/50 font-mono text-xs text-gray-400 max-h-20 overflow-y-auto">
                    {log.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-wrap gap-3">
                  <Link href="/synchronization/semaphores" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Semaphores <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/synchronization/dining-philosophers" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Dining Philosophers
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
