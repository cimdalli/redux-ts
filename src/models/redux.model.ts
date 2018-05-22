import { AnyAction } from 'redux'
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux'

export type Indexer<T = any> = { [key: string]: T }

export interface StateToProps<TState = any> {
  <T extends Indexer, TOwn>(
    map: MapStateToProps<T, TOwn, TState>,
  ): MapStateToProps<T, TOwn, TState>
}

export interface DispatchToProps {
  <T extends Indexer<(...params: any[]) => AnyAction>, TOwn>(
    map: T | MapDispatchToPropsFunction<T, TOwn>,
  ): MapDispatchToPropsFunction<T, TOwn>
}
