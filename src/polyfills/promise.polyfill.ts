interface PromiseConstructor {
  defer<T>(): {
    resolve: (value?: T | PromiseLike<T>) => void
    reject: (reason?: any) => void
    promise: Promise<T>,
  }
}

Promise['defer'] = function deferPolyfill() {
  const deferred = {} as any
  const promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  deferred.promise = promise
  return deferred
}
