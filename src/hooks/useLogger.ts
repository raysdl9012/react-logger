import { useCallback } from 'react';
import { useLoggerContext } from '../context/LoggerContext';
import { LogEntry, LogLevel } from '../types';

/**
 * Main hook to interact with the Liquid Glass Logger.
 * 
 * Provides methods for different logging levels and allows accessing
 * the current state of logs.
 * 
 * @example
 * ```tsx
 * const { debug, error, object } = useLogger();
 * 
 * debug('App started');
 * error(new Error('Failed to fetch'), 'API Error');
 * object({ user: 'John' }, 'Current User');
 * ```
 */
export const useLogger = () => {
    const { state, dispatch, isPanelOpen } = useLoggerContext();

    const addLog = useCallback((level: LogLevel, message: string, extra?: { title?: string, data?: any, stack?: string }) => {
        const log: LogEntry = {
            id: Math.random().toString(36).substring(2, 9),
            level,
            message,
            timestamp: new Date().toISOString(),
            ...extra
        };

        dispatch({ type: 'ADD_LOG', log: log });
        state.config.onLogAdded?.(log);
    }, [dispatch, state.config]);

    /**
     * Log a debug message (Blue neon)
     */
    const debug = useCallback((message: string) => addLog('DEBUG', message), [addLog]);

    /**
     * Log an error. If an Error object is passed, it automatically captures the stack trace.
     * (Red neon)
     */
    const error = useCallback((err: string | Error, title?: string) => {
        const message = err instanceof Error ? err.message : err;
        const stack = err instanceof Error ? err.stack : undefined;
        addLog('ERROR', message, { title: title || 'Error', stack });
    }, [addLog]);

    /**
     * Log a data object for inspection.
     * (Green neon)
     */
    const object = useCallback((data: any, title?: string) => {
        addLog('OBJECT', 'Object visualization', { title: title || 'Data Object', data });
    }, [addLog]);

    /**
     * Clears all logs from the current session and persistent storage.
     */
    const clear = useCallback(() => {
        dispatch({ type: 'CLEAR_LOGS' });
    }, [dispatch]);

    /**
     * Exports all logs as a JSON file download.
     */
    const exportLogs = useCallback(() => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.logs, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `logs_${new Date().getTime()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }, [state.logs]);

    return {
        /** Register a debug message */
        debug,
        /** Register an error or exception */
        error,
        /** Register an object for JSON visualization */
        object,
        /** Clear all history */
        clear,
        /** Download history as JSON */
        exportLogs,
        /** List of all captured logs */
        logs: state.logs,
        /** Count of logs not yet viewed */
        unreadCount: state.unreadCount,
    };
};
