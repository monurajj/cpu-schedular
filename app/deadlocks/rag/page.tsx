'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Info,
  Zap,
  ArrowRight,
  Circle,
  Square,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';

type EdgeType = 'request' | 'allocation';

interface Edge {
  from: string;
  to: string;
  type: EdgeType;
}

const PRESETS = [
  {
    id: 'no-deadlock',
    name: 'No Deadlock',
    edges: [
      { from: 'R0', to: 'P0', type: 'allocation' as EdgeType },
      { from: 'P0', to: 'R1', type: 'request' as EdgeType },
      { from: 'R1', to: 'P1', type: 'allocation' as EdgeType },
    ],
    desc: 'P0 holds R0, requests R1. P1 holds R1. P1 can finish and release R1.',
  },
  {
    id: 'deadlock',
    name: 'Deadlock',
    edges: [
      { from: 'R0', to: 'P0', type: 'allocation' as EdgeType },
      { from: 'P0', to: 'R1', type: 'request' as EdgeType },
      { from: 'R1', to: 'P1', type: 'allocation' as EdgeType },
      { from: 'P1', to: 'R0', type: 'request' as EdgeType },
    ],
    desc: 'P0 holds R0, waits for R1. P1 holds R1, waits for R0. Cycle → deadlock.',
  },
];

function hasCycle(edges: Edge[]): boolean {
  const adj: Record<string, string[]> = {};
  edges.forEach((e) => {
    if (!adj[e.from]) adj[e.from] = [];
    adj[e.from].push(e.to);
  });

  const rec = new Set<string>();
  const visit = (node: string): boolean => {
    if (rec.has(node)) return true;
    rec.add(node);
    for (const next of adj[node] || []) {
      if (visit(next)) return true;
    }
    rec.delete(node);
    return false;
  };

  for (const n of Object.keys(adj)) {
    if (visit(n)) return true;
  }
  return false;
}

export default function RAGPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [preset, setPreset] = useState<string>('no-deadlock');
  const [edges, setEdges] = useState<Edge[]>(PRESETS[0].edges);

  const currentPreset = PRESETS.find((p) => p.id === preset)!;
  const deadlock = useMemo(() => hasCycle(edges), [edges]);

  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (p) {
      setPreset(id);
      setEdges(p.edges);
    }
  };

  const positions: Record<string, { x: number; y: number }> = {
    P0: { x: 80, y: 120 },
    P1: { x: 240, y: 120 },
    R0: { x: 120, y: 220 },
    R1: { x: 200, y: 220 },
  };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Resource Allocation Graph (RAG)</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Deadlocks • Lecture 16</p>
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
                  What is a RAG?
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  A <strong className="text-cyan-400">Resource Allocation Graph</strong> models processes and resources as nodes. Edges show who holds what and who is waiting.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center">
                      <Circle className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-mono text-cyan-400 mb-1">Process (circle)</h4>
                      <p className="text-sm text-gray-400">P0, P1, P2, ...</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center">
                      <Square className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-mono text-amber-400 mb-1">Resource (rectangle)</h4>
                      <p className="text-sm text-gray-400">R0, R1, R2, ...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-cyan-400" />
                  Edges
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-1">Request edge: P → R</h4>
                    <p className="text-sm text-gray-400">Process P is waiting for resource R. Drawn as dashed arrow.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-1">Allocation edge: R → P</h4>
                    <p className="text-sm text-gray-400">Resource R is held by process P. Drawn as solid arrow.</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <h4 className="font-mono text-amber-400 mb-2">Cycle = Deadlock (single-instance)</h4>
                  <p className="text-sm text-amber-200/90">
                    For single-instance resources, a cycle in the RAG implies deadlock. No process in the cycle can proceed.
                  </p>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/deadlocks/intro" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Deadlock Introduction
                  </Link>
                  <Link href="/deadlocks/detection" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Detection & Recovery <ArrowRight className="w-3.5 h-3.5" />
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
                  <GitBranch className="w-5 h-5 text-cyan-400" />
                  RAG Visualizer
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  Select a preset to view the graph. Cycle detection runs automatically.
                </p>
                <div className="flex gap-3 mb-6">
                  {PRESETS.map((p) => (
                    <motion.button
                      key={p.id}
                      onClick={() => applyPreset(p.id)}
                      className={`px-4 py-2 rounded-lg font-mono text-sm border transition-all ${
                        preset === p.id
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                          : 'bg-gray-800/60 text-gray-400 border-white/10 hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {p.name}
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mb-6">{currentPreset.desc}</p>

                <div className="relative w-full max-w-md mx-auto aspect-4/3 bg-gray-900/60 rounded-xl border border-white/10">
                  <svg viewBox="0 0 320 320" className="w-full h-full">
                    {edges.map((e, i) => {
                      const from = positions[e.from];
                      const to = positions[e.to];
                      if (!from || !to) return null;
                      const isRequest = e.type === 'request';
                      return (
                        <line
                          key={i}
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke={deadlock ? '#f87171' : isRequest ? '#22d3ee' : '#a3e635'}
                          strokeWidth={2}
                          strokeDasharray={isRequest ? '6 4' : '0'}
                          markerEnd="url(#arrow)"
                        />
                      );
                    })}
                    <defs>
                      <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                        <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
                      </marker>
                    </defs>
                    {Object.entries(positions).map(([id, pos]) => (
                      <g key={id}>
                        {id.startsWith('P') ? (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r={24}
                            fill="#0a0a0a"
                            stroke={deadlock ? '#f87171' : '#22d3ee'}
                            strokeWidth={2}
                          />
                        ) : (
                          <rect
                            x={pos.x - 24}
                            y={pos.y - 18}
                            width={48}
                            height={36}
                            rx={4}
                            fill="#0a0a0a"
                            stroke={deadlock ? '#f87171' : '#fbbf24'}
                            strokeWidth={2}
                          />
                        )}
                        <text
                          x={pos.x}
                          y={pos.y + 5}
                          textAnchor="middle"
                          fill="#e2e8f0"
                          fontSize="14"
                          fontFamily="monospace"
                        >
                          {id}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="mt-6 text-center">
                  {deadlock ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-block p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 font-mono text-sm"
                    >
                      ⚠ Cycle detected → DEADLOCK
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-block p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-sm"
                    >
                      ✓ No cycle → No deadlock
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Solid = allocation (R→P), Dashed = request (P→R)
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-wrap gap-3">
                  <Link href="/deadlocks/intro" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Deadlock Introduction
                  </Link>
                  <Link href="/deadlocks/detection" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Detection & Recovery <ArrowRight className="w-3.5 h-3.5" />
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
