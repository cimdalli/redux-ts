import { ActionCreatorDefinition, DispatchToProps, Indexer } from '../'

export const createAction = <TPayload = any, TMeta = any>(
  type: string,
): ActionCreatorDefinition<TPayload, TMeta> => {
  const creator: any = (payload?: TPayload, meta?: TMeta) => ({
    payload,
    meta,
    type,
  })
  creator.type = type
  return creator
}


/**
* Dummy function to return `MapDispatchToPropsParam` type that can be passed to `connect`
* As paramter, either mapper function which takes dispatch object and returns indexer object or indexer object is required
* ex. 
* const changeLayout = createAction('changeLayout')
* const dispatchedProps = mapDispatchToProps((dispatch, own) => ({ changeLayout: () => dispatch(changeLayout()) }))
* // or
* const dispatchedProps = mapDispatchToProps({ changeLayout }))
* 
* @param {*} map
*/
export const mapDispatchToProps: DispatchToProps = map => (dispatch, own) => {
  const mapper = <T extends Indexer>(m: T) =>
    Object.keys(m).reduce(
      (prev, key) => ({
        ...prev,
        [key]: (...params: any[]) => dispatch(m[key](...params)),
      }),
      {},
    ) as typeof m

  return typeof map === 'function' ? mapper(map(dispatch, own)) : mapper(map)
}