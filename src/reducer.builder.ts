import { ActionBody, ActionClass } from '.'
import { Action, Dispatch, Reducer, AnyAction } from 'redux'

export class ReducerBuilder<State = {}> {
  private actions: { [type: string]: ActionBody<State, any> } = {}
  private initState: State

  /**
   * Initial state of the reducer
   *
   * @param {State} state State object
   * @returns
   * @memberof ReducerBuilder
   */
  public init(state: State) {
    this.initState = state
    return this
  }

  /**
   * Consumer definition for given action type
   *
   * @template T Action type
   * @param {ActionClass<T>} action Action object (should be class)
   * @param {ActionBody<State, T>} body Action body
   * @returns
   * @memberof ReducerBuilder
   */
  public handle<T extends {}>(
    action: ActionClass<T>,
    body: ActionBody<State, T>,
  ) {
    if (!action.type) {
      throw new Error('Actions should have unique `type` information.')
    }
    this.actions[action.type] = body
    return this
  }

  private build(dispatch: Promise<Dispatch>): Reducer<State, Action> {
    return (state = this.initState, action) => {
      const actionBody = this.actions[action.type]
      if (!!actionBody) {
        return actionBody(state, action, a => dispatch.then(d => d(a as any)))
      }

      return state
    }
  }
}
