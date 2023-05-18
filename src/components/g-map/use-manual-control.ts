import {
  ref,
  onUnmounted,
  watch,
  Ref,
} from 'vue'
import { message } from 'ant-design-vue'
import {
  DRC_METHOD,
  DroneControlProtocol,
} from '/@/types/drc'
import {
  useMqtt,
  DeviceTopicInfo
} from './use-mqtt'

let myInterval: any

export enum KeyCode {
  KEY_W = 'KeyW',
  KEY_A = 'KeyA',
  KEY_S = 'KeyS',
  KEY_D = 'KeyD',
  KEY_Q = 'KeyQ',
  KEY_E = 'KeyE',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
}

export function useManualControl (deviceTopicInfo: DeviceTopicInfo, isCurrentFlightController: Ref<boolean>) {
  const activeCodeKey = ref(null) as Ref<KeyCode | null>
  const mqttHooks = useMqtt(deviceTopicInfo)
  let seq = 0
  function handlePublish (params: DroneControlProtocol) {
    const body = {
      method: DRC_METHOD.DRONE_CONTROL,
      data: params,
    }
    handleClearInterval()
    myInterval = setInterval(() => {
      body.data.seq = seq++
      seq++
      window.console.log('keyCode>>>>', activeCodeKey.value, body)
      mqttHooks?.publishMqtt(deviceTopicInfo.pubTopic, body, { qos: 0 })
    }, 50)
  }

  function handleKeyup (keyCode: KeyCode) {
    if (!deviceTopicInfo.pubTopic) {
      message.error('请确保已经建立DRC链路')
      return
    }
    const SPEED = 5 //  check
    const HEIGHT = 5 //  check
    const W_SPEED = 20 // 机头角速度
    seq = 0
    switch (keyCode) {
      case 'KeyA':
        if (activeCodeKey.value === keyCode) return
        handlePublish({ y: -SPEED })
        activeCodeKey.value = keyCode
        break
      case 'KeyW':
        if (activeCodeKey.value === keyCode) return
        handlePublish({ x: SPEED })
        activeCodeKey.value = keyCode
        break
      case 'KeyS':
        if (activeCodeKey.value === keyCode) return
        handlePublish({ x: -SPEED })
        activeCodeKey.value = keyCode
        break
      case 'KeyD':
        if (activeCodeKey.value === keyCode) return
        handlePublish({ y: SPEED })
        activeCodeKey.value = keyCode
        break
      case 'ArrowUp':
        if (activeCodeKey.value === keyCode) return
        handlePublish({ h: HEIGHT })
        activeCodeKey.value = keyCode
        break
      case 'ArrowDown':
        if (activeCodeKey.value === keyCode) return
        handlePublish({ h: -HEIGHT })
        activeCodeKey.value = keyCode
        break
      case 'KeyQ':
        if (activeCodeKey.value === keyCode) return
        handlePublish({ w: -W_SPEED })
        activeCodeKey.value = keyCode
        break
      case 'KeyE':
        if (activeCodeKey.value === keyCode) return
        handlePublish({ w: W_SPEED })
        activeCodeKey.value = keyCode
        break
      default:
        break
    }
  }

  function handleClearInterval () {
    clearInterval(myInterval)
    myInterval = undefined
  }

  function resetControlState () {
    activeCodeKey.value = null
    seq = 0
    handleClearInterval()
  }

  function onKeyup () {
    resetControlState()
  }

  function onKeydown (e: KeyboardEvent) {
    handleKeyup(e.code as KeyCode)
  }

  function startKeyboardManualControl () {
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('keyup', onKeyup)
  }

  function closeKeyboardManualControl () {
    resetControlState()
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('keyup', onKeyup)
  }

  watch(() => isCurrentFlightController.value, (val) => {
    if (val && deviceTopicInfo.pubTopic) {
      startKeyboardManualControl()
    } else {
      closeKeyboardManualControl()
    }
  }, { immediate: true })

  onUnmounted(() => {
    closeKeyboardManualControl()
  })

  function handleEmergencyStop () {
    if (!deviceTopicInfo.pubTopic) {
      message.error('请确保已经建立DRC链路')
      return
    }
    const body = {
      method: DRC_METHOD.DRONE_EMERGENCY_STOP,
      data: {}
    }
    resetControlState()
    window.console.log('handleEmergencyStop>>>>', deviceTopicInfo.pubTopic, body)
    mqttHooks?.publishMqtt(deviceTopicInfo.pubTopic, body, { qos: 1 })
  }

  return {
    activeCodeKey,
    handleKeyup,
    handleEmergencyStop,
    resetControlState,
  }
}
