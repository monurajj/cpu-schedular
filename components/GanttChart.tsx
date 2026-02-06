import React from 'react';
import { GanttChartBlock, BurstType } from '@/lib/types';

interface GanttChartProps {
    blocks: GanttChartBlock[];
}

const COLORS = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500'
];

const getProcessColor = (id: string) => {
    if (id === 'IDLE') return 'bg-gray-200';
    const numId = parseInt(id.replace(/\D/g, '')) || 1;
    return COLORS[(numId - 1) % COLORS.length];
};

export default function GanttChart({ blocks }: GanttChartProps) {
    if (blocks.length === 0) return null;

    const totalTime = blocks[blocks.length - 1].endTime;

    return (
        <div className="w-full">
            {/* Timeline Container */}
            <div className="relative w-full h-16 bg-gray-800/50 rounded overflow-hidden flex border border-gray-600/50">
                {blocks.map((block, index) => {
                    const duration = block.endTime - block.startTime;
                    const widthPercent = (duration / totalTime) * 100;

                    return (
                        <div
                            key={index}
                            className={`h-full flex flex-col justify-center items-center text-[10px] font-bold transition-all duration-500 border-r border-gray-900/20 ${getProcessColor(block.processId)} ${block.processId === 'IDLE' ? 'text-gray-600 bg-gray-900/30' : 'text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]'}`}
                            style={{ width: `${widthPercent}%` }}
                            title={`Process: ${block.processId}\nType: ${block.type}\nStart: ${block.startTime}\nEnd: ${block.endTime}\nDuration: ${duration}`}
                        >
                            <span className="truncate w-full text-center px-1 font-mono">
                                {block.processId !== 'IDLE' && block.processId}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Time Markers */}
            <div className="relative w-full h-6 flex text-[10px] font-mono text-gray-500 mt-1">
                <div className="absolute left-0 transform -translate-x-1/2 ml-1">0</div>
                {blocks.map((block, index) => {
                    const currentEndTime = block.endTime;
                    const percent = (currentEndTime / totalTime) * 100;
                    if (currentEndTime === 0) return null;
                    return (
                        <div
                            key={index}
                            className="absolute transform -translate-x-1/2 transition-all duration-500"
                            style={{ left: `${percent}%` }}
                        >
                            {currentEndTime}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex gap-2 mt-0 flex-wrap justify-end">
                {Array.from(new Set(blocks.map(b => b.processId))).filter(id => id !== 'IDLE').map(id => (
                    <div key={id} className="flex items-center text-[10px] text-gray-400 font-mono">
                        <div className={`w-2 h-2 rounded-full mr-1 ${getProcessColor(id)}`}></div>
                        <span>{id}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
