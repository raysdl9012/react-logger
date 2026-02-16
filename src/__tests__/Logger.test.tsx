/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Logger } from '../Logger';
import { LoggerProvider } from '../context/LoggerContext';
import { renderHook, act } from '@testing-library/react';
import { useLoggerContext } from '../context/LoggerContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LoggerProvider config={{ persistence: false }}>{children}</LoggerProvider>
);

describe('Logger Static Class', () => {
    beforeEach(() => {
        // Clear any buffered logs
        Logger['logBuffer'] = [];
        Logger['dispatch'] = null;
    });

    it('should buffer logs when dispatcher is not set', () => {
        act(() => {
            Logger.debug('test message');
        });
        expect(Logger['logBuffer']).toHaveLength(1);
        expect(Logger['logBuffer'][0].level).toBe('DEBUG');
    });

    it('should flush buffered logs when dispatcher is set', () => {
        act(() => {
            Logger.debug('buffered message');
        });

        const { result } = renderHook(() => useLoggerContext(), { wrapper });

        // Dispatcher should be set by LoggerProvider
        expect(Logger['logBuffer']).toHaveLength(0);
        expect(result.current.state.logs.length).toBeGreaterThan(0);
    });

    it('should log debug messages with title', () => {
        const { result } = renderHook(() => useLoggerContext(), { wrapper });

        act(() => {
            Logger.debug('test message', 'Test Title');
        });

        const logs = result.current.state.logs;
        // In Context, it prepends, so logs[0] is the latest
        expect(logs[0].message).toBe('test message');
        expect(logs[0].title).toBe('Test Title');
    });

    it('should log error from Error object', () => {
        const { result } = renderHook(() => useLoggerContext(), { wrapper });

        act(() => {
            const error = new Error('Test error');
            Logger.error(error);
        });

        const logs = result.current.state.logs;
        expect(logs[0].level).toBe('ERROR');
        expect(logs[0].message).toBe('Test error');
        expect(logs[0].stack).toBeDefined();
    });

    it('should log error from string', () => {
        const { result } = renderHook(() => useLoggerContext(), { wrapper });

        act(() => {
            Logger.error('String error', 'Error Title');
        });

        const logs = result.current.state.logs;
        expect(logs[0].level).toBe('ERROR');
        expect(logs[0].message).toBe('String error');
        expect(logs[0].title).toBe('Error Title');
    });

    it('should log objects with data', () => {
        const { result } = renderHook(() => useLoggerContext(), { wrapper });

        const testData = { foo: 'bar', nested: { value: 123 } };
        act(() => {
            Logger.object(testData, 'Object Title');
        });

        const logs = result.current.state.logs;
        expect(logs[0].level).toBe('OBJECT');
        expect(logs[0].data).toEqual(testData);
        expect(logs[0].title).toBe('Object Title');
    });
});
