import "./promiseHelpers"
import { Dispatch, Action } from 'redux'

export type NullableDispatch = Dispatch<any> | void

export abstract class SyncAction implements Action {
    type: string
}

export abstract class AsyncAction extends SyncAction implements Promise<NullableDispatch>{
    private resolve: (value?: Dispatch<any> | PromiseLike<Dispatch<any>>) => void
    private promise: Promise<Dispatch<any>> = new Promise<Dispatch<any>>((resolve, reject) => {
        this.resolve = resolve
    })

    then(onfulfilled?: (value: Dispatch<any>) => NullableDispatch | PromiseLike<NullableDispatch>, onrejected?: (reason: any) => void): Promise<NullableDispatch> {
        return this.promise.then(onfulfilled, onrejected)
    }

    catch(onrejected?: (reason: any) => NullableDispatch | PromiseLike<NullableDispatch>): Promise<NullableDispatch> {
        return this.promise.catch(onrejected)
    }

    finally(onfulfilled?: (value?: NullableDispatch, isSuccess?: boolean) => any | PromiseLike<NullableDispatch>): Promise<NullableDispatch> {
        return this.promise.finally(onfulfilled)
    }
}
