<template>
  <a-layout class="width-100 flex-display" style="height: 100vh">
    <a-layout-header class="header">
      <Topbar />
    </a-layout-header>
    <a-layout-content>
      <router-view />
    </a-layout-content>

  </a-layout>
</template>

<script lang="ts" setup>
import Topbar from '/@/components/common/topbar.vue'
import { onMounted, reactive, ref, UnwrapRef, watch } from 'vue'
import { getRoot } from '/@/root'
import { EBizCode, ELocalStorageKey, ERouterName } from '/@/types'
import { useConnectWebSocket } from '/@/hooks/use-connect-websocket'
import EventBus from '/@/event-bus'

interface FormState {
  user: string
  password: string
}

const root = getRoot()

const messageHandler = async (payload: any) => {
  if (!payload) {
    return
  }
  switch (payload.biz_code) {
    case EBizCode.DeviceUpgrade: {
      EventBus.emit('deviceUpgrade', payload)
      break
    }
    case EBizCode.DeviceLogUploadProgress: {
      EventBus.emit('deviceLogUploadProgress', payload)
      break
    }
  }
}

// 监听ws 消息
useConnectWebSocket(messageHandler)

onMounted(() => {
  const token = localStorage.getItem(ELocalStorageKey.Token)
  if (!token) {
    root.$router.push(ERouterName.PROJECT)
  }
})

</script>

<style lang="scss" scoped>
@import '/@/styles/index.scss';

.fontBold {
  font-weight: 500;
  font-size: 18px;
}

.header {
  background-color: black;
  color: white;
  height: 60px;
  font-size: 15px;
  padding: 0 20px;
}
</style>
