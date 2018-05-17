# redux-ts

Utils to define react redux reducer/action in typescript.</p>

[![build status](https://img.shields.io/travis/cimdalli/redux-ts/master.svg?style=flat-square)](https://travis-ci.org/cimdalli/redux-ts)
[![dependencies Status](https://david-dm.org/cimdalli/redux-ts/status.svg?style=flat-square)](https://david-dm.org/cimdalli/redux-ts)
[![devDependencies Status](https://david-dm.org/cimdalli/redux-ts/dev-status.svg?style=flat-square)](https://david-dm.org/cimdalli/redux-ts?type=dev)
[![npm version](https://img.shields.io/npm/v/redux-ts.svg?style=flat-square)](https://www.npmjs.com/package/redux-ts)

<h5 align="right">  Now FSA compliant</h5>

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

Action declaration can be done with `'createAction'` function which takes action `type` as parameter.

```ts
import { createAction } from 'redux-ts'

interface LoginPayload {
  username: string
  password: string
}

interface SetTokenPayload {
  token?: string
}

export const Login = createAction<LoginPayload>('Login')

export const Logout = createAction('Logout')

export const SetToken = createAction<SetTokenPayload>('SetToken')
```

## Reducers

Reducers are consumers for actions to change application state. Difference from original redux implementation is in `redux-ts` reducers can also dispatch another action asynchronously. Each reducer method should return state value even it doesn't change it. Async dispatch operations will be handled after original dispatch cycle is finished.

```ts
import { ReducerBuilder } from 'redux-ts'
import { Login, Logout, SetToken } from '../actions'
import { push } from 'react-router-redux'

const tokenKey = 'auth'

export interface AuthState {
  token?: string
}

export const authReducer = new ReducerBuilder<AuthState>()
  .init({
    token: localStorage.getItem(tokenKey) || undefined,
  })

  .handle(Login, (state, action, dispatch) => {
    const { username, password } = action.payload

    fetch(`https://server.com/login?u=${username}&p=${password}`)
      .then(x => x.json())
      .then(data => {
        /*
        * When server respond with token, another action is dispatching.
        */
        dispatch(SetToken(data.token))
        dispatch(push('/dashboard'))
      })

    return state
  })

  .handle(Logout, (state, action, dispatch) => {
    dispatch(SetToken({ token: undefined }))
    dispatch(push('/dashboard'))

    return state
  })

  .handle(SetToken, (state, action) => {
    const token = action.payload.token

    if (token) {
      localStorage.setItem(tokenKey, token)
    } else {
      localStorage.removeItem(tokenKey)
    }

    return {
      ...state,
      token,
    }
  })
```

## Connect

`connect` method is part of redux library and allows you to connect your react components with redux store. Although you can use your own implementation, this library provides you some syntactic sugar to make it easy.

```tsx
import * as React from 'react'

import { ChangeTheme } from '../actions/layout.actions'
import { Logout } from '../actions/auth.actions'

import { connect } from 'react-redux'
import { mapDispatchToProps, StateToProps } from 'redux-ts'

const mapStoreToProps: StateToProps<StoreState> = map => map

const storeProps = mapStoreToProps(store => ({
  useDarkTheme: !!store.layout.useDarkTheme,
}))

const dispatchProps = mapDispatchToProps({
  Logout,
  ChangeTheme,
})

type MainProps = ReturnType<typeof dispatchProps> & ReturnType<typeof storeProps>

const MainContainer: React.SFC<MainProps> = ({ children, useDarkTheme, Logout, ChangeTheme }) => {

  const appBarRightElement = (
    <div style={{ display: 'inline-block' }}>
      <Toggle
        onToggle={ChangeTheme}
        label={useDarkTheme: 'dark' : 'light'}
        toggled={useDarkTheme}
      />
      <FlatButton onClick={Logout} label="logout" />
    </div>
  )
  
  return (
    <div>
      <AppBar iconElementRight={appBarRightElement}/>
      {children}
    </div>
  )
}

export const Main = connect(storeProps, dispatchProps)(MainContainer)
```

## Example

[react-material-demo](https://github.com/cimdalli/react-material-demo)

## License

MIT
