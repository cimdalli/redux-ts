import {
  MapDispatchToPropsFunction, MapDispatchToPropsParam, MapStateToProps, MapStateToPropsParam
} from 'react-redux'
import { AnyAction, Store as ReduxStore } from 'redux'

export type HOC<Pin, Pout> = (
  c: React.ComponentType<Pin>,
) => React.ComponentType<Pout>

export type Indexer<T = any> = {
  [key: string]: T
}

export type StateToProps<TState = any> = <T extends Indexer, TOwn>(
  map: MapStateToProps<T, TOwn, TState>,
) => MapStateToProps<T, TOwn, TState>

export type DispatchToProps = <
  T extends Indexer<(...params: any[]) => AnyAction>,
  TOwn
>(
  map: T | MapDispatchToPropsFunction<T, TOwn>,
) => MapDispatchToPropsFunction<T, TOwn>

export interface Store<StoreState> extends ReduxStore<StoreState> {
  /**
   * Dummy function to return `MapStateToProps` type that can be passed to `connect`
   * As paramter, mapper function is required which takes store object and returns indexer object
   * You can expose that function from your store object to be able to use on connected components.
   * ex.
   * export const [store, mapStoreToProps] = new StoreBuilder<StoreState>().build()
   *
   * @type {StateToProps<S>}
   * @memberof StoreBuilder
   */
  mapStoreToProps: StateToProps<StoreState>

  /**
   * Wrapper of redux connect method in order to support inferring props of inner component
   * ex.
   * export const [store, mapStoreToProps, connected] = new StoreBuilder<StoreState>().build()
   *
   * @private
   * @template TStateProps
   * @template TDispatchProps
   * @template TOwnProps
   * @template State
   * @param {MapStateToPropsParam<TStateProps, TOwnProps, State>} [mapStateToProps]
   * @param {MapDispatchToPropsParam<TDispatchProps, TOwnProps>} [mapDispatchToProps]
   * @returns {(HOC<
   *     TStateProps & TDispatchProps & TOwnProps,
   *     Exclude<TOwnProps, TStateProps & TDispatchProps>>)}
   * @memberof StoreBuilder
   */
  connected<TStateProps = {}, TDispatchProps = {}, TOwnProps = {}>(
    mapStateToProps?: MapStateToPropsParam<TStateProps, TOwnProps, StoreState>,
    mapDispatchToProps?: MapDispatchToPropsParam<TDispatchProps, TOwnProps>,
  ): HOC<
    TStateProps & TDispatchProps & TOwnProps,
    Exclude<TOwnProps, TStateProps & TDispatchProps>
  >
}
