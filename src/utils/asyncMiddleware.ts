import { Action, MiddlewareAPI, Dispatch } from 'redux'
import { SyncAction, AsyncAction } from './actionHelpers'


const isSyncAction = (action: Action): action is any => {
    return action instanceof SyncAction;
}

const isAsyncAction = (action: Action): action is any => {
    return action instanceof AsyncAction;
}

const mergeObject = (action: any): any => {
    let merged: any = {};
    for (var key in action) {
        if (key !== 'constructor') {
            merged[key] = (<any>action)[key];
        }
    }
    return merged;
}

export const asyncMiddleware = <S>(store: MiddlewareAPI<S>) => (next: Dispatch<S>): Dispatch<S> => (action: Action) => {
    if (isSyncAction(action)) {
        action.type = (<any>action).constructor.name;

        if (isAsyncAction(action)) {
            (<any>action).promise = new Promise<Dispatch<any>>((resolve, reject) => {
                //After original dispatch lifecycle, resolve dispatch in order to handle async operations
                setTimeout(() => {
                    resolve(store.dispatch);
                });
            });
        }

        //Fix: Actions must be plain objects.
        let merged = mergeObject(action);

        //Change state immediately and register async operations
        return next(merged);
    }

    return next(action);
};
