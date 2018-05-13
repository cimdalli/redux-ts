import { Action as ReduxAction } from 'redux'

export interface Action<TPayload = any, TMeta = any>
  extends ReduxAction<string> {
  payload: TPayload
  meta?: TMeta
}

export interface ActionCreatorDefinition<TPayload = any, TMeta = any> {
  type: string
  (payload?: TPayload, meta?: TMeta): Action<TPayload>
}

export type LazyDispatch = <TAction extends ReduxAction>(
  action: TAction,
) => Promise<TAction>

export type ActionBody<TState, TPayload> = (
  state: TState,
  action: TPayload,
  dispatch: LazyDispatch,
) => TState
