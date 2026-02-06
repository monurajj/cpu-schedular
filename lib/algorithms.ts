import { Process, ProcessState, GanttChartBlock, SchedulerResult } from './types';

// Helper to deep copy processes to avoid mutation of props
const deepCopy = (processes: Process[]): ProcessState[] => {
    return processes.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        startTime: null,
        completionTime: 0,
        waitingTime: 0,
        turnaroundTime: 0,
        responseTime: 0,
        isCompleted: false,
    }));
};

const calculateMetrics = (
    processes: ProcessState[],
    ganttChart: GanttChartBlock[],
    lastCompletionTime: number
): SchedulerResult => {
    const totalWT = processes.reduce((acc, p) => acc + p.waitingTime, 0);
    const totalTAT = processes.reduce((acc, p) => acc + p.turnaroundTime, 0);
    const totalBurst = processes.reduce((acc, p) => acc + p.burstTime, 0);

    // CPU Utilization = (Total Busy Time / Total Schedule Time) * 100
    // Note: Total Schedule Time could be longer than last completion if there are gaps at the end? 
    // Usually it is (Busy Time) / (Time when last process finishes - Time when first process arrives)
    // Or simply (Busy Time) / (Total Time Elapsed)

    // Let's use: (totalBurst / lastCompletionTime) * 100 for simplicity, assuming 0 start
    // Handle 0 division
    const cpuUtil = lastCompletionTime > 0 ? (totalBurst / lastCompletionTime) * 100 : 0;

    return {
        processes,
        ganttChart,
        averageWaitingTime: processes.length > 0 ? totalWT / processes.length : 0,
        averageTurnaroundTime: processes.length > 0 ? totalTAT / processes.length : 0,
        cpuUtilization: parseFloat(cpuUtil.toFixed(2)),
        throughput: processes.length > 0 ? parseFloat((processes.length / lastCompletionTime).toFixed(4)) : 0
    };
};

// --- ALGORITHMS ---

export const fcfsResponse = (inputProcesses: Process[]): SchedulerResult => {
    let processes = deepCopy(inputProcesses);
    // Sort by Arrival Time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    const ganttChart: GanttChartBlock[] = [];

    for (const process of processes) {
        // If CPU is idle before this process arrives
        if (currentTime < process.arrivalTime) {
            ganttChart.push({
                processId: 'IDLE',
                startTime: currentTime,
                endTime: process.arrivalTime
            });
            currentTime = process.arrivalTime;
        }

        process.startTime = currentTime;
        process.responseTime = currentTime - process.arrivalTime;

        // Run process
        ganttChart.push({
            processId: process.id,
            startTime: currentTime,
            endTime: currentTime + process.burstTime
        });

        currentTime += process.burstTime;
        process.completionTime = currentTime;
        process.turnaroundTime = process.completionTime - process.arrivalTime;
        process.waitingTime = process.turnaroundTime - process.burstTime;
        process.remainingTime = 0;
        process.isCompleted = true;
    }

    return calculateMetrics(processes, ganttChart, currentTime);
};

export const sjfResponse = (inputProcesses: Process[]): SchedulerResult => {
    // Non-Preemptive SJF
    let processes = deepCopy(inputProcesses);
    let currentTime = 0;
    let completedCount = 0;
    const n = processes.length;
    const ganttChart: GanttChartBlock[] = [];

    while (completedCount < n) {
        // Filter available processes that are NOT completed
        const available = processes.filter(
            p => p.arrivalTime <= currentTime && !p.isCompleted
        );

        if (available.length === 0) {
            // Find next arrival time
            const futureProcesses = processes.filter(p => !p.isCompleted);
            // Should exist because completedCount < n
            if (futureProcesses.length > 0) {
                futureProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
                const nextArrival = futureProcesses[0].arrivalTime;

                ganttChart.push({
                    processId: 'IDLE',
                    startTime: currentTime,
                    endTime: nextArrival
                });
                currentTime = nextArrival;
            }
            continue;
        }

        // Pick process with shortest burst time
        // If tie, pick one with earlier arrival time
        available.sort((a, b) => {
            if (a.burstTime === b.burstTime) return a.arrivalTime - b.arrivalTime;
            return a.burstTime - b.burstTime;
        });

        const p = available[0];

        // Response time logic (first time CPU access) - for non-preemptive, it's now
        if (p.startTime === null) {
            p.startTime = currentTime;
            p.responseTime = currentTime - p.arrivalTime;
        }

        ganttChart.push({
            processId: p.id,
            startTime: currentTime,
            endTime: currentTime + p.burstTime
        });

        currentTime += p.burstTime;
        p.completionTime = currentTime;
        p.turnaroundTime = p.completionTime - p.arrivalTime;
        p.waitingTime = p.turnaroundTime - p.burstTime;
        p.remainingTime = 0;
        p.isCompleted = true;
        completedCount++;
    }

    return calculateMetrics(processes, ganttChart, currentTime);
};

