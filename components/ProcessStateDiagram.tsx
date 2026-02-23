'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProcessStateDiagramProps {
  selectedState?: string | null;
  onStateSelect?: (id: string) => void;
  interactive?: boolean;
}

const states = [
  { id: 'new', label: 'New', x: 50, y: 30, color: '#6b7280' },
  { id: 'ready', label: 'Ready', x: 50, y: 90, color: '#f59e0b' },
  { id: 'running', label: 'Running', x: 50, y: 150, color: '#22c55e' },
  { id: 'waiting', label: 'Waiting', x: 20, y: 210, color: '#f97316' },
  { id: 'terminated', label: 'Terminated', x: 80, y: 210, color: '#ef4444' },
];

const transitions = [
  { from: 'new', to: 'ready', label: 'admit' },
  { from: 'ready', to: 'running', label: 'dispatch' },
  { from: 'running', to: 'ready', label: 'preempt' },
  { from: 'running', to: 'waiting', label: 'I/O wait' },
  { from: 'waiting', to: 'ready', label: 'I/O done' },
  { from: 'running', to: 'terminated', label: 'exit' },
];

function getState(id: string) {
  return states.find((s) => s.id === id)!;
}

export default function ProcessStateDiagram({ selectedState, onStateSelect, interactive = true }: ProcessStateDiagramProps) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <svg viewBox="0 0 100 250" className="w-full h-auto" style={{ minHeight: 280 }}>
        <defs>
          <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
            <polygon points="0 0, 4 2, 0 4" fill="#64748b" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Arrows */}
        {transitions.map((t, i) => {
          const from = getState(t.from);
          const to = getState(t.to);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const isCurved = from.x !== to.x;
          const path = isCurved
            ? `M ${from.x} ${from.y} Q ${from.x} ${midY} ${midX} ${midY} T ${to.x} ${to.y}`
            : `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
          return (
            <g key={i}>
              <motion.path
                d={path}
                fill="none"
                stroke="#475569"
                strokeWidth="0.4"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0, opacity: 0.5 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
              <text x={midX} y={midY - 2} textAnchor="middle" fill="#94a3b8" fontSize="2.5" fontFamily="monospace">
                {t.label}
              </text>
            </g>
          );
        })}

        {/* State nodes */}
        {states.map((s, i) => {
          const isSelected = selectedState === s.id;
          return (
            <g key={s.id}>
              <motion.circle
                cx={s.x}
                cy={s.y}
                r={8}
                fill={s.color}
                stroke={isSelected ? '#22d3ee' : '#334155'}
                strokeWidth={isSelected ? 1.5 : 0.8}
                filter={isSelected ? 'url(#glow)' : undefined}
                style={interactive ? { cursor: 'pointer' } : {}}
                onClick={() => interactive && onStateSelect?.(s.id)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 + i * 0.08 }}
                whileHover={interactive ? { scale: 1.15, filter: 'url(#glow)' } : {}}
                whileTap={interactive ? { scale: 0.95 } : {}}
              />
              <text
                x={s.x}
                y={s.y + 14}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="3.5"
                fontFamily="monospace"
                fontWeight={isSelected ? 600 : 400}
              >
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
