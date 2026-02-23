'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Zap,
  Shield,
  Apple,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Scale,
  Cpu,
  Info,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';

const designDilemma = [
  {
    id: 'monolithic',
    title: 'Monolithic (The Fast Way)',
    icon: Zap,
    examples: ['Linux'],
    description: 'Everything—drivers, file systems, networking—runs in kernel space. Blazing fast but one bug can crash the entire system.',
    pros: ['Fast', 'Direct access', 'No message passing overhead'],
    cons: ['One bug crashes all', 'Hard to maintain', 'Less modular'],
    color: 'from-amber-500/20 to-orange-600/20',
    border: 'border-amber-500/30',
  },
  {
    id: 'microkernel',
    title: 'Microkernel (The Safe Way)',
    icon: Shield,
    examples: ['QNX'],
    description: 'Only essential services run in the kernel; others run in user space. Highly secure and modular but slower due to "message passing" overhead.',
    pros: ['Secure', 'Modular', 'Reliable'],
    cons: ['Slower', 'Message passing overhead', 'More context switches'],
    color: 'from-emerald-500/20 to-green-600/20',
    border: 'border-emerald-500/30',
  },
  {
    id: 'hybrid',
    title: 'macOS XNU Hybrid',
    icon: Apple,
    examples: ['macOS', 'iOS'],
    description: 'Combines the Mach microkernel (for IPC/threads) with the BSD monolithic layer (for POSIX/networking) to get speed and stability.',
    pros: ['Best of both', 'Speed + stability', 'POSIX support'],
    cons: ['Complex', 'Apple-specific'],
    color: 'from-cyan-500/20 to-blue-600/20',
    border: 'border-cyan-500/30',
  },
];