export const srtfResponse = (inputProcesses: Process[]): SchedulerResult => {
    // Preemptive SJF
    let processes = deepCopy(inputProcesses);
    let currentTime = 0;
    let completedCount = 0;
    const n = processes.length;
    const ganttChart: GanttChartBlock[] = [];

    // We simulate time unit by time unit, or by event points (arrivals/completions)
    // For simplicity and accuracy in visualization, checking at every time unit is standard for academic viz unless bursts are huge.
    // However, event-based is more efficient. Let's do event-based optimization:
    // Run current shortest process until:
    // 1. It finishes
    // 2. A new process arrives that has SHORTER remaining time than current process's remaining time

    let lastProcessId: string | null = null;

    while (completedCount < n) {
        const available = processes.filter(p => p.arrivalTime <= currentTime && !p.isCompleted);

        if (available.length === 0) {
            // Jump to next arrival
            const future = processes.filter(p => !p.isCompleted).sort((a, b) => a.arrivalTime - b.arrivalTime);
            if (future.length > 0) {
                const nextTime = future[0].arrivalTime;
                if (lastProcessId === 'IDLE') {
                    // Extend idle block
                    const lastBlock = ganttChart[ganttChart.length - 1];
                    lastBlock.endTime = nextTime;
                } else {
                    ganttChart.push({ processId: 'IDLE', startTime: currentTime, endTime: nextTime });
                }
                currentTime = nextTime;
                lastProcessId = 'IDLE';
            }
            continue;
        }

        // Sort by remaining time
        available.sort((a, b) => {
            if (a.remainingTime === b.remainingTime) return a.arrivalTime - b.arrivalTime;
            return a.remainingTime - b.remainingTime;
        });

        const currentP = available[0];

        // Start time logic
        if (currentP.startTime === null) {
            currentP.startTime = currentTime;
            currentP.responseTime = currentTime - currentP.arrivalTime;
        }

        // Determine how long to run:
        // Run until it finishes OR next arrival that MIGHT preempt it
        // Find next arrival time > currentTime
        const futureArrivals = processes
            .filter(p => p.arrivalTime > currentTime && !p.isCompleted)
            .sort((a, b) => a.arrivalTime - b.arrivalTime);

        let runTime = currentP.remainingTime;
        let isPreempted = false;

        if (futureArrivals.length > 0) {
            const timeToNextArrival = futureArrivals[0].arrivalTime - currentTime;
            // Only preempt if the new process actually has strictly lower burst than current's REMAINING at that point?
            // SRTF definition: if new process arrives with burst < current remaining, preempt.
            // But we don't know if the new one IS shorter until we check. 
            // So we usually run up to the next arrival, then re-evaluate.

            if (timeToNextArrival < runTime) {
                runTime = timeToNextArrival;
                isPreempted = true;
            }
        }

        // Add to Gantt
        if (lastProcessId === currentP.id) {
            // Extend previous block
            ganttChart[ganttChart.length - 1].endTime += runTime;
        } else {
            ganttChart.push({
                processId: currentP.id,
                startTime: currentTime,
                endTime: currentTime + runTime
            });
        }

        currentTime += runTime;
        currentP.remainingTime -= runTime;
        lastProcessId = currentP.id;

        if (currentP.remainingTime === 0) {
            currentP.isCompleted = true;
            currentP.completionTime = currentTime;
            currentP.turnaroundTime = currentP.completionTime - currentP.arrivalTime;
            currentP.waitingTime = currentP.turnaroundTime - currentP.burstTime;
            completedCount++;
            lastProcessId = null; // Reset ensures next block starts fresh if context switch needed (conceptually)
        }
    }

    return calculateMetrics(processes, ganttChart, currentTime);
};

export const priorityNonPreemptiveResponse = (inputProcesses: Process[]): SchedulerResult => {
    let processes = deepCopy(inputProcesses);
    let currentTime = 0;
    let completedCount = 0;
    const n = processes.length;
    const ganttChart: GanttChartBlock[] = [];

    while (completedCount < n) {
        const available = processes.filter(p => p.arrivalTime <= currentTime && !p.isCompleted);

        if (available.length === 0) {
            const future = processes.filter(p => !p.isCompleted).sort((a, b) => a.arrivalTime - b.arrivalTime);
            if (future.length > 0) {
                const nextTime = future[0].arrivalTime;
                ganttChart.push({ processId: 'IDLE', startTime: currentTime, endTime: nextTime });
                currentTime = nextTime;
            }
            continue;
        }

        // Sort by Priority (Lower number = Higher priority)
        available.sort((a, b) => {
            if (a.priority === b.priority) return a.arrivalTime - b.arrivalTime;
            return a.priority - b.priority;
        });

        const p = available[0];

        if (p.startTime === null) {
            p.startTime = currentTime;
            p.responseTime = currentTime - p.arrivalTime;
        }

        ganttChart.push({
            processId: p.id,
            startTime: currentTime,
            endTime: currentTime + p.burstTime
        });

        currentTime += p.burstTime;
        p.completionTime = currentTime;
        p.turnaroundTime = p.completionTime - p.arrivalTime;
        p.waitingTime = p.turnaroundTime - p.burstTime;
        p.remainingTime = 0;
        p.isCompleted = true;
        completedCount++;
    }

    return calculateMetrics(processes, ganttChart, currentTime);
};

