'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  Info,
  Zap,
  ArrowRight,
} from 'lucide-react';
import PageFramesVisual from '@/components/PageFramesVisual';
import ModeToggle from '@/components/ModeToggle';

type Algo = 'fifo' | 'lru' | 'optimal';

function runFIFO(refs: number[], frames: number): { steps: { page: number; frames: number[]; fault: boolean }[]; faults: number } {
  const mem: number[] = [];
  const steps: { page: number; frames: number[]; fault: boolean }[] = [];
  let faults = 0;
  let next = 0;
  for (const p of refs) {
    const idx = mem.indexOf(p);
    if (idx >= 0) {
      steps.push({ page: p, frames: [...mem], fault: false });
    } else {
      faults++;
      if (mem.length < frames) {
        mem.push(p);
      } else {
        mem[next % frames] = p;
        next++;
      }
      steps.push({ page: p, frames: [...mem], fault: true });
    }
  }
  return { steps, faults };
}

function runLRU(refs: number[], frames: number): { steps: { page: number; frames: number[]; fault: boolean }[]; faults: number } {
  const mem: number[] = [];
  const lastUsed: number[] = [];
  const steps: { page: number; frames: number[]; fault: boolean }[] = [];
  let faults = 0;
  refs.forEach((p, t) => {
    const idx = mem.indexOf(p);
    if (idx >= 0) {
      lastUsed[idx] = t;
      steps.push({ page: p, frames: [...mem], fault: false });
    } else {
      faults++;
      if (mem.length < frames) {
        mem.push(p);
        lastUsed.push(t);
      } else {
        let victim = 0;
        for (let i = 1; i < mem.length; i++) {
          if (lastUsed[i] < lastUsed[victim]) victim = i;
        }
        mem[victim] = p;
        lastUsed[victim] = t;
      }
      steps.push({ page: p, frames: [...mem], fault: true });
    }
  });
  return { steps, faults };
}

function runOptimal(refs: number[], frames: number): { steps: { page: number; frames: number[]; fault: boolean }[]; faults: number } {
  const mem: number[] = [];
  const steps: { page: number; frames: number[]; fault: boolean }[] = [];
  let faults = 0;
  refs.forEach((p, t) => {
    const idx = mem.indexOf(p);
    if (idx >= 0) {
      steps.push({ page: p, frames: [...mem], fault: false });
    } else {
      faults++;
      if (mem.length < frames) {
        mem.push(p);
      } else {
        let victim = 0;
        let farthest = -1;
        for (let i = 0; i < mem.length; i++) {
          const next = refs.indexOf(mem[i], t + 1);
          if (next === -1) {
            victim = i;
            farthest = Infinity;
            break;
          }
          if (next > farthest) {
            farthest = next;
            victim = i;
          }
        }
        mem[victim] = p;
      }
      steps.push({ page: p, frames: [...mem], fault: true });
    }
  });
  return { steps, faults };
}

