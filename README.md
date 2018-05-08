# redux-ts

Utils to define react redux reducer/action in typescript.

[![build status](https://img.shields.io/travis/cimdalli/redux-ts/master.svg?style=flat-square)](https://travis-ci.org/cimdalli/redux-ts)
[![npm version](https://img.shields.io/npm/v/redux-ts.svg?style=flat-square)](https://www.npmjs.com/package/redux-ts)

### FOR v 2.X PLEASE GO TO [THE 2.x BRANCH](https://github.com/cimdalli/redux-ts/tree/2.x)

> For breaking changes you can take look [CHANGELOG](./CHANGELOG.md)

```js
npm install --save redux-ts
```

## Store Builder

Create redux store with builder pattern.

```ts
import { StoreBuilder } from 'redux-ts'

const store = new StoreBuilder<StoreState>()
                        .withInitialState({test:true})
                        .withReducer("reducer", reducer)
                        .withDevTools() // enable chrome devtools
                        .build();
}
```

## Actions

Actions store data that are required on reducers. Declaration of them are succeed by their `class name` so no need to define type again.

> Uglify operation will scramble function names so you need to either configure to keep function names as is ([#1](https://github.com/cimdalli/redux-ts/issues/1)) or specify unique names with `type` property.

```ts
import { SyncAction } from 'redux-ts'

export class Login extends SyncAction {
  constructor(public username: string, public password: string) {
    super()
  }
}

export class Logout extends SyncAction {
  type = 'Unique Type Name'
}

export class SetToken extends SyncAction {
  constructor(public token: string) {
    super()
  }
  getTokenKey() {
    return 'auth'
  }
}
```

## Reducers

Reducers are consumers for actions to change application state. Difference from original redux implementation is in `redux-ts` reducers can also dispatch another action asynchronously. Each reducer method should return a value even it doesn't change state. Async dispatch operations will be handled after original dispatch cycle is finished.

```ts
import { ReducerBuilder } from 'redux-ts'
import { Login, Logout, SetToken } from '../actions'
import { push } from 'react-router-redux'

export interface AuthState {
  token?: string
}

export const authReducer = new ReducerBuilder<AuthState>()
  .init({})

  .handle(Login, (state, action, dispatch) => {
    fetch`https://httpbin.org/get?username=${action.username}&password=${action.password}`)
      .then(x => x.json())
      .then(data => {
        dispatch(new SetToken(data.args.username + '|' + data.args.password))
        dispatch(push('/dashboard'))
      })

    return state
  })

  .handle(Logout, (state, action, dispatch) => {
    dispatch(new SetToken(undefined))
    dispatch(push('/dashboard'))

    return state
  })

  .handle(SetToken, (state, action) => {
    const token = action.token
    const key = action.getTokenKey()

    if (token) {
      localStorage.setItem(key, token)
    } else {
      localStorage.removeItem(key)
    }

    return {
      ...state,
      token,
    }
  })
```

## Example

[react-material-demo](https://github.com/cimdalli/react-material-demo)  (obsolete)

## License

MIT
