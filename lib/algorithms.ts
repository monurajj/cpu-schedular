import { Process, ProcessState, GanttChartBlock, SchedulerResult, Burst } from './types';

// --- Helper: Deep Copy & Initialize ---
const initProcessStates = (inputProcesses: Process[]): ProcessState[] => {
    return inputProcesses.map(p => ({
        ...p,
        status: 'NEW',
        currentBurstIndex: 0,
        remainingTimeCurrentBurst: p.bursts.length > 0 ? p.bursts[0].duration : 0,

        startTime: null,
        completionTime: 0,
        waitingTime: 0,
        turnaroundTime: 0,
        responseTime: -1, // -1 indicates not yet responded

        totalCpuTime: 0,
        totalIoTime: 0
    }));
};

/**
 * GENERIC SCHEDULER SIMULATION
 * 
 * Simulates a clock tick by tick (or event based).
 * For visualization granularity, we'll do integer time steps (ticks).
 * 
 * @param inputProcesses List of processes
 * @param pickProcessStragegy callback to select the next process from Ready Queue
 * @param isPreemptive boolean flag
 * @param quantum optional time quantum for RR
 */

type PickProcessStrategy = (readyQueue: ProcessState[], runningProcess: ProcessState | null, currentTime: number) => ProcessState | null;

