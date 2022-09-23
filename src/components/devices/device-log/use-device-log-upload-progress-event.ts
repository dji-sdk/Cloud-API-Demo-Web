import EventBus from '/@/event-bus/'
import { onMounted, onBeforeUnmount } from 'vue'
import { DeviceLogUploadInfo } from '/@/types/device-log'

export function useDeviceLogUploadProgressEvent (onDeviceLogUploadWs: (data: DeviceLogUploadInfo) => void): void {
  function handleDeviceLogUploadProgress (payload: any) {
    onDeviceLogUploadWs(payload.data)
    // eslint-disable-next-line no-unused-expressions
    // console.log('payload', payload.data)
  }

  onMounted(() => {
    EventBus.on('deviceLogUploadProgress', handleDeviceLogUploadProgress)
  })

  onBeforeUnmount(() => {
    EventBus.off('deviceLogUploadProgress', handleDeviceLogUploadProgress)
  })
}
