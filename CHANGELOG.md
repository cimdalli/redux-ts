# [4.0.0](https://github.com/cimdalli/redux-ts/compare/4.0.0...3.0.0) (2018-05-12)

### BREAKING CHANGES

* **Actions:** The way creating and registering action has been changed. Instead of declaring action as class, you can create them via `createAction` function. (It is changed since modifying uglify settings for a library does not make sense and it is more compatible with FSA standards.)

### Features

* **mapDispatchToProps:** This new method can be used for mapping actions to props in easy way. You can find the usage in readme.

# [3.0.0](https://github.com/cimdalli/redux-ts/compare/3.0.0...2.6.0) (2018-05-08)

### BREAKING CHANGES

* **AsyncAction:** There is no more `AsyncAction`. Instead of passing dispatch through actions, it is passing to reducer body. You can use async dispatch on reducer declaration via `ReducerBuilder`.

* **ReducerBuilder.build():** Dont need to build reducer, only passing declaration is enough.
