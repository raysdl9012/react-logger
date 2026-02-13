import React, { useState } from 'react';
import { useLoggerContext } from '../context/LoggerContext';
import { LogList } from './LogList';

/**
 * Main 'Liquid Glass' logging console.
 * Contains the log list, filtering, search, and action controls.
 */
export const LogPanel: React.FC = () => {
    const { state, setIsPanelOpen, dispatch } = useLoggerContext();
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    const clearLogs = () => {
        if (confirm('Are you sure you want to clear all logs?')) {
            dispatch({ type: 'CLEAR_LOGS' });
        }
    };

    const exportLogs = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.logs, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `logs_${new Date().getTime()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    if (!state) return null;

    return (
        <div className="liql-panel">
            <div className="liql-panelHeader">
                <div className="liql-titleGroup">
                    <span className="liql-title">ReactLoggerApp console [{state.logs.length}]</span>
                </div>
                <div className="liql-controls">
                    <button className="liql-btnAction" onClick={exportLogs} title="Export JSON">📥</button>
                    <button className="liql-btnAction" onClick={clearLogs} title="Clear Logs">🗑️</button>
                    <button className="liql-btnAction" onClick={() => setIsPanelOpen(false)} title="Minimize">➖</button>
                </div>
            </div>

            <div className="liql-filterBar">
                <input
                    type="text"
                    placeholder="Search entries..."
                    className="liql-searchInput"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="liql-selectFilter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="ALL">ALL</option>
                    <option value="DEBUG">DEBUG</option>
                    <option value="ERROR">ERROR</option>
                    <option value="OBJECT">OBJECTS</option>
                </select>
            </div>

            <LogList logs={state.logs} filter={filter} search={search} />

            <div className="liql-footerActions">
                <div className="liql-storageInfo">
                    {state.config.persistence ? `DRIVER: ${state.config.persistenceDriver?.toUpperCase()}` : 'SESSION MODE'}
                </div>
                <button className="liql-btnClose" onClick={() => setIsPanelOpen(false)}>CLOSE CONSOLE</button>
            </div>
        </div>
    );
};
