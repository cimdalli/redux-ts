# [3.0.0](https://github.com/cimdalli/redux-ts/compare/3.0.0...2.6.0) (2018-05-08)


### BREAKING CHANGES

* **AsyncAction:** There is no more `AsyncAction`. Instead of passing dispatch through actions, it is passing to reducer body. You can use async dispatch on reducer declaration via `ReducerBuilder`.

* **ReducerBuilder.build():** Dont need to build reducer, only passing declaration is enough.