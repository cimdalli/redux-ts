import { Dispatch, AnyAction } from 'redux'
import { ActionCreatorDefinition } from '..'

export interface StateToProps<TState = any> {
  <T extends { [key: string]: any } = {}>(map: (store: TState) => T): (
    store: TState,
  ) => T
}

export interface DispatchToProps<
  TDispatchAction extends AnyAction = AnyAction
> {
  <T extends { [key: string]: (...params: any[]) => AnyAction }>(map: T): (
    dispatch: Dispatch<TDispatchAction>,
  ) => T
}
