import { ActionCreatorDefinition, StateToProps, DispatchToProps } from '..'

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

export const mapDispatchToProps: DispatchToProps = map => dispatch =>
  Object.keys(map).reduce(
    (prev, key) => ({
      ...prev,
      [key]: (...params: any[]) => dispatch(map[key](params)),
    }),
    {},
  ) as typeof map
