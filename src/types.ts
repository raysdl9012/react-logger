/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Supported severity levels for logging.
 */
export type LogLevel = 'DEBUG' | 'ERROR' | 'OBJECT';

/**
 * Represents a single log entry in the system.
 */
export interface LogEntry {
    /** Unique identifier for the log entry */
    id: string;
    /** The severity level of the log */
    level: LogLevel;
    /** Main descriptive message */
    message: string;
    /** Optional title for grouped logs or object labels */
    title?: string;
    /** ISO timestamp of when the log was created */
    timestamp: string;
    /** Optional raw data associated with the log (for OBJECT level) */
    data?: any;
    /** Optional stack trace (for ERROR level) */
    stack?: string;
}

/**
 * Configuration options for the Logger.
 */
export interface LoggerConfig {
    /** Whether the logger is enabled. If false, no logs are collected and UI is hidden. Default: true */
    enabled?: boolean;
    /** Whether to persist logs between sessions. Default: false */
    persistence?: boolean;
    /** Choice of storage driver. Default: 'localStorage' */
    persistenceDriver?: 'localStorage' | 'indexedDB';
    /** Maximum number of logs to keep in memory/storage. Default: 500 */
    maxLogs?: number;
    /** Optional callback triggered on every new log */
    onLogAdded?: (log: LogEntry) => void;
}

/**
 * Internal interface for storage implementations.
 */
export interface StorageDriver {
    save(logs: LogEntry[]): Promise<void>;
    load(): Promise<LogEntry[]>;
    clear(): Promise<void>;
}
