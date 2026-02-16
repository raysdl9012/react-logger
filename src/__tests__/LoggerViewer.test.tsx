/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { LoggerProvider } from '../context/LoggerContext';
import { LoggerViewer } from '../components/LoggerViewer';
import React from 'react';

describe('LoggerViewer Component', () => {
    it('should render FloatingButton when panel is closed', () => {
        render(
            <LoggerProvider config={{ persistence: false }}>
                <LoggerViewer />
            </LoggerProvider>
        );

        const button = document.querySelector('.liql-floatingButton');
        expect(button).not.toBeNull();
    });

    it('should not render FloatingButton when panel is open', () => {
        render(
            <LoggerProvider config={{ persistence: false }}>
                <LoggerViewer />
            </LoggerProvider>
        );

        const button = document.querySelector('.liql-floatingButton');
        fireEvent.click(button!);

        const buttonAfterClick = document.querySelector('.liql-floatingButton');
        expect(buttonAfterClick).toBeNull();
    });

    it('should render LogPanel when panel is open', () => {
        render(
            <LoggerProvider config={{ persistence: false }}>
                <LoggerViewer />
            </LoggerProvider>
        );

        const button = document.querySelector('.liql-floatingButton');
        fireEvent.click(button!);

        const panel = document.querySelector('.liql-panel');
        expect(panel).not.toBeNull();
    });

    it('should toggle between button and panel', () => {
        render(
            <LoggerProvider config={{ persistence: false }}>
                <LoggerViewer />
            </LoggerProvider>
        );

        // Initially shows button
        let button = document.querySelector('.liql-floatingButton');
        expect(button).not.toBeNull();

        // Click to open panel
        fireEvent.click(button!);

        let panel = document.querySelector('.liql-panel');
        expect(panel).not.toBeNull();

        // Close panel
        const closeButton = screen.getByText(/CLOSE CONSOLE/i);
        fireEvent.click(closeButton);

        // Button should be back
        button = document.querySelector('.liql-floatingButton');
        expect(button).not.toBeNull();
    });
});
