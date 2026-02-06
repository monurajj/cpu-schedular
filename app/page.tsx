'use client';

import React, { useState } from 'react';
import InputForm from '@/components/InputForm';
import GanttChart from '@/components/GanttChart';
import MetricsTable from '@/components/MetricsTable';
import ComparisonView from '@/components/ComparisonView';
import PlaybackControls from '@/components/PlaybackControls';
import ReadyQueue from '@/components/ReadyQueue';
import StatsCharts from '@/components/StatsCharts';
import {
  Process,
  SchedulerResult,
  AlgorithmType
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
    { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 1, color: '#3b82f6' },
    { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 2, color: '#22c55e' },
    { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 1, color: '#eab308' },
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

    // Sort input processes by Arrival Time for consistent processing
    // const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    // Actually the algorithms sort them internally, so passing as is is fine.

    switch (selectedAlgorithm) {
      case 'FCFS':
        result = fcfsResponse(processes);
        break;
      case 'SJF':
        result = sjfResponse(processes);
        break;
      case 'SRTF':
        result = srtfResponse(processes);
        break;
      case 'Priority-NP':
        result = priorityNonPreemptiveResponse(processes);
        break;
      case 'Priority-P':
        result = priorityPreemptiveResponse(processes);
        break;
      case 'RR':
        result = roundRobinResponse(processes, timeQuantum);
        break;
      default:
        result = fcfsResponse(processes);
    }

    setSchedulerResult(result);
    // Reset playback on new run
    setPlaybackTime(0);
    setIsPlaying(true);
  };

  // Derived state for visualization based on playbackTime
  const visibleBlocks = schedulerResult
    ? schedulerResult.ganttChart.filter(b => b.startTime < playbackTime).map(b => ({
      ...b,
      endTime: Math.min(b.endTime, playbackTime) // Clip end time to current playback
    }))
    : [];

  // Determine current CPU process
  const currentCpuBlock = schedulerResult?.ganttChart.find(b => b.startTime <= playbackTime && b.endTime > playbackTime);
  const currentCpuProcessId = currentCpuBlock ? currentCpuBlock.processId : null;

  const totalTime = schedulerResult ? schedulerResult.ganttChart[schedulerResult.ganttChart.length - 1].endTime : 0;

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2">
            CPU Scheduling Visualizer
          </h1>
          <p className="text-gray-600">
            Interactive demonstration of Operating System scheduling algorithms.
          </p>
        </header>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setViewMode('visualizer')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'visualizer' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Visualizer
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'comparison' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Comparison
            </button>
          </div>
        </div>

        <InputForm
          processes={processes}
          setProcesses={setProcesses}
          selectedAlgorithm={selectedAlgorithm}
          setSelectedAlgorithm={setSelectedAlgorithm}
          timeQuantum={timeQuantum}
          setTimeQuantum={setTimeQuantum}
          onRun={handleRunSimulation}
        />

        {viewMode === 'visualizer' && (
          <>
            {schedulerResult && (
              <div className="space-y-8 animate-in fade-in zoom-in duration-300">

                {/* Playback Controls */}
                <PlaybackControls
                  totalTime={totalTime}
                  currentTime={playbackTime}
                  setCurrentTime={setPlaybackTime}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                />

                {/* Ready Queue Vis */}
                <ReadyQueue
                  processes={processes}
                  currentTime={playbackTime}
                  cpuProcessId={currentCpuProcessId}
                  scheduledBlocks={schedulerResult.ganttChart}
                />

                {/* Gantt Chart (Animated Clips) */}
                <GanttChart blocks={visibleBlocks} />

                {/* Stats Charts */}
                <StatsCharts results={schedulerResult} />

                {/* Detailed Metrics Table */}
                <MetricsTable results={schedulerResult} />
              </div>
            )}

            {/* Educational Info Section */}
            <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-gray-800 mb-2">About {selectedAlgorithm}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedAlgorithm === 'FCFS' && "First-Come, First-Served (FCFS) is the simplest scheduling algorithm. Processes are executed in the order they arrive. It is non-preemptive."}
                {selectedAlgorithm === 'SJF' && "Shortest Job First (SJF) selects the waiting process with the smallest execution time. Non-preemptive."}
                {selectedAlgorithm === 'SRTF' && "Shortest Remaining Time First (SRTF) is the preemptive version of SJF."}
                {selectedAlgorithm === 'Priority-NP' && "Priority Scheduling (Non-Preemptive) selects the process with the highest priority."}
                {selectedAlgorithm === 'Priority-P' && "Priority Scheduling (Preemptive) allows higher priority processes to interpret running ones."}
                {selectedAlgorithm === 'RR' && `Round Robin (RR) gives each process a time slice (Quantum = ${timeQuantum}).`}
              </p>
            </div>
          </>
        )}

        {viewMode === 'comparison' && (
          <ComparisonView processes={processes} timeQuantum={timeQuantum} />
        )}

      </div>
    </main>
  );
}
