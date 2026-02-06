import React from 'react';
import { Process } from '@/lib/types';
import {
    fcfsResponse,
    sjfResponse,
    srtfResponse,
    priorityNonPreemptiveResponse,
    priorityPreemptiveResponse,
    roundRobinResponse
} from '@/lib/algorithms';

interface ComparisonViewProps {
    processes: Process[];
    timeQuantum: number;
}

export default function ComparisonView({ processes, timeQuantum }: ComparisonViewProps) {
    if (processes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-gray-500 border border-dashed border-gray-700 rounded-xl">
                <span className="text-xl font-bold mb-2">No Simulation Data</span>
                <span className="text-sm">Run simulations to compare algorithms</span>
            </div>
        );
    }

    // Run all algorithms
    const results = [
        { name: 'FCFS', res: fcfsResponse(processes) },
        { name: 'SJF', res: sjfResponse(processes) },
        { name: 'SRTF', res: srtfResponse(processes) },
        { name: 'Priority (NP)', res: priorityNonPreemptiveResponse(processes) },
        { name: 'Priority (P)', res: priorityPreemptiveResponse(processes) },
        { name: 'Round Robin', res: roundRobinResponse(processes, timeQuantum) },
    ];

    // Find min/max values for chart scaling
    const maxWT = Math.max(...results.map(r => r.res.averageWaitingTime));
    const maxTAT = Math.max(...results.map(r => r.res.averageTurnaroundTime));

    // Determine winners (Green highlight)
    const minWT = Math.min(...results.map(r => r.res.averageWaitingTime));

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Algorithm Comparison</h2>
                <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">Dataset: {processes.length} Processes</span>
            </div>

            {/* Comparison Cards Grid (Replacing big table for Top Level Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((item) => {
                    const isBest = item.res.averageWaitingTime === minWT;
                    return (
                        <div key={item.name} className={`glass-panel p-4 rounded-xl border transition-all ${isBest ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-gray-200">{item.name}</h3>
                                {isBest && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono uppercase">Optimal</span>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Avg Wait</span>
                                    <span className={`font-mono font-bold ${isBest ? 'text-emerald-400' : 'text-gray-300'}`}>{item.res.averageWaitingTime.toFixed(2)}ms</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Avg Turnaround</span>
                                    <span className="font-mono text-gray-300">{item.res.averageTurnaroundTime.toFixed(2)}ms</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Utilization</span>
                                    <span className="font-mono text-blue-400">{item.res.cpuUtilization}%</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Comparative Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Waiting Time Comparison */}
                <div className="glass-panel p-5 rounded-xl">
                    <h3 className="text-xs font-mono text-gray-500 mb-6 uppercase tracking-wider text-center flex items-center justify-center gap-2">
                        <span>Avg Waiting Time</span>
                        <span className="text-[9px] bg-gray-800 text-gray-400 px-1 rounded">(Lower is Better)</span>
                    </h3>
                    <div className="space-y-4">
                        {results.map(item => (
                            <div key={item.name} className="group">
                                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                    <span>{item.name}</span>
                                    <span>{item.res.averageWaitingTime.toFixed(2)}ms</span>
                                </div>
                                <div className="h-2 w-full bg-gray-800/50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${item.res.averageWaitingTime === minWT ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${maxWT > 0 ? (item.res.averageWaitingTime / maxWT) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Turnaround Time Comparison */}
                <div className="glass-panel p-5 rounded-xl">
                    <h3 className="text-xs font-mono text-gray-500 mb-6 uppercase tracking-wider text-center flex items-center justify-center gap-2">
                        <span>Avg Turnaround Time</span>
                        <span className="text-[9px] bg-gray-800 text-gray-400 px-1 rounded">(Lower is Better)</span>
                    </h3>
                    <div className="space-y-4">
                        {results.map(item => (
                            <div key={item.name} className="group">
                                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                    <span>{item.name}</span>
                                    <span>{item.res.averageTurnaroundTime.toFixed(2)}ms</span>
                                </div>
                                <div className="h-2 w-full bg-gray-800/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 rounded-full transition-all duration-1000 relative"
                                        style={{ width: `${maxTAT > 0 ? (item.res.averageTurnaroundTime / maxTAT) * 100 : 0}%` }}
                                    >
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
