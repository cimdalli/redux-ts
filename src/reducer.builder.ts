import { ActionBody, ActionClass } from '.'
import { Action, Dispatch, Reducer } from 'redux'

export class ReducerBuilder<State = {}> {
  private actions: { [type: string]: ActionBody<State, Action> } = {}
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
   * @param {ActionClass<T>} type Action object (should be class)
   * @param {ActionBody<State, T>} action Action body
   * @returns
   * @memberof ReducerBuilder
   */
  public handle<T extends Action>(
    type: ActionClass<T>,
    action: ActionBody<State, T>,
  ) {
    this.actions[(<any>type).name] = action
    return this
  }

  private build(dispatch: Promise<Dispatch>): Reducer<State, Action> {
    return (state = this.initState, action) => {
      const type = action.type
      const actionBody = this.actions[type]

      if (!!actionBody) {
        return actionBody(state, action, a => dispatch.then(d => d(a)))
      }

      return state
    }
  }
}