export default function ArchitecturePage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">OS Architecture & Structure</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Lecture 2: OS Foundations II</p>
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
              {/* Intro */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-cyan-400" />
                  Why Does OS Architecture Matter?
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  The way an OS is structured determines its <strong className="text-cyan-400">speed</strong>, <strong className="text-cyan-400">reliability</strong>, and <strong className="text-cyan-400">maintainability</strong>. The core question: how much code runs in <strong className="text-gray-300">kernel space</strong> (privileged, fast, risky) vs <strong className="text-gray-300">user space</strong> (isolated, slower, safe)?
                </p>
                <div className="flex gap-4 p-4 rounded-xl bg-gray-900/40 border border-white/5">
                  <div className="flex-1">
                    <h4 className="text-xs font-mono text-amber-400 mb-1">Kernel Space</h4>
                    <p className="text-xs text-gray-400">Privileged mode. Direct hardware access. One bug = system crash.</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-mono text-emerald-400 mb-1">User Space</h4>
                    <p className="text-xs text-gray-400">Isolated. Safer. Communicates via system calls / message passing.</p>
                  </div>
                </div>
              </div>

              {/* Design Dilemma */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  The Design Dilemma: Monolithic vs. Microkernel
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  OS designers face a fundamental trade-off: put everything in the kernel for speed, or keep the kernel minimal for safety and modularity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, type: 'spring' as const, stiffness: 300, damping: 24 }}
                  >
                    <ArchitectureDiagram type="monolithic" interactive={true} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, type: 'spring' as const, stiffness: 300, damping: 24 }}
                  >
                    <ArchitectureDiagram type="microkernel" interactive={true} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: 'spring' as const, stiffness: 300, damping: 24 }}
                  >
                    <ArchitectureDiagram type="hybrid" interactive={true} />
                  </motion.div>
                </div>
                <p className="text-xs text-gray-500 mb-4 text-center">
                  Hover over blocks to see what each component does
                </p>
                <div className="mb-6 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <p className="text-sm text-gray-300">
                    <strong className="text-cyan-400">Key insight:</strong> Notice how the kernel (amber) shrinks from monolithic → microkernel. 
                    More in user space = safer but slower. Hybrid (macOS) keeps Mach minimal and pushes BSD services into a separate layer.
                  </p>
                </div>
                <div className="space-y-4">
                  {designDilemma.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.08, type: 'spring' as const, stiffness: 300, damping: 24 }}
                      className={`p-5 rounded-xl border ${item.border} ${item.color} hover:border-opacity-60 transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-gray-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-200 mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-400 mb-3">{item.description}</p>
                          <div className="flex flex-wrap gap-4 text-xs">
                            <span className="text-emerald-400">Pros: {item.pros.join(', ')}</span>
                            <span className="text-amber-400">Cons: {item.cons.join(', ')}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-gray-500 shrink-0">e.g., {item.examples.join(', ')}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Trade-off Summary */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  Quick Comparison
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-gray-500 font-mono">Architecture</th>
                        <th className="text-left py-3 px-4 text-gray-500 font-mono">Speed</th>
                        <th className="text-left py-3 px-4 text-gray-500 font-mono">Reliability</th>
                        <th className="text-left py-3 px-4 text-gray-500 font-mono">Best For</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-400">
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4 font-mono text-amber-400">Monolithic</td>
                        <td className="py-3 px-4">High</td>
                        <td className="py-3 px-4">Lower (one bug = crash)</td>
                        <td className="py-3 px-4">Performance-critical (Linux, servers)</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 px-4 font-mono text-emerald-400">Microkernel</td>
                        <td className="py-3 px-4">Lower (message passing)</td>
                        <td className="py-3 px-4">High</td>
                        <td className="py-3 px-4">Safety-critical (QNX, aerospace)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono text-cyan-400">Hybrid (XNU)</td>
                        <td className="py-3 px-4">Balanced</td>
                        <td className="py-3 px-4">Balanced</td>
                        <td className="py-3 px-4">Consumer devices (macOS, iOS)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Next Steps */}
              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  What&apos;s Next?
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Now that you understand OS structure, explore the <strong className="text-cyan-400">Process Concept</strong>—how code becomes a living process—and <strong className="text-cyan-400">CPU Scheduling</strong>—how the OS decides who runs next.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/process/concept"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-sm font-mono"
                  >
                    Process Concept <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/process/cpu-fundamentals"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 transition-colors text-sm font-mono"
                  >
                    CPU Scheduling Fundamentals
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
                  <Layers className="w-5 h-5 text-cyan-400" />
                  Kernel vs User Space
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Hover over each block to see what it does. Compare how kernel size changes across architectures.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ArchitectureDiagram type="monolithic" interactive={true} />
                  <ArchitectureDiagram type="microkernel" interactive={true} />
                  <ArchitectureDiagram type="hybrid" interactive={true} />
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  Compare Kernel Architectures
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Click each architecture to expand and compare pros, cons, and examples.
                </p>
                <div className="space-y-3">
                  {designDilemma.map((item) => (
                    <motion.div
                      key={item.id}
                      className={`rounded-xl border overflow-hidden transition-all ${item.border}`}
                      layout
                    >
                      <button
                        onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                        className={`w-full text-left p-4 flex items-center justify-between ${item.color}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-gray-200" />
                          </div>
                          <div>
                            <span className="font-semibold text-gray-200">{item.title}</span>
                            <p className="text-xs text-gray-400 mt-0.5">e.g., {item.examples.join(', ')}</p>
                          </div>
                        </div>
                        {expanded === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <AnimatePresence>
                        {expanded === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-0 space-y-4 bg-gray-900/40">
                              <p className="text-sm text-gray-400">{item.description}</p>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-xs font-mono text-emerald-400 mb-2">Pros</h4>
                                  <ul className="text-xs text-gray-400 space-y-1">
                                    {item.pros.map((p) => (
                                      <li key={p}>• {p}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-xs font-mono text-amber-400 mb-2">Cons</h4>
                                  <ul className="text-xs text-gray-400 space-y-1">
                                    {item.cons.map((c) => (
                                      <li key={c}>• {c}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Kernel vs User Space */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  Kernel vs User Space
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  The fundamental divide. Monolithic puts more in kernel; Microkernel keeps kernel minimal.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <h4 className="font-mono text-amber-400 mb-2">Kernel Space</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Privileged mode, direct hardware</li>
                      <li>• One bug can crash entire system</li>
                      <li>• No message passing overhead</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <h4 className="font-mono text-emerald-400 mb-2">User Space</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Isolated, safer</li>
                      <li>• Communicates via system calls</li>
                      <li>• Message passing adds overhead</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Explore Further
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/process/concept"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-sm font-mono"
                  >
                    Process Concept <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/process/cpu-fundamentals"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 transition-colors text-sm font-mono"
                  >
                    CPU Scheduling
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
