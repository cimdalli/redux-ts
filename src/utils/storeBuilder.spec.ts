import 'mocha'
import { expect } from 'chai'
import { StoreBuilder } from './storeBuilder'


describe("Store", () => {

    var TestAction = <Redux.Action>{ type: "test" };

    describe("with inital state", () => {
        var state = { test: true }
        var store = new StoreBuilder()
            .withInitialState(state)
            .build();

        it("should have correct value", () => {
            expect(store.getState()).equal(state);
        });
    });


    describe("with middleware", () => {
        var isSet = false;
        var testMiddleware = (store: any) => (next: any) => (action: any) => { isSet = true; }
        var store = new StoreBuilder()
            .withMiddleware(testMiddleware)
            .build();

        store.dispatch(TestAction);

        it("should be called on dispatch action", () => {
            expect(isSet).equal(true);
        });
    });


    describe("with reducer", () => {
        var isSet = false;
        var testReducer = (state = {}, action: Redux.Action) => {
            if (action.type == TestAction.type) { isSet = true; }
            return state;
        };
        var store = new StoreBuilder()
            .withReducer("test", testReducer)
            .build();

        store.dispatch(TestAction);

        it("should be called on dispatch action", () => {
            expect(isSet).equal(true);
        });
    });


    describe("with reducer map", () => {
        var isSet = false;
        var testReducer = (state = {}, action: Redux.Action) => {
            if (action.type == TestAction.type) { isSet = true; }
            return state;
        }
        var store = new StoreBuilder()
            .withReducersMap({ testReducer })
            .build();

        store.dispatch(TestAction);

        it("should be called on dispatch action", () => {
            expect(isSet).equal(true);
        });
    });


    describe("with enhancer", () => {
        var isSet = false;
        var enhancer = (f: Redux.StoreCreator) => {
            isSet = true;
            return f;
        };
        var store = new StoreBuilder()
            .withEnhancer(enhancer)
            .build();

        store.dispatch(TestAction);

        it("should be called on dispatch action", () => {
            expect(isSet).equal(true);
        });
    });

});