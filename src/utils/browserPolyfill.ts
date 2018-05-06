/**
 * Hack in support for Function.name for browsers that don't support it.
 * https://stackoverflow.com/questions/25140723/constructor-name-is-undefined-in-internet-explorer
 **/
if (
  Function.prototype.name === undefined &&
  Object.defineProperty !== undefined
) {
  Object.defineProperty(Function.prototype, 'name', {
    get() {
      const funcNameRegex = /function\s([^(]{1,})\(/
      const results = funcNameRegex.exec(this.toString())
      return results && results.length > 1 ? results[1].trim() : ''
    },
    set(value) {},
  })
}

/*
 * Polyfill for Object.assign
 * https://github.com/Microsoft/TypeScript/issues/3429#issuecomment-173213973
 */
if (typeof Object.assign !== 'function') {
  Object.assign = function (target: any) {
    'use strict'
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object')
    }

    const obj = Object(target)
    for (const key in arguments) {
      const source = arguments[key]
      if (source != null) {
        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            obj[key] = source[key]
          }
        }
      }
    }
    return obj
  }
}
