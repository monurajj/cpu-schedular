'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Disc,
  Info,
  Zap,
  ArrowRight,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';

type Algo = 'fcfs' | 'sstf' | 'scan' | 'cscan';

function runFCFS(requests: number[], head: number): { order: number[]; seeks: number } {
  const order = [...requests];
  let seeks = 0;
  let pos = head;
  for (const r of order) {
    seeks += Math.abs(r - pos);
    pos = r;
  }
  return { order, seeks };
}

function runSSTF(requests: number[], head: number): { order: number[]; seeks: number } {
  const remaining = [...requests];
  const order: number[] = [];
  let pos = head;
  let seeks = 0;
  while (remaining.length > 0) {
    let nearest = 0;
    for (let i = 1; i < remaining.length; i++) {
      if (Math.abs(remaining[i] - pos) < Math.abs(remaining[nearest] - pos)) nearest = i;
    }
    const r = remaining.splice(nearest, 1)[0];
    order.push(r);
    seeks += Math.abs(r - pos);
    pos = r;
  }
  return { order, seeks };
}

function runSCAN(requests: number[], head: number, maxCyl: number): { order: number[]; seeks: number } {
  const left = requests.filter((r) => r < head).sort((a, b) => b - a);
  const right = requests.filter((r) => r >= head).sort((a, b) => a - b);
  const order = [...right, ...left];
  let seeks = 0;
  let pos = head;
  for (const r of order) {
    seeks += Math.abs(r - pos);
    pos = r;
  }
  return { order, seeks };
}

function runCSCAN(requests: number[], head: number, maxCyl: number): { order: number[]; seeks: number } {
  const left = requests.filter((r) => r < head).sort((a, b) => a - b);
  const right = requests.filter((r) => r >= head).sort((a, b) => a - b);
  const order = right.length > 0 ? [...right, ...left] : [...left];
  let seeks = 0;
  let pos = head;
  for (const r of order) {
    seeks += Math.abs(r - pos);
    pos = r;
  }
  return { order, seeks };
}

export default function DiskSchedulingPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [reqStr, setReqStr] = useState('98 183 37 122 14 124 65 67');
  const [head, setHead] = useState(53);
  const [maxCyl, setMaxCyl] = useState(199);
  const [algo, setAlgo] = useState<Algo>('sstf');

  const requests = reqStr.trim().split(/\s+/).map(Number).filter((n) => !isNaN(n));
  const result = requests.length > 0
    ? algo === 'fcfs'
      ? runFCFS(requests, head)
      : algo === 'sstf'
      ? runSSTF(requests, head)
      : algo === 'scan'
      ? runSCAN(requests, head, maxCyl)
      : runCSCAN(requests, head, maxCyl)
    : { order: [], seeks: 0 };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Disk Scheduling</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Storage & I/O • Lecture 24</p>
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
                  A disk has cylinders (tracks). The read/write head moves to service requests. <strong className="text-cyan-400">Seek time</strong> dominates; scheduling order affects total head movement.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Disc className="w-5 h-5 text-cyan-400" />
                  Algorithms
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">FCFS (First-Come First-Served)</h4>
                    <p className="text-sm text-gray-400">Process requests in arrival order. Fair but often poor performance.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">SSTF (Shortest Seek Time First)</h4>
                    <p className="text-sm text-gray-400">Always serve nearest request. Good but can cause starvation.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">SCAN (Elevator)</h4>
                    <p className="text-sm text-gray-400">Head moves in one direction to end, then reverses. Uniform wait.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">C-SCAN (Circular SCAN)</h4>
                    <p className="text-sm text-gray-400">Moves to end, then jumps to start. More uniform than SCAN.</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/storage/file-systems" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    File Systems
                  </Link>
                  <Link href="/memory/overview" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Memory Overview
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
                  <Disc className="w-5 h-5 text-cyan-400" />
                  Disk Scheduling Simulator
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Enter cylinder requests (space-separated), initial head position, and algorithm. Compare total seek distance.
                </p>

                <div className="mb-6 flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-mono">Requests</label>
                    <input
                      type="text"
                      value={reqStr}
                      onChange={(e) => setReqStr(e.target.value)}
                      className="w-64 px-3 py-2 rounded-lg bg-gray-900/60 border border-white/10 font-mono text-sm text-gray-200"
                      placeholder="98 183 37 122 14 124 65 67"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-mono">Head start</label>
                    <input
                      type="number"
                      min={0}
                      max={maxCyl}
                      value={head}
                      onChange={(e) => setHead(Math.max(0, Math.min(maxCyl, +e.target.value)))}
                      className="w-20 px-3 py-2 rounded-lg bg-gray-900/60 border border-white/10 font-mono text-sm text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-mono">Algorithm</label>
                    <select
                      value={algo}
                      onChange={(e) => setAlgo(e.target.value as Algo)}
                      className="px-3 py-2 rounded-lg bg-gray-900/60 border border-white/10 font-mono text-sm text-gray-200"
                    >
                      <option value="fcfs">FCFS</option>
                      <option value="sstf">SSTF</option>
                      <option value="scan">SCAN</option>
                      <option value="cscan">C-SCAN</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5 mb-4">
                  <h4 className="font-mono text-cyan-400 mb-2">Service order</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-gray-500 font-mono text-sm">Head {head} →</span>
                    {result.order.map((r, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-cyan-500/20 font-mono text-sm">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 font-mono text-sm">
                  Total seek distance: <strong className="text-cyan-400">{result.seeks}</strong> cylinders
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-wrap gap-3">
                  <Link href="/storage/file-systems" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    File Systems
                  </Link>
                  <Link href="/memory/overview" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Memory Overview
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
