import { Action, Reducer } from 'redux'
import { SyncAction } from '../utils/actionHelpers'

export interface IAction<T extends Action> {
  prototype: T
}

export class ReducerBuilder<State> {
  private actions: { [type: string]: Reducer<State, SyncAction> } = {}
  private initState: State

  public init(state: State) {
    this.initState = state
    return this
  }

  public handle<T extends SyncAction>(
    type: IAction<T>,
    action: Reducer<State, T>,
  ) {
    this.actions[(<any>type).name] = action
    return this
  }

  public build() {
    return (state: State = this.initState, action: SyncAction): State => {
      const type = action.type
      const actionBody = this.actions[type]

      if (!!actionBody) {
        return actionBody(state, action)
      }

      return state
    }
  }
}
