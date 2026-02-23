'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookMarked } from 'lucide-react';
import { sortedTerms, DictionaryTerm } from '@/lib/dictionary';

const categoryColors: Record<string, string> = {
  Process: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  'CPU Scheduling': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Synchronization: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Deadlocks: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  Memory: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  Storage: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  Introduction: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
};

function TermCard({ term, index }: { term: DictionaryTerm; index: number }) {
  const colorClass = term.category ? categoryColors[term.category] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/30' : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, type: 'spring' as const, stiffness: 400, damping: 30 }}
      className="p-4 rounded-xl bg-gray-900/40 border border-white/5 hover:border-cyan-500/20 transition-colors group"
    >
      <div>
        <h3 className="font-mono font-semibold text-gray-200 group-hover:text-cyan-400 transition-colors">
          {term.term}
        </h3>
        <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
          {term.definition}
        </p>
        {term.category && (
          <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono border ${colorClass}`}>
            {term.category}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function DictionaryPage() {
  const [search, setSearch] = useState('');

  const filteredTerms = useMemo(() => {
    if (!search.trim()) return sortedTerms;
    const q = search.toLowerCase().trim();
    return sortedTerms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookMarked className="w-8 h-8 text-cyan-400" />
            Dictionary
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">
            OS terms in alphabetical order • Search any term
          </p>
        </header>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search terms, definitions, or categories..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/60 border border-white/10 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all font-mono text-gray-200 placeholder:text-gray-500"
          />
          {search && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono">
              {filteredTerms.length} result{filteredTerms.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Results */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTerms.length > 0 ? (
              filteredTerms.map((term, i) => (
                <TermCard key={term.term} term={term} index={i} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-gray-500"
              >
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="font-mono">No terms match &quot;{search}&quot;</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer hint */}
        {!search && (
          <p className="mt-8 text-center text-xs text-gray-600 font-mono">
            {sortedTerms.length} terms • Use the search bar to find definitions quickly
          </p>
        )}
      </div>
    </div>
  );
}
