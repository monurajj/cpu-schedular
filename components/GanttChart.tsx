import React from 'react';
import { GanttChartBlock } from '@/lib/types';
import { motion } from 'framer-motion';

interface GanttChartProps {
    blocks: GanttChartBlock[];
}

export const getProcessColor = (processId: string) => {
    // Cyberpunk Neon Palette
    const colors: Record<string, string> = {
        'P1': 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] border-blue-400',
        'P2': 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] border-green-400',
        'P3': 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)] border-purple-400',
        'P4': 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)] border-orange-400',
        'P5': 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.6)] border-pink-400',
        'IDLE': 'bg-gray-800/50 border-gray-700 repeating-linear-gradient(45deg,transparent,transparent_5px,#374151_5px,#374151_10px)'
    };
    return colors[processId] || 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)] border-cyan-400';
};

// Helper to map process ID to tailwind classes
function processIdToClassName(id: string): string {
    if (id === 'IDLE') return 'bg-gray-800/80 text-gray-600';

    const colorMap: Record<string, string> = {
        'P1': 'bg-blue-600',
        'P2': 'bg-green-600',
        'P3': 'bg-purple-600',
        'P4': 'bg-orange-600',
        'P5': 'bg-pink-600'
    };
    return colorMap[id] || 'bg-cyan-600';
}

export default function GanttChart({ blocks }: GanttChartProps) {
    if (blocks.length === 0) return null;

    const totalTime = blocks[blocks.length - 1].endTime;

    return (
        <div className="w-full">
            {/* Timeline Container */}
            <div className="relative w-full h-16 bg-gray-900/60 rounded-xl overflow-hidden flex border border-gray-700/50 shadow-inner">
                {blocks.map((block, index) => {
                    const duration = block.endTime - block.startTime;
                    const widthPercent = (duration / totalTime) * 100;

                    return (
                        <motion.div
                            key={`${index}-${block.processId}`}
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: `${widthPercent}%`, opacity: 1 }}
                            transition={{ duration: 0.3, type: "spring" }}
                            className={`h-full flex flex-col justify-center items-center text-[10px] font-bold border-r border-gray-900/50 relative group ${processIdToClassName(block.processId)}`}
                            title={`Process: ${block.processId}\nType: ${block.type}\nStart: ${block.startTime}\nEnd: ${block.endTime}\nDuration: ${duration}`}
                        >
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>

                            <span className="truncate w-full text-center px-1 font-mono text-white/90 drop-shadow-md z-10">
                                {block.processId !== 'IDLE' && block.processId}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Time Markers */}
            <div className="relative w-full h-6 flex text-[10px] font-mono text-gray-500 mt-2">
                <div className="absolute left-0 transform -translate-x-1/2 ml-1">0</div>
                {blocks.map((block, index) => {
                    const currentEndTime = block.endTime;
                    const percent = (currentEndTime / totalTime) * 100;
                    if (currentEndTime === 0) return null;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, left: `${percent}%` }}
                            animate={{ opacity: 1, left: `${percent}%` }}
                            className="absolute transform -translate-x-1/2 transition-all duration-300 flex flex-col items-center"
                        >
                            <div className="h-1 w-[1px] bg-gray-600 mb-1"></div>
                            {currentEndTime}
                        </motion.div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex gap-3 mt-4 flex-wrap justify-end">
                {Array.from(new Set(blocks.map(b => b.processId))).filter(id => id !== 'IDLE').map(id => (
                    <div key={id} className="flex items-center text-[10px] text-gray-400 font-mono bg-gray-800/50 px-2 py-1 rounded-full border border-gray-700/50">
                        <div className={`w-2 h-2 rounded-full mr-2 ${getProcessColor(id).split(' ')[0]}`}></div>
                        <span>{id}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
