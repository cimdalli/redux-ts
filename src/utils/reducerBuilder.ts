import { Action } from 'redux'
import { SyncAction, AsyncAction } from '../utils/actionHelpers'

export interface IAction<T extends Action> {
  prototype: T
}

export type Reducer<State, ActionType extends SyncAction> = (
  state: State,
  action: ActionType,
) => State

export class ReducerBuilder<State> {
  private actions: { [type: string]: Reducer<State, SyncAction> } = {}
  private initState: State

  public init(state: State) {
    this.initState = state
    return this
  }

  public handle<T extends SyncAction>(
    actionType: IAction<T>,
    actionBody: Reducer<State, T>,
  ) {
    this.actions[(<any>actionType).name] = actionBody
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
