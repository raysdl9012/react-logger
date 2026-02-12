import { StorageDriver, LogEntry } from '../types';
import { LocalStorageDriver } from './localStorageDriver';
import { IndexedDBDriver } from './indexedDBDriver';

export function getStorageDriver(type: 'localStorage' | 'indexedDB'): StorageDriver {
    if (type === 'indexedDB') {
        return new IndexedDBDriver();
    }
    return new LocalStorageDriver();
}

export * from './localStorageDriver';
export * from './indexedDBDriver';
