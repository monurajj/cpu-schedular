'use client';

import React, { useState } from 'react';
import { Process, AlgorithmType } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Plus, Cpu, Clock, Zap, AlertCircle, Trash2 } from 'lucide-react';

interface InputFormProps {
    processes: Process[];
    setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
    selectedAlgorithm: AlgorithmType;
    setSelectedAlgorithm: React.Dispatch<React.SetStateAction<AlgorithmType>>;
    timeQuantum: number;
    setTimeQuantum: React.Dispatch<React.SetStateAction<number>>;
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
    // Temporary state for the input fields
    const [newProcess, setNewProcess] = useState({
        id: `P${processes.length + 1}`,
        arrivalTime: 0,
        burstTime: 5,
        priority: 1
    });

    const handleAddProcess = (e: React.FormEvent) => {
        e.preventDefault();
        const id = newProcess.id.trim() || `P${processes.length + 1}`;

        // Basic check for unique ID
        if (processes.some(p => p.id === id)) {
            alert('Process ID must be unique');
            return;
        }

        const process: Process = {
            id,
            arrivalTime: Number(newProcess.arrivalTime),
            priority: Number(newProcess.priority || 1),
            // Default to single CPU burst for now (extensible later)
            bursts: [{ type: 'CPU', duration: Number(newProcess.burstTime) }],
            memoryRequired: 128 // Default memory
        };

        setProcesses([...processes, process]);
        setNewProcess({
            ...newProcess,
            id: `P${processes.length + 2}`, // Auto-increment suggestion
            arrivalTime: Math.max(0, newProcess.arrivalTime + 1), // Suggest next arrival
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
                    <label className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
                        <Cpu className="w-3 h-3" /> Algorithm
                    </label>
                    <select
                        value={selectedAlgorithm}
                        onChange={(e) => setSelectedAlgorithm(e.target.value as AlgorithmType)}
                        className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs font-mono transition-all hover:bg-gray-800/50"
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
                <AnimatePresence>
                    {selectedAlgorithm === 'RR' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <label className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">
                                <Clock className="w-3 h-3" /> Quantum (ms)
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={timeQuantum}
                                onChange={(e) => setTimeQuantum(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500 font-mono"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Process Form */}
            <form onSubmit={handleAddProcess} className="grid grid-cols-2 gap-3 items-end mb-6 bg-gray-800/30 p-3 rounded-xl border border-gray-700/50 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50"></div>

                <div className="col-span-1">
                    <label className="text-[10px] text-gray-500 uppercase font-mono mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> ID</label>
                    <input
                        type="text"
                        value={newProcess.id}
                        onChange={(e) => setNewProcess({ ...newProcess, id: e.target.value })}
                        className="w-full bg-gray-900/80 border border-gray-700 text-gray-200 rounded px-2 py-1.5 text-xs font-mono focus:border-blue-500 outline-none transition-colors"
                        placeholder="P1"
                        required
                    />
                </div>
                <div className="col-span-1">
                    <label className="text-[10px] text-gray-500 uppercase font-mono mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Arrival</label>
                    <input
                        type="number"
                        min="0"
                        value={newProcess.arrivalTime}
                        onChange={(e) => setNewProcess({ ...newProcess, arrivalTime: parseInt(e.target.value) || 0 })}
                        className="w-full bg-gray-900/80 border border-gray-700 text-gray-200 rounded px-2 py-1.5 text-xs font-mono focus:border-blue-500 outline-none transition-colors"
                        required
                    />
                </div>
                <div className="col-span-1">
                    <label className="text-[10px] text-gray-500 uppercase font-mono mb-1 flex items-center gap-1"><Zap className="w-3 h-3" /> Burst</label>
                    <input
                        type="number"
                        min="1"
                        value={newProcess.burstTime}
                        onChange={(e) => setNewProcess({ ...newProcess, burstTime: parseInt(e.target.value) || 1 })}
                        className="w-full bg-gray-900/80 border border-gray-700 text-gray-200 rounded px-2 py-1.5 text-xs font-mono focus:border-blue-500 outline-none transition-colors"
                        required
                    />
                </div>
                <div className="col-span-1">
                    <label className="text-[10px] text-gray-500 uppercase font-mono mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Pri</label>
                    <input
                        type="number"
                        value={newProcess.priority}
                        onChange={(e) => setNewProcess({ ...newProcess, priority: parseInt(e.target.value) || 1 })}
                        className={`w-full border border-gray-700 rounded px-2 py-1.5 text-xs font-mono outline-none transition-colors ${['Priority-NP', 'Priority-P'].includes(selectedAlgorithm) ? 'bg-gray-900/80 text-gray-200 focus:border-blue-500' : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'}`}
                        disabled={!['Priority-NP', 'Priority-P'].includes(selectedAlgorithm)}
                    />
                </div>
                <div className="col-span-2 mt-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-blue-600/10 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 p-2 rounded-lg text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                        <Plus className="w-3 h-3" /> Add Process
                    </motion.button>
                </div>
            </form>

            {/* Process List */}
            <div className="overflow-hidden border border-gray-700/50 rounded-xl bg-gray-900/30 min-h-[150px]">
                <table className="min-w-full divide-y divide-gray-700/50">
                    <thead className="bg-gray-800/40">
                        <tr>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider font-mono">ID</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider font-mono">Arr</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider font-mono">Bur</th>
                            <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider font-mono">Pri</th>
                            <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider font-mono">Del</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                        <AnimatePresence>
                            {processes.map((p) => (
                                <motion.tr
                                    key={p.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="hover:bg-blue-500/5 transition-colors group"
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-xs font-mono text-gray-300 font-bold group-hover:text-blue-400 transition-colors">{p.id}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-xs font-mono text-gray-400">{p.arrivalTime}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-xs font-mono text-gray-400">
                                        {p.bursts.map(b => b.duration).join(', ')}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-xs font-mono text-gray-400">{p.priority}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium">
                                        <button
                                            onClick={() => removeProcess(p.id)}
                                            className="text-gray-600 hover:text-red-400 transition-colors p-1"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {processes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-3 py-8 text-center">
                                    <p className="text-xs text-gray-600 italic font-mono">-- NO PROCESSES --</p>
                                    <p className="text-[10px] text-amber-500/80 mt-2">Add at least one process above, then click Initialize System</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Simulation Controls */}
            <div className="mt-6 flex justify-between gap-3 pt-4 border-t border-gray-800">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProcesses([])}
                    className="px-3 py-2 border border-gray-700 text-gray-400 rounded-lg hover:bg-red-900/20 hover:text-red-400 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                    <RotateCcw className="w-3 h-3" /> Reset
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRun}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-500 hover:to-cyan-500 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
                >
                    <Play className="w-3 h-3 fill-current" /> Initialize System
                </motion.button>
            </div>
        </div>
    );
}
