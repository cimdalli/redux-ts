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
