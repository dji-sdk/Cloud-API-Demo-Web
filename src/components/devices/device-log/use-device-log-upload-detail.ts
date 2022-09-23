import { DeviceLogItem } from '/@/api/device-log'
import { bytesToSize } from '/@/utils/bytes'
import { formatUnixTime } from '/@/utils/time'
import {
  DATE_FORMAT_MINUTE
} from '/@/utils/constants'

export function useDeviceLogUploadDetail () {
  function getLogTime (deviceLog: DeviceLogItem): string {
    const startTime = formatUnixTime(deviceLog.start_time, DATE_FORMAT_MINUTE)
    const endTime = formatUnixTime(deviceLog.end_time, DATE_FORMAT_MINUTE)
    return `${startTime} — ${endTime}`
  }

  function getLogSize (size: number) {
    return bytesToSize(size)
  }

  return {
    getLogTime,
    getLogSize
  }
}
