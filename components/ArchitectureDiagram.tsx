'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ArchType = 'monolithic' | 'microkernel' | 'hybrid';

interface ArchitectureDiagramProps {
  type: ArchType;
  interactive?: boolean;
}

const componentLabels: Record<string, string> = {
  Drivers: 'Device drivers',
  FS: 'File system',
  Net: 'Networking',
  Sched: 'Scheduler',
  All: 'Everything in kernel',
  IPC: 'Inter-process communication',
  MM: 'Memory management',
  Mach: 'Mach microkernel',
  BSD: 'BSD layer (POSIX)',
  App1: 'Application',
  App2: 'Application',
  Apps: 'Applications',
  Services: 'User services',
};

type AccentKey = 'amber' | 'emerald' | 'cyan';

const config: Record<ArchType, {
  kernel: string[];
  user: string[];
  kernelHeight: number;
  userHeight: number;
  accent: AccentKey;
  label: string;
  example: string;
}> = {
  monolithic: {
    kernel: ['Drivers', 'FS', 'Net', 'Sched', 'All'],
    user: ['App1', 'App2'],
    kernelHeight: 72,
    userHeight: 28,
    accent: 'amber',
    label: 'Most in kernel',
    example: 'Linux',
  },
  microkernel: {
    kernel: ['IPC', 'Sched', 'MM'],
    user: ['Drivers', 'FS', 'Net', 'App1', 'App2'],
    kernelHeight: 28,
    userHeight: 72,
    accent: 'emerald',
    label: 'Minimal kernel',
    example: 'QNX',
  },
  hybrid: {
    kernel: ['Mach', 'BSD', 'Drivers'],
    user: ['Apps', 'Services'],
    kernelHeight: 50,
    userHeight: 50,
    accent: 'cyan',
    label: 'Mixed',
    example: 'macOS',
  },
};

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const blockVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

export default function ArchitectureDiagram({ type, interactive = true }: ArchitectureDiagramProps) {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const { kernel, user, kernelHeight, userHeight, accent, label, example } = config[type];

  const accentClasses = {
    amber: {
      user: 'bg-emerald-500/15 border-emerald-500/35',
      kernel: 'bg-amber-500/15 border-amber-500/35',
      blockUser: 'bg-emerald-500/25 border-emerald-500/45 text-emerald-300',
      blockKernel: 'bg-amber-500/25 border-amber-500/45 text-amber-200',
      glow: 'ring-amber-500/30',
    },
    emerald: {
      user: 'bg-emerald-500/15 border-emerald-500/35',
      kernel: 'bg-amber-500/15 border-amber-500/35',
      blockUser: 'bg-emerald-500/25 border-emerald-500/45 text-emerald-300',
      blockKernel: 'bg-amber-500/25 border-amber-500/45 text-amber-200',
      glow: 'ring-emerald-500/30',
    },
    cyan: {
      user: 'bg-emerald-500/15 border-emerald-500/35',
      kernel: 'bg-amber-500/15 border-amber-500/35',
      blockUser: 'bg-emerald-500/25 border-emerald-500/45 text-emerald-300',
      blockKernel: 'bg-amber-500/25 border-amber-500/45 text-amber-200',
      glow: 'ring-cyan-500/30',
    },
  };

  const classes = accentClasses[accent];

  return (
    <motion.div
      className={`
        relative rounded-xl border overflow-hidden
        bg-gray-900/60 transition-all duration-300
        ${interactive ? 'cursor-default' : ''}
        hover:border-cyan-500/20
        ${hoveredBlock ? `ring-2 ${classes.glow}` : 'border-cyan-500/20'}
      `}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      layout
    >
      {/* Header */}
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <span className="text-xs font-mono text-gray-400 capitalize">{type}</span>
        <span className="text-[10px] text-gray-500 font-mono">{example}</span>
      </div>

      {/* Diagram */}
      <div className="flex flex-col p-3 gap-2" style={{ minHeight: 200 }}>
        {/* User Space */}
        <div
          className={`rounded-lg border p-2.5 flex flex-wrap gap-1.5 content-start transition-all ${classes.user}`}
          style={{ flexGrow: userHeight, flexShrink: 1, minHeight: 40 }}
        >
          <div className="w-full text-[10px] font-mono text-emerald-400/80 mb-1 px-1">User Space</div>
          {user.map((item, i) => (
            <motion.div
              key={item}
              variants={blockVariants}
              onMouseEnter={() => interactive && setHoveredBlock(item)}
              onMouseLeave={() => setHoveredBlock(null)}
              className={`
                px-2.5 py-1.5 rounded-md text-[11px] font-mono border
                ${classes.blockUser}
                ${interactive ? 'hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/10 transition-transform' : ''}
              `}
            >
              {item}
            </motion.div>
          ))}
        </div>

        {/* Kernel Space */}
        <div
          className={`rounded-lg border p-2.5 flex flex-wrap gap-1.5 content-start transition-all ${classes.kernel}`}
          style={{ flexGrow: kernelHeight, flexShrink: 1, minHeight: 40 }}
        >
          <div className="w-full text-[10px] font-mono text-amber-400/80 mb-1 px-1">Kernel Space</div>
          {kernel.map((item, i) => (
            <motion.div
              key={item}
              variants={blockVariants}
              onMouseEnter={() => interactive && setHoveredBlock(item)}
              onMouseLeave={() => setHoveredBlock(null)}
              className={`
                px-2.5 py-1.5 rounded-md text-[11px] font-mono border
                ${classes.blockKernel}
                ${interactive ? 'hover:scale-105 hover:shadow-lg hover:shadow-amber-500/10 transition-transform' : ''}
              `}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between gap-2">
        <span className="text-[10px] text-gray-500 font-mono">{label}</span>
        {interactive && hoveredBlock && componentLabels[hoveredBlock] && (
          <AnimatePresence>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-cyan-400/90 font-mono truncate flex-1 text-right"
              title={componentLabels[hoveredBlock]}
            >
              {componentLabels[hoveredBlock]}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
