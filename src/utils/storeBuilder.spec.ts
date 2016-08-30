import 'mocha'
import { expect } from 'chai'
import { StoreBuilder } from './storeBuilder'


describe("StoreBuilder", () => {

    var store: Redux.Store<{}>;
    var INITIAL_STATE = { test: true }
    var enhancer = (f: Redux.StoreCreator) => { return f; };


    beforeEach(() => {
        store = new StoreBuilder()
            .withInitialState(INITIAL_STATE)
            .withEnhancer(enhancer)
            .build();
    });

    it("should have initial state", () => {
        expect(store.getState()).equal(INITIAL_STATE);
    });

});