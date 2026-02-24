"use client";

import React, { useState } from "react";
import InputForm from "@/components/InputForm";
import MetricsTable from "@/components/MetricsTable";
import GanttChart from "@/components/GanttChart";
import ComparisonView from "@/components/ComparisonView";
import PlaybackControls from "@/components/PlaybackControls";
import ReadyQueue from "@/components/ReadyQueue";
import StatsCharts from "@/components/StatsCharts";
import MemoryBlock from "@/components/MemoryBlock";
import PCBView from "@/components/PCBView";
import ModeToggle from "@/components/ModeToggle";
import StepControls from "@/components/StepControls";
import AlgorithmGuide from "@/components/AlgorithmGuide";
import {
  Process,
  SchedulerResult,
  AlgorithmType,
  ProcessState,
} from "@/lib/types";
import {
  fcfsResponse,
  sjfResponse,
  srtfResponse,
  priorityNonPreemptiveResponse,
  priorityPreemptiveResponse,
  roundRobinResponse,
} from "@/lib/algorithms";

type ViewMode = "visualizer" | "comparison";
type TeachingMode = "lecture" | "sandbox";

export default function CPUSchedulingPage() {
  const [processes, setProcesses] = useState<Process[]>([
    {
      id: "P1",
      arrivalTime: 0,
      priority: 1,
      color: "#3b82f6",
      bursts: [{ type: "CPU", duration: 5 }],
      memoryRequired: 128,
    },
    {
      id: "P2",
      arrivalTime: 1,
      priority: 2,
      color: "#22c55e",
      bursts: [{ type: "CPU", duration: 3 }],
      memoryRequired: 256,
    },
    {
      id: "P3",
      arrivalTime: 2,
      priority: 1,
      color: "#eab308",
      bursts: [{ type: "CPU", duration: 8 }],
      memoryRequired: 64,
    },
  ]);

  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmType>("FCFS");
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [schedulerResult, setSchedulerResult] =
    useState<SchedulerResult | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("visualizer");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>("lecture");

  // Playback State
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Validation & Error State
  const [runError, setRunError] = useState<string | null>(null);

  const validateProcesses = (): string | null => {
    if (processes.length === 0) {
      return "Add at least one process. Use the form above to add processes with ID, Arrival Time, and Burst Time.";
    }
    for (let i = 0; i < processes.length; i++) {
      const p = processes[i];
      if (!p.id?.trim()) {
        return `Process ${i + 1}: ID cannot be empty.`;
      }
      if (p.arrivalTime < 0) {
        return `Process ${p.id}: Arrival Time must be ≥ 0.`;
      }
      if (!p.bursts?.length) {
        return `Process ${p.id}: Must have at least one burst.`;
      }
      const invalidBurst = p.bursts.find((b) => b.duration <= 0);
      if (invalidBurst) {
        return `Process ${p.id}: Burst time must be > 0.`;
      }
    }
    if (
      selectedAlgorithm === "RR" &&
      (timeQuantum < 1 || !Number.isFinite(timeQuantum))
    ) {
      return "Round Robin requires Time Quantum ≥ 1.";
    }
    return null;
  };

  const handleRunSimulation = () => {
    setRunError(null);
    const validationError = validateProcesses();
    if (validationError) {
      setRunError(validationError);
      return;
    }
    try {
      let result: SchedulerResult;
      switch (selectedAlgorithm) {
        case "FCFS":
          result = fcfsResponse(processes);
          break;
        case "SJF":
          result = sjfResponse(processes);
          break;
        case "SRTF":
          result = srtfResponse(processes);
          break;
        case "Priority-NP":
          result = priorityNonPreemptiveResponse(processes);
          break;
        case "Priority-P":
          result = priorityPreemptiveResponse(processes);
          break;
        case "RR":
          result = roundRobinResponse(processes, timeQuantum);
          break;
        default:
          result = fcfsResponse(processes);
      }
      setSchedulerResult(result);
      setPlaybackTime(0);
      setIsPlaying(true);
    } catch (err) {
      setRunError(
        err instanceof Error
          ? err.message
          : "Simulation failed. Check process data.",
      );
    }
  };

  // Step controls for Lecture mode
  const totalTime = schedulerResult?.ganttChart.length
    ? schedulerResult.ganttChart[schedulerResult.ganttChart.length - 1].endTime
    : 0;

  const handleStepBack = () => {
    setPlaybackTime((t) => Math.max(0, t - 1));
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    setPlaybackTime((t) => Math.min(totalTime, t + 1));
    setIsPlaying(false);
  };

  const handleReset = () => {
    setPlaybackTime(0);
    setIsPlaying(false);
  };

  // Derived state for visualization based on playbackTime (fills Gantt as time slider moves)
  const visibleBlocks = schedulerResult
    ? schedulerResult.ganttChart
        .filter((b) => b.startTime < playbackTime)
        .map((b) => ({
          ...b,
          endTime: Math.min(b.endTime, playbackTime),
        }))
        .filter((b) => b.endTime > b.startTime)
    : [];

  const currentCpuBlock = schedulerResult?.ganttChart.find(
    (b) =>
      b.startTime <= playbackTime &&
      b.endTime > playbackTime &&
      b.type === "CPU",
  );
  const currentCpuProcessId = currentCpuBlock
    ? currentCpuBlock.processId
    : null;

  const runningProcess =
    schedulerResult?.processes.find((p) => p.id === currentCpuProcessId) ||
    null;

  const liveProcessesForMemory = schedulerResult
    ? schedulerResult.processes.map((p) => {
        const clone = { ...p };
        if (p.arrivalTime > playbackTime) clone.status = "NEW";
        else if (p.completionTime <= playbackTime) clone.status = "TERMINATED";
        else clone.status = "READY";
        return clone;
      })
    : [];

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-6 border-b border-gray-800 pb-6 flex flex-wrap justify-between items-end gap-4 backdrop-blur-sm sticky top-0 z-50 bg-[#050505]/80 -mx-4 px-4 py-2">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 tracking-tight">
              CPU Scheduling
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">
              <span className="text-gray-300">Gantt Chart Visualizer</span>{" "}
              <span className="opacity-50">
                // FCFS, SJF, SRTF, RR, Priority
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <ModeToggle mode={teachingMode} onModeChange={setTeachingMode} />
            {schedulerResult && teachingMode === "lecture" && (
              <StepControls
                onStepBack={handleStepBack}
                onStepForward={handleStepForward}
                onReset={handleReset}
                canStepBack={playbackTime > 0}
                canStepForward={playbackTime < totalTime}
                currentStep={playbackTime}
                totalSteps={totalTime}
              />
            )}
            <div className="flex gap-2">
              {(["visualizer", "comparison"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all border ${
                    viewMode === mode
                      ? "bg-white/10 border-white/40 text-white"
                      : "border-white/10 text-gray-500 hover:border-gray-500"
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>

        {viewMode === "visualizer" ? (
          <div className="mt-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-3">
                <div className="glass-panel p-4 rounded-xl shadow-lg h-full">
                  <h2 className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest border-b border-white/10 pb-2">
                    Configuration
                  </h2>
                  {runError && (
                    <div className="mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-sm">
                      <p className="font-semibold mb-1">
                        Cannot run simulation
                      </p>
                      <p className="text-amber-200/90">{runError}</p>
                    </div>
                  )}
                  <InputForm
                    processes={processes}
                    setProcesses={setProcesses}
                    selectedAlgorithm={selectedAlgorithm}
                    setSelectedAlgorithm={setSelectedAlgorithm}
                    timeQuantum={timeQuantum}
                    setTimeQuantum={setTimeQuantum}
                    onRun={handleRunSimulation}
                  />
                  <div className="mt-4">
                    <AlgorithmGuide algorithm={selectedAlgorithm} />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-6">
                <div className="glass-panel p-1 rounded-xl shadow-lg min-h-[180px] flex flex-col justify-center relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage:
                        "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="p-4 relative z-10">
                    <h2 className="text-xs font-mono text-gray-500 mb-2 uppercase tracking-widest text-right">
                      CPU Timeline (Gantt Chart)
                    </h2>
                    {schedulerResult ? (
                      <GanttChart blocks={visibleBlocks} />
                    ) : (
                      <div className="text-center text-gray-600 font-mono text-xs py-10">
                        [SYSTEM HALTED] <br /> PRESS RUN TO INITIALIZE SEQUENCE
                      </div>
                    )}
                  </div>
                </div>

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
                    {teachingMode === "sandbox" && (
                      <PlaybackControls
                        totalTime={totalTime}
                        currentTime={playbackTime}
                        setCurrentTime={setPlaybackTime}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="lg:col-span-3 space-y-6">
                <div className="h-64">
                  <MemoryBlock
                    processes={liveProcessesForMemory}
                    totalMemory={1024}
                  />
                </div>
                <div className="h-64">
                  <PCBView
                    process={runningProcess as ProcessState | null}
                    clock={playbackTime}
                  />
                </div>
              </div>
            </div>

            {schedulerResult && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-4 rounded-xl h-96">
                  <StatsCharts results={schedulerResult} />
                </div>
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
    </div>
  );
}
