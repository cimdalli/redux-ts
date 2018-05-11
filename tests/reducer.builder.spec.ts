import 'mocha'
import { expect } from 'chai'
import { Store } from 'redux'
import { ReducerBuilder, StoreBuilder, Action } from '../src'

interface SampleState {
  isSimpleActionCalled?: boolean
  isNestedActionCalled?: boolean
  testValue?: string
}

interface SampleStore {
  reducer: SampleState
}

@Action('SIMPLE_ACTION')
class SimpleAction {}

@Action('NESTED_ACTION')
class NestedAction {
  constructor(public value: string) {}
}

describe('Reducer', () => {
  describe('with initial state', () => {
    const testValue = 'test'

    const reducer = new ReducerBuilder<SampleState>().init({
      testValue,
    })

    const store = new StoreBuilder<SampleStore>()
      .withReducerBuildersMap({ reducer })
      .build()

    it('should have correct value', () => {
      expect(store.getState().reducer.testValue).equal(testValue)
    })
  })

  describe('with simple action handler', () => {
    const reducer = new ReducerBuilder<SampleState>()
      .init({ isSimpleActionCalled: false })
      .handle(SimpleAction, (state, action) => {
        return {
          ...state,
          isSimpleActionCalled: true,
        }
      })

    const store = new StoreBuilder<SampleStore>()
      .withReducerBuilder('reducer', reducer)
      .build()

    store.dispatch(new SimpleAction())

    it('should be called on dispatch sync action', () => {
      expect(store.getState().reducer.isSimpleActionCalled).equal(true)
    })
  })

  describe('with async action handler', () => {
    const dispatchedEvents: any[] = []
    const testValue = 'test'
    let store: Store<SampleStore, any>

    before(done => {
      const reducer = new ReducerBuilder<SampleState>()
        .init({
          isNestedActionCalled: false,
          isSimpleActionCalled: false,
        })
        .handle(SimpleAction, (state, action, dispatch) => {
          dispatch(new NestedAction(testValue))
          return { ...state, isSimpleActionCalled: true }
        })
        .handle(NestedAction, (state, action) => {
          setTimeout(done)
          return {
            ...state,
            isNestedActionCalled: true,
            testValue: action.value,
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

      store.dispatch(new SimpleAction())
    })

    it('should dispatch actions in correct order', () => {
      expect(dispatchedEvents).deep.equal([
        (<any>SimpleAction).type,
        (<any>NestedAction).type,
      ])
    })

    it('should handle simple action', () => {
      expect(store.getState().reducer.isNestedActionCalled).equal(true)
    })

    it('should handle nested action', () => {
      expect(store.getState().reducer.isSimpleActionCalled).equal(true)
    })

    it('should pass correct parameter value', () => {
      expect(store.getState().reducer.testValue).equal(testValue)
    })
  })
})
