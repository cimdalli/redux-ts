import { Action as A } from 'redux'

export interface Action<TPayload = any> extends A<string> {
  payload?: TPayload
}

export interface ActionCreatorDefinition<TPayload = any> {
  type: string
  (payload?: TPayload): Action<TPayload>
}

export const createAction = <TPayload>(
  type: string,
): ActionCreatorDefinition<TPayload> => {
  const creator: any = (payload: TPayload): Action<TPayload> => ({
    type,
    payload,
  })
  creator.type = type
  return creator
}

export type ActionBody<TState, TPayload> = (
  state: TState,
  action: TPayload,
  dispatch: <TDispatchAction extends Action>(
    action: TDispatchAction,
  ) => Promise<TDispatchAction>,
) => TState
