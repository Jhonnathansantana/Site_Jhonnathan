import { useEffect, useState } from 'react';
import { logger } from '../lib/logger';
import type { LogEntry } from '../lib/logger';

const levelColors: Record<string, string> = {
  debug: 'text-gray-500',
  info: 'text-blue-600',
  warn: 'text-amber-600',
  error: 'text-red-600',
};

export function MonitorPanel() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const interval = setInterval(() => {
      const all = logger.getAll();
      setEntries(filter === 'all' ? all : all.filter(e => e.level === filter));
    }, 500);
    return () => clearInterval(interval);
  }, [filter]);

  const handleClear = () => {
    logger.clear();
    setEntries([]);
  };

  return (
    <div class="rounded-lg border border-slate-200 bg-white p-4 font-mono text-xs dark:border-slate-700 dark:bg-slate-900">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300">Monitor de Logs</h3>
        <div class="flex items-center gap-2">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            class="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">Todos</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
          <button
            onClick={handleClear}
            class="rounded bg-slate-200 px-2 py-1 text-xs hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Limpiar
          </button>
        </div>
      </div>
      {entries.length === 0 ? (
        <p class="text-slate-400 dark:text-slate-500">Sin registros aún.</p>
      ) : (
        <div class="max-h-80 space-y-1 overflow-y-auto">
          {entries.toReversed().map((e, i) => (
            <div key={i} class="flex gap-2">
              <span class="shrink-0 text-slate-400">{e.timestamp.slice(11, 19)}</span>
              <span class={`shrink-0 font-bold ${levelColors[e.level]}`}>{e.level.toUpperCase()}</span>
              <span class="shrink-0 text-slate-500">[{e.module}]</span>
              <span class="text-slate-700 dark:text-slate-300">{e.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}