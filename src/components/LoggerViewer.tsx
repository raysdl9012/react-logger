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
    const { isPanelOpen } = useLoggerContext();

    return (
        <>
            {!isPanelOpen && <FloatingButton />}
            {isPanelOpen && <LogPanel />}
        </>
    );
};
