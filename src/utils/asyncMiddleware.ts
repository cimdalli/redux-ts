import { AsyncAction, ShowLoading, HideLoading } from './actionHelpers'


const isAsyncAction = (action: AsyncAction | any): action is AsyncAction => {
    return action.resolve !== undefined && typeof action.resolve === "function";
}

export const asyncMiddleware = <S>(store: Redux.MiddlewareAPI<S>) => (next: Redux.Dispatch<S>): Redux.Dispatch<S> => (action: Redux.Action) => {
    //Fix: Actions must be plain objects.
    action = _.merge({}, action);

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
            (<any>action).resolve(store.dispatch);
        });
        return nextState;
    }
    return next(action);
};
