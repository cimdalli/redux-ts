import { Action as A, AnyAction } from 'redux'

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
// export abstract class Action implements A<string> {
//   type: string
// }

// tslint:disable-next-line:function-name
export function Action(
  type: string,
): (<T extends {}>(target: T) => T & { type: string }) {
  return target => Object.assign(target, { type })
}

export interface ActionClass<T> {
  prototype: T
  type?: string
}

export type ActionBody<S, A> = (
  state: S,
  action: A,
  dispatch: <D>(action: D) => Promise<D>,
) => S
