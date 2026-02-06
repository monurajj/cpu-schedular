import React from 'react';
import { SchedulerResult } from '@/lib/types';
import { motion } from 'framer-motion';
import { Activity, Clock } from 'lucide-react';

interface StatsChartsProps {
    results: SchedulerResult;
}

export default function StatsCharts({ results }: StatsChartsProps) {
    const { processes, cpuUtilization } = results;



    const maxWait = Math.max(...processes.map(p => p.waitingTime));

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xs font-mono text-gray-400 mb-6 uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                <Activity className="w-3 h-3 text-blue-500" /> System Diagnostics
            </h2>

            <div className="grid grid-cols-2 gap-4 flex-1 items-center">
                {/* CPU Load Gauge */}
                <div className="flex flex-col items-center justify-center relative">
                    <div className="relative w-36 h-36">
                        {/* Outer Ring Track */}
                        <div className="absolute inset-0 rounded-full border-[6px] border-white/5"></div>

                        {/* Conic Gradient Fill */}
                        <motion.div
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: -90, opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: `conic-gradient(from 0deg, #3b82f6 0%, #06b6d4 ${cpuUtilization}%, transparent ${cpuUtilization}%)`,
                                maskImage: 'radial-gradient(transparent 60%, black 61%)'
                            }}
                        ></motion.div>

                        {/* Center Value */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                                key={cpuUtilization}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-3xl font-bold text-white font-mono tracking-tighter"
                            >
                                {cpuUtilization}<span className="text-sm text-gray-500">%</span>
                            </motion.span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">CPU Load</span>
                        </div>
                    </div>
                </div>

                {/* Vertical Bar Chart for Wait Times */}
                <div className="h-full flex flex-col justify-end gap-1 px-2 relative">
                    <h3 className="absolute top-0 left-0 text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Wait Times
                    </h3>
                    <div className="flex items-end justify-between h-32 gap-1 mt-6">
                        {processes.map((p, i) => (
                            <div key={p.id} className="flex flex-col items-center justify-end h-full flex-1 group" title={`Process ${p.id}: ${p.waitingTime}ms`}>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${maxWait > 0 ? (p.waitingTime / maxWait) * 100 : 0}%` }}
                                    transition={{ duration: 0.5, delay: i * 0.1, type: "spring" }}
                                    className="w-full max-w-[12px] bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm relative shadow-[0_0_10px_rgba(249,115,22,0.3)] group-hover:shadow-[0_0_15px_rgba(249,115,22,0.6)] transition-all"
                                >
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-orange-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {p.waitingTime}
                                    </div>
                                </motion.div>
                                <div className="text-[8px] text-gray-500 mt-1 font-mono">{p.id}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
