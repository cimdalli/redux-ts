import { Action } from 'redux'

export abstract class SyncAction implements Action<string> {
  type: string
}

export interface ActionClass<T extends SyncAction> {
  prototype: T
}

export type ActionBody<S, A extends SyncAction> = (
  state: S,
  action: Action,
  dispatch: <D extends SyncAction>(action: D) => Promise<D>,
) => S
