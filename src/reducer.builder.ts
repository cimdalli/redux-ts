import { Dispatch, Reducer } from 'redux'

import { Action, ActionBody, ActionCreatorDefinition, LazyDispatch } from './'

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
   * @template TPayload Action payload type
   * @param {ActionCreatorDefinition<TPayload>} creator Action creator function
   * @param {ActionBody<State, Action<TPayload>>} body Action body
   * @returns
   * @memberof ReducerBuilder
   */
  public handle<TPayload, TMeta>(
    creator: ActionCreatorDefinition<TPayload, TMeta>,
    body: ActionBody<State, Action<TPayload, TMeta>>,
  ) {
    this.actions[creator.type] = body
    return this
  }

  private build(dispatchPromise: Promise<Dispatch>): Reducer<State, Action> {
    return (state = this.initState, action) => {
      const actionBody = this.actions[action.type]
      const lazyDispatch: LazyDispatch = nestedAction =>
        dispatchPromise.then(dispatch => dispatch(nestedAction))

      if (!!actionBody) {
        return actionBody(state, action, lazyDispatch)
      }

      return state
    }
  }
}
