/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { LogEntry, StorageDriver } from '../types';

export class LocalStorageDriver implements StorageDriver {
    private key: string;

    constructor(key: string = 'ionic_react_logger_logs') {
        this.key = key;
    }

    async save(logs: LogEntry[]): Promise<void> {
        try {
            localStorage.setItem(this.key, JSON.stringify(logs));
        } catch (e) {
            console.error('Failed to save logs to localStorage', e);
        }
    }

    async load(): Promise<LogEntry[]> {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to load logs from localStorage', e);
            return [];
        }
    }

    async clear(): Promise<void> {
        localStorage.removeItem(this.key);
    }
}