const runSimulation = (
    inputProcesses: Process[],
    strategy: PickProcessStrategy,
    isPreemptive: boolean,
    quantum: number = Infinity
): SchedulerResult => {
    const processes = initProcessStates(inputProcesses);

    // Global Time
    let currentTime = 0;

    // Queues
    const readyQueue: ProcessState[] = [];
    const blockedQueue: ProcessState[] = []; // Processes in I/O

    // Current Execution
    let runningProcess: ProcessState | null = null;
    let runningQuantum = 0; // for RR

    // Result Tracking
    const ganttChart: GanttChartBlock[] = [];
    let completedCount = 0;
    const n = processes.length;

    // Simulation Loop (Safety break at 10000 ticks to prevent infinite loops in dev)
    const MAX_TICKS = 10000;

    while (completedCount < n && currentTime < MAX_TICKS) {

        // 1. ARRIVALS: Move NEW -> READY
        // We find processes that "arrive" exactly now or before now but haven't been admitted
        processes.forEach(p => {
            if (p.status === 'NEW' && p.arrivalTime <= currentTime) {
                p.status = 'READY';
                readyQueue.push(p);
            }
        });

        // 2. IO UPDATES: Check Blocked Processes
        // If a blocked process finishes IO, move to READY
        // For simulation, we decrement I/O at the end of tick? 
        // Or we treat I/O simply: they are in IO state for X ticks.
        // We iterate backwards to safely remove
        for (let i = blockedQueue.length - 1; i >= 0; i--) {
            const p = blockedQueue[i];

            // This is "doing I/O" for this tick (simplification: simultaneous I/O allowed)
            // Note: If we want to record I/O in Gantt, we might need a separate structure.
            p.totalIoTime++;
            p.remainingTimeCurrentBurst--;

            if (p.remainingTimeCurrentBurst <= 0) {
                // Burst finished
                p.currentBurstIndex++;
                if (p.currentBurstIndex < p.bursts.length) {
                    // Next burst exists (It must be CPU, as we alternate CPU-IO-CPU)
                    p.remainingTimeCurrentBurst = p.bursts[p.currentBurstIndex].duration;
                    p.status = 'READY';
                    // Remove from blocked, add to ready
                    blockedQueue.splice(i, 1);
                    readyQueue.push(p);
                } else {
                    // This shouldn't happen usually for IO burst ending unless process ends on IO?
                    // If process ends on IO, it terminates.
                    p.status = 'TERMINATED';
                    p.completionTime = currentTime;
                    blockedQueue.splice(i, 1);
                    completedCount++;
                }
            }
        }

        // 3. SCHEDULING DECISION

        // If we have a running process
        if (runningProcess) {
            runningProcess.totalCpuTime++;
            runningProcess.remainingTimeCurrentBurst--;
            runningQuantum++;

            // Check if Finished Burst
            if (runningProcess.remainingTimeCurrentBurst <= 0) {
                // Burst Complete
                runningProcess.currentBurstIndex++;

                if (runningProcess.currentBurstIndex >= runningProcess.bursts.length) {
                    // Process Complete
                    runningProcess.status = 'TERMINATED';
                    runningProcess.completionTime = currentTime; // Or currentTime + 1? Ticks are discrete. 
                    // Let's say it finishes AT the transition to next tick.
                    runningProcess.completionTime = currentTime + 1;
                    completedCount++;
                    runningProcess = null;
                } else {
                    // Move to I/O
                    runningProcess.status = 'BLOCKED';
                    runningProcess.remainingTimeCurrentBurst = runningProcess.bursts[runningProcess.currentBurstIndex].duration;
                    blockedQueue.push(runningProcess);
                    runningProcess = null;
                }
            } else if (isPreemptive) {
                // Check Preemption or Quantum
                if (quantum < Infinity && runningQuantum >= quantum) {
                    // RR Time Slice Expiry
                    runningProcess.status = 'READY';
                    readyQueue.push(runningProcess);
                    runningProcess = null;
                } else {
                    // Check specific preemptive logic (SRTF, Priority-P) via strategy
                    // We ask strategy: "Is there someone better?"
                    // Wait, strategy usually picks FROM queue. 
                    // We need to re-add running to queue conceptually to compare?

                    // Optimization: Only check if readyQueue is not empty
                    if (readyQueue.length > 0) {
                        const next = strategy(readyQueue, runningProcess, currentTime);
                        if (next && next.id !== runningProcess.id) {
                            // Context Switch
                            runningProcess.status = 'READY';
                            readyQueue.push(runningProcess);
                            runningProcess = next;
                            runningQuantum = 0;

                            // Remove next from queue (strategy should handle just returning, we assume we must find and remove)
                            // Actually strategy returns the object. We need to manage the queue.
                            // Let's assume strategy JUST selects.
                            // We need to find 'next' in readyQueue and splice it.
                            const idx = readyQueue.findIndex(p => p.id === next.id);
                            if (idx !== -1) readyQueue.splice(idx, 1);
                        }
                    }
                }
            }
        }

        // 4. PICK NEXT IF IDLE
        if (!runningProcess && readyQueue.length > 0) {
            const next = strategy(readyQueue, null, currentTime);
            if (next) {
                runningProcess = next;

                // Remove from readyQueue
                const idx = readyQueue.findIndex(p => p.id === next.id);
                if (idx !== -1) readyQueue.splice(idx, 1);

                runningProcess.status = 'RUNNING';
                runningQuantum = 0;

                // Response Time Logic
                if (runningProcess.startTime === null) {
                    runningProcess.startTime = currentTime;
                    runningProcess.responseTime = currentTime - runningProcess.arrivalTime;
                }
            }
        }

        // 5. UPDATE WAITING TIME (for everyone in readyQueue)
        readyQueue.forEach(p => p.waitingTime++);

        // 6. RECORD GANTT
        if (runningProcess) {
            // Check if we can extend last block
            const lastBlock = ganttChart.length > 0 ? ganttChart[ganttChart.length - 1] : null;
            if (lastBlock && lastBlock.processId === runningProcess.id && lastBlock.type === 'CPU') {
                lastBlock.endTime = currentTime + 1;
            } else {
                ganttChart.push({
                    processId: runningProcess.id,
                    type: 'CPU',
                    startTime: currentTime,
                    endTime: currentTime + 1
                });
            }
        } else {
            // IDLE RECORDING
            // Only record idle if no CPU activity (and we usually want to show it)
            // Or if there are processes still in system (blocked)
            if (completedCount < n) {
                const lastBlock = ganttChart.length > 0 ? ganttChart[ganttChart.length - 1] : null;
                if (lastBlock && lastBlock.processId === 'IDLE') {
                    lastBlock.endTime = currentTime + 1;
                } else {
                    ganttChart.push({
                        processId: 'IDLE',
                        type: 'IDLE',
                        startTime: currentTime,
                        endTime: currentTime + 1
                    });
                }
            }
        }

        currentTime++;
    }

    // Final Calc
    // TAT = Completion - Arrival
    processes.forEach(p => {
        if (p.completionTime > 0) {
            p.turnaroundTime = p.completionTime - p.arrivalTime;
        }
    });

    // Helper metrics
    const totalWT = processes.reduce((acc, p) => acc + p.waitingTime, 0);
    const totalTAT = processes.reduce((acc, p) => acc + p.turnaroundTime, 0);
    const totalCPU = processes.reduce((acc, p) => acc + p.totalCpuTime, 0);

    // CPU Util = Total CPU Time / Total Schedule Time
    const util = currentTime > 0 ? (totalCPU / currentTime) * 100 : 0;

    return {
        processes,
        ganttChart,
        averageWaitingTime: processes.length > 0 ? totalWT / processes.length : 0,
        averageTurnaroundTime: processes.length > 0 ? totalTAT / processes.length : 0,
        cpuUtilization: parseFloat(util.toFixed(2)),
        throughput: processes.length > 0 ? parseFloat((processes.length / currentTime).toFixed(4)) : 0
    };
};

