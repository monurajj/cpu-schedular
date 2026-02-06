import React from 'react';
import { GanttChartBlock } from '@/lib/types';

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
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Gantt Chart</h2>

            {/* Timeline Container */}
            <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden flex border border-gray-300">
                {blocks.map((block, index) => {
                    const duration = block.endTime - block.startTime;
                    const widthPercent = (duration / totalTime) * 100;

                    return (
                        <div
                            key={index}
                            className={`h-full flex flex-col justify-center items-center text-xs font-bold transition-all duration-500 hover:opacity-90 ${getProcessColor(block.processId)} ${block.processId === 'IDLE' ? 'text-gray-500' : 'text-white'}`}
                            style={{ width: `${widthPercent}%` }}
                            title={`Process: ${block.processId}\nStart: ${block.startTime}\nEnd: ${block.endTime}\nDuration: ${duration}`}
                        >
                            <span className="truncate w-full text-center px-1">
                                {block.processId}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Time Markers */}
            <div className="relative w-full h-8 flex text-xs text-gray-500 mt-1">
                {/* Always show 0 */}
                <div className="absolute left-0 transform -translate-x-1/2 ml-1">0</div>

                {blocks.map((block, index) => {
                    // We want to show end time of each block
                    const currentEndTime = block.endTime;
                    const percent = (currentEndTime / totalTime) * 100;

                    // Avoid overlapping with 0 if end time is 0 (unlikely)
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

            {/* Key/Legend (Optional but good) */}
            <div className="flex gap-4 mt-2 flex-wrap">
                {Array.from(new Set(blocks.map(b => b.processId))).filter(id => id !== 'IDLE').map(id => (
                    <div key={id} className="flex items-center text-xs">
                        <div className={`w-3 h-3 rounded-full mr-1 ${getProcessColor(id)}`}></div>
                        <span>{id}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
