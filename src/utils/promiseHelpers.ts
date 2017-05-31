interface Promise<T> {
    finally<TResult>(onfulfilled?: (value?: T, isSuccess?: boolean) => TResult | PromiseLike<TResult>): Promise<TResult>
}

Promise.prototype['finally'] = function finallyPolyfill<TResult>(callback: (value?: any, isSuccess?: boolean) => TResult | PromiseLike<TResult>) {
    var constructor = this.constructor

    return this.then(function (value: any) {
        return constructor.resolve(callback(value, true)).then(function () {
            return value
        })
    }, function (reason: any) {
        return constructor.resolve(callback(reason, false)).then(function () {
            throw reason
        })
    })
}