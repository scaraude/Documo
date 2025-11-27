import { isDevelopment, isTest } from '@/lib/config/env';
import pino from 'pino';

// Simple logger without transport to avoid Next.js bundling issues
const logger = pino({
  level: isTest ? 'silent' : isDevelopment ? 'debug' : 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
});

export default logger;
