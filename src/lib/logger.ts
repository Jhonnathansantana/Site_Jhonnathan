type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: unknown;
}

const MAX_LOGS = 200;
const logs: LogEntry[] = [];

function createEntry(level: LogLevel, module: string, message: string, data?: unknown): LogEntry {
  return { timestamp: new Date().toISOString(), level, module, message, data };
}

function store(entry: LogEntry) {
  logs.push(entry);
  if (logs.length > MAX_LOGS) logs.shift();

  const fn = entry.level === 'error' ? console.error
    : entry.level === 'warn' ? console.warn
    : entry.level === 'debug' ? console.debug
    : console.log;
  fn(`[${entry.level.toUpperCase()}] [${entry.module}] ${entry.message}`, entry.data || '');
}

export const logger = {
  debug: (module: string, message: string, data?: unknown) => store(createEntry('debug', module, message, data)),
  info: (module: string, message: string, data?: unknown) => store(createEntry('info', module, message, data)),
  warn: (module: string, message: string, data?: unknown) => store(createEntry('warn', module, message, data)),
  error: (module: string, message: string, data?: unknown) => store(createEntry('error', module, message, data)),
  getAll: () => [...logs],
  clear: () => { logs.length = 0; },
};