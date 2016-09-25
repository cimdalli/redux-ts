import { SyncAction, AsyncAction } from './actionHelpers'


const isSyncAction = (action: Redux.Action): action is any => {
    return action instanceof SyncAction;
}

const isAsyncAction = (action: Redux.Action): action is any => {
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

export const asyncMiddleware = <S>(store: Redux.MiddlewareAPI<S>) => (next: Redux.Dispatch<S>): Redux.Dispatch<S> => (action: Redux.Action) => {
    if (isSyncAction(action)) {
        action.type = action.constructor.name;

        if (isAsyncAction(action)) {
            action.promise = new Promise<Redux.Dispatch<any>>((resolve, reject) => {
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
