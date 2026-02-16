/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
