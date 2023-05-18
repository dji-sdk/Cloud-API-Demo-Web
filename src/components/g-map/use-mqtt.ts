import {
  ref,
  reactive,
  computed,
  watch,
  onUnmounted,
} from 'vue'
import {
  IClientPublishOptions,
  IPublishPacket,
} from '/@/mqtt'
import { useMyStore } from '/@/store'
import {
  DRC_METHOD,
} from '/@/types/drc'
import EventBus from '/@/event-bus'

export interface DeviceTopicInfo{
  sn: string
  pubTopic: string
  subTopic: string
}

type MessageMqtt = (topic: string, payload: Buffer, packet: IPublishPacket) => void | Promise<void>

export function useMqtt (deviceTopicInfo: DeviceTopicInfo) {
  let cacheSubscribeArr: {
    topic: string;
    callback?: MessageMqtt;
  }[] = []

  const store = useMyStore()

  const mqttState = computed(() => {
    return store.state.mqttState
  })

  function publishMqtt (topic: string, body: object, ots?: IClientPublishOptions) {
    // const buffer = Buffer.from(JSON.stringify(body))
    mqttState.value?.publishMqtt(topic, JSON.stringify(body), ots)
  }

  function subscribeMqtt (topic: string, handleMessageMqtt?: MessageMqtt) {
    mqttState.value?.subscribeMqtt(topic)
    const handler = handleMessageMqtt || onMessageMqtt
    mqttState.value?.on('onMessageMqtt', handler)
    cacheSubscribeArr.push({
      topic,
      callback: handler,
    })
  }

  function onMessageMqtt (message: any) {
    if (cacheSubscribeArr.findIndex(item => item.topic === message?.topic) !== -1) {
      const payloadStr = new TextDecoder('utf-8').decode(message?.payload)
      const payloadObj = JSON.parse(payloadStr)
      switch (payloadObj?.method) {
        case DRC_METHOD.HEART_BEAT:
          break
        case DRC_METHOD.DELAY_TIME_INFO_PUSH:
        case DRC_METHOD.HSI_INFO_PUSH:
        case DRC_METHOD.OSD_INFO_PUSH:
        case DRC_METHOD.DRONE_CONTROL:
        case DRC_METHOD.DRONE_EMERGENCY_STOP:
          EventBus.emit('droneControlMqttInfo', payloadObj)
          break
        default:
          break
      }
    }
  }

  function unsubscribeDrc () {
    // 销毁已订阅事件
    cacheSubscribeArr.forEach(item => {
      mqttState.value?.off('onMessageMqtt', item.callback)
      mqttState.value?.unsubscribeMqtt(item.topic)
    })
    cacheSubscribeArr = []
  }

  // 心跳
  const heartBeatSeq = ref(0)
  const state = reactive({
    heartState: new Map<string, {
      pingInterval: any;
    }>(),
  })

  // 监听云控控制权
  watch(() => deviceTopicInfo, (val, oldVal) => {
    if (val.subTopic !== '') {
      // 1.订阅topic
      subscribeMqtt(deviceTopicInfo.subTopic)
      // 2.发心跳
      publishDrcPing(deviceTopicInfo.sn)
    } else {
      clearInterval(state.heartState.get(deviceTopicInfo.sn)?.pingInterval)
      state.heartState.delete(deviceTopicInfo.sn)
      heartBeatSeq.value = 0
    }
  }, { immediate: true, deep: true })

  function publishDrcPing (sn: string) {
    const body = {
      method: DRC_METHOD.HEART_BEAT,
      data: {
        ts: new Date().getTime(),
        seq: heartBeatSeq.value,
      },
    }
    const pingInterval = setInterval(() => {
      if (!mqttState.value) return
      heartBeatSeq.value += 1
      body.data.ts = new Date().getTime()
      body.data.seq = heartBeatSeq.value
      publishMqtt(deviceTopicInfo.pubTopic, body, { qos: 0 })
    }, 1000)
    state.heartState.set(sn, {
      pingInterval,
    })
  }

  onUnmounted(() => {
    unsubscribeDrc()
    heartBeatSeq.value = 0
  })

  return {
    mqttState,
    publishMqtt,
    subscribeMqtt,
  }
}
