import 'ts-helpers'


export type NullableDispatch = Redux.Dispatch<any> | void;

export abstract class SyncAction implements Redux.Action {
    type: string;
}

export abstract class AsyncAction extends SyncAction implements Promise<NullableDispatch>{

    private promise: Promise<Redux.Dispatch<any>>

    then(onfulfilled?: (value: Redux.Dispatch<any>) => NullableDispatch | PromiseLike<NullableDispatch>, onrejected?: (reason: any) => void): Promise<NullableDispatch> {
        return this.promise.then(onfulfilled, onrejected);
    }

    catch(onrejected?: (reason: any) => NullableDispatch | PromiseLike<NullableDispatch>): Promise<NullableDispatch> {
        return this.promise.catch(onrejected);
    }
}