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
import { ReducerBuilder } from '.'

const devTool: StoreEnhancer = f =>
  (window as any).__REDUX_DEVTOOLS_EXTENSION__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION__
    : f

const plainObjMiddleware: Middleware = store => next => action => {
  action.type = action.type || action.constructor.type
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
  private reducers: ReducersMapObject<StoreType, any>
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

  /**
   * Register given middlewares.
   *
   * _Execution order will be same as registration order._
   *
   * @param {Middleware} middleware
   * @returns
   * @memberof StoreBuilder
   */
  public withMiddleware(...middleware: Middleware[]) {
    this.middlewares.push(...middleware)
    return this
  }

  /**
   * Initial value of store state
   *
   * @param {DeepPartial<StoreType>} state
   * @returns
   * @memberof StoreBuilder
   */
  public withInitialState(state: DeepPartial<StoreType>) {
    this.initialState = state
    return this
  }

  /**
   * Register pure redux reducer with given name
   *
   * @param {string} name Name of the reducer. _(should be same as store field name)_
   * @param {Reducer} reducer Reducer instance
   * @returns
   * @memberof StoreBuilder
   */
  public withReducer(name: string, reducer: Reducer) {
    this.reducers[name] = reducer
    return this
  }

  /**
   * Register *ReducerBuilder* instance
   *
   * @param {string} name Name of the reducer. _(should be same as store field name)_
   * @param {ReducerBuilder} reducerBuilder ReducerBuilder instance
   * @returns
   * @memberof StoreBuilder
   */
  public withReducerBuilder(name: string, reducerBuilder: ReducerBuilder) {
    this.reducerBuilders[name] = reducerBuilder
    return this
  }

  /**
   * Register list of pure reducer functions with given name
   *
   * @param {ReducersMapObject} reducers List of reducers
   * @returns
   * @memberof StoreBuilder
   */
  public withReducersMap(reducers: ReducersMapObject) {
    this.reducers = {
      ...(this.reducers as any),
      ...reducers,
    }
    return this
  }

  /**
   * Register list of ReducerBuilder objects with given name
   *
   * @param {ReducerBuilderMap} reducerBuilders List of ReducerBuilder objects
   * @returns
   * @memberof StoreBuilder
   */
  public withReducerBuildersMap(reducerBuilders: ReducerBuilderMap) {
    this.reducerBuilders = {
      ...this.reducerBuilders,
      ...reducerBuilders,
    }
    return this
  }

  /**
   * Register given enhancer
   *
   * _Execution order will be same as registration order._
   *
   * @param {StoreEnhancer} enhancer
   * @returns
   * @memberof StoreBuilder
   */
  public withEnhancer(enhancer: StoreEnhancer) {
    const preEnhancer = this.enhancer
    this.enhancer = f => enhancer(preEnhancer(f))
    return this
  }

  /**
   * Enable chrome devtools
   *
   * @returns
   * @memberof StoreBuilder
   */
  public withDevTools() {
    this.withEnhancer(devTool)
    return this
  }

  /**
   * Build an instance of store with configured values.
   *
   * @returns {Store<StoreType>}
   * @memberof StoreBuilder
   */
  public build(): Store<StoreType, any> {
    const defer = Promise.defer<Dispatch<any>>()
    const reducerMap = Object.keys(this.reducerBuilders).reduce(
      (p: any, r) => ({
        ...p,
        [r]: (this.reducerBuilders[r] as any).build(defer.promise),
      }),
      this.reducers,
    )
    const middlewares = applyMiddleware(...this.middlewares)
    const reducers = combineReducers<StoreType, any>(reducerMap)
    const composer = compose(middlewares, this.enhancer)(createStore)
    const store = composer(reducers, this.initialState)

    defer.resolve(store.dispatch)

    return store
  }
}
