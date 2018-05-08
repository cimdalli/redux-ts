import 'mocha'
import { expect } from 'chai'
import { Store, Reducer } from 'redux'
import { SyncAction, ReducerBuilder, StoreBuilder } from '../src'

interface SampleState {
  isSyncActionCalled: boolean
  isAsyncActionCalled?: boolean
  testValue?: string
}

interface SampleStore {
  reducer: SampleState
}

class SampleSyncAction extends SyncAction {
  constructor(public value: string) {
    super()
  }
}

class SampleAsyncAction extends SyncAction {}

describe('Reducer', () => {
  describe('with initial state', () => {
    const reducer = new ReducerBuilder<SampleState>().init({
      isSyncActionCalled: true,
    })

    const store = new StoreBuilder<SampleStore>()
      .withReducerBuildersMap({ reducer })
      .build()

    it('should have correct value', () => {
      expect(store.getState().reducer.isSyncActionCalled).equal(true)
    })
  })

  describe('with sync action handler', () => {
    const reducer = new ReducerBuilder<SampleState>()
      .init({ isSyncActionCalled: false })
      .handle(SampleSyncAction, (state, action) => {
        state.isSyncActionCalled = true
        return state
      })

    const store = new StoreBuilder<SampleStore>()
      .withReducerBuilder('reducer', reducer)
      .build()

    store.dispatch(new SampleSyncAction('test1'))

    it('should be called on dispatch sync action', () => {
      expect(store.getState().reducer.isSyncActionCalled).equal(true)
    })
  })

  describe('with async action handler', () => {
    const dispatchedEvents: any[] = []
    const testValue = 'test'
    let store: Store<SampleStore>

    before(done => {
      const reducer = new ReducerBuilder<SampleState>()
        .init({
          isSyncActionCalled: false,
          isAsyncActionCalled: false,
        })
        .handle(SampleAsyncAction, (state, action, dispatch) => {
          dispatch(new SampleSyncAction(testValue))
          return { ...state, isAsyncActionCalled: true }
        })
        .handle(SampleSyncAction, (state, action) => {
          setTimeout(done)
          return { ...state, isSyncActionCalled: true, testValue: action.value }
        })

      store = new StoreBuilder<SampleStore>()
        .withMiddleware(m => next => a => {
          if (!a.type.startsWith('@@')) {
            dispatchedEvents.push(a.type)
          }
          return next(a)
        })
        .withReducerBuildersMap({ reducer })
        .build()

      store.dispatch(new SampleAsyncAction())
    })

    it('should dispatch actions in correct order', () => {
      expect(dispatchedEvents).deep.equal([
        (<any>SampleAsyncAction).name,
        (<any>SampleSyncAction).name,
      ])
    })

    it('should handle sync action', () => {
      expect(store.getState().reducer.isSyncActionCalled).equal(true)
    })

    it('should handle async action', () => {
      expect(store.getState().reducer.isAsyncActionCalled).equal(true)
    })

    it('should pass correct parameter value', () => {
      expect(store.getState().reducer.testValue).equal(testValue)
    })
  })
})
