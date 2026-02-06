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
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Algorithm Comparison</h2>

            {/* Table */}
            <div className="overflow-x-auto mb-8">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Algorithm</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Avg Wait Time</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Avg Turnaround</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Utilization</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Throughput</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((item) => (
                            <tr key={item.name} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{item.res.averageWaitingTime.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{item.res.averageTurnaroundTime.toFixed(2)}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{item.res.cpuUtilization}%</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{item.res.throughput}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Waiting Time Chart */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-bold text-center text-gray-700 mb-4">Average Waiting Time (Lower is Better)</h3>
                    <div className="space-y-3">
                        {results.map(item => (
                            <div key={item.name} className="flex items-center text-xs">
                                <div className="w-24 font-medium text-gray-600 truncate mr-2">{item.name}</div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{ width: `${maxWT > 0 ? (item.res.averageWaitingTime / maxWT) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <div className="w-12 text-right text-gray-700 ml-2">{item.res.averageWaitingTime.toFixed(1)}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Turnaround Time Chart */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-md font-bold text-center text-gray-700 mb-4">Average Turnaround Time (Lower is Better)</h3>
                    <div className="space-y-3">
                        {results.map(item => (
                            <div key={item.name} className="flex items-center text-xs">
                                <div className="w-24 font-medium text-gray-600 truncate mr-2">{item.name}</div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500"
                                        style={{ width: `${maxTAT > 0 ? (item.res.averageTurnaroundTime / maxTAT) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <div className="w-12 text-right text-gray-700 ml-2">{item.res.averageTurnaroundTime.toFixed(1)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
