import { ref, onMounted, onBeforeUnmount } from 'vue'
import EventBus from '/@/event-bus/'
import {
  DRC_METHOD,
  DRCHsiInfo,
  DRCOsdInfo,
  DRCDelayTimeInfo,
  DrcResponseInfo,
} from '/@/types/drc'

export function useDroneControlMqttEvent (sn: string) {
  const drcInfo = ref('')
  const hsiInfo = ref('')
  const osdInfo = ref('')
  const delayInfo = ref('')
  const errorInfo = ref('')

  function handleHsiInfo (data: DRCHsiInfo) {
    hsiInfo.value = `method: ${DRC_METHOD.HSI_INFO_PUSH}\r\n ${JSON.stringify(data)}\r\n `
  }

  function handleOsdInfo (data: DRCOsdInfo) {
    osdInfo.value = `method: ${DRC_METHOD.OSD_INFO_PUSH}\r\n ${JSON.stringify(data)}\r\n `
  }

  function handleDelayTimeInfo (data: DRCDelayTimeInfo) {
    delayInfo.value = `method: ${DRC_METHOD.DELAY_TIME_INFO_PUSH}\r\n ${JSON.stringify(data)}\r\n `
  }

  function handleDroneControlErrorInfo (data: DrcResponseInfo) {
    if (!data.result) {
      return
    }
    errorInfo.value = `Drc error code: ${data.result}, seq: ${data.output?.seq}`
  }

  function handleDroneControlMqttEvent (payload: any) {
    if (!payload || !payload.method) {
      return
    }

    switch (payload.method) {
      case DRC_METHOD.HSI_INFO_PUSH: {
        handleHsiInfo(payload.data)
        break
      }
      case DRC_METHOD.OSD_INFO_PUSH: {
        handleOsdInfo(payload.data)
        break
      }
      case DRC_METHOD.DELAY_TIME_INFO_PUSH: {
        handleDelayTimeInfo(payload.data)
        break
      }
      case DRC_METHOD.DRONE_EMERGENCY_STOP:
      case DRC_METHOD.DRONE_CONTROL: {
        handleDroneControlErrorInfo(payload.data)
        break
      }
    }
    drcInfo.value = hsiInfo.value + osdInfo.value + delayInfo.value
  }

  onMounted(() => {
    EventBus.on('droneControlMqttInfo', handleDroneControlMqttEvent)
  })

  onBeforeUnmount(() => {
    EventBus.off('droneControlMqttInfo', handleDroneControlMqttEvent)
  })

  return {
    drcInfo: drcInfo,
    errorInfo: errorInfo
  }
}
