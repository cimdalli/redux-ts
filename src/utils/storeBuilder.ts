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

export class StoreBuilder<StoreType extends { [key: string]: any }> {
  private middlewares: Middleware[]
  private reducers: ReducersMapObject<StoreType>
  private initialState: DeepPartial<StoreType>
  private enhancer: StoreEnhancer

  constructor() {
    this.middlewares = [asyncMiddleware]
    this.reducers = {} as StoreType
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

  public withReducer(name: string, reducer: Reducer) {
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
    const preEnhancer = this.enhancer
    this.enhancer = f => enhancer(preEnhancer(f))
    return this
  }

  public withDevTools() {
    this.withEnhancer(
      f =>
        (window as any).__REDUX_DEVTOOLS_EXTENSION__
          ? (window as any).__REDUX_DEVTOOLS_EXTENSION__
          : f,
    )
    return this
  }

  public build(): Store<StoreType> {
    const middlewares = applyMiddleware(...this.middlewares)
    const reducers = combineReducers<StoreType>(this.reducers)
    const composer = compose(middlewares, this.enhancer)(createStore)
    const store = composer(reducers, this.initialState)

    return store
  }
}
