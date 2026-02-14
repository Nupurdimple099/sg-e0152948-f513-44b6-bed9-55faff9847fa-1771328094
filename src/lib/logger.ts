// Production-safe logger that strips console in production builds
// but provides logging in development

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

interface Logger {
  log: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
}

class ProductionSafeLogger implements Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private logWithLevel(level: LogLevel, ...args: unknown[]) {
    if (this.isDevelopment || level === "error" || level === "warn") {
      console[level](...args);
    }
  }

  log(...args: unknown[]) {
    this.logWithLevel("log", ...args);
  }

  info(...args: unknown[]) {
    this.logWithLevel("info", ...args);
  }

  warn(...args: unknown[]) {
    this.logWithLevel("warn", ...args);
  }

  error(...args: unknown[]) {
    this.logWithLevel("error", ...args);
  }

  debug(...args: unknown[]) {
    this.logWithLevel("debug", ...args);
  }
}

// Export singleton instance
export const logger = new ProductionSafeLogger();

// Helper functions for common logging patterns
export const logApiError = (endpoint: string, error: unknown) => {
  logger.error(`API Error [${endpoint}]:`, error);
};

export const logAuthEvent = (event: string, details?: unknown) => {
  logger.info(`Auth Event [${event}]:`, details);
};

export const logDatabaseOperation = (operation: string, table: string, result?: unknown) => {
  logger.debug(`DB Operation [${operation}] on ${table}:`, result);
};

export const logPerformance = (label: string, startTime: number) => {
  const duration = performance.now() - startTime;
  logger.info(`Performance [${label}]: ${duration.toFixed(2)}ms`);
};