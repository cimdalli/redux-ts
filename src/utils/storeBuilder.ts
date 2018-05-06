import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  DeepPartial,
  Middleware,
  Reducer,
  ReducersMapObject,
  Store,
  StoreEnhancer,
} from 'redux'
import { asyncMiddleware } from './asyncMiddleware'
import './browserPolyfill'

const devTools: StoreEnhancer = f =>
  (window as any).__REDUX_DEVTOOLS_EXTENSION__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION__
    : f

export class StoreBuilder<StoreType> {
  private middlewares: Middleware[]
  private reducers: ReducersMapObject
  private initialState: DeepPartial<StoreType>
  private enhancer: StoreEnhancer

  constructor() {
    this.middlewares = []
    this.reducers = {}
    this.initialState = {}
    this.enhancer = f => f
  }

  public withMiddleware(middleware: Middleware) {
    this.middlewares.push(middleware)
    return this
  }

  public withInitialState(state: DeepPartial<StoreType>) {
    this.initialState = state
    return this
  }

  public withReducer<K = keyof StoreType>(name: K, reducer: Reducer) {
    this.reducers[name] = reducer
    return this
  }

  public withReducersMap(reducers: ReducersMapObject) {
    for (const reducer in reducers) {
      this.reducers[reducer] = reducers[reducer]
    }
    return this
  }

  public withEnhancer(enhancer: StoreEnhancer) {
    this.enhancer = f => enhancer(this.enhancer(f))
    return this
  }

  public withDevTools() {
    this.withEnhancer(devTools)
    return this
  }

  public build(): Store<StoreType> {
    const middlewares = applyMiddleware(...this.middlewares, asyncMiddleware)
    const reducers = combineReducers<StoreType>(this.reducers)
    const composer = compose(middlewares, this.enhancer)(createStore)
    const store = composer(reducers, this.initialState)

    return store
  }
}
