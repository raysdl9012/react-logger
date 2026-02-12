import React, { useEffect } from 'react';
import { LoggerProvider, LoggerViewer, useLogger } from 'ionic-react-logger';

const LoggerTester = () => {
    const { debug, error, object } = useLogger();

    useEffect(() => {
        debug('Logger initialized');
    }, []);

    const handleTestLogs = () => {
        debug('Basic debug message');
        error(new Error('Sample error with stack trace'));
        object({ id: 123, status: 'active', meta: { source: 'demo' } }, 'Test Object');
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#0f172a', minHeight: '100vh', color: 'white' }}>
            <h1>ionic-react-logger Demo</h1>
            <p style={{ color: '#94a3b8' }}>Click the buttons below to generate logs, then open the debugger using the bug icon in the bottom-right.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleTestLogs}
                    style={{ padding: '10px 20px', cursor: 'pointer', background: 'linear-gradient(135deg, #3498db, #2980b9)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
                >
                    Generate Test Logs
                </button>
                <button
                    onClick={() => debug(`Log added at ${new Date().toLocaleTimeString()}`)}
                    style={{ padding: '10px 20px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }}
                >
                    Add Debug Log
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