export default function PageReplacementPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [refStr, setRefStr] = useState('7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1');
  const [frames, setFrames] = useState(3);
  const [algo, setAlgo] = useState<Algo>('fifo');
  const [stepIdx, setStepIdx] = useState(-1);

  const refs = refStr.trim().split(/\s+/).map(Number).filter((n) => !isNaN(n));
  const result = refs.length > 0
    ? algo === 'fifo'
      ? runFIFO(refs, frames)
      : algo === 'lru'
      ? runLRU(refs, frames)
      : runOptimal(refs, frames)
    : { steps: [], faults: 0 };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Page Replacement Algorithms</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Memory Management • Lecture 22</p>
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
                  When a page fault occurs and all frames are full, a <strong className="text-cyan-400">victim</strong> must be chosen. The replacement algorithm affects performance (number of page faults).
                </p>
                <div className="mt-6">
                  <PageFramesVisual frames={[7, 0, 1, 2]} reference={1} />
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                  Algorithms
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">FIFO (First-In First-Out)</h4>
                    <p className="text-sm text-gray-400">Replace the oldest page. Simple but can suffer from Belady&apos;s anomaly (more frames → more faults).</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">LRU (Least Recently Used)</h4>
                    <p className="text-sm text-gray-400">Replace the page least recently used. Good approximation of optimal; requires hardware support (counters or stack).</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Optimal</h4>
                    <p className="text-sm text-gray-400">Replace the page that will not be used for the longest time. Theoretical best; not implementable (requires future knowledge).</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/memory/virtual" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Virtual Memory
                  </Link>
                  <Link href="/memory/paging" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Paging
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
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                  Page Replacement Simulator
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Enter reference string (space-separated page numbers), choose algorithm, and step through.
                </p>

                <div className="mb-6 flex flex-wrap gap-4 items-center">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-mono">Reference string</label>
                    <input
                      type="text"
                      value={refStr}
                      onChange={(e) => {
                        setRefStr(e.target.value);
                        setStepIdx(-1);
                      }}
                      className="w-64 px-3 py-2 rounded-lg bg-gray-900/60 border border-white/10 font-mono text-sm text-gray-200"
                      placeholder="7 0 1 2 0 3 0 4 2 3 0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-mono">Frames</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={frames}
                      onChange={(e) => {
                        setFrames(Math.max(1, Math.min(8, +e.target.value)));
                        setStepIdx(-1);
                      }}
                      className="w-16 px-3 py-2 rounded-lg bg-gray-900/60 border border-white/10 font-mono text-sm text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-mono">Algorithm</label>
                    <select
                      value={algo}
                      onChange={(e) => {
                        setAlgo(e.target.value as Algo);
                        setStepIdx(-1);
                      }}
                      className="px-3 py-2 rounded-lg bg-gray-900/60 border border-white/10 font-mono text-sm text-gray-200"
                    >
                      <option value="fifo">FIFO</option>
                      <option value="lru">LRU</option>
                      <option value="optimal">Optimal</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <motion.button
                    onClick={() => setStepIdx(Math.max(-1, stepIdx - 1))}
                    disabled={stepIdx <= -1}
                    className="px-4 py-2 rounded-lg bg-gray-800/60 text-gray-400 border border-white/10 hover:border-white/20 disabled:opacity-50 font-mono text-sm"
                  >
                    ← Prev
                  </motion.button>
                  <motion.button
                    onClick={() => setStepIdx(Math.min(result.steps.length - 1, stepIdx + 1))}
                    disabled={stepIdx >= result.steps.length - 1}
                    className="px-4 py-2 rounded-lg bg-gray-800/60 text-gray-400 border border-white/10 hover:border-white/20 disabled:opacity-50 font-mono text-sm"
                  >
                    Next →
                  </motion.button>
                  <motion.button
                    onClick={() => setStepIdx(result.steps.length - 1)}
                    className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/30 font-mono text-sm"
                  >
                    Run All
                  </motion.button>
                  <button onClick={() => setStepIdx(-1)} className="px-4 py-2 rounded-lg bg-gray-800/60 text-gray-400 border border-white/10 hover:border-white/20 font-mono text-sm">
                    Reset
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <div className="flex gap-2 mb-4 min-w-max">
                    {refs.map((p, i) => (
                      <div
                        key={i}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm border ${
                          stepIdx >= 0 && stepIdx === i
                            ? 'bg-cyan-500/20 border-cyan-500'
                            : stepIdx >= i
                            ? 'bg-gray-800/60 border-white/10'
                            : 'bg-gray-900/40 border-gray-800'
                        }`}
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                  {stepIdx >= 0 && result.steps[stepIdx] && (
                    <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 mb-4">
                      <p className="text-sm font-mono text-cyan-400 mb-2">
                        Step {stepIdx + 1}: Access page {result.steps[stepIdx].page}
                        {result.steps[stepIdx].fault && ' (Fault)'}
                      </p>
                      <div className="flex gap-2">
                        {result.steps[stepIdx].frames.map((f, i) => (
                          <span key={i} className="px-3 py-1 rounded bg-gray-900/60 font-mono text-sm">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5 font-mono text-sm">
                  Total page faults: <strong className="text-cyan-400">{result.faults}</strong>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-wrap gap-3">
                  <Link href="/memory/virtual" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Virtual Memory
                  </Link>
                  <Link href="/memory/paging" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Paging
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
