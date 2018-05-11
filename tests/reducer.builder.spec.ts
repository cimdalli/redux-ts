import 'mocha'
import { expect } from 'chai'
import { Store, Reducer } from 'redux'
import { ReducerBuilder, StoreBuilder, createAction } from '../src'

interface SampleState {
  isFirstActionCalled: boolean
  isSecondActionCalled?: boolean
  testValue?: string
}

interface SampleStore {
  reducer: SampleState
}

const FIRST_ACTION = createAction('first')
const SECOND_ACTION = createAction<{ value: string }>('second')

describe('Reducer', () => {
  describe('with initial state', () => {
    const reducer = new ReducerBuilder<SampleState>().init({
      isFirstActionCalled: true,
    })

    const store = new StoreBuilder<SampleStore>()
      .withReducerBuildersMap({ reducer })
      .build()

    it('should have correct value', () => {
      expect(store.getState().reducer.isFirstActionCalled).equal(true)
    })
  })

  describe('with simple action handler', () => {
    const reducer = new ReducerBuilder<SampleState>()
      .init({ isFirstActionCalled: false })
      .handle(SECOND_ACTION, (state, action) => {
        state.isFirstActionCalled = true
        return state
      })

    const store = new StoreBuilder<SampleStore>()
      .withReducerBuilder('reducer', reducer)
      .build()

    store.dispatch(SECOND_ACTION({ value: 'test1' }))

    it('should be called on dispatch action', () => {
      expect(store.getState().reducer.isFirstActionCalled).equal(true)
    })
  })

  describe('with complex action handler', () => {
    const dispatchedEvents: any[] = []
    const testValue = 'test'
    let store: Store<SampleStore>

    before(done => {
      const reducer = new ReducerBuilder<SampleState>()
        .init({
          isFirstActionCalled: false,
          isSecondActionCalled: false,
        })
        .handle(FIRST_ACTION, (state, action, dispatch) => {
          dispatch(SECOND_ACTION({ value: testValue }))
          return { ...state, isSecondActionCalled: true }
        })
        .handle(SECOND_ACTION, (state, action) => {
          setTimeout(done)
          return {
            ...state,
            isFirstActionCalled: true,
            testValue: action.payload.value,
          }
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

      store.dispatch(FIRST_ACTION())
    })

    it('should dispatch actions in correct order', () => {
      expect(dispatchedEvents).deep.equal([
        FIRST_ACTION.type,
        SECOND_ACTION.type,
      ])
    })

    it('should handle first action', () => {
      expect(store.getState().reducer.isFirstActionCalled).equal(true)
    })

    it('should handle second action', () => {
      expect(store.getState().reducer.isSecondActionCalled).equal(true)
    })

    it('should pass correct parameter value', () => {
      expect(store.getState().reducer.testValue).equal(testValue)
    })
  })
})
