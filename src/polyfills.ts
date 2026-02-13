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
