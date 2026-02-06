
export type AlgorithmType =
  | 'FCFS'
  | 'SJF'
  | 'SRTF'
  | 'Priority-NP'
  | 'Priority-P'
  | 'RR';

export type BurstType = 'CPU' | 'IO';

export interface Burst {
  type: BurstType;
  duration: number;
}

export interface Process {
  id: string;
  arrivalTime: number;
  priority: number; // Lower number usually means higher priority
  color?: string; // For visualization
  bursts: Burst[];
  memoryRequired?: number; // in MB
}

export type ProcessStatus = 'READY' | 'RUNNING' | 'BLOCKED' | 'TERMINATED' | 'NEW';

// Extended process interface for internal calculation
export interface ProcessState extends Process {
  status: ProcessStatus;

  // Tracking execution
  currentBurstIndex: number;
  remainingTimeCurrentBurst: number;

  // Metrics
  startTime: number | null; // First time it touched CPU
  completionTime: number;
  waitingTime: number; // Time spent in Ready Queue
  turnaroundTime: number; // completion - arrival
  responseTime: number; // time until first CPU response

  // Utilization stats
  totalCpuTime: number;
  totalIoTime: number;
}

export interface GanttChartBlock {
  processId: string; // 'IDLE' or process ID
  type: BurstType | 'IDLE';
  startTime: number;
  endTime: number;
}

export interface SchedulerResult {
  processes: ProcessState[];
  ganttChart: GanttChartBlock[];
  cpuUtilization: number;
  throughput: number;
  averageWaitingTime: number;
  averageTurnaroundTime: number;
}
