import { message, notification } from 'ant-design-vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import EventBus from '/@/event-bus/'
import { EBizCode } from '/@/types'
import { ControlSource } from '/@/types/device'
import { ControlSourceChangeType, ControlSourceChangeInfo, FlyToPointMessage, TakeoffToPointMessage, DrcModeExitNotifyMessage, DrcStatusNotifyMessage } from '/@/types/drone-control'

export interface UseDroneControlWsEventParams {
}

export function useDroneControlWsEvent (sn: string, payloadSn: string, funcs?: UseDroneControlWsEventParams) {
  const droneControlSource = ref(ControlSource.A)
  const payloadControlSource = ref(ControlSource.B)
  function onControlSourceChange (data: ControlSourceChangeInfo) {
    if (data.type === ControlSourceChangeType.Flight && data.sn === sn) {
      droneControlSource.value = data.control_source
      message.info(`Flight control is changed to ${droneControlSource.value}`)
      return
    }
    if (data.type === ControlSourceChangeType.Payload && data.sn === payloadSn) {
      payloadControlSource.value = data.control_source
      message.info(`Payload control is changed to ${payloadControlSource.value}.`)
    }
  }

  function handleProgress (key: string, message: string, error: number) {
    if (error !== 0) {
      notification.error({
        key: key,
        message: key + 'Error code:' + error,
        description: message,
        duration: null
      })
    } else {
      notification.info({
        key: key,
        message: key,
        description: message,
        duration: 30
      })
    }
  }

  function handleDroneControlWsEvent (payload: any) {
    if (!payload) {
      return
    }

    switch (payload.biz_code) {
      case EBizCode.ControlSourceChange: {
        onControlSourceChange(payload.data)
        break
      }
      case EBizCode.FlyToPointProgress: {
        const { sn: deviceSn, result, message: msg } = payload.data as FlyToPointMessage
        if (deviceSn !== sn) return
        handleProgress(EBizCode.FlyToPointProgress, `device(sn: ${deviceSn}) ${msg}`, result)
        break
      }
      case EBizCode.TakeoffToPointProgress: {
        const { sn: deviceSn, result, message: msg } = payload.data as TakeoffToPointMessage
        if (deviceSn !== sn) return
        handleProgress(EBizCode.TakeoffToPointProgress, `device(sn: ${deviceSn}) ${msg}`, result)
        break
      }
      case EBizCode.JoystickInvalidNotify: {
        const { sn: deviceSn, result, message: msg } = payload.data as DrcModeExitNotifyMessage
        if (deviceSn !== sn) return
        handleProgress(EBizCode.JoystickInvalidNotify, `device(sn: ${deviceSn}) ${msg}`, result)
        break
      }
      case EBizCode.DrcStatusNotify: {
        const { sn: deviceSn, result, message: msg } = payload.data as DrcStatusNotifyMessage
        // handleProgress(EBizCode.DrcStatusNotify, `device(sn: ${deviceSn}) ${msg}`, result)

        break
      }
    }
    // eslint-disable-next-line no-unused-expressions
    // console.log('payload.biz_code', payload.data)
  }

  onMounted(() => {
    EventBus.on('droneControlWs', handleDroneControlWsEvent)
  })

  onBeforeUnmount(() => {
    EventBus.off('droneControlWs', handleDroneControlWsEvent)
  })

  return {
    droneControlSource: droneControlSource,
    payloadControlSource: payloadControlSource
  }
}
