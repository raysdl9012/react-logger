/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { LogEntry } from '../types';

interface LogItemProps {
    log: LogEntry;
}

export const LogItem: React.FC<LogItemProps> = ({ log }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toTimeString().split(' ')[0];
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        let textToCopy = log.message;

        if (log.data) {
            try {
                textToCopy = JSON.stringify(log.data, null, 2);
            } catch (err) {
                console.error('Failed to stringify log data for copy', err);
            }
        } else if (log.stack) {
            textToCopy = `${log.message}\n\nStack Trace:\n${log.stack}`;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const renderJson = (data: any) => {
        try {
            return (
                <pre className="liql-expandedContent">
                    {JSON.stringify(data, null, 2)}
                </pre>
            );
        } catch (e) {
            return <div>Error parsing object</div>;
        }
    };

    const getIcon = (level: string) => {
        switch (level) {
            case 'DEBUG': return '🐞';
            case 'ERROR': return '❌';
            case 'OBJECT': return '📦';
            default: return '📝';
        }
    };

    const levelClass = log.level.toLowerCase();

    return (
        <div
            className={`liql-logItem liql-logItem-${levelClass}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="liql-logMeta">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className={`liql-statusTag liql-tag-${levelClass}`}>
                        {getIcon(log.level)} {log.level}
                    </span>
                    <span className="liql-logTime">{formatTime(log.timestamp)}</span>
                </div>
                <button
                    className="liql-btnCopy"
                    onClick={handleCopy}
                    title="Copy to clipboard"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--liql-foreground)',
                        opacity: 0.6,
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                    }}
                >
                    {copied ? '✅' : '📋'}
                </button>
            </div>
            <div className="liql-logContent">
                {log.title && <strong style={{ color: 'var(--liql-primary)' }}>{log.title}: </strong>}
                {log.message}
            </div>

            {isExpanded && (
                <div className="liql-expandedContent">
                    {log.stack && (
                        <div style={{ color: 'var(--liql-error)', marginBottom: '8px' }}>
                            <strong>Stack Trace:</strong>
                            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '10px', marginTop: '4px' }}>{log.stack}</pre>
                        </div>
                    )}
                    {log.data && (
                        <div>
                            <strong>Payload:</strong>
                            {renderJson(log.data)}
                        </div>
                    )}
                    {!log.data && !log.stack && <div>Full message: {log.message}</div>}
                </div>
            )}
        </div>
    );
};
