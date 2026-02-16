/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { renderHook, act } from '@testing-library/react';
import { useLogger } from '../hooks/useLogger';
import { LoggerProvider } from '../context/LoggerContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LoggerProvider config={{ persistence: false }}>{children}</LoggerProvider>
);

describe('useLogger', () => {
    it('should add a debug log', () => {
        const { result } = renderHook(() => useLogger(), { wrapper });

        act(() => {
            result.current.debug('test message');
        });

        expect(result.current.logs).toHaveLength(1);
        expect(result.current.logs[0].level).toBe('DEBUG');
        expect(result.current.logs[0].message).toBe('test message');
    });

    it('should add an error log from Error object', () => {
        const { result } = renderHook(() => useLogger(), { wrapper });

        act(() => {
            result.current.error(new Error('test error'));
        });

        expect(result.current.logs).toHaveLength(1);
        expect(result.current.logs[0].level).toBe('ERROR');
        expect(result.current.logs[0].stack).toBeDefined();
    });

    it('should add an object log', () => {
        const { result } = renderHook(() => useLogger(), { wrapper });
        const testData = { foo: 'bar' };

        act(() => {
            result.current.object(testData, 'Title');
        });

        expect(result.current.logs).toHaveLength(1);
        expect(result.current.logs[0].level).toBe('OBJECT');
        expect(result.current.logs[0].data).toEqual(testData);
        expect(result.current.logs[0].title).toBe('Title');
    });

    it('should clear logs', () => {
        const { result } = renderHook(() => useLogger(), { wrapper });

        act(() => {
            result.current.debug('msg');
            result.current.clear();
        });

        expect(result.current.logs).toHaveLength(0);
    });

    it('should export logs', () => {
        const { result } = renderHook(() => useLogger(), { wrapper });
        const spyAppend = jest.spyOn(document.body, 'appendChild').mockImplementation((node) => node);

        act(() => {
            result.current.exportLogs();
        });

        expect(spyAppend).toHaveBeenCalled();
        spyAppend.mockRestore();
    });
});
