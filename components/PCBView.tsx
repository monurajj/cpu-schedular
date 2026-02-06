import React from 'react';
import { ProcessState } from '@/lib/types';

interface PCBViewProps {
    process: ProcessState | null;
    clock: number;
}

export default function PCBView({ process, clock }: PCBViewProps) {

    // Simulate register values based on clock/process ID
    const getPseudoRandomHex = (seed: number, offset: number) => {
        const val = Math.floor(Math.abs(Math.sin(seed + offset) * 0xFFFF));
        return '0x' + val.toString(16).toUpperCase().padStart(4, '0');
    };

    const pc = process ? 1000 + (process.totalCpuTime * 4) : 0;
    const ax = process ? getPseudoRandomHex(clock, 1) : '0x0000';
    const bx = process ? getPseudoRandomHex(clock, 2) : '0x0000';
    const cx = process ? getPseudoRandomHex(clock, 3) : '0x0000';
    const dx = process ? getPseudoRandomHex(clock, 4) : '0x0000';

    return (
        <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] font-mono">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                <h3 className="text-green-400 font-mono text-sm tracking-widest uppercase">CPU Registers</h3>
                <div className={`w-2 h-2 rounded-full ${process ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
            </div>

            {process ? (
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                        <div className="flex justify-between text-gray-400">
                            <span>PID</span>
                            <span className="text-white font-bold">{process.id}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>PC</span>
                            <span className="text-yellow-400">{pc}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>IR</span>
                            <span className="text-blue-400">MOV AX, [BX]</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-gray-400">
                            <span>AX</span>
                            <span className="text-green-300">{ax}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>BX</span>
                            <span className="text-green-300">{bx}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                            <span>CX</span>
                            <span className="text-green-300">{cx}</span>
                        </div>
                    </div>

                    <div className="col-span-2 pt-2 border-t border-gray-800">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">FLAGS</span>
                            <div className="flex gap-1 text-[10px]">
                                <span className="bg-gray-800 text-gray-300 px-1 rounded">Z:0</span>
                                <span className="bg-gray-800 text-gray-300 px-1 rounded">S:0</span>
                                <span className="bg-green-900 text-green-300 px-1 rounded">O:1</span>
                                <span className="bg-gray-800 text-gray-300 px-1 rounded">C:0</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-32 flex items-center justify-center text-gray-600 italic">
                    SYSTEM IDLE
                </div>
            )}
        </div>
    );
}
