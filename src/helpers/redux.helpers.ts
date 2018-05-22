import { ActionCreatorDefinition, DispatchToProps, Indexer } from '..'

export const createAction = <TPayload>(
  type: string,
): ActionCreatorDefinition<TPayload> => {
  const creator: any = (payload = {}, meta = {}) => ({
    type,
    payload,
    meta,
  })
  creator.type = type
  return creator
}

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

  // : map =>  mapper(d, o)
}
