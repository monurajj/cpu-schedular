"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  Monitor,
  Layers,
  Cpu,
  Smartphone,
  Server,
  Wrench,
  Check,
  ChevronDown,
  ChevronUp,
  HardDrive,
  User,
  ArrowRight,
  Zap,
} from "lucide-react";
import ModeToggle from "@/components/ModeToggle";
import OSLayersVisual from "@/components/OSLayersVisual";

const osLayers = [
  {
    id: "user",
    label: "Users",
    icon: User,
    description: "People interacting with the system through interfaces.",
    color: "from-violet-500/30 to-purple-600/30",
    border: "border-violet-500/40",
  },
  {
    id: "apps",
    label: "Application Programs",
    icon: Layers,
    description:
      "Software like browsers, editors, games. They request services from the OS.",
    color: "from-blue-500/30 to-cyan-600/30",
    border: "border-blue-500/40",
  },
  {
    id: "os",
    label: "Operating System",
    icon: Cpu,
    description:
      "The kernel. Manages hardware, allocates resources, provides system calls.",
    color: "from-cyan-500/30 to-teal-600/30",
    border: "border-cyan-500/40",
  },
  {
    id: "hardware",
    label: "Computer Hardware",
    icon: HardDrive,
    description:
      "CPU, RAM, disk, I/O devices. The physical resources the OS controls.",
    color: "from-gray-600/30 to-gray-700/30",
    border: "border-gray-500/40",
  },
];

const osTypes = [
  {
    id: "desktop",
    title: "Desktop",
    icon: Monitor,
    examples: ["Windows", "macOS", "Linux (Ubuntu, Fedora)"],
    description:
      "General-purpose OS for personal computers. Multi-user, multitasking.",
  },
  {
    id: "mobile",
    title: "Mobile",
    icon: Smartphone,
    examples: ["Android", "iOS", "HarmonyOS"],
    description:
      "Optimized for touch, battery, and smaller screens. App-centric model.",
  },
  {
    id: "embedded",
    title: "Embedded",
    icon: Wrench,
    examples: ["FreeRTOS", "VxWorks", "Zephyr"],
    description:
      "Runs on dedicated hardware (IoT, cars, appliances). Often real-time.",
  },
  {
    id: "server",
    title: "Server",
    icon: Server,
    examples: ["Linux", "Windows Server", "Unix"],
    description: "Designed for stability, security, and serving many clients.",
  },
];

const coreFunctions = [
  {
    id: "process",
    term: "Process Management",
    def: "Creates, schedules, and terminates processes. Manages CPU time.",
  },
  {
    id: "memory",
    term: "Memory Management",
    def: "Allocates RAM, handles paging, virtual memory.",
  },
  {
    id: "file",
    term: "File Systems",
    def: "Organizes data on disk. Directories, permissions, storage.",
  },
  {
    id: "io",
    term: "I/O Management",
    def: "Handles devices, drivers, interrupts. Manages input/output.",
  },
  {
    id: "security",
    term: "Security & Protection",
    def: "Access control, user isolation, privilege levels.",
  },
];

