import 'ts-helpers'


//http://www.bluewire-technologies.com/2015/redux-actions-for-typescript/
export interface IAction<T extends Redux.Action> {
    prototype: T;
}

export function Action<T extends SyncAction>(actionClass: IAction<T>) {
    actionClass.prototype.type = actionClass.toString().match(/\w+/g)[1];;
}

export abstract class SyncAction implements Redux.Action {
    type: string;
    constructor() {
        this.type = this.type;
    }
}

export type NullableDispatch = Redux.Dispatch<any> | void;

export abstract class AsyncAction extends SyncAction implements Promise<NullableDispatch> {
    private resolve: (value?: Redux.Dispatch<any>) => void;
    private promise: Promise<Redux.Dispatch<any>> = new Promise<Redux.Dispatch<any>>((resolve, reject) => {
        this.resolve = resolve;
    });

    then(onfulfilled?: (value: Redux.Dispatch<any>) => NullableDispatch | PromiseLike<NullableDispatch>, onrejected?: (reason: any) => void): Promise<NullableDispatch> {
        return this.promise.then(onfulfilled, onrejected);
    }

    catch(onrejected?: (reason: any) => NullableDispatch | PromiseLike<NullableDispatch>): Promise<NullableDispatch> {
        return this.promise.catch(onrejected);
    }
}

@Action
export class ShowLoading extends SyncAction { }

@Action
export class HideLoading extends SyncAction { }