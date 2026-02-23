'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Users } from 'lucide-react';

export default function BankAccountVisual() {
  return (
    <motion.div
      className="relative flex flex-col items-center gap-4 p-6 rounded-xl border border-amber-500/30 bg-gray-900/60"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="flex items-center justify-between gap-8 w-full">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center">
            <Users className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="text-xs font-mono text-cyan-400">Person A</span>
          <span className="text-[10px] text-gray-500">read → subtract → write</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-xl bg-amber-500/20 border-2 border-amber-500/50 flex flex-col items-center justify-center">
            <Wallet className="w-8 h-8 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300 mt-1">Balance</span>
          </div>
          <span className="text-[10px] text-gray-500 mt-2">Shared • Critical Section</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-xl bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center">
            <Users className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-xs font-mono text-emerald-400">Person B</span>
          <span className="text-[10px] text-gray-500">read → subtract → write</span>
        </div>
      </div>
      <p className="text-xs text-red-400 font-mono text-center">
        Race: Both read $100, both withdraw $50, both write $50 → Final $50 instead of $0
      </p>
    </motion.div>
  );
}
