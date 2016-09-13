import 'mocha'
import { expect } from 'chai'
import { StoreBuilder } from './storeBuilder'
import { ReducerBuilder } from './reducerBuilder'
import { SyncAction, AsyncAction, Action, HideLoading, ShowLoading } from './actionHelpers'


interface SampleState {
    isSet: boolean;
}

interface SampleStore {
    reducer: SampleState
}

@Action
class SampleAction extends SyncAction {
}

@Action
class SampleAsyncAction extends AsyncAction {
}


describe("Reducer", () => {

    describe("with inital state", () => {
        var reducer = new ReducerBuilder<SampleState>()
            .init({ isSet: true })
            .build();

        var store = new StoreBuilder<SampleStore>()
            .withReducersMap({ reducer })
            .build();

        it("should have correct value", () => {
            expect(store.getState().reducer.isSet).equal(true);
        });
    });

    describe("with sync action handler", () => {
        var reducer = new ReducerBuilder<SampleState>()
            .handle(SampleAction, (state: SampleState, action: SampleAction) => {
                state.isSet = true;
                return state;
            })
            .build();

        var store = new StoreBuilder<SampleStore>()
            .withReducersMap({ reducer })
            .build();

        store.dispatch(new SampleAction());

        it("should be called on dispatch action", () => {
            expect(store.getState().reducer.isSet).equal(true);
        });
    });

    describe("with async action handler", () => {
        var dispatchedEvents: any[] = [];

        var reducer: Redux.Reducer<any> = (state: any = {}, action: Redux.Action) => {
            if (!action.type.startsWith("@@")) {
                dispatchedEvents.push(action.type);
            }
            return state;
        };

        var store = new StoreBuilder<SampleStore>()
            .withReducersMap({ reducer })
            .build();

        before(done => {
            var action = new SampleAsyncAction();
            store.dispatch(action);

            action.then(dispatch => {
                dispatch(new SampleAction());
                done();
            })
        })

        it("should be dispatched in correct order", () => {
            expect(dispatchedEvents).deep.equal([
                ShowLoading.prototype.type,
                SampleAsyncAction.prototype.type,
                HideLoading.prototype.type,
                SampleAction.prototype.type
            ]);
        });
    });

});