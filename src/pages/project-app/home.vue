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
import Topbar from './topbar.vue'
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref, UnwrapRef, watch } from 'vue'
import { getPlatformInfo, getUserInfo } from '/@/api/manage'
import websocket from '/@/api/websocket'
import { useGMapCover } from '/@/hooks/use-g-map-cover'
import { getRoot } from '/@/root'
import { useMyStore } from '/@/store'
import { ELocalStorageKey, ERouterName } from '/@/types'
import ReconnectingWebSocket from 'reconnecting-websocket'

interface FormState {
  user: string
  password: string
}

const root = getRoot()
const showLogin = ref(true)

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
