import { isArray, isObject, isString } from 'lodash'
// import { compress, decompress } from 'lz-string'

export const setLocalStorage = (key: string, value: string | object | [any] | any) => {
  if (isObject(value) || isArray(value)) {
    value = JSON.stringify(value)
  }

  // const compressedKey = compress(key)
  // const compressedValue = compress(JSON.stringify(value))

  if (typeof window !== 'undefined') {
    // localStorage.setItem(compressedKey, compressedValue)
    localStorage.setItem(key, value)
  }
}

export const getLocalStorage = (key: string) => {
  let compressedValue
  if (typeof window !== 'undefined') {
    // compressedValue = localStorage.getItem(compress(key))
    compressedValue = localStorage.getItem(key)
  }

  if (compressedValue !== null) {
    // const decompressedValue = decompress(compressedValue!)
    const decompressedValue = compressedValue
    if (isString(decompressedValue)) {
      return decompressedValue
    }

    return JSON.parse(decompressedValue || '{}')
  }
}
