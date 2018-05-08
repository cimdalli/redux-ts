import {
  Middleware,
  DeepPartial,
  StoreEnhancer,
  Store,
  Dispatch,
  ReducersMapObject,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Reducer,
} from 'redux'
import { ReducerBuilder, SyncAction } from '.'

const devTool: StoreEnhancer = f =>
  (window as any).__REDUX_DEVTOOLS_EXTENSION__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION__
    : f

const plainObjMiddleware: Middleware = store => next => action => {
  action.type = action.type || action.constructor.name
  const plain: any = {}
  for (const key in action) {
    plain[key] = action[key]
  }
  return next(plain)
}

export interface ReducerBuilderMap {
  [key: string]: ReducerBuilder
}

export class StoreBuilder<StoreType extends { [key: string]: any }> {
  private middlewares: Middleware[]
  private reducers: ReducersMapObject<StoreType>
  private reducerBuilders: ReducerBuilderMap
  private initialState: DeepPartial<StoreType>
  private enhancer: StoreEnhancer

  constructor() {
    this.middlewares = [plainObjMiddleware]
    this.reducers = {} as ReducersMapObject<StoreType>
    this.reducerBuilders = {}
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

  public withReducerBuilder(name: string, reducerBuilder: ReducerBuilder) {
    this.reducerBuilders[name] = reducerBuilder
    return this
  }

  public withReducersMap(reducers: ReducersMapObject) {
    this.reducers = {
      ...(this.reducers as any),
      ...reducers,
    }
    return this
  }

  public withReducerBuildersMap(reducerBuilders: ReducerBuilderMap) {
    this.reducerBuilders = {
      ...this.reducerBuilders,
      ...reducerBuilders,
    }
    return this
  }

  public withEnhancer(enhancer: StoreEnhancer) {
    const preEnhancer = this.enhancer
    this.enhancer = f => enhancer(preEnhancer(f))
    return this
  }

  public withDevTools() {
    this.withEnhancer(devTool)
    return this
  }

  public build(): Store<StoreType> {
    const defer = Promise.defer<Dispatch<SyncAction>>()
    const reducerMap = Object.keys(this.reducerBuilders).reduce(
      (p: any, r) => ({
        ...p,
        [r]: (this.reducerBuilders[r] as any).build(defer.promise),
      }),
      this.reducers,
    )
    const middlewares = applyMiddleware(...this.middlewares)
    const reducers = combineReducers<StoreType>(reducerMap)
    const composer = compose(middlewares, this.enhancer)(createStore)
    const store = composer(reducers, this.initialState)

    defer.resolve(store.dispatch)

    return store
  }
}
