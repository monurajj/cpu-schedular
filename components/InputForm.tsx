'use client';

import React, { useState, Dispatch, SetStateAction } from 'react';
import { Process, AlgorithmType } from '@/lib/types';

interface InputFormProps {
    processes: Process[];
    setProcesses: Dispatch<SetStateAction<Process[]>>; // Allow functional updates
    selectedAlgorithm: AlgorithmType;
    setSelectedAlgorithm: (algo: AlgorithmType) => void;
    timeQuantum: number;
    setTimeQuantum: (q: number) => void;
    onRun: () => void;
}

export default function InputForm({
    processes,
    setProcesses,
    selectedAlgorithm,
    setSelectedAlgorithm,
    timeQuantum,
    setTimeQuantum,
    onRun
}: InputFormProps) {
    const [newProcess, setNewProcess] = useState<Partial<Process>>({
        id: `P${processes.length + 1}`,
        arrivalTime: 0,
        burstTime: 1,
        priority: 1
    });

    const handleAddProcess = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProcess.arrivalTime === undefined || newProcess.burstTime === undefined) return;

        const id = newProcess.id || `P${processes.length + 1}`;

        // Optimistic check (UI feedback)
        if (processes.some(p => p.id === id)) {
            alert(`Process ID ${id} already exists. Please choose a unique ID.`);
            return;
        }

        const process: Process = {
            id,
            arrivalTime: Number(newProcess.arrivalTime),
            burstTime: Number(newProcess.burstTime),
            priority: Number(newProcess.priority || 1),
        };

        setProcesses((prevProcesses: Process[]) => {
            // robust check inside functional update
            if (prevProcesses.some(p => p.id === process.id)) {
                return prevProcesses;
            }
            return [...prevProcesses, process];
        });

        // Auto-increment logic
        // We use the current 'processes' length as a heuristic. 
        // Ideally we'd calculate this from the *new* state, but for UI suggestion 'processes.length' is close enough.
        // We iterate until we find a free ID.
        let nextNum = processes.length + 1;
        while (
            processes.some(p => p.id === `P${nextNum}`) ||
            id === `P${nextNum}` ||
            `P${nextNum}` === newProcess.id // avoid same if not cleared?
        ) {
            nextNum++;
        }

        setNewProcess({
            id: `P${nextNum}`,
            arrivalTime: Math.max(0, process.arrivalTime),
            burstTime: 1,
            priority: 1
        });
    };

    const removeProcess = (id: string) => {
        setProcesses(processes.filter(p => p.id !== id));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* Algorithm Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scheduling Algorithm</label>
                    <select
                        value={selectedAlgorithm}
                        onChange={(e) => setSelectedAlgorithm(e.target.value as AlgorithmType)}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="FCFS">First Come First Serve (FCFS)</option>
                        <option value="SJF">Shortest Job First (Non-Preemptive)</option>
                        <option value="SRTF">Shortest Remaining Time First (Preemptive)</option>
                        <option value="Priority-NP">Priority (Non-Preemptive)</option>
                        <option value="Priority-P">Priority (Preemptive)</option>
                        <option value="RR">Round Robin</option>
                    </select>
                </div>

                {/* Time Quantum (Conditional) */}
                {selectedAlgorithm === 'RR' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Quantum</label>
                        <input
                            type="number"
                            min="1"
                            value={timeQuantum}
                            onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                )}
            </div>

            {/* Add Process Form */}
            <form onSubmit={handleAddProcess} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end mb-6 bg-gray-50 p-4 rounded-md">
                <div>
                    <label className="block text-xs font-medium text-gray-500">Process ID</label>
                    <input
                        type="text"
                        value={newProcess.id}
                        onChange={(e) => setNewProcess({ ...newProcess, id: e.target.value })}
                        className="w-full border-gray-300 rounded-md text-sm p-2"
                        placeholder="P1"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500">Arrival Time</label>
                    <input
                        type="number"
                        min="0"
                        value={newProcess.arrivalTime}
                        onChange={(e) => setNewProcess({ ...newProcess, arrivalTime: parseInt(e.target.value) || 0 })}
                        className="w-full border-gray-300 rounded-md text-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500">Burst Time</label>
                    <input
                        type="number"
                        min="1"
                        value={newProcess.burstTime}
                        onChange={(e) => setNewProcess({ ...newProcess, burstTime: parseInt(e.target.value) || 1 })}
                        className="w-full border-gray-300 rounded-md text-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500">Priority {['Priority-NP', 'Priority-P'].includes(selectedAlgorithm) ? '(Lower=High)' : '(Optional)'}</label>
                    <input
                        type="number"
                        value={newProcess.priority}
                        onChange={(e) => setNewProcess({ ...newProcess, priority: parseInt(e.target.value) || 1 })}
                        className={`w-full border-gray-300 rounded-md text-sm p-2 ${['Priority-NP', 'Priority-P'].includes(selectedAlgorithm) ? 'bg-white' : 'bg-gray-100 text-gray-400'}`}
                        disabled={!['Priority-NP', 'Priority-P'].includes(selectedAlgorithm)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                    Add Process
                </button>
            </form>

            {/* Process List */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {processes.map((p) => (
                            <tr key={p.id}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{p.arrivalTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{p.burstTime}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{p.priority}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => removeProcess(p.id)} className="text-red-600 hover:text-red-900">Remove</button>
                                </td>
                            </tr>
                        ))}
                        {processes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-3 py-4 text-center text-sm text-gray-500 italic">
                                    No processes added. Add some above.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Simulation Controls */}
            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={() => setProcesses([])}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
                >
                    Reset
                </button>
                <button
                    onClick={onRun}
                    disabled={processes.length === 0}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-bold shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform active:scale-95"
                >
                    Run Simulation
                </button>
            </div>
        </div>
    );
}
