'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitFork, RefreshCw } from 'lucide-react';

interface ProcessTreeVisualProps {
  step?: number; // 0: init, 1: after fork, 2: after exec
  interactive?: boolean;
}

export default function ProcessTreeVisual({ step: controlledStep, interactive = true }: ProcessTreeVisualProps) {
  const [internalStep, setInternalStep] = useState(0);
  const step = controlledStep ?? internalStep;
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-xl bg-gray-900/40 border border-white/10">
      <div className="flex items-center justify-center gap-8">
        {/* Parent */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-14 h-14 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center">
            <span className="font-mono font-bold text-cyan-400">P</span>
          </div>
          <span className="text-xs font-mono text-gray-500 mt-2">Parent</span>
          <span className="text-[10px] text-gray-600">PID: 100</span>
        </motion.div>

        {/* Fork arrow */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <GitFork className="w-6 h-6 text-amber-400" />
              <span className="text-[10px] font-mono text-amber-400 mt-1">fork()</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Child */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="flex flex-col items-center"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 ${
                  step >= 2 ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-amber-500/20 border-amber-500/50'
                }`}
              >
                {step >= 2 ? (
                  <RefreshCw className="w-6 h-6 text-emerald-400" />
                ) : (
                  <span className="font-mono font-bold text-amber-400">C</span>
                )}
              </div>
              <span className="text-xs font-mono text-gray-500 mt-2">
                {step >= 2 ? 'Child (exec)' : 'Child'}
              </span>
              <span className="text-[10px] text-gray-600">PID: 101</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {interactive && controlledStep === undefined && (
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2].map((s) => (
            <motion.button
              key={s}
              onClick={() => setInternalStep(s)}
              className={`px-3 py-1 rounded text-xs font-mono ${
                step === s ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50' : 'bg-gray-800/60 text-gray-500 border border-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {s === 0 ? 'Init' : s === 1 ? 'fork()' : 'exec()'}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
