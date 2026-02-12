import React, { useEffect } from 'react';
import { LoggerProvider, LoggerViewer, useLogger, Logger } from 'react-logger-app';

// Example of usage inside a plain TypeScript class
class AnalyticsService {
    trackEvent(name: string) {
        Logger.debug(`[Analytics] Event tracked: ${name}`);
    }
}

const analytics = new AnalyticsService();

const LoggerTester = () => {
    const { debug, error, object, clear } = useLogger();

    useEffect(() => {
        // This log was failing to show up in v1.0.0
        debug('Start');
    }, [debug]);

    const handleTestLogs = () => {
        debug('Basic debug message');
        error(new Error('Sample error with stack trace'));
        object({ id: 123, status: 'active', meta: { source: 'demo' } }, 'Test Object');
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white' }}>
            <h1 style={{ color: '#a855f7' }}>ReactLoggerApp v1.1.0</h1>
            <p style={{ color: '#94a3b8' }}>
                Refined UI (50x50 Purple Button) | Mobile Full-screen | Class Support
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                    onClick={handleTestLogs}
                    style={{ padding: '10px 20px', cursor: 'pointer', background: 'linear-gradient(135deg, #7e22ce, #6b21a8)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
                >
                    Generate Test Logs
                </button>

                <button
                    onClick={() => analytics.trackEvent('ButtonClicked')}
                    style={{ padding: '10px 20px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }}
                >
                    Test Class-based Log
                </button>

                <button
                    onClick={clear}
                    style={{ padding: '10px 20px', cursor: 'pointer', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px' }}
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <LoggerProvider config={{ persistence: true }}>
            <main>
                <LoggerTester />
                <LoggerViewer />
            </main>
        </LoggerProvider>
    );
};

export default App;
