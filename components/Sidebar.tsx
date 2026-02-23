'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Lock,
  AlertTriangle,
  HardDrive,
  Home,
  Info,
  Layers,
  GitBranch,
  FileCode,
  GanttChart,
  Shield,
  Key,
  Package,
  UtensilsCrossed,
  AlertCircle,
  Search,
  Database,
  LayoutList,
  Grid3X3,
  Cloud,
  RefreshCw,
  Folder,
  Disc,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  GitFork,
  Users,
  BarChart3,
  Zap,
  BookMarked,
} from 'lucide-react';
import { syllabus, SyllabusModule } from '@/lib/syllabus';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Lock,
  AlertTriangle,
  HardDrive,
  Home,
  Info,
  Layers,
  GitBranch,
  GitFork,
  Users,
  FileCode,
  GanttChart,
  BarChart3,
  Zap,
  Shield,
  Key,
  Package,
  UtensilsCrossed,
  AlertCircle,
  Search,
  Database,
  LayoutList,
  Grid3X3,
  Cloud,
  RefreshCw,
  Folder,
  Disc,
  BookMarked,
};

function getIcon(name: string) {
  const Icon = iconMap[name] || Info;
  return <Icon className="w-4 h-4 shrink-0" />;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(['dashboard', 'process', 'reference'])
  );
  const [collapsed, setCollapsed] = useState(false);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900/90 border border-white/10 text-gray-300 hover:text-white"
      >
        {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </button>

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen shrink-0 flex flex-col
          bg-[#080808]/95 backdrop-blur-xl border-r border-white/5
          transition-all duration-300 ease-out
          lg:translate-x-0
          ${collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
          ${collapsed ? 'lg:w-16 lg:min-w-[64px]' : 'w-72 min-w-[288px]'}
        `}
      >
        {/* Brand + Collapse Toggle */}
        <div className={`p-4 border-b border-white/5 shrink-0 flex items-center gap-2 ${collapsed ? 'flex-col justify-center' : 'justify-between'}`}>
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-white text-lg tracking-tight">OS-Interactive</h1>
                <p className="text-[10px] text-gray-500 font-mono">Teaching Platform</p>
              </div>
            )}
          </Link>
          {/* Desktop: Collapse/Expand button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
            title={collapsed ? 'Open sidebar' : 'Close sidebar'}
          >
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation - hidden when collapsed on desktop */}
        <nav className={`flex-1 overflow-y-auto py-4 px-3 space-y-1 ${collapsed ? 'hidden' : ''}`}>
          {syllabus.map((module: SyllabusModule) => {
            const isExpanded = expandedModules.has(module.id);
            const hasActiveChild = module.topics.some((t) => isActive(t.path));

            return (
              <div key={module.id} className="mb-2">
                <button
                  onClick={() => toggleModule(module.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg
                    text-sm font-medium transition-colors
                    ${hasActiveChild ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-200'}
                  `}
                >
                  {getIcon(module.icon)}
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{module.title}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && !collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 mt-1 space-y-0.5 border-l border-gray-800/80 ml-4">
                        {module.topics.map((topic) => {
                          const active = isActive(topic.path);
                          return (
                            <Link
                              key={topic.id}
                              href={topic.path}
                              className={`
                                flex items-center gap-2 px-3 py-2 rounded-lg text-xs
                                transition-all duration-150
                                ${active
                                  ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-500 -ml-[2px]'
                                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}
                              `}
                            >
                              {getIcon(topic.icon)}
                              <span className="truncate">{topic.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-white/5">
            <p className="text-[10px] text-gray-600 font-mono">
              25 Topics • OS Fundamentals
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
