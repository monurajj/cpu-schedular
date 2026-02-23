'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  File,
  Info,
  Zap,
  ArrowRight,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import ModeToggle from '@/components/ModeToggle';

const TREE: { name: string; type: 'dir' | 'file'; children?: typeof TREE }[] = [
  { name: 'home', type: 'dir', children: [
    { name: 'docs', type: 'dir', children: [
      { name: 'notes.txt', type: 'file' },
      { name: 'report.pdf', type: 'file' },
    ]},
    { name: 'code', type: 'dir', children: [
      { name: 'main.c', type: 'file' },
      { name: 'utils.c', type: 'file' },
    ]},
    { name: 'readme.txt', type: 'file' },
  ]},
  { name: 'etc', type: 'dir', children: [
    { name: 'config', type: 'file' },
  ]},
];

function TreeNode({ node, depth = 0 }: { node: { name: string; type: 'dir' | 'file'; children?: typeof TREE }; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  return (
    <div className="ml-4">
      <button
        onClick={() => hasChildren && setOpen(!open)}
        className="flex items-center gap-2 py-1 text-left hover:bg-white/5 rounded px-2 -ml-2 w-full"
      >
        {hasChildren ? (
          open ? <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
        ) : (
          <span className="w-4" />
        )}
        {node.type === 'dir' ? (
          <FolderOpen className="w-4 h-4 text-cyan-400 shrink-0" />
        ) : (
          <FileText className="w-4 h-4 text-amber-400/80 shrink-0" />
        )}
        <span className="font-mono text-sm text-gray-300">{node.name}</span>
      </button>
      {open && hasChildren && (
        <div className="border-l border-white/10 ml-2 pl-2">
          {node.children!.map((c, i) => (
            <TreeNode key={i} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileSystemsPage() {
  const [mode, setMode] = useState<'lecture' | 'sandbox'>('lecture');

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">File Systems</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">Storage & I/O • Lecture 23</p>
          </div>
          <ModeToggle mode={mode} onModeChange={setMode} />
        </header>

        <AnimatePresence mode="wait">
          {mode === 'lecture' ? (
            <motion.div
              key="lecture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-cyan-400" />
                  File System Structure
                </h2>
                <p className="text-gray-400 leading-relaxed mb-4">
                  File systems organize data on storage. Key abstractions: <strong className="text-cyan-400">files</strong> (named data), <strong className="text-cyan-400">directories</strong> (hierarchical organization), and <strong className="text-cyan-400">metadata</strong> (inodes: permissions, size, block pointers).
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <Folder className="w-5 h-5 text-cyan-400" />
                  Allocation Methods
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Contiguous</h4>
                    <p className="text-sm text-gray-400">File blocks stored in consecutive sectors. Fast sequential access; external fragmentation.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Linked</h4>
                    <p className="text-sm text-gray-400">Each block points to next. No fragmentation; slow random access.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
                    <h4 className="font-mono text-cyan-400 mb-2">Indexed</h4>
                    <p className="text-sm text-gray-400">Index block holds pointers to data blocks. Supports random access; index block overhead.</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                  <File className="w-5 h-5 text-cyan-400" />
                  Free Space Management
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  <strong className="text-cyan-400">Bit vector</strong>: one bit per block (0=free, 1=used). <strong className="text-cyan-400">Linked list</strong>: free blocks chained. <strong className="text-cyan-400">Grouping</strong>: store addresses of free blocks in first free block.
                </p>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Related Topics
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link href="/storage/disk-scheduling" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Disk Scheduling <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/memory/overview" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Memory Overview
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
              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-cyan-400" />
                  Directory Tree
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Hierarchical structure: directories contain files and subdirectories. Click to expand/collapse.
                </p>
                <div className="p-6 rounded-xl bg-gray-900/40 border border-white/5 font-mono">
                  <div className="text-xs text-gray-500 mb-4">/ (root)</div>
                  {TREE.map((node, i) => (
                    <TreeNode key={i} node={node} />
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex flex-wrap gap-3">
                  <Link href="/storage/disk-scheduling" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-sm font-mono">
                    Disk Scheduling <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/memory/overview" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-300 border border-white/10 hover:border-white/20 text-sm font-mono">
                    Memory Overview
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
