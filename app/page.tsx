'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Lock,
  AlertTriangle,
  HardDrive,
  Building2,
  Zap,
  ArrowRight,
  Monitor,
  BookOpen,
  Briefcase,
  Code2,
  Layers,
  Shield,
} from 'lucide-react';

const cityAnalogy = [
  {
    icon: Building2,
    title: 'CPU Scheduler',
    analogy: 'Traffic Controller',
    description: 'Like a traffic controller at intersections, the CPU scheduler decides which process gets to run next, managing the flow of "vehicles" (processes) through the system.',
    path: '/cpu-scheduling',
    color: 'from-cyan-500/20 to-blue-600/20',
    border: 'border-cyan-500/30',
  },
  {
    icon: Lock,
    title: 'Process Synchronization',
    analogy: 'Restroom Locks',
    description: 'Mutexes and semaphores are like locks on restroom doors—ensuring only one thread enters the critical section at a time, preventing race conditions.',
    path: '/synchronization/critical-section',
    color: 'from-amber-500/20 to-orange-600/20',
    border: 'border-amber-500/30',
  },
  {
    icon: AlertTriangle,
    title: 'Deadlocks',
    analogy: 'Gridlock',
    description: 'When two cars block each other waiting for the other to move—deadlock! The Resource Allocation Graph helps detect these circular waits.',
    path: '/deadlocks/rag',
    color: 'from-red-500/20 to-rose-600/20',
    border: 'border-red-500/30',
  },
  {
    icon: HardDrive,
    title: 'Memory Management',
    analogy: 'Warehouse Shelves',
    description: 'RAM is like a warehouse. Paging divides it into fixed-size frames; processes get pages mapped to frames like boxes on shelves.',
    path: '/memory/paging',
    color: 'from-emerald-500/20 to-green-600/20',
    border: 'border-emerald-500/30',
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-cyan-200 to-gray-400 tracking-tight">
            OS-Interactive
          </h1>
          <p className="text-gray-500 mt-2 font-mono text-sm">
            Operating Systems • Interactive Teaching Platform
          </p>
        </header>

        {/* What is an OS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-8 mb-8 border border-white/10"
        >
          <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-cyan-400" />
            What is an Operating System?
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            An <strong className="text-gray-300">Operating System (OS)</strong> is system software that acts as an intermediary between
            computer hardware and application programs. It manages hardware resources—CPU, memory, storage, I/O devices—and
            provides common services so that applications can run efficiently and securely.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
              <h3 className="text-sm font-mono text-cyan-400 mb-2">Core Functions</h3>
              <ul className="text-sm text-gray-400 space-y-1.5">
                <li>• <strong className="text-gray-300">Process Management</strong> — Scheduling, creation, termination</li>
                <li>• <strong className="text-gray-300">Memory Management</strong> — Allocation, paging, virtual memory</li>
                <li>• <strong className="text-gray-300">File Systems</strong> — Organization and access to data</li>
                <li>• <strong className="text-gray-300">I/O & Device Management</strong> — Drivers, interrupts</li>
                <li>• <strong className="text-gray-300">Security & Protection</strong> — Access control, isolation</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
              <h3 className="text-sm font-mono text-cyan-400 mb-2">Examples</h3>
              <ul className="text-sm text-gray-400 space-y-1.5">
                <li>• <strong className="text-gray-300">Desktop</strong> — Windows, macOS, Linux</li>
                <li>• <strong className="text-gray-300">Mobile</strong> — Android, iOS</li>
                <li>• <strong className="text-gray-300">Embedded</strong> — RTOS, FreeRTOS</li>
                <li>• <strong className="text-gray-300">Server</strong> — Linux, Windows Server</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Why Study OS / Use Cases */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-2xl p-8 mb-8 border border-white/10"
        >
          <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Why Study Operating Systems?
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            Understanding OS concepts is foundational for computer science and software engineering. It explains how
            programs actually run, how resources are shared, and how to build efficient, reliable systems.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5 flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">Systems Programming</h3>
                <p className="text-xs text-gray-400">Write efficient code that interacts with the kernel, handles concurrency, and manages resources.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5 flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">Career Relevance</h3>
                <p className="text-xs text-gray-400">Kernel development, DevOps, cloud infrastructure, embedded systems, and performance tuning.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5 flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">Problem-Solving</h3>
                <p className="text-xs text-gray-400">Learn to reason about deadlocks, race conditions, scheduling trade-offs, and memory management.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5 flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-1">Security & Reliability</h3>
                <p className="text-xs text-gray-400">Understand isolation, privilege levels, and how vulnerabilities arise at the OS level.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* City Analogy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-panel rounded-2xl p-8 mb-8 border border-white/10"
        >
          <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            The City Infrastructure Analogy
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Think of an operating system as a bustling city. The <strong className="text-gray-300">CPU</strong> is the
            traffic controller, <strong className="text-gray-300">processes</strong> are vehicles, <strong className="text-gray-300">memory</strong> is
            warehouse space, and <strong className="text-gray-300">synchronization primitives</strong> are locks on shared
            resources. This platform lets you visualize each concept through interactive simulations—perfect for teaching
            and learning.
          </p>
          <p className="text-gray-400 text-sm">
            Use the module cards below to explore each topic with <strong className="text-gray-300">Lecture Mode</strong> (step-by-step) or <strong className="text-gray-300">Sandbox Mode</strong> (hands-on experimentation).
          </p>
        </motion.section>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cityAnalogy.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link href={item.path}>
                <div
                  className={`
                    glass-panel rounded-2xl p-6 h-full
                    border transition-all duration-300
                    hover:border-white/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]
                    group cursor-pointer
                    ${item.border}
                  `}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} border ${item.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs font-mono text-cyan-400/80 mb-3">≈ {item.analogy}</p>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{item.description}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <div className="px-4 py-2 rounded-lg bg-gray-900/60 border border-white/5 text-xs font-mono text-gray-500">
            24 Lecture Topics
          </div>
          <div className="px-4 py-2 rounded-lg bg-gray-900/60 border border-white/5 text-xs font-mono text-gray-500">
            Lecture + Sandbox Modes
          </div>
          <div className="px-4 py-2 rounded-lg bg-gray-900/60 border border-white/5 text-xs font-mono text-gray-500">
            Step-by-Step Animations
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
