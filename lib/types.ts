export type AlgorithmType = 
  | 'FCFS' 
  | 'SJF' 
  | 'SRTF' 
  | 'Priority-NP' 
  | 'Priority-P' 
  | 'RR';

export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number; // Lower number usually means higher priority, we'll document this choice
  color?: string; // For visualization
}

// Extended process interface for internal calculation (tracking remaining time etc)
export interface ProcessState extends Process {
  remainingTime: number;
  startTime: number | null; // First time it got CPU
  completionTime: number;
  waitingTime: number;
  turnaroundTime: number;
  responseTime: number;
  isCompleted: boolean;
}

export interface GanttChartBlock {
  processId: string; // 'IDLE' if cpu is idle
  startTime: number;
  endTime: number;
}

export interface SchedulerResult {
  processes: ProcessState[]; // with calculated metrics
  ganttChart: GanttChartBlock[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  cpuUtilization: number;
  throughput: number; // processes per unit time (or total processes / total time)
}
