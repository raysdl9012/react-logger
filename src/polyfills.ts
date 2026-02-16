/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Polyfills for older browsers and Android WebView compatibility
 */

// Polyfill for Object.hasOwn (ES2022)
// Required for Android WebView < Chrome 93
if (!Object.hasOwn) {
    Object.hasOwn = function (obj: object, prop: PropertyKey): boolean {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };
}

export { };
