import { Action, Store, Reducer } from 'redux'
import { SyncAction, AsyncAction } from './actionHelpers'
import { ReducerBuilder } from './reducerBuilder'
import { StoreBuilder } from './storeBuilder'
import { expect } from 'chai'
import 'mocha'

interface SampleState {
  isSyncActionCalled: boolean
  isAsyncActionCalled?: boolean
}

interface SampleStore {
  reducer: SampleState
}

class SampleSyncAction extends SyncAction {}

class SampleAsyncAction extends AsyncAction {}

describe('Reducer', () => {
  describe('with inital state', () => {
    const reducer = new ReducerBuilder<SampleState>()
      .init({ isSyncActionCalled: true })
      .build()

    const store = new StoreBuilder<SampleStore>()
      .withReducersMap({ reducer })
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
      .build()

    const store = new StoreBuilder<SampleStore>()
      .withReducersMap({ reducer })
      .build()

    store.dispatch(new SampleSyncAction())

    it('should be called on dispatch sync action', () => {
      expect(store.getState().reducer.isSyncActionCalled).equal(true)
    })
  })

  describe('with async action handler', () => {
    const dispatchedEvents: any[] = []
    let store: Store<SampleStore>
    let beforeDispatch = false

    const hookReducer: Reducer<any> = (state: any = {}, action: Action) => {
      if (!action.type.startsWith('@@')) {
        dispatchedEvents.push(action.type)
      }
      return state
    }

    before(done => {
      const reducer = new ReducerBuilder<SampleState>()
        .init({
          isSyncActionCalled: false,
          isAsyncActionCalled: false,
        })
        .handle(SampleAsyncAction, (state, action) => {
          action.then(dispatch => {
            dispatch(new SampleSyncAction())
          })
          return Object.assign({}, state, { isAsyncActionCalled: true })
        })
        .handle(SampleSyncAction, (state, action) => {
          return Object.assign({}, state, { isSyncActionCalled: true })
        })
        .build()

      store = new StoreBuilder<SampleStore>()
        .withReducersMap({ hookReducer, reducer })
        .build()

      const asyncAction = new SampleAsyncAction()
      asyncAction.then(x => {
        beforeDispatch = true
        done()
      })
      store.dispatch(asyncAction)
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

    it('should handle before dispatch promise', () => {
      expect(beforeDispatch).equal(true)
    })
  })
})
