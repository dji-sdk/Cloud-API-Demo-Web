import { DEFAULT_PLACEHOLDER, SIZES as byteSizes, BYTE_SIZES } from './constants'

/**
 * 转换字节数为单位B，KB，GB...
 * 保留一位小数
 * @param bytes 字节数
 * @param holder 0字节占位符，默认 --
 * @returns
 */
export function bytesToSize (bytes: number, holder = DEFAULT_PLACEHOLDER, fix = 1, unit = false): string {
  if (isNaN(bytes) || bytes === 0) {
    return holder
  }
  // 兼容负数
  let prefix = ''
  if (bytes < 0) {
    bytes = 0 - bytes
    prefix = '-'
  }
  const k = 1024
  const sizes = unit ? BYTE_SIZES : byteSizes// ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return prefix + (bytes / Math.pow(k, i)).toFixed(fix) + '' + sizes[i]
}

//  获取转化后数据及单位
export function getBytesObject (bytes: number, holder = DEFAULT_PLACEHOLDER, fix = 1): {
  value: string,
  size: string
  index: number
} {
  if (isNaN(bytes) || bytes === 0) {
    return {
      value: holder,
      size: '',
      index: -1,
    }
  }
  // 兼容负数
  let prefix = ''
  if (bytes < 0) {
    bytes = 0 - bytes
    prefix = '-'
  }
  const k = 1024
  const sizes = byteSizes// ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return {
    value: prefix + (bytes / Math.pow(k, i)).toFixed(fix),
    size: sizes[i],
    index: i,
  }
}

/**
 * 根据最小单位返回文件大小
 * @param bytes
 * @param minUnit
 * @param fix
 * @returns
 */
export function bytesToSizeWithMinUnit (bytes: number, minUnit = 'B', fix = 1): string {
  const holder = `0${minUnit}`
  const sizes = byteSizes// ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
  const k = 1024
  const findIndex = sizes.findIndex(item => item === minUnit)

  const { value, size, index } = getBytesObject(bytes, holder, fix)
  // 0
  if (index === -1) {
    return holder
  }
  // 转换后单位小于传入的最小单位
  if (index < findIndex) {
    const sizeToMinUint = parseFloat(value) / (Math.pow(k, findIndex - index))
    return sizeToMinUint.toFixed(fix) + minUnit
  }
  // 其他
  return value + size
}
// console.log('size', bytesToSizeWithMinUnit(0))
// console.log('size', bytesToSizeWithMinUnit(1023))
// console.log('size', bytesToSizeWithMinUnit(1024))
// console.log('size', bytesToSizeWithMinUnit(1000 * 1024, 'MB', 2))
// console.log('size', bytesToSizeWithMinUnit(1024 * 1024, 'MB', 2))
