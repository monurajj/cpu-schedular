'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, HardDrive, Zap, Database, Layers } from 'lucide-react';

const levels = [
  {
    name: 'Registers',
    speed: '~1ns',
    size: 'KB',
    color: '#22d3ee',
    width: 22,
    icon: Zap,
    description: 'Fastest storage, directly inside the CPU. Holds operands for current instructions.',
  },
  {
    name: 'L1 Cache',
    speed: '~1ns',
    size: 'KB',
    color: '#2dd4bf',
    width: 38,
    icon: Cpu,
    description: 'On-chip cache. Typically 32–64 KB per core. First place CPU looks for data.',
  },
  {
    name: 'L2 Cache',
    speed: '~4ns',
    size: 'MB',
    color: '#34d399',
    width: 55,
    icon: Layers,
    description: 'Larger cache, often shared between cores. Reduces trips to main memory.',
  },
  {
    name: 'RAM',
    speed: '~100ns',
    size: 'GB',
    color: '#fbbf24',
    width: 75,
    icon: Database,
    description: 'Main memory for processes. OS manages allocation, protection, and paging.',
  },
  {
    name: 'SSD/HDD',
    speed: '~100μs',
    size: 'TB',
    color: '#94a3b8',
    width: 95,
    icon: HardDrive,
    description: 'Backing store for virtual memory. Persists data when power is off.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0 },
};

interface MemoryHierarchyPyramidProps {
  interactive?: boolean;
}

export default function MemoryHierarchyPyramid({ interactive = true }: MemoryHierarchyPyramidProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      className="flex flex-col items-center py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* CPU indicator */}
      <motion.div
        className="flex items-center gap-2 mb-3 text-xs text-cyan-400/80"
        variants={itemVariants}
      >
        <Cpu className="w-4 h-4" />
        <span className="font-mono">Closer to CPU</span>
      </motion.div>

      <div className="flex flex-col items-center gap-2 w-full max-w-md">
        {levels.map((level, i) => {
          const Icon = level.icon;
          const isExpanded = expanded === i;
          const isHovered = hovered === i;

          return (
            <motion.div
              key={level.name}
              variants={itemVariants}
              className="w-full"
            >
              <motion.div
                onMouseEnter={() => interactive && setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => interactive && setExpanded(isExpanded ? null : i)}
                className={`
                  flex items-center justify-between gap-4 py-3 px-4 rounded-xl border-2
                  transition-colors cursor-default
                  ${interactive ? 'cursor-pointer' : ''}
                `}
                style={{
                  width: `${level.width}%`,
                  marginLeft: `${(100 - level.width) / 2}%`,
                  backgroundColor: level.color + '12',
                  borderColor: isHovered || isExpanded ? level.color + '70' : level.color + '35',
                  boxShadow: isHovered || isExpanded ? `0 0 20px ${level.color}25` : 'none',
                }}
                animate={{
                  scale: isHovered && interactive ? 1.02 : 1,
                  x: isHovered && interactive ? 4 : 0,
                }}
                transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" style={{ color: level.color }} />
                  <span className="font-mono text-sm font-semibold truncate" style={{ color: level.color }}>
                    {level.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-mono shrink-0">
                  {level.speed} • {level.size}
                </span>
              </motion.div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mt-2 ml-4 pl-4 border-l-2 py-2"
                      style={{ borderColor: level.color + '40' }}
                    >
                      <p className="text-sm text-gray-400 leading-relaxed">{level.description}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <motion.div
        className="flex items-center justify-between w-full max-w-md mt-6 px-2"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2 text-xs text-cyan-400/80">
          <Zap className="w-3.5 h-3.5" />
          <span>Fast, small</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <span className="text-[10px]">←</span>
          <span className="w-16 h-px bg-gradient-to-r from-cyan-500/50 to-gray-500/50" />
          <span className="text-[10px]">→</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Slow, large</span>
          <HardDrive className="w-3.5 h-3.5" />
        </div>
      </motion.div>

      {interactive && (
        <motion.p
          className="mt-3 text-xs text-gray-500"
          variants={itemVariants}
        >
          Click a level to learn more
        </motion.p>
      )}
    </motion.div>
  );
}
