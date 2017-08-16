/**
 * Hack in support for Function.name for browsers that don't support it.
 * https://stackoverflow.com/questions/25140723/constructor-name-is-undefined-in-internet-explorer
**/
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function () {
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = (funcNameRegex).exec((this).toString());
            return (results && results.length > 1) ? results[1].trim() : "";
        },
        set: function (value) { }
    });
}

/*
 * Polyfill for Object.assign
 * https://github.com/Microsoft/TypeScript/issues/3429#issuecomment-173213973
 */
if (typeof Object.assign != 'function') {
    Object.assign = function (target: any) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}