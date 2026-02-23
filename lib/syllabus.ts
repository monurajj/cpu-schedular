/**
 * OS-Interactive Syllabus: 24 Lecture Topics
 * Organized by module for sidebar navigation
 */

export interface LectureTopic {
  id: string;
  title: string;
  path: string;
  icon: string;
  module: string;
}

export interface SyllabusModule {
  id: string;
  title: string;
  icon: string;
  topics: LectureTopic[];
}

export const syllabus: SyllabusModule[] = [
  {
    id: 'dashboard',
    title: 'Overview',
    icon: 'LayoutDashboard',
    topics: [
      { id: '1', title: 'Dashboard & City Analogy', path: '/', module: 'dashboard', icon: 'Home' },
    ],
  },
  {
    id: 'intro',
    title: 'Introduction',
    icon: 'BookOpen',
    topics: [
      { id: '2', title: 'Introduction to Operating Systems', path: '/intro/os-basics', module: 'intro', icon: 'Info' },
      { id: '3', title: 'OS Architecture & Structure', path: '/intro/architecture', module: 'intro', icon: 'Layers' },
    ],
  },
  {
    id: 'process',
    title: 'Process Management',
    icon: 'Cpu',
    topics: [
      { id: '4', title: 'Process Concept & States', path: '/process/concept', module: 'process', icon: 'GitBranch' },
      { id: '5', title: 'Process Control Block (PCB)', path: '/process/pcb', module: 'process', icon: 'FileCode' },
      { id: '6', title: 'Process Creation & Threads', path: '/process/creation', module: 'process', icon: 'GitFork' },
      { id: '7', title: 'Threads in Depth', path: '/process/threads', module: 'process', icon: 'Users' },
      { id: '8', title: 'CPU Scheduling Fundamentals', path: '/process/cpu-fundamentals', module: 'process', icon: 'BarChart3' },
      { id: '9', title: 'CPU Scheduling Algorithms', path: '/cpu-scheduling', module: 'process', icon: 'GanttChart' },
      { id: '10', title: 'CPU Scheduling Advanced', path: '/process/cpu-advanced', module: 'process', icon: 'Zap' },
    ],
  },
  {
    id: 'sync',
    title: 'Process Synchronization',
    icon: 'Lock',
    topics: [
      { id: '11', title: 'Critical Section & Race Conditions', path: '/synchronization/critical-section', module: 'sync', icon: 'Shield' },
      { id: '12', title: 'Semaphores & Mutexes', path: '/synchronization/semaphores', module: 'sync', icon: 'Key' },
      { id: '13', title: 'Producer-Consumer Problem', path: '/synchronization/producer-consumer', module: 'sync', icon: 'Package' },
      { id: '14', title: 'Dining Philosophers', path: '/synchronization/dining-philosophers', module: 'sync', icon: 'UtensilsCrossed' },
    ],
  },
  {
    id: 'deadlock',
    title: 'Deadlocks',
    icon: 'AlertTriangle',
    topics: [
      { id: '15', title: 'Deadlock Introduction', path: '/deadlocks/intro', module: 'deadlock', icon: 'AlertCircle' },
      { id: '16', title: 'Resource Allocation Graph (RAG)', path: '/deadlocks/rag', module: 'deadlock', icon: 'GitBranch' },
      { id: '17', title: 'Deadlock Detection & Recovery', path: '/deadlocks/detection', module: 'deadlock', icon: 'Search' },
    ],
  },
  {
    id: 'memory',
    title: 'Memory Management',
    icon: 'HardDrive',
    topics: [
      { id: '18', title: 'Memory Management Overview', path: '/memory/overview', module: 'memory', icon: 'Database' },
      { id: '19', title: 'Contiguous Allocation', path: '/memory/contiguous', module: 'memory', icon: 'LayoutList' },
      { id: '20', title: 'Paging & Address Translation', path: '/memory/paging', module: 'memory', icon: 'Grid3X3' },
      { id: '21', title: 'Virtual Memory', path: '/memory/virtual', module: 'memory', icon: 'Cloud' },
      { id: '22', title: 'Page Replacement Algorithms', path: '/memory/page-replacement', module: 'memory', icon: 'RefreshCw' },
    ],
  },
  {
    id: 'storage',
    title: 'Storage & I/O',
    icon: 'HardDrive',
    topics: [
      { id: '23', title: 'File Systems', path: '/storage/file-systems', module: 'storage', icon: 'Folder' },
      { id: '24', title: 'Disk Scheduling', path: '/storage/disk-scheduling', module: 'storage', icon: 'Disc' },
    ],
  },
  {
    id: 'reference',
    title: 'Reference',
    icon: 'BookMarked',
    topics: [
      { id: '25', title: 'Dictionary', path: '/dictionary', module: 'reference', icon: 'Search' },
    ],
  },
];

// Flatten all topics for quick lookup
export const allTopics: LectureTopic[] = syllabus.flatMap((m) => m.topics);
