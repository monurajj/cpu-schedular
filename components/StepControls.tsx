'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface StepControlsProps {
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  canStepBack: boolean;
  canStepForward: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export default function StepControls({
  onStepBack,
  onStepForward,
  onReset,
  canStepBack,
  canStepForward,
  currentStep = 0,
  totalSteps = 0,
}: StepControlsProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900/60 border border-white/10">
      <motion.button
        onClick={onReset}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        title="Reset"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RotateCcw className="w-4 h-4" />
      </motion.button>
      <div className="flex items-center gap-1">
        <motion.button
          onClick={onStepBack}
          disabled={!canStepBack}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Step Backward"
          whileHover={{ scale: canStepBack ? 1.05 : 1 }}
          whileTap={{ scale: canStepBack ? 0.95 : 1 }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={onStepForward}
          disabled={!canStepForward}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Step Forward"
          whileHover={{ scale: canStepForward ? 1.05 : 1 }}
          whileTap={{ scale: canStepForward ? 0.95 : 1 }}
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
      {totalSteps > 0 && (
        <span className="text-xs font-mono text-gray-500 ml-2">
          {currentStep} / {totalSteps}
        </span>
      )}
    </div>
  );
}