// --- STRATEGIES ---

const fcfsStrategy: PickProcessStrategy = (queue, running) => {
    // Just pick first (queue is usually appended to end, so FIFO)
    // We assume queue is maintained in arrival order for FCFS generally, 
    // but if we push back to queue, strictly it should be "queue[0]"
    return queue.length > 0 ? queue[0] : null;
};

const sjfStrategy: PickProcessStrategy = (queue, running) => {
    // Pick shortest burst
    if (queue.length === 0) return null;
    return [...queue].sort((a, b) => a.remainingTimeCurrentBurst - b.remainingTimeCurrentBurst)[0];
};

const srtfStrategy: PickProcessStrategy = (queue, running) => {
    // Shortest Remaining Time
    // Compare running vs queue best
    const bestCandidate = queue.length > 0
        ? [...queue].sort((a, b) => a.remainingTimeCurrentBurst - b.remainingTimeCurrentBurst)[0]
        : null;

    if (running && bestCandidate) {
        if (bestCandidate.remainingTimeCurrentBurst < running.remainingTimeCurrentBurst) {
            return bestCandidate;
        }
        return running;
    }
    return bestCandidate || running;
};

const priorityStrategy: PickProcessStrategy = (queue, running) => {
    // Lower number = higher priority
    if (queue.length === 0) return null;
    return [...queue].sort((a, b) => a.priority - b.priority)[0];
};

const rrStrategy: PickProcessStrategy = (queue, running) => {
    return queue.length > 0 ? queue[0] : null;
};

// --- EXPORTS ---

export const fcfsResponse = (processes: Process[]): SchedulerResult => {
    // Sort input by arrival first for FCFS correctness
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    return runSimulation(sorted, fcfsStrategy, false);
};

export const sjfResponse = (processes: Process[]): SchedulerResult => {
    return runSimulation(processes, sjfStrategy, false);
};

export const srtfResponse = (processes: Process[]): SchedulerResult => {
    return runSimulation(processes, srtfStrategy, true);
};

export const priorityNonPreemptiveResponse = (processes: Process[]): SchedulerResult => {
    return runSimulation(processes, priorityStrategy, false);
};

export const priorityPreemptiveResponse = (processes: Process[]): SchedulerResult => {
    // Need a strategy that compares running priority vs queue priority
    const strategy: PickProcessStrategy = (queue, running) => {
        const bestCandidate = queue.length > 0
            ? [...queue].sort((a, b) => a.priority - b.priority)[0]
            : null;

        if (running && bestCandidate) {
            if (bestCandidate.priority < running.priority) {
                return bestCandidate;
            }
            return running;
        }
        return bestCandidate || running;
    };
    return runSimulation(processes, strategy, true);
};

export const roundRobinResponse = (processes: Process[], quantum: number): SchedulerResult => {
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    return runSimulation(sorted, rrStrategy, true, quantum);
};
