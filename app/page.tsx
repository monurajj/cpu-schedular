'use client';

import React, { useState } from 'react';
import InputForm from '@/components/InputForm';
import PieChart from '@/components/PieChart';
import MetricsTable from '@/components/MetricsTable';
import ComparisonView from '@/components/ComparisonView';
import PlaybackControls from '@/components/PlaybackControls';
import ReadyQueue from '@/components/ReadyQueue';
import StatsCharts from '@/components/StatsCharts';
import MemoryBlock from '@/components/MemoryBlock';
import PCBView from '@/components/PCBView';
import {
  Process,
  SchedulerResult,
  AlgorithmType,
  ProcessState
} from '@/lib/types';
import {
  fcfsResponse,
  sjfResponse,
  srtfResponse,
  priorityNonPreemptiveResponse,
  priorityPreemptiveResponse,
  roundRobinResponse
} from '@/lib/algorithms';

type ViewMode = 'visualizer' | 'comparison';

export default function Home() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, priority: 1, color: '#3b82f6', bursts: [{ type: 'CPU', duration: 5 }], memoryRequired: 128 },
    { id: 'P2', arrivalTime: 1, priority: 2, color: '#22c55e', bursts: [{ type: 'CPU', duration: 3 }], memoryRequired: 256 },
    { id: 'P3', arrivalTime: 2, priority: 1, color: '#eab308', bursts: [{ type: 'CPU', duration: 8 }], memoryRequired: 64 },
  ]);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('FCFS');
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [schedulerResult, setSchedulerResult] = useState<SchedulerResult | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('visualizer');

  // Playback State
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleRunSimulation = () => {
    let result: SchedulerResult;

    switch (selectedAlgorithm) {
      case 'FCFS': result = fcfsResponse(processes); break;
      case 'SJF': result = sjfResponse(processes); break;
      case 'SRTF': result = srtfResponse(processes); break;
      case 'Priority-NP': result = priorityNonPreemptiveResponse(processes); break;
      case 'Priority-P': result = priorityPreemptiveResponse(processes); break;
      case 'RR': result = roundRobinResponse(processes, timeQuantum); break;
      default: result = fcfsResponse(processes);
    }

    setSchedulerResult(result);
    setPlaybackTime(0);
    setIsPlaying(true);
  };

  // Derived state for visualization based on playbackTime
  const visibleBlocks = schedulerResult
    ? schedulerResult.ganttChart.filter(b => b.startTime < playbackTime).map(b => ({
      ...b,
      endTime: Math.min(b.endTime, playbackTime)
    }))
    : [];

  const currentCpuBlock = schedulerResult?.ganttChart.find(b => b.startTime <= playbackTime && b.endTime > playbackTime && b.type === 'CPU');
  const currentCpuProcessId = currentCpuBlock ? currentCpuBlock.processId : null;

  // Find the actual process object running
  const runningProcess = schedulerResult?.processes.find(p => p.id === currentCpuProcessId) || null;

  // Active processes for memory map
  const liveProcessesForMemory = schedulerResult ? schedulerResult.processes.map(p => {
    const clone = { ...p };
    if (p.arrivalTime > playbackTime) clone.status = 'NEW';
    else if (p.completionTime <= playbackTime) clone.status = 'TERMINATED';
    else clone.status = 'READY';
    return clone;
  }) : [];

  const totalTime = schedulerResult && schedulerResult.ganttChart.length > 0
    ? schedulerResult.ganttChart[schedulerResult.ganttChart.length - 1].endTime
    : 0;

  return (
    <main className="min-h-screen bg-[#050505] p-4 text-gray-100 font-sans selection:bg-cyan-500/30">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-0 border-b border-gray-800 pb-6 flex justify-between items-end backdrop-blur-sm sticky top-0 z-50 bg-[#050505]/80">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 tracking-tight">
              CPU SCHEDULER
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">
              <span className="text-gray-300">System.v2</span> <span className="opacity-50"> {'// Interactive OS Kernel Simulation'} </span>
            </p>
          </div>

          <div className="flex gap-2">
            {['visualizer', 'comparison'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all border ${viewMode === mode
                  ? 'bg-white/10 border-white/40 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                  : 'border-white/10 text-gray-500 hover:border-gray-500'
                  }`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {/* MAIN DASHBOARD */}
        {viewMode === 'visualizer' ? (
          <div className="mt-6 flex flex-col gap-6">

            {/* TOP SECTION: 3 Columns (3 | 6 | 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* COL 1: CONFIGURATION (Span 3) */}
              <div className="lg:col-span-3">
                <div className="glass-panel p-4 rounded-xl shadow-lg h-full">
                  <h2 className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Configuration</h2>
                  <InputForm
                    processes={processes}
                    setProcesses={setProcesses}
                    selectedAlgorithm={selectedAlgorithm}
                    setSelectedAlgorithm={setSelectedAlgorithm}
                    timeQuantum={timeQuantum}
                    setTimeQuantum={setTimeQuantum}
                    onRun={handleRunSimulation}
                  />
                </div>
              </div>

              {/* COL 2: MAIN VISUALIZATION (Span 6) */}
              <div className="lg:col-span-6 space-y-6">
                {/* Gantt Chart (Timeline) */}
                <div className="glass-panel p-1 rounded-xl shadow-lg min-h-[180px] flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  </div>
                  <div className="p-4 relative z-10">
                    <h2 className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest text-right">CPU Timeline</h2>
                    {schedulerResult ? (
                      <GanttChart blocks={visibleBlocks} />
                    ) : (
                      <div className="text-center text-gray-600 font-mono text-xs py-10">
                        [SYSTEM HALTED] <br /> PRESS RUN TO INITIALIZE SEQUENCE
                      </div>
                    )}
                  </div>
                </div>

                {/* Ready Queue & Playback */}
                {schedulerResult && (
                  <div className="grid grid-cols-1 gap-6">
                    <div className="glass-panel p-4 rounded-xl shadow-lg">
                      <ReadyQueue
                        processes={processes}
                        currentTime={playbackTime}
                        cpuProcessId={currentCpuProcessId}
                        scheduledBlocks={schedulerResult.ganttChart}
                      />
                    </div>
                    <PlaybackControls
                      totalTime={totalTime}
                      currentTime={playbackTime}
                      setCurrentTime={setPlaybackTime}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                    />
                  </div>
                )}
              </div>

              {/* COL 3: SYSTEM INTERNALS (Span 3) - Stacked Memory & PCB */}
              <div className="lg:col-span-3 space-y-6">
                {/* RAM Block - Fixed Height */}
                <div className="h-64">
                  <MemoryBlock processes={liveProcessesForMemory} totalMemory={1024} />
                </div>

                {/* PCB Block - Fixed Height, Below RAM */}
                <div className="h-64">
                  <PCBView process={runningProcess as ProcessState | null} clock={playbackTime} />
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: Stats & Metrics (Half/Half) */}
            {schedulerResult && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stats Charts */}
                <div className="glass-panel p-4 rounded-xl h-96">
                  <StatsCharts results={schedulerResult} />
                </div>

                {/* Metrics Table */}
                <div className="glass-panel p-4 rounded-xl h-96 overflow-y-auto">
                  <MetricsTable results={schedulerResult} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <ComparisonView processes={processes} timeQuantum={timeQuantum} />
          </div>
        )}
      </div>
    </main>
  );
}
