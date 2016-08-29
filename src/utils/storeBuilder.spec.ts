import 'mocha'
import { expect } from 'chai'
import { StoreBuilder } from './storeBuilder'


describe("StoreBuilder", () => {

    var store: Redux.Store<{}>;
    var INITIAL_STATE = { test: true }
    var enhancer = () => 3;


    beforeEach(() => {
        store = new StoreBuilder()
            .withInitialState(INITIAL_STATE)
            .withComposeEnhancer(enhancer)
            .build();
    });

    it("should have initial state", () => {
        expect(store.getState()).equal(INITIAL_STATE);
    });

});