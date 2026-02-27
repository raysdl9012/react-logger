/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { LogEntry, LogLevel, LoggerConfig, StorageDriver } from '../types';
import { getStorageDriver } from '../storage';
import { Logger } from '../Logger';

interface LoggerState {
    logs: LogEntry[];
    config: LoggerConfig;
    unreadCount: number;
}

type LoggerAction =
    | { type: 'ADD_LOG'; log: LogEntry }
    | { type: 'SET_LOGS'; logs: LogEntry[] }
    | { type: 'CLEAR_LOGS' }
    | { type: 'SET_CONFIG'; config: Partial<LoggerConfig> }
    | { type: 'RESET_UNREAD' }
    | { type: 'INCREMENT_UNREAD' };

const initialState: LoggerState = {
    logs: [],
    config: {
        enabled: true,
        persistence: false,
        persistenceDriver: 'localStorage',
        maxLogs: 500,
    },
    unreadCount: 0,
};

function loggerReducer(state: LoggerState, action: LoggerAction): LoggerState {
    switch (action.type) {
        case 'ADD_LOG': {
            const newLogs = [action.log, ...state.logs].slice(0, state.config.maxLogs);
            return {
                ...state,
                logs: newLogs,
                unreadCount: state.unreadCount + 1,
            };
        }
        case 'SET_LOGS':
            return {
                ...state,
                logs: [...state.logs, ...action.logs].slice(0, state.config.maxLogs),
                unreadCount: state.unreadCount + action.logs.length
            };
        case 'CLEAR_LOGS':
            return { ...state, logs: [], unreadCount: 0 };
        case 'SET_CONFIG':
            return { ...state, config: { ...state.config, ...action.config } };
        case 'RESET_UNREAD':
            return { ...state, unreadCount: 0 };
        case 'INCREMENT_UNREAD':
            return { ...state, unreadCount: state.unreadCount + 1 };
        default:
            return state;
    }
}

interface LoggerContextType {
    state: LoggerState;
    dispatch: React.Dispatch<LoggerAction>;
    isPanelOpen: boolean;
    setIsPanelOpen: (open: boolean) => void;
}

const LoggerContext = createContext<LoggerContextType | undefined>(undefined);

/**
 * Provides the logging context to all child components.
 * This should wrap your entire application (e.g. in App.tsx).
 * 
 * @param config Optional initial configuration for persistence and limits.
 */
export const LoggerProvider: React.FC<{ children: React.ReactNode; config?: LoggerConfig }> = ({
    children,
    config,
}) => {
    const [state, dispatch] = useReducer(loggerReducer, {
        ...initialState,
        config: { ...initialState.config, ...config },
    });
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);
    const storageRef = useRef<StorageDriver | null>(null);

    // Initialize storage driver and Logger singleton
    useEffect(() => {
        Logger._setDispatcher(dispatch, state.config.onLogAdded);

        if (state.config.persistence) {
            storageRef.current = getStorageDriver(state.config.persistenceDriver || 'localStorage');
            storageRef.current.load().then((loadedLogs) => {
                dispatch({ type: 'SET_LOGS', logs: loadedLogs });
            });
        }
    }, [state.config.persistence, state.config.persistenceDriver]);

    // Sync enabled state from config
    useEffect(() => {
        Logger.enabled = state.config.enabled ?? true;
    }, [state.config.enabled]);

    // Persist logs when they change
    useEffect(() => {
        if (state.config.persistence && storageRef.current) {
            storageRef.current.save(state.logs);
        }
    }, [state.logs, state.config.persistence]);

    return (
        <LoggerContext.Provider value={{ state, dispatch, isPanelOpen, setIsPanelOpen }}>
            {children}
        </LoggerContext.Provider>
    );
};

/**
 * Internal hook to access the logger context state.
 * Use the public `useLogger` hook for standard logging operations.
 */
export const useLoggerContext = () => {
    const context = useContext(LoggerContext);
    if (!context) {
        throw new Error('useLoggerContext must be used within a LoggerProvider');
    }
    return context;
};
