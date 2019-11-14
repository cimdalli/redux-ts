import { connect } from 'react-redux'
import {
    applyMiddleware, combineReducers, compose, createStore, DeepPartial, Dispatch, Middleware,
    Reducer, ReducersMapObject, StoreEnhancer
} from 'redux'

import { Action, ReducerBuilder, StateToProps, Store } from './'

const devTool: StoreEnhancer = f =>
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ || f

type StoreState = { [key: string]: any }
type ReducerBuilderMap<S> = { [key in keyof S]: ReducerBuilder }

export class StoreBuilder<S extends StoreState> {
  private middlewares: Middleware[]
  private reducers: ReducersMapObject<S>
  private reducerBuilders: ReducerBuilderMap<S>
  private initialState: DeepPartial<S>
  private enhancer: StoreEnhancer

  constructor() {
    this.middlewares = []
    this.reducers = {} as ReducersMapObject<S>
    this.reducerBuilders = {} as ReducerBuilderMap<S>
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
  public withInitialState(state: DeepPartial<S>) {
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
  public withReducer(name: keyof S, reducer: Reducer) {
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
  public withReducerBuilder(name: keyof S, reducerBuilder: ReducerBuilder) {
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
  public withReducerBuildersMap(reducerBuilders: ReducerBuilderMap<S>) {
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
  public build(): Store<S> {
    const defer = Promise.defer<Dispatch<Action>>()
    const reducerMap = Object.keys(this.reducerBuilders).reduce(
      (p: any, r) => ({
        ...p,
        [r]: (this.reducerBuilders[r] as any).build(defer.promise),
      }),
      this.reducers,
    )
    const middlewares = applyMiddleware(...this.middlewares)
    const reducers = combineReducers<S>(reducerMap)
    const composer = compose(middlewares, this.enhancer)(createStore)
    const store = composer(reducers, this.initialState)

    defer.resolve(store.dispatch)

    return {
      ...store,
      mapStoreToProps: map => map,
      connected: (mapStateToProps, mapDispatchToProps) => mapDispatchToProps
        ? (connect(mapStateToProps, mapDispatchToProps) as any)
        : (connect(mapStateToProps) as any)

    }
  }
}
