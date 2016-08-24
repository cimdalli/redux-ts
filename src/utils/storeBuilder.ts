import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import * as _ from 'lodash'


declare var window: any;

export class StoreBuilder<StoreType> {

    private middlewares: Redux.Middleware[];
    private reducers: Redux.ReducersMapObject;
    private initialState: StoreType;

    constructor() {
        this.middlewares = [];
        this.reducers = {};
        this.initialState = {} as StoreType;
    }

    public withMiddleware(middleware: Redux.Middleware) {
        this.middlewares.push(middleware);
        return this;
    }

    public withInitialState(state: StoreType) {
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
    

    public build() {
        
        let middlewares = applyMiddleware(...this.middlewares);
        let reducers = combineReducers(this.reducers);
        let composer = compose(middlewares, (window && window.devToolsExtension) ? window.devToolsExtension() : f => f)(createStore);
        let store = composer(reducers, this.initialState);

        return store as Redux.Store<StoreType>;
    }
}