<template>
  <a-layout class="flex-display" style="height: 100vh; background-color: white;">
  <div class="height100 width100 flex-column flex-justify-start flex-align-start">
    <a-row class="pt20 pl20" style="height: 45px; width: 100vw" align="middle">
      <a-col :span="1">
        <span style="color: #1fa3f6" class="fz26"><SendOutlined rotate="90" /></span>
      </a-col>
      <a-col :span="20">
        <span class="fz20 pl5">{{ drone.data.model }}</span>
      </a-col>
      <a-col :span="3">
        <span class="fz16" v-if="drone.data.bound_status" style="color: #737373">Bound</span>
        <a-button type="primary" @click="onBindDevice" v-else>Bind</a-button>
      </a-col>
    </a-row>
  </div>
  </a-layout>
</template>

<script lang="ts" setup>
import { SendOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'
import { BindBody, bindDevice } from '/@/api/manage'
import apiPilot from '/@/api/pilot-bridge'
import { getRoot } from '/@/root'
import { ELocalStorageKey } from '/@/types'
import { DeviceStatus } from '/@/types/device'

const root = getRoot()
interface DeviceStatusData {
  data: DeviceStatus
}
const drone = reactive<DeviceStatusData>({
  data: JSON.parse(localStorage.getItem(ELocalStorageKey.Device)!)
})

function onBindDevice () {
  const bindParam: BindBody = {
    device_sn: drone.data.sn,
    user_id: localStorage.getItem(ELocalStorageKey.UserId)!,
    workspace_id: localStorage.getItem(ELocalStorageKey.WorkspaceId)!
  }
  bindDevice(bindParam).then(bindRes => {
    if (bindRes.code !== 0) {
      message.error('bind failed:' + bindRes.message)
      console.error(bindRes.message)
      return
    }
    drone.data.bound_status = true
    localStorage.setItem(ELocalStorageKey.Device, JSON.stringify(drone.data))
  })
}
</script>
