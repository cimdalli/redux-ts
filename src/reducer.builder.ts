import { ActionBody, ActionClass } from '.'
import { Action, Dispatch, Reducer } from 'redux'

export class ReducerBuilder<State = {}> {
  private actions: { [type: string]: ActionBody<State, Action> } = {}
  private initState: State

  public init(state: State) {
    this.initState = state
    return this
  }

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
