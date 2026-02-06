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
      #1f2937 ${cpuUtilization}% 100%
    )`
    };

    const maxWait = Math.max(...processes.map(p => p.waitingTime));

    return (
        <div className="mb-0">
            <h2 className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest border-b border-gray-800 pb-2">Operational Stats</h2>

            <div className="grid grid-cols-1 gap-6">

                {/* CPU Utilization Pie */}
                <div className="flex flex-col items-center justify-center p-2">
                    <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.1)]" style={pieStyle}>
                        <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center flex-col">
                            <span className="text-xl font-bold text-blue-400 font-mono">{cpuUtilization}%</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Load</span>
                        </div>
                    </div>
                </div>

                {/* Process Waiting Time Bars */}
                <div>
                    <h3 className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider">Wait Times</h3>
                    <div className="space-y-2">
                        {processes.map(p => (
                            <div key={p.id} className="flex items-center text-xs">
                                <div className="w-8 font-mono text-gray-400">{p.id}</div>
                                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden mx-2 border border-gray-700">
                                    <div
                                        className="h-full bg-orange-500/80 rounded-full shadow-[0_0_5px_rgba(249,115,22,0.5)]"
                                        style={{ width: `${maxWait > 0 ? (p.waitingTime / maxWait) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <div className="w-10 text-right text-gray-500 font-mono">{p.waitingTime}ms</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
