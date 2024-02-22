import {
  DATE_FORMAT,
  DEFAULT_PLACEHOLDER
} from '/@/utils/constants'
import moment, { Moment } from 'moment'

// 时间字符串 或者 Unix 时间戳（毫秒数）
export function formatDateTime (time: string | number, format = DATE_FORMAT) {
  return time ? moment(time).format(format) : DEFAULT_PLACEHOLDER
}

// Unix 时间戳 (秒)
export function formatUnixTime (time: number, format = DATE_FORMAT): string {
  return time ? moment.unix(time).format(format) : DEFAULT_PLACEHOLDER
}
