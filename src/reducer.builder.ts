import { ActionBody, Action, ActionCreatorDefinition } from '.'
import { Dispatch, Reducer } from 'redux'

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
   * @template TPayload Action type
   * @param {ActionClass<TPayload>} type Action object (should be class)
   * @param {ActionBody<State, TPayload>} body Action body
   * @returns
   * @memberof ReducerBuilder
   */
  public handle<TPayload>(
    creator: ActionCreatorDefinition<TPayload>,
    body: ActionBody<State, Action<TPayload>>,
  ) {
    this.actions[creator.type] = body
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
