'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DiskCylinderVisualProps {
  requests: number[];
  headPosition: number;
  maxCylinder?: number;
  serviceOrder?: number[];
}

export default function DiskCylinderVisual({ requests, headPosition, maxCylinder = 199, serviceOrder }: DiskCylinderVisualProps) {
  const scale = 200 / maxCylinder;
  const uniqueReqs = [...new Set(requests)].sort((a, b) => a - b);

  return (
    <motion.div
      className="p-6 rounded-xl border border-cyan-500/30 bg-gray-900/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-xs font-mono text-cyan-400 mb-4">Cylinder Track (0 → {maxCylinder})</div>
      <div className="relative h-8 bg-gray-800/60 rounded-full border border-gray-700 overflow-hidden">
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-6 rounded bg-cyan-500 border-2 border-cyan-400 -ml-2 z-10"
          initial={{ left: 0 }}
          animate={{ left: `${(headPosition / maxCylinder) * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          title={`Head: ${headPosition}`}
        />
        {uniqueReqs.slice(0, 8).map((cyl, i) => (
          <motion.div
            key={cyl}
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-500/80 -ml-1"
            style={{ left: `${(cyl / maxCylinder) * 100}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            title={`Cylinder ${cyl}`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-500">
        <span>0</span>
        <span>Head: {headPosition}</span>
        <span>{maxCylinder}</span>
      </div>
      {serviceOrder && serviceOrder.length > 0 && (
        <p className="text-xs text-gray-500 mt-3 font-mono">
          Order: {serviceOrder.join(' → ')}
        </p>
      )}
    </motion.div>
  );
}
