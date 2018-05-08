import { Action } from 'redux'

/**
 * Abstract action definition. Create a new class and extend from `SyncAction`
 *
 * Uglify operation scrambles function names with default configuration.
 * In order to prevent it, either configure as keeping function names
 * or overwrite `type` field.
 *
 * @export
 * @abstract
 * @class SyncAction
 * @implements {Action<string>}
 */
export abstract class SyncAction implements Action<string> {
  type: string
}

export interface ActionClass<T extends SyncAction> {
  prototype: T
}

export type ActionBody<S, A extends SyncAction> = (
  state: S,
  action: A,
  dispatch: <D extends SyncAction>(action: D) => Promise<D>,
) => S
