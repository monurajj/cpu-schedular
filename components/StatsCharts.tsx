import React from 'react';
import { SchedulerResult } from '@/lib/types';

interface StatsChartsProps {
    results: SchedulerResult;
}

export default function StatsCharts({ results }: StatsChartsProps) {
    const { processes, cpuUtilization } = results;

    // Calculate specific idle percentage
    const idle = Math.max(0, 100 - cpuUtilization);

    // For Pie Chart (CSS Conic Gradient)
    const pieStyle = {
        background: `conic-gradient(
      #3b82f6 0% ${cpuUtilization}%, 
      #e5e7eb ${cpuUtilization}% 100%
    )`
    };

    const maxWait = Math.max(...processes.map(p => p.waitingTime));

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Operational Stats</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* CPU Utilization Pie */}
                <div className="flex flex-col items-center justify-center">
                    <h3 className="text-sm font-bold text-gray-600 mb-4 uppercase">CPU Usage</h3>
                    <div className="relative w-40 h-40 rounded-full flex items-center justify-center" style={pieStyle}>
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center flex-col">
                            <span className="text-2xl font-bold text-blue-600">{cpuUtilization}%</span>
                            <span className="text-xs text-gray-400">Busy</span>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6 text-sm">
                        <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>Busy</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>Idle</div>
                    </div>
                </div>

                {/* Process Waiting Time Bars */}
                <div>
                    <h3 className="text-sm font-bold text-gray-600 mb-4 uppercase">Process Waiting Times</h3>
                    <div className="space-y-3">
                        {processes.map(p => (
                            <div key={p.id} className="flex items-center text-xs">
                                <div className="w-10 font-bold text-gray-700">{p.id}</div>
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden mx-2">
                                    <div
                                        className="h-full bg-orange-400 rounded-full"
                                        style={{ width: `${maxWait > 0 ? (p.waitingTime / maxWait) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <div className="w-10 text-right text-gray-500">{p.waitingTime}ms</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
