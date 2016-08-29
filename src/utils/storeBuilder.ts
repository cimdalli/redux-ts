import * as _ from 'lodash'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { typedToPlainMiddleware, asyncMiddleware } from '../utils/actionHelpers'


export class StoreBuilder<StoreType> {

    private middlewares: Redux.Middleware[];
    private reducers: Redux.ReducersMapObject;
    private initialState: StoreType;
    private enhancer: (...arg: any[]) => any;

    constructor() {
        this.middlewares = [typedToPlainMiddleware, asyncMiddleware];
        this.reducers = {};
        this.initialState = {} as StoreType;
        this.enhancer = f => f;
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

    public withComposeEnhancer(enhancer: (a: any) => any) {
        var innerEnhancer = this.enhancer;
        this.enhancer = enhancer(innerEnhancer);
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