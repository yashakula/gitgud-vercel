export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogConfig {
  level: LogLevel;
  enableColors: boolean;
  enableTimestamp: boolean;
  prefix?: string;
}

class Logger {
  private config: LogConfig;

  constructor(config?: Partial<LogConfig>) {
    this.config = {
      level: this.getLogLevelFromEnv(),
      enableColors: process.env.NODE_ENV !== 'production',
      enableTimestamp: true,
      ...config,
    };
  }

  private getLogLevelFromEnv(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase();
    switch (envLevel) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'INFO':
        return LogLevel.INFO;
      case 'DEBUG':
        return LogLevel.DEBUG;
      default:
        return process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.config.level;
  }

  private formatMessage(level: string, message: string, data?: Record<string, unknown>): string {
    const timestamp = this.config.enableTimestamp 
      ? `[${new Date().toISOString()}]` 
      : '';
    
    const prefix = this.config.prefix ? `[${this.config.prefix}]` : '';
    const levelStr = `[${level}]`;
    
    let formattedMessage = `${timestamp}${prefix}${levelStr} ${message}`;
    
    if (data && Object.keys(data).length > 0) {
      formattedMessage += ` ${JSON.stringify(data)}`;
    }
    
    return formattedMessage;
  }

  private getColorCode(level: LogLevel): string {
    if (!this.config.enableColors) return '';
    
    switch (level) {
      case LogLevel.ERROR:
        return '\x1b[31m'; // Red
      case LogLevel.WARN:
        return '\x1b[33m'; // Yellow
      case LogLevel.INFO:
        return '\x1b[36m'; // Cyan
      case LogLevel.DEBUG:
        return '\x1b[90m'; // Gray
      default:
        return '';
    }
  }

  private resetColor(): string {
    return this.config.enableColors ? '\x1b[0m' : '';
  }

  error(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const colorCode = this.getColorCode(LogLevel.ERROR);
      const resetCode = this.resetColor();
      console.error(`${colorCode}${this.formatMessage('ERROR', message, data)}${resetCode}`);
    }
  }

  warn(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const colorCode = this.getColorCode(LogLevel.WARN);
      const resetCode = this.resetColor();
      console.warn(`${colorCode}${this.formatMessage('WARN', message, data)}${resetCode}`);
    }
  }

  info(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const colorCode = this.getColorCode(LogLevel.INFO);
      const resetCode = this.resetColor();
      console.info(`${colorCode}${this.formatMessage('INFO', message, data)}${resetCode}`);
    }
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const colorCode = this.getColorCode(LogLevel.DEBUG);
      const resetCode = this.resetColor();
      console.debug(`${colorCode}${this.formatMessage('DEBUG', message, data)}${resetCode}`);
    }
  }
}

// Create logger instances for different parts of the application
export const apiLogger = new Logger({ prefix: 'API' });
export const dbLogger = new Logger({ prefix: 'DB' });
export const uiLogger = new Logger({ prefix: 'UI' });
export const middlewareLogger = new Logger({ prefix: 'MIDDLEWARE' });

// Default logger
export const logger = new Logger();