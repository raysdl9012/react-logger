/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getStorageDriver } from '../storage';
import { LocalStorageDriver } from '../storage/localStorageDriver';
import { IndexedDBDriver } from '../storage/indexedDBDriver';

// Mock idb
jest.mock('idb', () => {
    const store = new Map();
    return {
        openDB: jest.fn().mockResolvedValue({
            transaction: jest.fn().mockReturnValue({
                objectStore: jest.fn().mockReturnValue({
                    clear: jest.fn().mockImplementation(() => {
                        store.clear();
                        return Promise.resolve();
                    }),
                    put: jest.fn().mockImplementation((val) => {
                        store.set(val.id, val);
                        return Promise.resolve();
                    }),
                }),
                done: Promise.resolve(),
            }),
            getAll: jest.fn().mockImplementation(() => {
                return Promise.resolve(Array.from(store.values()));
            }),
        }),
    };
});

describe('Storage Drivers', () => {
    describe('getStorageDriver', () => {
        it('should return LocalStorageDriver for localStorage', () => {
            const driver = getStorageDriver('localStorage');
            expect(driver).toBeInstanceOf(LocalStorageDriver);
        });

        it('should return IndexedDBDriver for indexedDB', () => {
            const driver = getStorageDriver('indexedDB');
            expect(driver).toBeInstanceOf(IndexedDBDriver);
        });

        it('should default to LocalStorageDriver for invalid driver', () => {
            const driver = getStorageDriver('invalid' as any);
            expect(driver).toBeInstanceOf(LocalStorageDriver);
        });
    });

    describe('LocalStorageDriver', () => {
        let driver: LocalStorageDriver;

        beforeEach(() => {
            driver = new LocalStorageDriver('test-key');
            localStorage.clear();
        });

        it('should save logs to localStorage', async () => {
            const logs = [
                {
                    id: '1',
                    timestamp: new Date().toISOString(),
                    level: 'DEBUG' as const,
                    message: 'Test log'
                }
            ];

            await driver.save(logs);

            const saved = localStorage.getItem('test-key');
            expect(saved).toBeTruthy();
            expect(JSON.parse(saved!)).toEqual(logs);
        });

        it('should load logs from localStorage', async () => {
            const logs = [
                {
                    id: '1',
                    timestamp: new Date().toISOString(),
                    level: 'DEBUG' as const,
                    message: 'Test log'
                }
            ];

            localStorage.setItem('test-key', JSON.stringify(logs));

            const loaded = await driver.load();
            expect(loaded).toEqual(logs);
        });

        it('should return empty array if no logs exist', async () => {
            const loaded = await driver.load();
            expect(loaded).toEqual([]);
        });

        it('should handle corrupted localStorage data', async () => {
            localStorage.setItem('test-key', 'invalid json');

            const loaded = await driver.load();
            expect(loaded).toEqual([]);
        });

        it('should clear logs from localStorage', async () => {
            const logs = [
                {
                    id: '1',
                    timestamp: new Date().toISOString(),
                    level: 'DEBUG' as const,
                    message: 'Test log'
                }
            ];

            await driver.save(logs);
            await driver.clear();

            const saved = localStorage.getItem('test-key');
            expect(saved).toBeNull();
        });
    });

    describe('IndexedDBDriver', () => {
        let driver: IndexedDBDriver;

        beforeEach(() => {
            driver = new IndexedDBDriver();
        });

        it('should save and load logs from IndexedDB', async () => {
            const logs = [
                {
                    id: '1',
                    timestamp: new Date().toISOString(),
                    level: 'DEBUG' as const,
                    message: 'Test log'
                },
                {
                    id: '2',
                    timestamp: new Date().toISOString(),
                    level: 'ERROR' as const,
                    message: 'Error log'
                }
            ];

            await driver.save(logs);
            const loaded = await driver.load();

            expect(loaded).toHaveLength(2);
            // Result order depends on keyPath alphabetically? Actually save uses put.
            // IDB getAll usually returns in key order or insertion order for default indices.
            expect(loaded.find(l => l.id === '1')?.message).toBe('Test log');
            expect(loaded.find(l => l.id === '2')?.message).toBe('Error log');
        });

        it('should clear logs from IndexedDB', async () => {
            const logs = [
                {
                    id: '1',
                    timestamp: new Date().toISOString(),
                    level: 'DEBUG' as const,
                    message: 'Test log'
                }
            ];

            await driver.save(logs);
            await driver.clear();

            const loaded = await driver.load();
            expect(loaded).toEqual([]);
        });

        it('should return empty array if database is empty', async () => {
            await driver.clear();
            const loaded = await driver.load();
            expect(loaded).toEqual([]);
        });
    });
});
