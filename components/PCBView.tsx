import React, { useEffect, useState } from 'react';
import { ProcessState } from '@/lib/types';
import { Terminal } from 'lucide-react';

interface PCBViewProps {
    process: ProcessState | null;
    clock: number;
}

// Scramble Text Component for Cyberpunk Effect
const ScrambleText = ({ text }: { text: string }) => {
    const [display, setDisplay] = useState(text);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

    useEffect(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(
                text.split('').map((letter, index) => {
                    if (index < iterations) return text[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('')
            );
            if (iterations >= text.length) clearInterval(interval);
            iterations += 1 / 3;
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return <span>{display}</span>;
}

export default function PCBView({ process, clock }: PCBViewProps) {
    if (!process) {
        return (
            <div className="glass-panel p-4 rounded-xl shadow-lg h-full flex flex-col justify-center items-center text-gray-600 border border-gray-800/50 bg-gray-900/40">
                <Terminal className="w-8 h-8 mb-2 opacity-50 text-gray-500" />
                <span className="text-xs font-mono uppercase tracking-widest text-gray-500">CPU Idle</span>
            </div>
        );
    }

    // Pure deterministic hex generator based on clock/seed
    const getHex = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        const val = Math.floor((x - Math.floor(x)) * 16777215);
        return '0x' + val.toString(16).toUpperCase().padStart(6, '0');
    };

    return (
        <div className="glass-panel p-4 rounded-xl shadow-lg h-full relative overflow-hidden group border border-gray-700/50 flex flex-col">
            {/* Background Pulse */}
            <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors animate-pulse duration-[2000ms]"></div>

            <div className="flex justify-between items-center mb-4 border-b border-gray-700/50 pb-2 relative z-10 shrink-0">
                <h2 className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> PCB: <span className="text-white font-bold">{process.id}</span>
                </h2>
                <span className="text-[10px] font-mono bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-600">
                    RUNNING
                </span>
            </div>

            <div className="space-y-2 font-mono text-xs relative z-10 flex-1 overflow-y-auto">
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">PC:</span>
                    <span className="text-emerald-400 font-bold">
                        <ScrambleText text={`0x${(1000 + clock * 4).toString(16).toUpperCase()}`} />
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-500">AX:</span>
                    <span className="text-amber-400">{getHex(clock + 1)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">BX:</span>
                    <span className="text-purple-400">{getHex(clock + 2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-500">State:</span>
                    <span className="text-blue-400">READY → RUN</span>
                </div>

                <div className="mt-auto pt-2 border-t border-gray-700/50 w-full">
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-500 uppercase">Priority</span>
                        <span className="text-gray-300">{process.priority}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
