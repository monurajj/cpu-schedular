import React from 'react';
import { SchedulerResult } from '@/lib/types';

interface MetricsTableProps {
    results: SchedulerResult;
}

export default function MetricsTable({ results }: MetricsTableProps) {
    const { processes, averageWaitingTime, averageTurnaroundTime, cpuUtilization, throughput } = results;

    if (processes.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Results & Metrics</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-blue-600 font-semibold uppercase">Avg. Waiting Time</div>
                    <div className="text-2xl font-bold text-gray-800">{averageWaitingTime.toFixed(2)} ms</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-green-600 font-semibold uppercase">Avg. Turnaround Time</div>
                    <div className="text-2xl font-bold text-gray-800">{averageTurnaroundTime.toFixed(2)} ms</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-purple-600 font-semibold uppercase">CPU Utilization</div>
                    <div className="text-2xl font-bold text-gray-800">{cpuUtilization}%</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-orange-600 font-semibold uppercase">Throughput</div>
                    <div className="text-2xl font-bold text-gray-800">{throughput} p/ms</div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Process ID</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Arrival Time</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Burst Time</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Completion Time</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Turnaround Time</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Waiting Time</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Response Time</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {processes.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{p.arrivalTime}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{p.burstTime}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-bold">{p.completionTime}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.turnaroundTime}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.waitingTime}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{p.responseTime}</td>
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
