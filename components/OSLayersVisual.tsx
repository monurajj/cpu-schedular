'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Layers, Cpu, HardDrive } from 'lucide-react';

const layers = [
  { id: 'user', label: 'Users', icon: User, color: '#a78bfa', width: '100%' },
  { id: 'apps', label: 'Applications', icon: Layers, color: '#60a5fa', width: '85%' },
  { id: 'os', label: 'OS (Kernel)', icon: Cpu, color: '#22d3ee', width: '70%' },
  { id: 'hw', label: 'Hardware', icon: HardDrive, color: '#64748b', width: '55%' },
];

export default function OSLayersVisual() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {layers.map((layer, i) => (
        <motion.div
          key={layer.id}
          className="flex items-center gap-4 w-full max-w-md"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 24 }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all hover:scale-[1.02]"
            style={{
              width: layer.width,
              backgroundColor: layer.color + '20',
              borderColor: layer.color + '50',
            }}
          >
            <layer.icon className="w-5 h-5" style={{ color: layer.color }} />
            <span className="font-mono font-semibold text-sm" style={{ color: layer.color }}>
              {layer.label}
            </span>
          </div>
          {i < layers.length - 1 && (
            <div className="text-gray-600 text-xs">↓</div>
          )}
        </motion.div>
      ))}
      <p className="text-xs text-gray-500 mt-2 font-mono">Data flows down • OS mediates between apps and hardware</p>
    </motion.div>
  );
}
