import { AsyncAction, ShowLoading, HideLoading } from './actionHelpers'


const isAsyncAction = (action: AsyncAction | any): action is AsyncAction => {
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
    //Fix: Actions must be plain objects.
    let merged = mergeObject(action);

    if (isAsyncAction(action)) {
        //First dispatch show loading action synchronously
        store.dispatch(new ShowLoading());

        //Change state immediately and register async operations
        var nextState = next(merged);

        //Lastly dispatch hide loading action asynchronously
        action.then(dispatch => {
            dispatch(new HideLoading());
        });

        //After original dispatch lifecycle, resolve dispatch in order to handle async operations
        setTimeout(() => {
            merged.resolve(store.dispatch);
        });

        return nextState;
    }

    return next(merged);
};
