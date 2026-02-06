import React from 'react';
import { ProcessState } from '@/lib/types';

interface MemoryBlockProps {
    processes: ProcessState[];
    totalMemory?: number;
}

export default function MemoryBlock({ processes, totalMemory = 1024 }: MemoryBlockProps) {
    // Simple Memory Manager Simulation
    // We assume contiguous allocation for simplicity of visualization
    // or just show total usage.

    // Let's do a block visualization. 
    // Total blocks = 32 (representing 32MB chunks?)
    const blockSize = 32;
    const totalBlocks = Math.ceil(totalMemory / blockSize);

    const memoryMap: { status: 'FREE' | 'OCCUPIED', processId?: string, color?: string }[] =
        Array(totalBlocks).fill({ status: 'FREE' });

    // Fill memory based on active processes (READY, RUNNING, BLOCKED)
    // Terminated processes release memory.
    let currentBlock = 0;

    processes.filter(p => p.status !== 'TERMINATED' && p.status !== 'NEW').forEach(p => {
        const requiredBlocks = Math.ceil((p.memoryRequired || 128) / blockSize);

        for (let i = 0; i < requiredBlocks; i++) {
            if (currentBlock < totalBlocks) {
                memoryMap[currentBlock] = {
                    status: 'OCCUPIED',
                    processId: p.id,
                    color: p.color
                };
                currentBlock++;
            }
        }
    });

    const used = processes.filter(p => p.status !== 'TERMINATED' && p.status !== 'NEW')
        .reduce((acc, p) => acc + (p.memoryRequired || 128), 0);
    const usedPercent = Math.min(100, (used / totalMemory) * 100);

    return (
        <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-cyan-400 font-mono text-sm tracking-widest uppercase">Memory Map (RAM)</h3>
                <span className="text-xs text-gray-400 font-mono">{used}MB / {totalMemory}MB</span>
            </div>

            <div className="w-full h-4 bg-gray-800 rounded-full mb-4 overflow-hidden border border-gray-600">
                <div
                    className="h-full bg-cyan-600 shadow-[0_0_10px_#06b6d4] transition-all duration-500"
                    style={{ width: `${usedPercent}%` }}
                ></div>
            </div>

            <div className="grid grid-cols-8 gap-1">
                {memoryMap.map((block, i) => (
                    <div
                        key={i}
                        className={`
                            h-6 rounded-sm text-[8px] flex items-center justify-center font-bold text-white transition-all duration-300
                            ${block.status === 'FREE' ? 'bg-gray-800 border-gray-700 border' : 'border border-white/20'}
                        `}
                        style={{
                            backgroundColor: block.status === 'OCCUPIED' ? (block.color || '#3b82f6') : undefined,
                            boxShadow: block.status === 'OCCUPIED' ? `0 0 5px ${block.color}` : 'none'
                        }}
                        title={block.status === 'OCCUPIED' ? `Block ${i}: ${block.processId}` : `Block ${i}: Free`}
                    >
                        {block.processId || ''}
                    </div>
                ))}
            </div>
            <div className="mt-2 text-[10px] text-gray-500 font-mono text-right">
                Block Size: {blockSize}MB
            </div>
        </div>
    );
}
