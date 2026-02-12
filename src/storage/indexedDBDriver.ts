import { openDB, IDBPDatabase } from 'idb';
import { LogEntry, StorageDriver } from '../types';

const DB_NAME = 'IonicReactLoggerDB';
const STORE_NAME = 'logs';
const DB_VERSION = 1;

export class IndexedDBDriver implements StorageDriver {
    private dbPromise: Promise<IDBPDatabase>;

    constructor() {
        this.dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                }
            },
        });
    }

    async save(logs: LogEntry[]): Promise<void> {
        const db = await this.dbPromise;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        // Clear existing logs first or manage them as needed
        // Simple implementation: clear and re-save everything to match the expected behavior of StorageDriver
        await store.clear();
        for (const log of logs) {
            await store.put(log);
        }
        await tx.done;
    }

    async load(): Promise<LogEntry[]> {
        const db = await this.dbPromise;
        return db.getAll(STORE_NAME);
    }

    async clear(): Promise<void> {
        const db = await this.dbPromise;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        await tx.objectStore(STORE_NAME).clear();
        await tx.done;
    }
}
