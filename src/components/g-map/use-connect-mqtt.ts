
import {
  ref,
  watch,
  computed,
  onUnmounted,
} from 'vue'
import { useMyStore } from '/@/store'
import { postDrc } from '/@/api/drc'
import {
  UranusMqtt,
} from '/@/mqtt'

type StatusOptions = {
  status: 'close';
  event?: CloseEvent;
} | {
  status: 'open';
  retryCount: number;
} | {
  status: 'pending';
}

export function useConnectMqtt () {
  const store = useMyStore()
  const dockOsdVisible = computed(() => {
    return store.state.osdVisible && store.state.osdVisible.visible && store.state.osdVisible.is_dock
  })
  const mqttState = ref<UranusMqtt | null>(null)

  // 监听已打开的设备小窗 窗口数量
  watch(() => dockOsdVisible.value, async (val) => {
    // 1.打开小窗
    // 2.设备拥有飞行控制权
    // 3.请求建立mqtt连接的认证信息
    if (val) {
      if (mqttState.value) return
      const result = await postDrc({})
      if (result?.code === 0) {
        const { address, client_id, username, password, expire_time } = result.data
        // @TODO: 校验 expire_time
        mqttState.value = new UranusMqtt(address, {
          clientId: client_id,
          username,
          password,
        })
        mqttState.value?.initMqtt()
        mqttState.value?.on('onStatus', (statusOptions: StatusOptions) => {
          // @TODO: 异常case
        })

        store.commit('SET_MQTT_STATE', mqttState.value)
        store.commit('SET_CLIENT_ID', client_id)
      }
      // @TODO: 认证失败case
      return
    }
    // 关闭所有小窗后
    // 1.销毁mqtt连接重置mqtt状态
    if (mqttState?.value) {
      mqttState.value?.destroyed()
      mqttState.value = null
      store.commit('SET_MQTT_STATE', null)
      store.commit('SET_CLIENT_ID', '')
    }
  }, { immediate: true })

  onUnmounted(() => {
    mqttState.value?.destroyed()
  })
}
