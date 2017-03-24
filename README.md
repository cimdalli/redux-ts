react-ts
=============

Utils to define react redux reducer/action in typescript.

[![build status](https://img.shields.io/travis/cimdalli/redux-ts/master.svg?style=flat-square)](https://travis-ci.org/cimdalli/redux-ts) 
[![npm version](https://img.shields.io/npm/v/redux-ts.svg?style=flat-square)](https://www.npmjs.com/package/redux-ts)


```js
npm install --save redux-ts
```

## Store Builder

Create redux store with builder pattern.

```js
import { StoreBuilder } from 'redux-ts'

var store: Redux.Store<StoreState> = new StoreBuilder<StoreState>()
                                            .withInitialState({test:true})
                                            .withReducer("reducer", reducer)
                                            .build();
} 
```

> To enable *chrome redux tool*; first declare a const then register within *StoreBuilder*

```js
const devTool = (f: Redux.StoreCreator) => {
    return ((window as any).__REDUX_DEVTOOLS_EXTENSION__) ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ : f
}

var store = new StoreBuilder<StoreState>()
                    .withEnhancer(devTool)
                    .build();
```


## Actions

Actions store data that are required on reducers. Declaration of them are succeed by their class name so no need to define type again. Depend on need, action could be either sync or async (like [redux-thunk](https://github.com/gaearon/redux-thunk)).

```js
import { SyncAction, AsyncAction } from 'redux-ts'
import { push } from 'react-router-redux'


export class Login extends AsyncAction {
    constructor(public username: string, public password: string) {
        super();
    }
}

export class Logout extends AsyncAction { }


export class SetToken extends SyncAction {
    constructor(public token: string) {
        super();
    }
    getTokenKey() {
        return "auth";
    }
}
```

## Reducers

Unlike original redux implementation, reducers can consume both sync and async actions. Each reducer method should return a value even it doesnt change state. Async operations are stored on async actions and will be resolved after original dispatch cycle is finised.

```js
import { ReducerBuilder } from 'redux-ts'
import { Login, Logout, SetToken } from '../actions'
import { push } from 'react-router-redux'


export interface AuthState {
    token?: string;
}

export const authReducer = new ReducerBuilder<AuthState>()
    .init({})

    .handle(Login, (state, action) => {
        
	    action.then(dispatch => {
	        fetch(`https://httpbin.org/get?username=${action.username}&password=${action.password}`)
	            .then(x => x.json())
	            .then(data => {
	                dispatch(new SetToken(data.args.username + "|" + data.args.password));
	                dispatch(push("/dashboard"))
	            });
	    });

        return state;
    })


    .handle(Logout, (state, action) => {

        action.then(dispatch => {
            dispatch(new SetToken(null));
            dispatch(push("/dashboard"));
        });

        return state;
    })


    .handle(SetToken, (state, action) => {

        if (action.token != null) {
            localStorage.setItem(action.getTokenKey(), action.token);
        }
        else {
            localStorage.removeItem(action.getTokenKey());
        }

        return Object.assign({}, state, {
            token: action.token
        });
    })


    .build();
```

## Example
[react-material-demo](https://github.com/cimdalli/react-material-demo)

## License

MIT
