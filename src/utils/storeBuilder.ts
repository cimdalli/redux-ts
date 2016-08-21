import { combineReducers, createStore, applyMiddleware, compose } from 'redux';

export class StoreBuilder {

    private middlewares: Redux.Middleware[];
    private reducers: Redux.ReducersMapObject;
    private initialState: any;

    constructor() {
        this.middlewares = [];
        this.reducers = {};
        this.initialState = {};
    }

    public withMiddleware(middleware: Redux.Middleware) {
        this.middlewares.push(middleware);
        return this;
    }

    public withInitialState<S>(state: S) {
        this.initialState = state;
        return this;
    }

    public withReducer<S>(name: string, reducer: Redux.Reducer<S>) {
        this.reducers[name] = reducer;
        return this;
    }

    public withReducersMap(reducers: Redux.ReducersMapObject) {
        this.reducers = _.merge({}, this.reducers, reducers);
        return this;
    }

    public build<T>() {
        let middlewares = applyMiddleware(...this.middlewares);
        let reducers = combineReducers(this.reducers);
        let composer = compose(middlewares, (<any>window).devToolsExtension ? (<any>window).devToolsExtension() : f => f)(createStore);
        let store = composer(reducers, this.initialState);

        return store as Redux.Store<T>;
    }
}