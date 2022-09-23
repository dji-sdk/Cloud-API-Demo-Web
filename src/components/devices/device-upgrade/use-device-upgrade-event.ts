import EventBus from '/@/event-bus/'
import { onMounted, onBeforeUnmount } from 'vue'
import { DeviceCmdExecuteInfo, DeviceCmdExecuteStatus } from '/@/types/device-cmd'

export function useDeviceUpgradeEvent (onDeviceUpgradeWs: (payload: DeviceCmdExecuteInfo) => void): void {
  function handleDeviceUpgrade (payload: any) {
    onDeviceUpgradeWs(payload.data)
    // eslint-disable-next-line no-unused-expressions
    // console.log('payload', payload.data)
  }

  onMounted(() => {
    EventBus.on('deviceUpgrade', handleDeviceUpgrade)
  })

  onBeforeUnmount(() => {
    EventBus.off('deviceUpgrade', handleDeviceUpgrade)
  })
}
