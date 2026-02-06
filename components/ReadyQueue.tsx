import React from 'react';
import { Process } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowRight } from 'lucide-react';

interface ReadyQueueProps {
    processes: Process[];
    currentTime: number;
    cpuProcessId: string | null;
    scheduledBlocks: { processId: string; startTime: number; endTime: number }[];
}

export default function ReadyQueue({ processes, currentTime, cpuProcessId, scheduledBlocks }: ReadyQueueProps) {

    // Helper to determine process status relative to playback time
    const getProcessStatus = (p: Process) => {
        // 1. Future
        if (p.arrivalTime > currentTime) return 'FUTURE';

        // 2. Completed? 
        // Calculate total duration scheduled for this process up to currentTime
        const processBlocks = scheduledBlocks.filter(b => b.processId === p.id);
        let timeRun = 0;
        processBlocks.forEach(b => {
            if (b.endTime <= currentTime) {
                timeRun += (b.endTime - b.startTime);
            } else if (b.startTime < currentTime) {
                timeRun += (currentTime - b.startTime);
            }
        });

        // Total required time
        const totalBurst = p.bursts.reduce((acc, b) => acc + (b.type === 'CPU' ? b.duration : 0), 0);

        // If run time >= total time, it's completed
        if (timeRun >= totalBurst - 0.01) return 'COMPLETED';

        // 3. Running?
        if (p.id === cpuProcessId) return 'RUNNING';

        // 4. Ready (Arrived, not done, not running)
        return 'READY';
    };

    const readyProcesses = processes.filter(p => getProcessStatus(p) === 'READY');

    return (
        <div className="mb-0">
            <div className="flex items-center gap-2 mb-3 pl-1">
                <Layers className="w-4 h-4 text-gray-500" />
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest">Process Queue</h3>
            </div>

            <div className="flex gap-3 min-h-[64px] p-3 bg-gray-900/40 rounded-xl overflow-x-auto items-center border border-dashed border-gray-700/50">
                <AnimatePresence mode="popLayout">
                    {readyProcesses.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-gray-600 text-[10px] italic w-full text-center font-mono flex items-center justify-center gap-2"
                        >
                            <span>[EMPTY]</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full animate-pulse"></span>
                        </motion.div>
                    ) : (
                        readyProcesses.map((p, index) => (
                            <motion.div
                                key={p.id}
                                layout
                                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="flex items-center relative group"
                            >
                                <div className="flex flex-col items-center justify-center min-w-[56px] h-12 bg-gray-800/80 border-l-2 border-blue-500/80 shadow-[0_4px_10px_rgba(0,0,0,0.2)] rounded-r-lg px-2 backdrop-blur-sm hover:bg-gray-700/80 transition-colors relative overflow-hidden">
                                    {/* Scanline effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000"></div>

                                    <div className="font-bold text-gray-200 text-xs font-mono z-10">{p.id}</div>
                                    <div className="text-[9px] text-gray-500 uppercase tracking-wider scale-90 z-10">P{p.priority}</div>
                                </div>

                                {index < readyProcesses.length - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="ml-2 text-gray-700"
                                    >
                                        <ArrowRight size={12} />
                                    </motion.div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
