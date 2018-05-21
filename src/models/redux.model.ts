import { Dispatch, AnyAction } from 'redux'
import { ActionCreatorDefinition } from '..'

export interface StateToProps<TState = any> {
  <T extends { [key: string]: any } = {}, Town = {}>(
    map: (store: TState, own: Town) => T,
  ): (store: TState, own: Town) => T
}

export interface DispatchToProps<
  TDispatchAction extends AnyAction = AnyAction
> {
  <T extends { [key: string]: (...params: any[]) => AnyAction }, Town>(
    map: T,
    own: Town,
  ): (dispatch: Dispatch<TDispatchAction>, own: Town) => T
}
