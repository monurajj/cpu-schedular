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
    const [newProcess, setNewProcess] = useState<Partial<Process> & { burstTime?: number }>({
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
            priority: Number(newProcess.priority || 1),
            bursts: [{ type: 'CPU', duration: Number(newProcess.burstTime) }]
        };

        setProcesses((prevProcesses: Process[]) => {
            // robust check inside functional update
            if (prevProcesses.some(p => p.id === process.id)) {
                return prevProcesses;
            }
            return [...prevProcesses, process];
        });

        // Auto-increment logic
        let nextNum = processes.length + 1;
        while (
            processes.some(p => p.id === `P${nextNum}`) ||
            id === `P${nextNum}` ||
            `P${nextNum}` === newProcess.id
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
        <div className="mb-0 text-sm">
            <div className="grid grid-cols-1 gap-4 mb-6">
                {/* Algorithm Selection */}
                <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Algorithm</label>
                    <select
                        value={selectedAlgorithm}
                        onChange={(e) => setSelectedAlgorithm(e.target.value as AlgorithmType)}
                        className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-mono"
                    >
                        <option value="FCFS">First Come First Serve (FCFS)</option>
                        <option value="SJF">Shortest Job First (NP)</option>
                        <option value="SRTF">Shortest Remaining Time (P)</option>
                        <option value="Priority-NP">Priority (NP)</option>
                        <option value="Priority-P">Priority (P)</option>
                        <option value="RR">Round Robin</option>
                    </select>
                </div>

                {/* Time Quantum (Conditional) */}
                {selectedAlgorithm === 'RR' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Quantum (ms)</label>
                        <input
                            type="number"
                            min="1"
                            value={timeQuantum}
                            onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 rounded-md p-2 focus:ring-1 focus:ring-blue-500 font-mono"
                        />
                    </div>
                )}
            </div>

            {/* Add Process Form */}
            <form onSubmit={handleAddProcess} className="grid grid-cols-2 gap-3 items-end mb-6 bg-gray-800/30 p-3 rounded-lg border border-gray-700/50">
                <div className="col-span-1">
                    <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">ID</label>
                    <input
                        type="text"
                        value={newProcess.id}
                        onChange={(e) => setNewProcess({ ...newProcess, id: e.target.value })}
                        className="w-full bg-gray-900/80 border border-gray-700 text-gray-200 rounded px-2 py-1 text-xs font-mono"
                        placeholder="P1"
                        required
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">Arrival</label>
                    <input
                        type="number"
                        min="0"
                        value={newProcess.arrivalTime}
                        onChange={(e) => setNewProcess({ ...newProcess, arrivalTime: parseInt(e.target.value) || 0 })}
                        className="w-full bg-gray-900/80 border border-gray-700 text-gray-200 rounded px-2 py-1 text-xs font-mono"
                        required
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">Burst</label>
                    <input
                        type="number"
                        min="1"
                        value={newProcess.burstTime}
                        onChange={(e) => setNewProcess({ ...newProcess, burstTime: parseInt(e.target.value) || 1 })}
                        className="w-full bg-gray-900/80 border border-gray-700 text-gray-200 rounded px-2 py-1 text-xs font-mono"
                        required
                    />
                </div>
                <div className="col-span-1">
                    <label className="block text-[10px] text-gray-500 uppercase font-mono mb-1">Pri</label>
                    <input
                        type="number"
                        value={newProcess.priority}
                        onChange={(e) => setNewProcess({ ...newProcess, priority: parseInt(e.target.value) || 1 })}
                        className={`w-full border border-gray-700 rounded px-2 py-1 text-xs font-mono ${['Priority-NP', 'Priority-P'].includes(selectedAlgorithm) ? 'bg-gray-900/80 text-gray-200' : 'bg-gray-800/50 text-gray-500'}`}
                        disabled={!['Priority-NP', 'Priority-P'].includes(selectedAlgorithm)}
                    />
                </div>
                <div className="col-span-2 mt-2">
                    <button
                        type="submit"
                        className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/50 p-1.5 rounded text-xs font-mono uppercase tracking-widest transition-colors"
                    >
                        + Add Process
                    </button>
                </div>
            </form>

            {/* Process List */}
            <div className="overflow-hidden border border-gray-700/50 rounded-lg bg-gray-900/40">
                <table className="min-w-full divide-y divide-gray-700/50">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider font-mono">ID</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider font-mono">Arr</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider font-mono">Bur</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider font-mono">Pri</th>
                            <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-400 uppercase tracking-wider font-mono">Del</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {processes.map((p) => (
                            <tr key={p.id} className="hover:bg-blue-500/10 transition-colors">
                                <td className="px-3 py-1.5 whitespace-nowrap text-xs font-mono text-gray-300">{p.id}</td>
                                <td className="px-3 py-1.5 whitespace-nowrap text-xs font-mono text-gray-400">{p.arrivalTime}</td>
                                <td className="px-3 py-1.5 whitespace-nowrap text-xs font-mono text-gray-400">
                                    {p.bursts.map(b => b.duration).join(', ')}
                                </td>
                                <td className="px-3 py-1.5 whitespace-nowrap text-xs font-mono text-gray-400">{p.priority}</td>
                                <td className="px-3 py-1.5 whitespace-nowrap text-right text-xs font-medium">
                                    <button onClick={() => removeProcess(p.id)} className="text-red-400 hover:text-red-300 hover:bg-red-900/30 px-1 rounded">×</button>
                                </td>
                            </tr>
                        ))}
                        {processes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-3 py-4 text-center text-xs text-gray-500 italic font-mono">
                                    -- NO DATA --
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Simulation Controls */}
            <div className="mt-6 flex justify-between gap-3 pt-4 border-t border-gray-800">
                <button
                    onClick={() => setProcesses([])}
                    className="px-3 py-2 border border-gray-700 text-gray-400 rounded hover:bg-red-900/20 hover:text-red-400 text-xs font-mono uppercase tracking-wider transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={onRun}
                    disabled={processes.length === 0}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded hover:from-blue-500 hover:to-cyan-500 text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Initialize System
                </button>
            </div>
        </div>
    );
}
