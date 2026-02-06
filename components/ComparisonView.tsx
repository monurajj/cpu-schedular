import React from 'react';
import { Process, SchedulerResult } from '@/lib/types';
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
        return <div className="text-gray-500 text-center italic mt-10">Add processes to see comparison.</div>;
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

    // Find max values for chart scaling
    const maxWT = Math.max(...results.map(r => r.res.averageWaitingTime));
    const maxTAT = Math.max(...results.map(r => r.res.averageTurnaroundTime));

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 neon-text-blue">Algorithm Comparison</h2>

            {/* Table */}
            <div className="overflow-hidden mb-8 border border-gray-700/50 rounded-lg">
                <table className="min-w-full divide-y divide-gray-700/50">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Algorithm</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Avg Wait Time</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Avg Turnaround</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Utilization</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Throughput</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900/40 divide-y divide-gray-700/50">
                        {results.map((item) => (
                            <tr key={item.name} className="hover:bg-blue-500/10 transition-colors">
                                <td className="px-4 py-3 text-xs font-medium text-gray-300 font-mono">{item.name}</td>
                                <td className="px-4 py-3 text-xs text-gray-400 font-mono">{item.res.averageWaitingTime.toFixed(2)}</td>
                                <td className="px-4 py-3 text-xs text-gray-400 font-mono">{item.res.averageTurnaroundTime.toFixed(2)}</td>
                                <td className="px-4 py-3 text-xs text-gray-400 font-mono">{item.res.cpuUtilization}%</td>
                                <td className="px-4 py-3 text-xs text-gray-400 font-mono">{item.res.throughput}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Waiting Time Chart */}
                <div className="glass-panel p-4 rounded-xl">
                    <h3 className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-wider text-center">Avg Waiting Time (Lower is Better)</h3>
                    <div className="space-y-3">
                        {results.map(item => (
                            <div key={item.name} className="flex items-center text-xs">
                                <div className="w-24 font-mono text-gray-400 truncate mr-2">{item.name}</div>
                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                    <div
                                        className="h-full bg-blue-500/80 shadow-[0_0_5px_rgba(59,130,246,0.5)]"
                                        style={{ width: `${maxWT > 0 ? (item.res.averageWaitingTime / maxWT) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <div className="w-12 text-right text-gray-400 ml-2 font-mono">{item.res.averageWaitingTime.toFixed(1)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Turnaround Time Chart */}
                <div className="glass-panel p-4 rounded-xl">
                    <h3 className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-wider text-center">Avg Turnaround Time (Lower is Better)</h3>
                    <div className="space-y-3">
                        {results.map(item => (
                            <div key={item.name} className="flex items-center text-xs">
                                <div className="w-24 font-mono text-gray-400 truncate mr-2">{item.name}</div>
                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                    <div
                                        className="h-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]"
                                        style={{ width: `${maxTAT > 0 ? (item.res.averageTurnaroundTime / maxTAT) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <div className="w-12 text-right text-gray-400 ml-2 font-mono">{item.res.averageTurnaroundTime.toFixed(1)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
