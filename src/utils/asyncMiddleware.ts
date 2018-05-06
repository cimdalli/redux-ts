import { Action, Middleware } from 'redux'
import { SyncAction, AsyncAction } from './actionHelpers'

const isSyncAction = (action: Action): action is any => {
  return action instanceof SyncAction
}

const isAsyncAction = (action: Action): action is any => {
  return action instanceof AsyncAction
}

const mergeObject = (action: any): any => {
  const merged: any = {}
  for (const key in action) {
    if (key !== 'constructor') {
      merged[key] = (<any>action)[key]
    }
  }
  return merged
}

export const asyncMiddleware: Middleware = store => next => action => {
  if (isSyncAction(action)) {
    action.type = action.constructor.name

    if (isAsyncAction(action)) {
      // After original dispatch lifecycle, resolve dispatch in order to handle async operations
      setTimeout(() => {
        action.resolve(store.dispatch)
      })
    }

    // Fix: Actions must be plain objects.
    const merged = mergeObject(action)

    // Change state immediately and register async operations
    return next(merged)
  }

  return next(action)
}
