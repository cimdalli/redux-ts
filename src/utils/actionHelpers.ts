//http://www.bluewire-technologies.com/2015/redux-actions-for-typescript/
export interface IAction<T extends Redux.Action> {
    prototype: T;
}

export abstract class SyncAction implements Redux.Action {
    type: string;
    constructor() {
        this.type = this.type;
    }
}

export type NullableDispatch = Redux.Dispatch<any> | void;

export abstract class AsyncAction extends SyncAction implements Promise<NullableDispatch> {
    resolve: (value?: Redux.Dispatch<any>) => void;
    reject: (reason?: any) => void;
    promise: Promise<Redux.Dispatch<any>> = new Promise<Redux.Dispatch<any>>((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
    });

    then(onfulfilled?: (value: Redux.Dispatch<any>) => NullableDispatch | PromiseLike<NullableDispatch>, onrejected?: (reason: any) => void): Promise<NullableDispatch> {
        return this.promise.then(onfulfilled, onrejected);
    }

    catch(onrejected?: (reason: any) => NullableDispatch | PromiseLike<NullableDispatch>): Promise<NullableDispatch> {
        return this.promise.catch(onrejected);
    }
}

export function Action<T extends SyncAction>(actionClass: IAction<T>) {
    actionClass.prototype.type = actionClass.toString().match(/\w+/g)[1];;
}


@Action
export class ShowLoading extends SyncAction { }


@Action
export class HideLoading extends SyncAction { }


const isAsyncAction = (action: AsyncAction | any): action is AsyncAction => {
    return (<AsyncAction>action).promise !== undefined;
}

export const typedToPlainMiddleware: Redux.Middleware =
    <S>(store: Redux.MiddlewareAPI<S>) => (next: Redux.Dispatch<S>): Redux.Dispatch<S> => (action: any) => {
        if (typeof action === "object") {
            action = _.merge({}, action);
        }
        return next(action);
    };

export const asyncMiddleware: Redux.Middleware =
    <S>(store: Redux.MiddlewareAPI<S>) => (next: Redux.Dispatch<S>): Redux.Dispatch<S> => (action: AsyncAction | Redux.Action) => {
        if (isAsyncAction(action)) {

            //First dispatch show loading action synchronously
            store.dispatch(new ShowLoading());

            //Change state immediately and register async operations
            var nextState = next(action);

            //Lastly dispatch hide loading action asynchronously
            action.then(dispatch => {
                dispatch(new HideLoading());
            });

            //After original dispatch lifecycle, resolve dispatch in order to handle async operations
            setTimeout(() => {
                action.resolve(store.dispatch);
            });

            return nextState;
        }

        return next(action);
    };