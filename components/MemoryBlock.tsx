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
        <div className="glass-panel p-4 rounded-xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <h3 className="text-gray-400 font-mono text-sm tracking-widest uppercase">Memory (RAM)</h3>
                <span className="text-xs text-gray-500 font-mono">{used}MB / {totalMemory}MB</span>
            </div>

            <div className="w-full h-2 bg-white/5 rounded-full mb-6 overflow-hidden">
                <div
                    className="h-full bg-cyan-500/50 shadow-[0_0_10px_#06b6d4] transition-all duration-500 relative"
                    style={{ width: `${usedPercent}%` }}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50"></div>
                </div>
            </div>

            <div className="grid grid-cols-8 gap-1 auto-rows-min flex-1 content-start">
                {memoryMap.map((block, i) => (
                    <div
                        key={i}
                        className={`
                            aspect-square rounded-sm text-[6px] flex items-center justify-center font-bold text-white transition-all duration-300
                            ${block.status === 'FREE' ? 'bg-white/5' : 'bg-transparent'}
                        `}
                        style={{
                            backgroundColor: block.status === 'OCCUPIED' ? (block.color || '#3b82f6') : undefined,
                            boxShadow: block.status === 'OCCUPIED' ? `0 0 5px ${block.color}` : 'none',
                            opacity: block.status === 'FREE' ? 0.3 : 0.8
                        }}
                        title={block.status === 'OCCUPIED' ? `Block ${i}: ${block.processId}` : `Block ${i}: Free`}
                    >
                    </div>
                ))}
            </div>
            <div className="mt-2 text-[10px] text-gray-600 font-mono text-right">
                Block: {blockSize}MB components
            </div>
        </div>
    );
}
