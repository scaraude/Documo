import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

// Simple logger without transport to avoid Next.js bundling issues
const logger = pino({
  level: isTest ? 'silent' : isDevelopment ? 'debug' : 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
});

export default logger;
