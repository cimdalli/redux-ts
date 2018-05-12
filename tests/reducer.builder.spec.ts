import 'mocha'
import { expect } from 'chai'
import { Store, Reducer } from 'redux'
import { ReducerBuilder, StoreBuilder, createAction } from '../src'

interface ReducerState {
  isBasicActionCalled: boolean
  isNestedActionCalled?: boolean
  testValue?: string
}

interface StoreState {
  reducer: ReducerState
}

const SimpleAction = createAction('simple')
const NestedAction = createAction<{ value: string }>('nested')

describe('Reducer', () => {
  describe('with initial state', () => {
    const reducer = new ReducerBuilder<ReducerState>().init({
      isBasicActionCalled: true,
    })

    const store = new StoreBuilder<StoreState>()
      .withReducerBuildersMap({ reducer })
      .build()

    it('should have correct value', () => {
      expect(store.getState().reducer.isBasicActionCalled).equal(true)
    })
  })

  describe('with simple action handler', () => {
    const reducer = new ReducerBuilder<ReducerState>()
      .init({ isBasicActionCalled: false })
      .handle(NestedAction, (state, action) => {
        state.isBasicActionCalled = true
        return state
      })

    const store = new StoreBuilder<StoreState>()
      .withReducerBuilder('reducer', reducer)
      .build()

    store.dispatch(NestedAction({ value: 'test1' }))

    it('should be called on dispatch action', () => {
      expect(store.getState().reducer.isBasicActionCalled).equal(true)
    })
  })

  describe('with nested action handler', () => {
    const dispatchedEvents: any[] = []
    const testValue = 'test'
    let store: Store<StoreState>

    before(done => {
      const reducer = new ReducerBuilder<ReducerState>()
        .init({
          isBasicActionCalled: false,
          isNestedActionCalled: false,
        })
        .handle(SimpleAction, (state, action, dispatch) => {
          dispatch(NestedAction({ value: testValue }))
          return { ...state, isNestedActionCalled: true }
        })
        .handle(NestedAction, (state, action) => {
          setTimeout(done)
          return {
            ...state,
            isBasicActionCalled: true,
            testValue: action.payload.value,
          }
        })

      store = new StoreBuilder<StoreState>()
        .withMiddleware(m => next => a => {
          if (!a.type.startsWith('@@')) {
            dispatchedEvents.push(a.type)
          }
          return next(a)
        })
        .withReducerBuildersMap({ reducer })
        .build()

      store.dispatch(SimpleAction())
    })

    it('should dispatch actions in correct order', () => {
      expect(dispatchedEvents).deep.equal([
        SimpleAction.type,
        NestedAction.type,
      ])
    })

    it('should handle simple action', () => {
      expect(store.getState().reducer.isBasicActionCalled).equal(true)
    })

    it('should handle nested action', () => {
      expect(store.getState().reducer.isNestedActionCalled).equal(true)
    })

    it('should pass correct parameter value', () => {
      expect(store.getState().reducer.testValue).equal(testValue)
    })
  })
})
