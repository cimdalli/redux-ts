interface Promise<T> {
  finally<TResult>(
    onfulfilled?: (
      value?: T,
      isSuccess?: boolean,
    ) => TResult | PromiseLike<TResult>,
  ): Promise<TResult>
}

Promise.prototype['finally'] = function finallyPolyfill<TResult>(
  callback: (value?: any, isSuccess?: boolean) => TResult | PromiseLike<TResult>,
) {
  return (this as Promise<TResult>).then(
    value => Promise.resolve(callback(value, true)).then(() => value),
    reason =>
      Promise.resolve(callback(reason, false)).then(() => {
        throw reason
      }),
  )
}