export const priorityPreemptiveResponse = (inputProcesses: Process[]): SchedulerResult => {
    let processes = deepCopy(inputProcesses);
    let currentTime = 0;
    let completedCount = 0;
    const n = processes.length;
    const ganttChart: GanttChartBlock[] = [];
    let lastProcessId: string | null = null;

    while (completedCount < n) {
        const available = processes.filter(p => p.arrivalTime <= currentTime && !p.isCompleted);

        if (available.length === 0) {
            const future = processes.filter(p => !p.isCompleted).sort((a, b) => a.arrivalTime - b.arrivalTime);
            if (future.length > 0) {
                const nextTime = future[0].arrivalTime;
                if (lastProcessId === 'IDLE') {
                    ganttChart[ganttChart.length - 1].endTime = nextTime;
                } else {
                    ganttChart.push({ processId: 'IDLE', startTime: currentTime, endTime: nextTime });
                }
                currentTime = nextTime;
                lastProcessId = 'IDLE';
            }
            continue;
        }

        // Sort by Priority
        available.sort((a, b) => {
            if (a.priority === b.priority) return a.arrivalTime - b.arrivalTime;
            return a.priority - b.priority;
        });

        const currentP = available[0];

        if (currentP.startTime === null) {
            currentP.startTime = currentTime;
            currentP.responseTime = currentTime - currentP.arrivalTime;
        }

        // Check for next arrival to potentially preempt
        const futureArrivals = processes
            .filter(p => p.arrivalTime > currentTime && !p.isCompleted)
            .sort((a, b) => a.arrivalTime - b.arrivalTime);

        let runTime = currentP.remainingTime;

        if (futureArrivals.length > 0) {
            const timeToNextArrival = futureArrivals[0].arrivalTime - currentTime;
            if (timeToNextArrival < runTime) {
                runTime = timeToNextArrival;
            }
        }

        if (lastProcessId === currentP.id) {
            ganttChart[ganttChart.length - 1].endTime += runTime;
        } else {
            ganttChart.push({
                processId: currentP.id,
                startTime: currentTime,
                endTime: currentTime + runTime
            });
        }

        currentTime += runTime;
        currentP.remainingTime -= runTime;
        lastProcessId = currentP.id;

        if (currentP.remainingTime === 0) {
            currentP.isCompleted = true;
            currentP.completionTime = currentTime;
            currentP.turnaroundTime = currentP.completionTime - currentP.arrivalTime;
            currentP.waitingTime = currentP.turnaroundTime - currentP.burstTime;
            completedCount++;
            lastProcessId = null;
        }
    }
    return calculateMetrics(processes, ganttChart, currentTime);
};

export const roundRobinResponse = (inputProcesses: Process[], quantum: number): SchedulerResult => {
    let processes = deepCopy(inputProcesses);

    // Sort primarily by arrival time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    const ganttChart: GanttChartBlock[] = [];
    const queue: ProcessState[] = [];

    let completedCount = 0;
    const n = processes.length;

    // Pointers
    let lastProcessId: string | null = null;
    let arrivedIndex = 0;

    // Push initial processes arriving at 0
    while (arrivedIndex < n && processes[arrivedIndex].arrivalTime <= currentTime) {
        queue.push(processes[arrivedIndex]);
        arrivedIndex++;
    }

    while (completedCount < n) {
        if (queue.length === 0) {
            // Jump to next arrival
            if (arrivedIndex < n) {
                const nextArrival = processes[arrivedIndex].arrivalTime;
                ganttChart.push({ processId: 'IDLE', startTime: currentTime, endTime: nextArrival });
                currentTime = nextArrival;
                // Add all processes that arrive exactly at new currentTime
                while (arrivedIndex < n && processes[arrivedIndex].arrivalTime <= currentTime) {
                    queue.push(processes[arrivedIndex]);
                    arrivedIndex++;
                }
            }
            continue;
        }

        const currentP = queue.shift()!;

        if (currentP.startTime === null) {
            currentP.startTime = currentTime;
            currentP.responseTime = currentTime - currentP.arrivalTime;
        }

        const runTime = Math.min(quantum, currentP.remainingTime);

        ganttChart.push({
            processId: currentP.id,
            startTime: currentTime,
            endTime: currentTime + runTime
        });

        currentTime += runTime;
        currentP.remainingTime -= runTime;

        // Check for new arrivals DURING this time slice
        // IMPORTANT: In standard RR, new arrivals are added to queue BEFORE the current process is re-added if it's not done.
        while (arrivedIndex < n && processes[arrivedIndex].arrivalTime <= currentTime) {
            queue.push(processes[arrivedIndex]);
            arrivedIndex++;
        }

        if (currentP.remainingTime > 0) {
            queue.push(currentP);
        } else {
            currentP.isCompleted = true;
            currentP.completionTime = currentTime;
            currentP.turnaroundTime = currentP.completionTime - currentP.arrivalTime;
            currentP.waitingTime = currentP.turnaroundTime - currentP.burstTime;
            completedCount++;
        }
    }

    return calculateMetrics(processes, ganttChart, currentTime);
};
