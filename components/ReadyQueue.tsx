import React from 'react';
import { Process, GanttChartBlock } from '@/lib/types';

interface ReadyQueueProps {
    processes: Process[];
    currentTime: number;
    cpuProcessId: string | null; // The process currently on CPU
    scheduledBlocks: GanttChartBlock[]; // To know who is done
}

export default function ReadyQueue({
    processes,
    currentTime,
    cpuProcessId,
    scheduledBlocks
}: ReadyQueueProps) {

    // Logic to find who is in Ready Queue
    // Condition: 
    // 1. Arrival Time <= Current Time
    // 2. Not Completed fully yet (check max EndTime in blocks < current time?)
    // 3. Not currently on CPU

    // Actually, 'scheduledBlocks' contains the FULL schedule of the future.
    // We need to know who is 'completed' relative to the currentTime.

    // Let's derive the state purely from the schedule relative to currentTime.

    // A process is "In Queue" if:
    // - It has arrived (Arrival <= currentTime)
    // - It is NOT the one running right now (cpuProcessId)
    // - It has remaining burst time > 0 (We need to calculate this!)

    const getProcessStatus = (p: Process) => {
        if (p.arrivalTime > currentTime) return 'FUTURE';

        // Calculate remaining time for this process up to currentTime
        // Sum up all blocks for this process that end BEFORE or AT currentTime
        // Also count partial block if currently running?

        const processBlocks = scheduledBlocks.filter(b => b.processId === p.id);
        let timeRun = 0;

        processBlocks.forEach(b => {
            if (b.endTime <= currentTime) {
                timeRun += (b.endTime - b.startTime);
            } else if (b.startTime < currentTime) {
                // Partial run
                timeRun += (currentTime - b.startTime);
            }
        });

        const totalBurstTime = p.bursts.reduce((acc, b) => acc + (b.type === 'CPU' ? b.duration : 0), 0);
        if (Math.abs(timeRun - totalBurstTime) < 0.01) return 'COMPLETED';
        if (p.id === cpuProcessId) return 'RUNNING';

        return 'READY';
    };

    const readyProcesses = processes.filter(p => getProcessStatus(p) === 'READY');

    return (
        <div className="mb-0">
            <h3 className="text-xs font-mono text-gray-500 uppercase mb-2 tracking-widest pl-1">Process Queue</h3>

            <div className="flex gap-2 min-h-[50px] p-2 bg-gray-900/40 rounded-lg overflow-x-auto items-center border border-dashed border-gray-700/50">
                {readyProcesses.length === 0 ? (
                    <div className="text-gray-600 text-[10px] italic w-full text-center font-mono">IDLE</div>
                ) : (
                    readyProcesses.map(p => (
                        <div
                            key={p.id}
                            className="flex flex-col items-center justify-center min-w-[50px] h-10 bg-gray-800 border-l-2 border-blue-500 shadow-lg rounded-r px-2 animate-in slide-in-from-right duration-300"
                        >
                            <div className="font-bold text-gray-200 text-xs font-mono">{p.id}</div>
                            <div className="text-[8px] text-gray-500">P{p.priority}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
