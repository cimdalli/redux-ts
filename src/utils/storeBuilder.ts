import { combineReducers, createStore, applyMiddleware, compose, Middleware, ReducersMapObject, GenericStoreEnhancer, StoreCreator, Reducer, Store } from 'redux';
import { asyncMiddleware } from '../utils/asyncMiddleware'


export class StoreBuilder<StoreType> {

    private middlewares: Middleware[];
    private reducers: ReducersMapObject;
    private initialState: StoreType;
    private enhancer: GenericStoreEnhancer;

    constructor() {
        this.middlewares = [asyncMiddleware];
        this.reducers = {};
        this.initialState = {} as StoreType;
        this.enhancer = (f: StoreCreator) => f;
    }

    public withMiddleware(middleware: Middleware) {
        this.middlewares.push(middleware);
        return this;
    }

    public withInitialState(state: StoreType) {
        this.initialState = state;
        return this;
    }

    public withReducer<S>(name: string, reducer: Reducer<S>) {
        this.reducers[name] = reducer;
        return this;
    }

    public withReducersMap(reducers: ReducersMapObject) {
        for (let reducer in reducers) {
            this.reducers[reducer] = reducers[reducer];
        }
        return this;
    }

    public withEnhancer(enhancer: GenericStoreEnhancer) {
        let preEnhancer = this.enhancer;
        this.enhancer = (f: StoreCreator) => enhancer(preEnhancer(f));
        return this;
    }


    public build() {
        let middlewares = applyMiddleware(...this.middlewares);
        let reducers = combineReducers(this.reducers);
        let composer = compose(middlewares, this.enhancer)(createStore);
        let store = composer(reducers, this.initialState);

        return store as Store<StoreType>;
    }
}