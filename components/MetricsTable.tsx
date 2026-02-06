import React from 'react';
import { SchedulerResult } from '@/lib/types';

interface MetricsTableProps {
    results: SchedulerResult;
}

export default function MetricsTable({ results }: MetricsTableProps) {
    const { processes, averageWaitingTime, averageTurnaroundTime, cpuUtilization, throughput } = results;

    if (processes.length === 0) return null;

    return (
        <div className="w-full h-full flex flex-col">
            <h2 className="text-xs font-mono text-gray-400 mb-4 uppercase tracking-widest border-b border-white/5 pb-2">Final Metrics</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-2 mb-4 shrink-0">
                <div className="bg-blue-500/5 border border-blue-500/20 p-2 rounded text-center backdrop-blur-sm">
                    <div className="text-[8px] text-blue-300 font-mono uppercase tracking-wider mb-0.5">Avg Wait</div>
                    <div className="text-sm font-bold text-white">{averageWaitingTime.toFixed(2)} ms</div>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-2 rounded text-center backdrop-blur-sm">
                    <div className="text-[8px] text-emerald-300 font-mono uppercase tracking-wider mb-0.5">Avg TAT</div>
                    <div className="text-sm font-bold text-white">{averageTurnaroundTime.toFixed(2)} ms</div>
                </div>
                <div className="bg-purple-500/5 border border-purple-500/20 p-2 rounded text-center backdrop-blur-sm">
                    <div className="text-[8px] text-purple-300 font-mono uppercase tracking-wider mb-0.5">Util</div>
                    <div className="text-sm font-bold text-white">{cpuUtilization}%</div>
                </div>
                <div className="bg-orange-500/5 border border-orange-500/20 p-2 rounded text-center backdrop-blur-sm">
                    <div className="text-[8px] text-orange-300 font-mono uppercase tracking-wider mb-0.5">T-put</div>
                    <div className="text-sm font-bold text-white">{throughput}</div>
                </div>
            </div>

            {/* Scrollable Table Container */}
            <div className="overflow-auto flex-1 border border-white/5 rounded relative scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                <table className="min-w-full divide-y divide-white/10 text-left">
                    <thead className="bg-white/5 sticky top-0 backdrop-blur-md z-10">
                        <tr>
                            {['PID', 'Arrival', 'CPU', 'Compl', 'TAT', 'Wait', 'Resp'].map(h => (
                                <th key={h} className="px-3 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono select-none">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-transparent">
                        {processes.map((p) => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-3 py-1.5 whitespace-nowrap text-[10px] font-bold text-blue-300 font-mono">{p.id}</td>
                                <td className="px-3 py-1.5 whitespace-nowrap text-[10px] text-gray-400 font-mono">{p.arrivalTime}</td>
                                <td className="px-3 py-1.5 whitespace-nowrap text-[10px] text-gray-400 font-mono">{p.totalCpuTime}</td>
                                <td className="px-3 py-1.5 whitespace-nowrap text-[10px] text-gray-300 font-mono group-hover:text-white transition-colors">{p.completionTime}</td>
                                <td className="px-3 py-1.5 whitespace-nowrap text-[10px] text-emerald-400/80 font-mono">{p.turnaroundTime}</td>
                                <td className="px-3 py-1.5 whitespace-nowrap text-[10px] text-orange-400/80 font-mono">{p.waitingTime}</td>
                                <td className="px-3 py-1.5 whitespace-nowrap text-[10px] text-purple-400/80 font-mono">{p.responseTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-2 flex justify-between text-[9px] text-gray-600 font-mono px-1">
                <span>*TAT: Turnaround Time</span>
                <span>*Compl: Completion</span>
            </div>
        </div>
    );
}
