# redux-ts

Utils to define react redux reducer/action in typescript.</p>

[![build status](https://img.shields.io/travis/cimdalli/redux-ts/master.svg?style=flat-square)](https://travis-ci.org/cimdalli/redux-ts)
[![dependencies Status](https://david-dm.org/cimdalli/redux-ts/status.svg?style=flat-square)](https://david-dm.org/cimdalli/redux-ts)
[![devDependencies Status](https://david-dm.org/cimdalli/redux-ts/dev-status.svg?style=flat-square)](https://david-dm.org/cimdalli/redux-ts?type=dev)
[![npm version](https://img.shields.io/npm/v/redux-ts.svg?style=flat-square)](https://www.npmjs.com/package/redux-ts)

<h5 align="right">  Now FSA compliant</h5>

> For breaking changes you can take look [CHANGELOG](./CHANGELOG.md)

## Installation

```bash
# npm
npm install --save redux-ts
# yarn
yarn add redux-ts
```

## Usage

### Quickstart

This is all in one reference implementation of `redux-ts` library. You can enhance that solution depend on your needs.

```ts
import { StoreBuilder, ReducerBuilder } from 'redux-ts'

// Define reducer state
type LayoutState = { isDark: boolean }

// Define store state
type StoreState = { layout: LayoutState }

// Define action
const switchTheme = createAction('switchTheme')

// Build reducer
const layoutReducer = new ReducerBuilder<LayoutState>()
  .handle(switchTheme, (state, action) => {
    const isDark = !state.layout.isDark
    return { ...state, isDark }
  },
)

// Build store
export const { mapStoreToProps, connected, ...store } = new StoreBuilder<StoreState>()
  .withReducerBuildersMap({ layout: layoutReducer })
  .withDevTools() // enable chrome devtools
  .build()
```

```tsx
import React from 'react'
import { mapDispatchToProps } from 'redux-ts'
import { connected, mapStoreToProps, store } from './store'

// Map store to component props
const storeProps = mapStoreToProps(store => ({
  theme: store.layout.isDark ? 'dark' : 'light',
}))

// Pass action object to create dispatchable func. (aka. bindActionCreators)
const dispatchProps = mapDispatchToProps({ switchTheme })

// Connect component
const ConnectedMain = connected(storeProps, dispatchProps)(
  ({ theme, switchTheme }) => (
    <div>
      <span>Current theme: {theme}</span>
      <button onClick={switchTheme}>Switch theme</button>
    </div>
  ))

// Connect store
const Root: React.FC = props => (
  <Provider store={store}>
    <ConnectedMain />
  </Provider>
)

ReactDOM.render(<Root />, document.getElementById('app'))
```

---

### Use case (connected-react-router)

This is sample usage of `connected-react-router` with `redux-ts`

```ts
import { StoreBuilder } from 'redux-ts'
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router'

export const history = createBrowserHistory()
const routerReducer = connectRouter(history)
export const store = new StoreBuilder<StoreState>()
  .withMiddleware(routerMiddleware(history))
  .withReducer('router', routerReducer)
  .withDevTools() // enable chrome devtools
  .build()
```

```tsx
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import { history, store } from './store'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" render={() => <div>Match</div>} />
        <Route render={() => <div>Miss</div>} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('react-root'),
)
```

---

## Using react-ts

### Store

Create redux store with builder pattern.

```ts
import { StoreBuilder } from 'redux-ts'
import { authReducer } from './reducers/authReducer'

export const { connected, mapStoreToProps, ...store } = new StoreBuilder<StoreState>()
  .withInitialState({test:true})
  .withMiddleware()
  .withReducer("auth", authReducer)
  .withDevTools()
  .build();
}
```

- As generic parameter, it requires store state type in order to match given reducers and the state.
- Any number of middleware, enhancer or reducer can be used to build the state.
- `mapStoreToProps` is a dummy method that returns passed parameter again. This method can be used to map store object to props which are consumed from connected components. Return type is `MapStateToPropsParam` which is compatible with [connect](https://react-redux.js.org/api/connect).
- `connected` function is also another dummy function that wraps original [connect](https://react-redux.js.org/api/connect) function but with implicit type resolution support. Problem with original one, when you connect your component with connect method, it is trying to resolve typing by matching signature you passed as parameters to connect _(mapStateToProps, mapDispatchToProps)_ and component own properties. If you are using explicit typing mostly, it is totally fine to use original one. But if you are expecting implicit type resolution, original connect is failing and resolving inner component type as `never`.

### Actions

Action declaration can be done with `createAction` function which takes action name as parameter and payload type as generic type.
Each action should have unique identifier which is first parameter of `createAction` function. You can also define your metadata type and pass to generic type as second argument.

```ts
import { createAction } from 'redux-ts'

type LoginPayload = { username: string; password: string }
type SetTokenPayload = { token?: string }
type TokenMeta = { createdAt: Date }

export const Login = createAction<LoginPayload>('Login')
export const Logout = createAction('Logout')
export const SetToken = createAction<SetTokenPayload, TokenMeta>('SetToken')
```

- Return value of `createAction` function is [action creator function](https://redux.js.org/basics/actions#action-creators) that takes payload and metadata objects as parameters.
- Return value of [action creator function](https://redux.js.org/basics/actions#action-creators) is plain js object that have _payload_, _meta_ and _type_ fields which is proposed for [FSA](https://github.com/redux-utilities/flux-standard-action).

### Reducers

Reducers are consumer functions that consumes actions and change application state. Difference from original redux implementation in `redux-ts`, reducers can also dispatch another action asynchronously. Each reducer method should return state value even it doesn't change it. Async dispatch operations will be handled after original dispatch cycle is finished.

```ts
import { ReducerBuilder } from 'redux-ts'
import { Login, Logout, SetToken } from '../actions'
import { push } from 'connected-react-router'

const tokenKey = 'auth'

type AuthState = { token?: string }

export const authReducer = new ReducerBuilder<AuthState>()
  // Initial value of sub state
  .init({
    token: localStorage.getItem(tokenKey) || undefined,
  })

  // Handle SetToken action
  .handle(SetToken, (state, action) => {
    const { token } = action.payload

    if (token) {
      // If token is valid, persist it on local storage
      localStorage.setItem(tokenKey, token)
    } else {
      // Otherwise remove from local storage
      localStorage.removeItem(tokenKey)
    }

    return { ...state, token }
  })

  // Handle Logout action
  .handle(Logout, (state, action, dispatch) => {
    dispatch(SetToken({ token: undefined })) // First clear token
    dispatch(push('/dashboard')) // Then navigate to home page, it should redirect to login page

    return state // Return state even there is no change
  })

  // Handle Login action
  .handle(Login, (state, action, dispatch) => {
    const { username, password } = action.payload

    // Request to login
    fetch(`https://server.com/login?u=${username}&p=${password}`)
      .then(x => x.json())
      .then(data => {
        // If valid, store token and navigate to home page
        dispatch(SetToken(data.token))
        dispatch(push('/dashboard'))
      })

    return state
  })
```

### Connect

[connect](https://react-redux.js.org/api/connect) method is part of [react-redux](https://github.com/reduxjs/react-redux) library that allows you to connect your react components with redux store.

> You can use `connected` method for implicit type resolution.

```tsx
import * as React from 'react'
import { mapDispatchToProps } from 'redux-ts'
import { store } from '../store'
import { ChangeTheme } from '../actions/layout.actions'
import { Logout } from '../actions/auth.actions'

const { mapStoreToProps, connected } = store

// Map store object to component props
const storeProps = mapStoreToProps(store => ({
  useDarkTheme:!!store.layout.useDarkTheme
}))

// Map actions to component props
const dispatchProps = mapDispatchToProps({
  Logout,
  ChangeTheme
})

export const Layout = connected(storeProps, dispatchProps)(({
  children,     // standard react prop
  useDarkTheme, // mapped store prop
  Logout,       // mapped action prop
  ChangeTheme   // mapped action prop
  }) => {
    const appBarRightElement = (
      <div>
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
  })
```

## Example

[react-material-demo](https://github.com/cimdalli/react-material-demo) (Not up to date)

## License

MIT
