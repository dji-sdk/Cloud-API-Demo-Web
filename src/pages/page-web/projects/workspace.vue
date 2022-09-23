<template>
  <div class="project-app-wrapper">
    <div class="left">
      <Sidebar />
      <div class="main-content uranus-scrollbar dark">
        <router-view />
      </div>
    </div>
    <div class="right">
      <div class="map-wrapper">
        <GMap />
      </div>
      <div class="media-wrapper" v-if="root.$route.name === ERouterName.MEDIA">
        <MediaPanel />
      </div>
      <div class="media-wrapper" v-if="root.$route.name === ERouterName.TASK">
        <TaskPanel />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

import Sidebar from '/@/components/common/sidebar.vue'
import MediaPanel from '/@/components/MediaPanel.vue'
import TaskPanel from '/@/components/TaskPanel.vue'
import GMap from '/@/components/GMap.vue'
import { EBizCode, ERouterName } from '/@/types'
import { getRoot } from '/@/root'
import { useMyStore } from '/@/store'
import { useConnectWebSocket } from '/@/hooks/use-connect-websocket'

const root = getRoot()
const store = useMyStore()

const messageHandler = async (payload: any) => {
  if (!payload) {
    return
  }

  switch (payload.biz_code) {
    case EBizCode.GatewayOsd: {
      store.commit('SET_GATEWAY_INFO', payload.data)
      break
    }
    case EBizCode.DeviceOsd: {
      store.commit('SET_DEVICE_INFO', payload.data)
      break
    }
    case EBizCode.DockOsd: {
      store.commit('SET_DOCK_INFO', payload.data)
      break
    }
    case EBizCode.MapElementCreate: {
      store.commit('SET_MAP_ELEMENT_CREATE', payload.data)
      break
    }
    case EBizCode.MapElementUpdate: {
      store.commit('SET_MAP_ELEMENT_UPDATE', payload.data)
      break
    }
    case EBizCode.MapElementDelete: {
      store.commit('SET_MAP_ELEMENT_DELETE', payload.data)
      break
    }
    case EBizCode.DeviceOnline: {
      store.commit('SET_DEVICE_ONLINE', payload.data)
      break
    }
    case EBizCode.DeviceOffline: {
      store.commit('SET_DEVICE_OFFLINE', payload.data)
      break
    }
    case EBizCode.FlightTaskProgress: {
      store.commit('SET_FLIGHT_TASK_PROGRESS', payload.data)
      break
    }
    case EBizCode.DeviceHms: {
      store.commit('SET_DEVICE_HMS_INFO', payload.data)
      break
    }
    case EBizCode.DeviceReboot:
    case EBizCode.DroneOpen:
    case EBizCode.DroneClose:
    case EBizCode.CoverOpen:
    case EBizCode.CoverClose:
    case EBizCode.PutterOpen:
    case EBizCode.PutterClose:
    case EBizCode.ChargeOpen:
    case EBizCode.ChargeClose:
    case EBizCode.DeviceFormat:
    case EBizCode.DroneFormat:
    {
      store.commit('SET_DEVICES_CMD_EXECUTE_INFO', {
        biz_code: payload.biz_code,
        timestamp: payload.timestamp,
        ...payload.data,
      })
      break
    }
    default:
      break
  }
}

// 监听ws 消息
useConnectWebSocket(messageHandler)

</script>
<style lang="scss" scoped>
@import '/@/styles/index.scss';

.project-app-wrapper {
  display: flex;
  position: absolute;
  transition: width 0.2s ease;
  height: 100%;
  width: 100%;
  .left {
    width: 400px;
    display: flex;
    background-color: #232323;
    float: left;
  }
  .right {
    width: 100%;
    height: 100%;
    .map-wrapper {
      width: 100%;
      height: 100%;
    }
  }
  .main-content {
    flex: 1;
    color: $text-white-basic;
  }
  .media-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: #f6f8fa;
  }
  .wayline-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: #f6f8fa;
    padding: 16px;
  }
}
</style>
