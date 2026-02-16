/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { LogPanel } from '../components/LogPanel';
import { LoggerProvider } from '../context/LoggerContext';
import * as LoggerContextModule from '../context/LoggerContext';
import React from 'react';

// Mock LogList to simplify
jest.mock('../components/LogList', () => ({
    LogList: ({ logs, filter, search }: any) => (
        <div data-testid="log-list-mock">
            Logs: {logs.length}, Filter: {filter}, Search: {search}
        </div>
    )
}));

describe('LogPanel Component', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <LoggerProvider config={{ persistence: false }}>{children}</LoggerProvider>
    );

    it('should render panel with header', () => {
        render(<LogPanel />, { wrapper });
        expect(screen.getByText(/ReactLoggerApp console/i)).not.toBeNull();
    });

    it('should handle search input', () => {
        render(<LogPanel />, { wrapper });
        const input = screen.getByPlaceholderText(/Search entries.../i) as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'my search' } });

        expect(input.value).toBe('my search');
        expect(screen.getByTestId('log-list-mock').textContent).toContain('Search: my search');
    });

    it('should handle filter selection', () => {
        render(<LogPanel />, { wrapper });
        const select = screen.getByRole('combobox') as HTMLSelectElement;

        fireEvent.change(select, { target: { value: 'ERROR' } });

        expect(select.value).toBe('ERROR');
        expect(screen.getByTestId('log-list-mock').textContent).toContain('Filter: ERROR');
    });

    it('should call confirm on clear logs', () => {
        window.confirm = jest.fn().mockReturnValue(true);
        render(<LogPanel />, { wrapper });

        const clearBtn = screen.getByTitle(/Clear Logs/i);
        fireEvent.click(clearBtn);

        expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('clear all logs'));
    });

    it('should handle export logs', () => {
        const spyCreate = jest.spyOn(document, 'createElement');
        const spyAppend = jest.spyOn(document.body, 'appendChild');

        render(<LogPanel />, { wrapper });

        const exportBtn = screen.getByTitle(/Export JSON/i);
        fireEvent.click(exportBtn);

        expect(spyCreate).toHaveBeenCalledWith('a');
        expect(spyAppend).toHaveBeenCalled();

        spyCreate.mockRestore();
        spyAppend.mockRestore();
    });

    it('should close panel on minimize or close button', () => {
        const mockSetIsPanelOpen = jest.fn();
        const mockDispatch = jest.fn();

        const useLoggerContextSpy = jest.spyOn(LoggerContextModule, 'useLoggerContext').mockReturnValue({
            state: { logs: [], config: { persistence: false } },
            setIsPanelOpen: mockSetIsPanelOpen,
            dispatch: mockDispatch,
            isPanelOpen: true
        } as any);

        render(<LogPanel />, { wrapper });

        const minimizeBtn = screen.getByTitle(/Minimize/i);
        fireEvent.click(minimizeBtn);
        expect(mockSetIsPanelOpen).toHaveBeenCalledWith(false);

        const closeBtn = screen.getByText(/CLOSE CONSOLE/i);
        fireEvent.click(closeBtn);
        expect(mockSetIsPanelOpen).toHaveBeenCalledWith(false);

        useLoggerContextSpy.mockRestore();
    });
});
