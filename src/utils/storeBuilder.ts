import * as _ from 'lodash'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { typedToPlainMiddleware, asyncMiddleware } from '../utils/actionHelpers'


export class StoreBuilder<StoreType> {

    private middlewares: Redux.Middleware[];
    private reducers: Redux.ReducersMapObject;
    private initialState: StoreType;
    private enhancer: Redux.GenericStoreEnhancer;

    constructor() {
        this.middlewares = [typedToPlainMiddleware, asyncMiddleware];
        this.reducers = {};
        this.initialState = {} as StoreType;
        this.enhancer = (f: Redux.StoreCreator) => f;
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

    public withEnhancer(enhancer: Redux.GenericStoreEnhancer) {
        var preEnhancer = this.enhancer;
        this.enhancer = (f: Redux.StoreCreator) => enhancer(preEnhancer(f));
        return this;
    }


    public build() {

        let middlewares = applyMiddleware(...this.middlewares);
        let reducers = combineReducers(this.reducers);
        let composer = compose(middlewares, this.enhancer)(createStore);
        let store = composer(reducers, this.initialState);

        return store as Redux.Store<StoreType>;
    }
}