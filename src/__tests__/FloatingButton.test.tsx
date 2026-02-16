/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { render, fireEvent, act } from '@testing-library/react';
import { FloatingButton } from '../components/FloatingButton';
import { LoggerProvider } from '../context/LoggerContext';
import React from 'react';

describe('FloatingButton Component', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <LoggerProvider config={{ persistence: false }}>{children}</LoggerProvider>
    );

    it('should render correctly', () => {
        const { getByLabelText } = render(<FloatingButton />, { wrapper });
        expect(getByLabelText(/Open Logger/i)).not.toBeNull();
    });

    it('should show unread badge', () => {
        const { Logger } = require('../Logger');
        // Clear buffer and dispatcher
        Logger['logBuffer'] = [];
        Logger['dispatch'] = null;

        const { getByText } = render(
            <LoggerProvider config={{ persistence: false }}>
                <FloatingButton />
            </LoggerProvider>
        );

        act(() => {
            Logger.debug('test msg');
        });

        expect(getByText('1')).not.toBeNull();
    });

    it('should support dragging via mouse', () => {
        const { getByLabelText } = render(<FloatingButton />, { wrapper });
        const button = getByLabelText(/Open Logger/i);

        // Mock getBoundingClientRect
        button.getBoundingClientRect = jest.fn(() => ({
            left: 100,
            top: 100,
            width: 50,
            height: 50,
            bottom: 150,
            right: 150,
        })) as any;

        fireEvent.mouseDown(button, { clientX: 110, clientY: 110 });

        act(() => {
            fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });
        });

        expect(button.style.left).toBe('190px');
        expect(button.style.top).toBe('190px');

        fireEvent.mouseUp(window);
    });

    it('should support dragging via touch', () => {
        const { getByLabelText } = render(<FloatingButton />, { wrapper });
        const button = getByLabelText(/Open Logger/i);

        button.getBoundingClientRect = jest.fn(() => ({
            left: 100,
            top: 100,
            width: 50,
            height: 50,
        })) as any;

        fireEvent.touchStart(button, { touches: [{ clientX: 110, clientY: 110 }] });

        act(() => {
            fireEvent.touchMove(window, { touches: [{ clientX: 250, clientY: 250 }] });
        });

        expect(button.style.left).toBe('240px');
        expect(button.style.top).toBe('240px');
    });

    it('should handle window resize', () => {
        const { getByLabelText } = render(<FloatingButton />, { wrapper });
        const button = getByLabelText(/Open Logger/i);

        // Initial move to set position state
        fireEvent.mouseDown(button, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });
        fireEvent.mouseUp(window);

        // Change window size
        (window as any).innerWidth = 500;
        (window as any).innerHeight = 500;

        act(() => {
            window.dispatchEvent(new Event('resize'));
        });

        // 500 - 60 = 440
        // Our previous position was roughly 200. It should still be 200 if it fits.
        // If we move it to 600, it should be capped at 440.

        fireEvent.mouseDown(button, { clientX: 200, clientY: 200 });
        fireEvent.mouseMove(window, { clientX: 700, clientY: 700 });
        fireEvent.mouseUp(window);

        expect(parseInt(button.style.left)).toBeLessThanOrEqual(440);
    });
});
