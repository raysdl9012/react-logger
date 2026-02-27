/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { useLoggerContext } from '../context/LoggerContext';
import { FloatingButton } from './FloatingButton';
import { LogPanel } from './LogPanel';

/**
 * Main entry point for the Logger UI.
 * Renders the floating trigger button and conditionally shows the glass panel.
 * Should be placed at the root level of your application.
 */
export const LoggerViewer: React.FC = () => {
    const { state, isPanelOpen } = useLoggerContext();

    if (state.config.enabled === false) {
        return null;
    }

    return (
        <>
            {!isPanelOpen && <FloatingButton />}
            {isPanelOpen && <LogPanel />}
        </>
    );
};
