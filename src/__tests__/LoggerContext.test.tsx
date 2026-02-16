/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { renderHook, act } from '@testing-library/react';
import { LoggerProvider, useLoggerContext } from '../context/LoggerContext';
import { Logger } from '../Logger';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LoggerProvider config={{ persistence: false }}>{children}</LoggerProvider>
);

describe('LoggerContext', () => {
    it('should provide initial state', () => {
        const { result } = renderHook(() => useLoggerContext(), { wrapper });

        expect(result.current.state.logs).toEqual([]);
        expect(result.current.isPanelOpen).toBe(false);
        expect(result.current.state.unreadCount).toBe(0);
    });

    it('should add logs via dispatch', () => {
        const { result } = renderHook(() => useLoggerContext(), { wrapper });

        act(() => {
            result.current.dispatch({
                type: 'ADD_LOG',
                log: {
                    id: '1',
                    timestamp: new Date().toISOString(),
                    level: 'DEBUG',
                    message: 'Test message'
                }
            });
        });

        expect(result.current.state.logs).toHaveLength(1);
        expect(result.current.state.logs[0].message).toBe('Test message');
    });

    it('should increment unread count when panel is closed', () => {
        const { result } = renderHook(() => useLoggerContext(), { wrapper });

        act(() => {
            Logger.debug('test');
        });

        expect(result.current.state.unreadCount).toBe(1);
    });

    it('should reset unread count when panel opens', () => {
        const { result } = renderHook(() => useLoggerContext(), { wrapper });

        act(() => {
            Logger.debug('test');
        });

        expect(result.current.state.unreadCount).toBe(1);

        act(() => {
            result.current.setIsPanelOpen(true);
            result.current.dispatch({ type: 'RESET_UNREAD' });
        });

        expect(result.current.state.unreadCount).toBe(0);
    });

    it('should clear all logs', () => {
        const { result } = renderHook(() => useLoggerContext(), { wrapper });

        act(() => {
            result.current.dispatch({
                type: 'ADD_LOG',
                log: {
                    id: '1',
                    timestamp: new Date().toISOString(),
                    level: 'DEBUG',
                    message: 'Test 1'
                }
            });
            result.current.dispatch({
                type: 'ADD_LOG',
                log: {
                    id: '2',
                    timestamp: new Date().toISOString(),
                    level: 'DEBUG',
                    message: 'Test 2'
                }
            });
        });

        expect(result.current.state.logs).toHaveLength(2);

        act(() => {
            result.current.dispatch({ type: 'CLEAR_LOGS' });
        });

        expect(result.current.state.logs).toHaveLength(0);
    });

    it('should respect maxLogs configuration', () => {
        const wrapperWithMax = ({ children }: { children: React.ReactNode }) => (
            <LoggerProvider config={{ persistence: false, maxLogs: 2 }}>
                {children}
            </LoggerProvider>
        );

        const { result } = renderHook(() => useLoggerContext(), { wrapper: wrapperWithMax });

        act(() => {
            result.current.dispatch({
                type: 'ADD_LOG',
                log: {
                    id: '1',
                    timestamp: new Date().toISOString(),
                    level: 'DEBUG',
                    message: 'Test 1'
                }
            });
            result.current.dispatch({
                type: 'ADD_LOG',
                log: {
                    id: '2',
                    timestamp: new Date().toISOString(),
                    level: 'DEBUG',
                    message: 'Test 2'
                }
            });
            result.current.dispatch({
                type: 'ADD_LOG',
                log: {
                    id: '3',
                    timestamp: new Date().toISOString(),
                    level: 'DEBUG',
                    message: 'Test 3'
                }
            });
        });

        expect(result.current.state.logs).toHaveLength(2);
        // Prepends, so [Test 3, Test 2]
        expect(result.current.state.logs[0].message).toBe('Test 3');
    });

    it('should call onLogAdded callback', () => {
        const onLogAdded = jest.fn();

        const wrapperWithCallback = ({ children }: { children: React.ReactNode }) => (
            <LoggerProvider config={{ persistence: false, onLogAdded }}>
                {children}
            </LoggerProvider>
        );

        const { result } = renderHook(() => useLoggerContext(), { wrapper: wrapperWithCallback });

        act(() => {
            // Static Logger call will trigger onLogAdded via the dispatcher
            Logger.debug('Test');
        });

        expect(onLogAdded).toHaveBeenCalledTimes(1);
        expect(onLogAdded).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Test'
        }));
    });
});
