/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import '../polyfills';

describe('Polyfills', () => {
    describe('Object.hasOwn', () => {
        beforeEach(() => {
            jest.resetModules();
        });

        it('should be defined', () => {
            require('../polyfills');
            expect(Object.hasOwn).toBeDefined();
            expect(typeof Object.hasOwn).toBe('function');
        });

        it('should not overwrite if already defined', () => {
            const mock = jest.fn();
            const original = Object.hasOwn;

            // @ts-ignore
            Object.hasOwn = mock;

            require('../polyfills');

            expect(Object.hasOwn).toBe(mock);

            // Restore
            Object.hasOwn = original;
        });

        it('should return true for own properties', () => {
            const obj = { foo: 'bar' };
            expect(Object.hasOwn(obj, 'foo')).toBe(true);
        });

        it('should return false for inherited properties', () => {
            const obj = Object.create({ inherited: 'value' });
            expect(Object.hasOwn(obj, 'inherited')).toBe(false);
        });

        it('should return false for non-existent properties', () => {
            const obj = { foo: 'bar' };
            expect(Object.hasOwn(obj, 'nonExistent')).toBe(false);
        });

        it('should work with symbol properties', () => {
            const sym = Symbol('test');
            const obj = { [sym]: 'value' };
            expect(Object.hasOwn(obj, sym)).toBe(true);
        });

        it('should work with null prototype objects', () => {
            const obj = Object.create(null);
            obj.prop = 'value';
            expect(Object.hasOwn(obj, 'prop')).toBe(true);
        });
    });
});