export default function OSBasicsPage() {
  const [mode, setMode] = useState<"lecture" | "sandbox">("lecture");
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [checkedConcepts, setCheckedConcepts] = useState<Set<string>>(
    new Set(),
  );

  const toggleConcept = (id: string) => {
    setCheckedConcepts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Introduction to Operating Systems
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Lecture 2</p>
          </div>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </header>

        <AnimatePresence mode="wait">
          {mode === "lecture" ? (
            <motion.div
              key="lecture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Definition Card */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-cyan-400" />
                  What is an Operating System?
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  An Operating System (OS) is system software that manages
                  computer hardware and software resources, and provides common
                  services for computer programs. It acts as an{" "}
                  <strong className="text-cyan-400">intermediary</strong>{" "}
                  between users and the computer hardware—translating high-level
                  requests into low-level hardware operations.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Without an OS, every application would need to directly
                  control the CPU, memory, and devices—an impossible task. The
                  OS abstracts complexity and ensures fair, secure, and
                  efficient resource sharing.
                </p>
              </div>

              {/* Core Functions Card */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  Core Functions of an OS
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coreFunctions.map((fn) => (
                    <div
                      key={fn.id}
                      className="p-4 rounded-xl bg-gray-900/40 border border-white/5 hover:border-cyan-500/20 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-200 mb-1">
                        {fn.term}
                      </h3>
                      <p className="text-sm text-gray-400">{fn.def}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* OS Layers - Compact View */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  The Layered View
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Data and requests flow through layers: from{" "}
                  <strong className="text-gray-300">Users</strong> →{" "}
                  <strong className="text-gray-300">Applications</strong> →{" "}
                  <strong className="text-gray-300">OS (Kernel)</strong> →{" "}
                  <strong className="text-gray-300">Hardware</strong>. The OS
                  sits in the middle, managing access and resources.
                </p>
                <div className="mb-8">
                  <OSLayersVisual />
                </div>
                <div className="flex flex-col gap-2">
                  {osLayers.map((layer, i) => (
                    <div
                      key={layer.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${layer.border} bg-gray-900/30`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <layer.icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-mono text-sm text-cyan-400">
                          {layer.label}
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {layer.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* OS Types - Compact Grid */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-cyan-400" />
                  Types of Operating Systems
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {osTypes.map((type) => (
                    <div
                      key={type.id}
                      className="p-4 rounded-xl bg-gray-900/40 border border-white/5 text-center"
                    >
                      <type.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-gray-200 text-sm">
                        {type.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {type.examples.slice(0, 2).join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  What&apos;s Next?
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Explore{" "}
                  <strong className="text-cyan-400">OS Architecture</strong>{" "}
                  (Monolithic vs Microkernel) and the{" "}
                  <strong className="text-cyan-400">Process Concept</strong> to
                  understand how the OS actually works under the hood.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/intro/architecture"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors text-sm font-mono"
                  >
                    OS Architecture <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/process/concept"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 transition-colors text-sm font-mono"
                  >
                    Process Concept
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* 1. Interactive OS Architecture Layers */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  OS Architecture Layers
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Click each layer to learn its role. Data flows from top
                  (users) to bottom (hardware).
                </p>
                <div className="space-y-2">
                  {osLayers.map((layer, i) => (
                    <motion.button
                      key={layer.id}
                      onClick={() =>
                        setActiveLayer(
                          activeLayer === layer.id ? null : layer.id,
                        )
                      }
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        activeLayer === layer.id
                          ? `${layer.color} border ${layer.border}`
                          : "bg-gray-900/40 border-white/5 hover:border-white/10"
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <layer.icon className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-gray-200">
                            {layer.label}
                          </span>
                          <AnimatePresence>
                            {activeLayer === layer.id && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-sm text-gray-400 mt-2"
                              >
                                {layer.description}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 2. OS Types Explorer */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-cyan-400" />
                  OS Types Explorer
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Expand each type to see examples and descriptions.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {osTypes.map((type) => (
                    <motion.div
                      key={type.id}
                      className="rounded-xl border border-white/10 overflow-hidden bg-gray-900/40 relative"
                      onMouseEnter={() => setExpandedType(type.id)}
                      onMouseLeave={() => setExpandedType(null)}
                      layout
                    >
                      <div className="w-full p-4 flex items-center justify-between text-left transition-colors relative z-10 cursor-default">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                            <type.icon className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="font-semibold text-gray-200">
                            {type.title}
                          </span>
                        </div>
                      </div>
                      <AnimatePresence>
                        {expandedType === type.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0 space-y-2">
                              <p className="text-sm text-gray-400">
                                {type.description}
                              </p>
                              <p className="text-xs text-cyan-400/80 font-mono">
                                Examples: {type.examples.join(", ")}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 3. Core Functions Checklist */}
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-cyan-400" />
                  Core Functions Checklist
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Mark each as you understand it. These are the main
                  responsibilities of an OS.
                </p>
                <div className="space-y-3">
                  {coreFunctions.map((fn) => (
                    <motion.button
                      key={fn.id}
                      onClick={() => toggleConcept(fn.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                        checkedConcepts.has(fn.id)
                          ? "bg-cyan-500/10 border-cyan-500/30"
                          : "bg-gray-900/40 border-white/5 hover:border-white/10"
                      }`}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                    >
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          checkedConcepts.has(fn.id)
                            ? "bg-cyan-500/30 border-cyan-500"
                            : "border-gray-600"
                        }`}
                      >
                        {checkedConcepts.has(fn.id) && (
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-200">
                          {fn.term}
                        </span>
                        <p className="text-sm text-gray-400 mt-1">{fn.def}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
                {checkedConcepts.size === coreFunctions.length && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-sm text-cyan-400 font-mono"
                  >
                    ✓ All core functions reviewed!
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
