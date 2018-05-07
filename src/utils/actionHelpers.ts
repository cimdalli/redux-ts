import './promiseHelpers'
import { Dispatch, Action } from 'redux'

export abstract class SyncAction implements Action<string> {
  type: string
}

export abstract class AsyncAction extends SyncAction
  implements Promise<Dispatch> {
  private resolve: (value?: Dispatch<any> | PromiseLike<Dispatch<any>>) => void
  private promise: Promise<Dispatch<any>> = new Promise<Dispatch<any>>(
    (resolve, reject) => {
      this.resolve = resolve
    },
  )

  then<TResult1 = Dispatch, TResult2 = never>(
    onfulfilled?: (value: Dispatch) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>,
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected)
  }

  catch<TResult = never>(
    onrejected?: (reason: any) => TResult | PromiseLike<TResult>,
  ): Promise<Dispatch | TResult> {
    return this.promise.catch(onrejected)
  }

  finally<TResult>(
    onfulfilled?: (
      value?: Dispatch,
      isSuccess?: boolean,
    ) => TResult | PromiseLike<TResult>,
  ): Promise<TResult> {
    return this.promise.finally(onfulfilled)
  }
}
