import { EStorageKey } from '/@/types/enums'
import { consoleWarn } from './logger'

function getStorageData (key: EStorageKey, parse?: boolean): string | null
function getStorageData<T> (key: EStorageKey, parse?: boolean): T | null
function getStorageData (key: EStorageKey, parse?: boolean): any {
  const value = window.localStorage.getItem(key)
  if (parse && value) {
    try {
      const result = JSON.parse(value)
      return result
    } catch (e) {
      consoleWarn('appStorage.get failed, err:', e)
      return null
    }
  } else {
    return value
  }
}

function clearStorageData (key: EStorageKey | EStorageKey[]) {
  let keyList: EStorageKey[] = []
  if (Array.isArray(key)) {
    keyList = key
  } else {
    keyList = [key]
  }
  keyList.forEach(item => {
    window.localStorage.removeItem(item)
  })
}

const appStorage = {
  save (key: EStorageKey, value: string) {
    window.localStorage.setItem(key, value)
  },
  get: getStorageData,

  clear: clearStorageData,
}

export default appStorage
