import { StringOfLength } from '../types'

/// string type helpers

// This is a type guard function which can be used to assert that a string
// is of type StringOfLength<Min,Max>
const isStringOfLength = <Min extends number, Max extends number>(
  str: string,
  min: Min,
  max: Max
): str is StringOfLength<Min, Max> => str.length >= min && str.length <= max

// type constructor function
export const stringOfLength = <Min extends number, Max extends number>(
  input: unknown,
  min: Min,
  max: Max
): StringOfLength<Min, Max> => {
  if (typeof input !== 'string') {
    throw new Error('invalid input')
  }
  if (!isStringOfLength(input, min, max)) {
    throw new Error('input is not between specified min and max')
  }
  return input // the type of input here is now StringOfLength<Min,Max>
}

/// / json helpers
export const isJson = (value: string): boolean => {
  try {
    JSON.parse(value)
  } catch (e) {
    return false
  }
  return true
}

export const isUUIDv4 = (input: string): boolean => {
  const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidv4Regex.test(input)
}
