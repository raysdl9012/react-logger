import { LogEntry, LogLevel } from './types';

type LoggerDispatch = (action: { type: 'ADD_LOG'; log: LogEntry } | { type: 'CLEAR_LOGS' }) => void;

/**
 * Global Logger class to support logging from plain TypeScript classes
 * and handle early logs before the React Provider is mounted.
 */
export class Logger {
    private static dispatch: LoggerDispatch | null = null;
    private static logBuffer: LogEntry[] = [];
    private static onLogAddedCallback?: (log: LogEntry) => void;

    /**
     * Internal method to initialize the dispatcher from the React context.
     */
    static _setDispatcher(dispatch: LoggerDispatch, onLogAdded?: (log: LogEntry) => void) {
        this.dispatch = dispatch;
        this.onLogAddedCallback = onLogAdded;

        // Flush buffer
        if (this.logBuffer.length > 0) {
            this.logBuffer.forEach(log => {
                this.dispatch!({ type: 'ADD_LOG', log });
                this.onLogAddedCallback?.(log);
            });
            this.logBuffer = [];
        }
    }

    private static createLog(level: LogLevel, message: string, extra?: { title?: string, data?: any, stack?: string }): LogEntry {
        return {
            id: Math.random().toString(36).substring(2, 9),
            level,
            message,
            timestamp: new Date().toISOString(),
            ...extra
        };
    }

    private static addLog(log: LogEntry) {
        if (this.dispatch) {
            this.dispatch({ type: 'ADD_LOG', log });
            this.onLogAddedCallback?.(log);
        } else {
            this.logBuffer.push(log);
        }
    }

    /**
     * Log a debug message (Blue neon)
     */
    static debug(message: string, title?: string) {
        this.addLog(this.createLog('DEBUG', message, { title }));
    }

    /**
     * Log an error (Red neon). Supports Error objects for automatic stack trace capture.
     */
    static error(err: string | Error, title?: string) {
        const message = err instanceof Error ? err.message : err;
        const stack = err instanceof Error ? err.stack : undefined;
        this.addLog(this.createLog('ERROR', message, { title: title || 'Error', stack }));
    }

    /**
     * Log an object for visualization (Green neon).
     */
    static object(data: any, title?: string) {
        this.addLog(this.createLog('OBJECT', 'Object visualization', { title: title || 'Data Object', data }));
    }

    /**
     * Clear all logs.
     */
    static clear() {
        if (this.dispatch) {
            this.dispatch({ type: 'CLEAR_LOGS' });
        } else {
            this.logBuffer = [];
        }
    }
}
