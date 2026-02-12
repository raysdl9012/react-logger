import React, { useState } from 'react';
import { LogEntry } from '../types';

interface LogItemProps {
    log: LogEntry;
}

export const LogItem: React.FC<LogItemProps> = ({ log }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toTimeString().split(' ')[0];
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
                <span className={`liql-statusTag liql-tag-${levelClass}`}>
                    {getIcon(log.level)} {log.level}
                </span>
                <span className="liql-logTime">{formatTime(log.timestamp)}</span>
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
