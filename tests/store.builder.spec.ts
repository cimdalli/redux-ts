import 'mocha'

import { expect } from 'chai'
import { Action, Middleware, StoreCreator } from 'redux'

import { StoreBuilder } from '../src'

describe('Store', () => {
  const testAction = <Action>{ type: 'test' }
  const reducer = (state: any = {}, action: any) => {
    return state
  }
  const initState = { reducer: { test: true } }

  describe('with initial state', () => {
    const store = new StoreBuilder()
      .withInitialState(initState)
      .withReducersMap({ reducer })
      .build()

    it('should have correct value', () => {
      expect(store.getState()).equal(initState)
    })
  })

  describe('with middleware', () => {
    let isSet = false
    const testMiddleware: Middleware = store => next => action => {
      isSet = true
      return next(action)
    }
    const store = new StoreBuilder()
      .withMiddleware(testMiddleware)
      .withReducersMap({ reducer })
      .build()

    store.dispatch(testAction)

    it('should be called on dispatch action', () => {
      expect(isSet).equal(true)
    })
  })

  describe('with reducer', () => {
    let isSet = false
    const testReducer = (state = {}, action: Action) => {
      if (action.type === testAction.type) {
        isSet = true
      }
      return state
    }
    const store = new StoreBuilder().withReducer('test', testReducer).build()

    store.dispatch(testAction)

    it('should be called on dispatch action', () => {
      expect(isSet).equal(true)
    })
  })

  describe('with reducer map', () => {
    let isSet = false
    const testReducer = (state = {}, action: Action) => {
      if (action.type === testAction.type) {
        isSet = true
      }
      return state
    }
    const store = new StoreBuilder().withReducersMap({ testReducer }).build()

    store.dispatch(testAction)

    it('should be called on dispatch action', () => {
      expect(isSet).equal(true)
    })
  })

  describe('with enhancer', () => {
    let isSet = false
    const enhancer = (f: StoreCreator) => {
      isSet = true
      return f
    }
    const store = new StoreBuilder()
      .withReducersMap({ reducer })
      .withEnhancer(enhancer)
      .build()

    store.dispatch(testAction)

    it('should be called on dispatch action', () => {
      expect(isSet).equal(true)
    })
  })
})
