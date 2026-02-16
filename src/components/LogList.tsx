/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import { LogItem } from './LogItem';
import { LogEntry } from '../types';

interface LogListProps {
    logs: LogEntry[];
    filter: string;
    search: string;
}

export const LogList: React.FC<LogListProps> = ({ logs, filter, search }) => {
    const filteredLogs = React.useMemo(() => {
        return logs.filter(log => {
            const matchesFilter = filter === 'ALL' || log.level === filter;
            const matchesSearch = search === '' ||
                log.message.toLowerCase().includes(search.toLowerCase()) ||
                (log.title || '').toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        }).reverse();
    }, [logs, filter, search]);

    return (
        <div className="liql-logListContainer">
            <Virtuoso
                style={{ height: '100%' }}
                data={filteredLogs}
                itemContent={(_index: number, log: LogEntry) => <LogItem key={log.id} log={log} />}
            />
        </div>
    );
};
