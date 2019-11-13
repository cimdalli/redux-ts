import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux'
import { AnyAction } from 'redux'

export type Indexer<T = any> = { [key: string]: T }

export type StateToProps<TState = any> = {
  <T extends Indexer, TOwn>(
    map: MapStateToProps<T, TOwn, TState>,
  ): MapStateToProps<T, TOwn, TState>
}

export type DispatchToProps = {
  <T extends Indexer<(...params: any[]) => AnyAction>, TOwn>(
    map: T | MapDispatchToPropsFunction<T, TOwn>,
  ): MapDispatchToPropsFunction<T, TOwn>
}
