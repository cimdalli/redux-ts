import { SyncAction, IAction } from '../utils/actionHelpers'


export type Reducer<State, ActionType extends SyncAction> = (state: State, action?: ActionType) => State;

export class ReducerBuilder<State> {

    actions: { [type: string]: Reducer<State, SyncAction> } = {};
    initState: State;


    public init(state: State) {
        this.initState = state;
        return this;
    }

    public handle<T extends SyncAction>(actionType: IAction<T>, actionBody: Reducer<State, T>) {
        this.actions[actionType.prototype.type] = actionBody;
        return this;
    }

    public build(mergeToState: boolean = true) {
        return (state: State = this.initState, action: SyncAction) => {
            let type = action.type;
            let actionBody = this.actions[type];

            if (!!actionBody) {
                let nextState = actionBody(state, action);
                if (!mergeToState) {
                    return nextState;
                }
                return Object.assign({}, state, nextState);
            }

            return state;
        }
    }
}