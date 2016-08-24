import 'mocha'
import 'chai'
import { StoreBuilder } from './storeBuilder'


describe("StoreBuilder", () => {
    
    var store: Redux.Store<{}>;
    var INITIAL_STATE = { test: true }

    beforeEach(() => {
        store = new StoreBuilder()
            .withInitialState(INITIAL_STATE)
            .build();
    });

    it("should have initial state", () => {
        chai.expect(store.getState()).equal(INITIAL_STATE);
    });

});