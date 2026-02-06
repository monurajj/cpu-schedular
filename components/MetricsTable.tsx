import React from 'react';
import { SchedulerResult } from '@/lib/types';

interface MetricsTableProps {
    results: SchedulerResult;
}

export default function MetricsTable({ results }: MetricsTableProps) {
    const { processes, averageWaitingTime, averageTurnaroundTime, cpuUtilization, throughput } = results;

    if (processes.length === 0) return null;

    return (
        <div className="w-full">
            <h2 className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest pl-1">Final Metrics</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg text-center backdrop-blur-sm">
                    <div className="text-[10px] text-blue-400 font-mono uppercase tracking-wider mb-1">Avg. Waiting</div>
                    <div className="text-xl font-bold text-gray-200">{averageWaitingTime.toFixed(2)} ms</div>
                </div>
                <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-lg text-center backdrop-blur-sm">
                    <div className="text-[10px] text-green-400 font-mono uppercase tracking-wider mb-1">Avg. Turnaround</div>
                    <div className="text-xl font-bold text-gray-200">{averageTurnaroundTime.toFixed(2)} ms</div>
                </div>
                <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-lg text-center backdrop-blur-sm">
                    <div className="text-[10px] text-purple-400 font-mono uppercase tracking-wider mb-1">Utilization</div>
                    <div className="text-xl font-bold text-gray-200">{cpuUtilization}%</div>
                </div>
                <div className="bg-orange-900/10 border border-orange-500/20 p-4 rounded-lg text-center backdrop-blur-sm">
                    <div className="text-[10px] text-orange-400 font-mono uppercase tracking-wider mb-1">Throughput</div>
                    <div className="text-xl font-bold text-gray-200">{throughput} p/ms</div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="overflow-hidden border border-gray-700 rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Process ID</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Arrival</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">CPU Time</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Completion</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Turnaround</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Waiting</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Response</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900/50 divide-y divide-gray-700/50">
                        {processes.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-800/50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-300 font-mono">{p.id}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 font-mono">{p.arrivalTime}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 font-mono">{p.totalCpuTime}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-200 font-bold font-mono">{p.completionTime}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-300 font-mono">{p.turnaroundTime}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-300 font-mono">{p.waitingTime}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-300 font-mono">{p.responseTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-xs text-gray-500 space-y-1">
                <p>• <strong>Turnaround Time</strong> = Completion Time - Arrival Time</p>
                <p>• <strong>Waiting Time</strong> = Turnaround Time - Burst Time</p>
                <p>• <strong>Response Time</strong> = First CPU Time - Arrival Time</p>
            </div>
        </div>
    );
}
