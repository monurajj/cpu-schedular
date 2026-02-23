'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DeadlockCycleVisualProps {
  processes?: string[];
}

export default function DeadlockCycleVisual({ processes = ['P0', 'P1', 'P2', 'P3'] }: DeadlockCycleVisualProps) {
  const n = processes.length;
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  return (
    <motion.div
      className="relative w-64 h-64 mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {processes.map((p, i) => {
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const nextI = (i + 1) % n;
          const nextAngle = (nextI / n) * 2 * Math.PI - Math.PI / 2;
          const nextX = centerX + radius * Math.cos(nextAngle);
          const nextY = centerY + radius * Math.sin(nextAngle);
          return (
            <g key={p}>
              <line
                x1={x}
                y1={y}
                x2={nextX}
                y2={nextY}
                stroke="#f87171"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <marker id={`arrow-${i}`} markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
                <path d="M0,0 L0,8 L8,4 z" fill="#f87171" />
              </marker>
            </g>
          );
        })}
        {processes.map((p, i) => {
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <g key={p}>
              <motion.circle
                cx={x}
                cy={y}
                r={16}
                fill="#1e293b"
                stroke="#f87171"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 + i * 0.05 }}
              />
              <text x={x} y={y + 5} textAnchor="middle" fill="#e2e8f0" fontSize="12" fontFamily="monospace">
                {p}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="text-center text-xs text-red-400 font-mono mt-2">
        Circular wait: {processes.map((p, i) => `${p} waits for ${processes[(i + 1) % n]}`).join(' → ')}
      </p>
    </motion.div>
  );
}
