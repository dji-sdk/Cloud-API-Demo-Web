<template>
  <div class="flight-area-sync-panel p10 flex-row flex-align-center" >
    <RobotFilled class="fz30" twoToneColor="red" fill="#00ff00"/>
    <div class="ml20 mr10 flex-column" @click="switchPanel">
      <div class="fz18">Sync Across Devices</div>
      <div v-if="syncDevicesCount > 0"><a-spin /> Syncing to {{ syncDevicesCount }} devices</div>
    </div>
    <RightOutlined class="fz18" @click="switchPanel"/>
    <FlightAreaDevicePanel v-if="visible" @close-panel="closePanel" :data="syncDevices"/>
  </div>

</template>

<script lang="ts" setup>
import { RobotFilled, RightOutlined } from '@ant-design/icons-vue'
import FlightAreaDevicePanel from '/@/components/flight-area/FlightAreaDevicePanel.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { GetDeviceStatus, getDeviceStatus } from '/@/api/flight-area'
import { ESyncStatus, FlightAreaSyncProgress } from '/@/types/flight-area'
import { useFlightAreaSyncProgressEvent } from './use-flight-area-sync-progress-event'

const visible = ref(false)
const syncDevices = ref<GetDeviceStatus[]>([])
const syncDevicesCount = computed(() => syncDevices.value.filter(device =>
  device.flight_area_status.sync_status === ESyncStatus.SYNCHRONIZING || device.flight_area_status.sync_status === ESyncStatus.WAIT_SYNC).length)
const getAllDeviceStatus = () => {
  getDeviceStatus().then(res => {
    if (res.code === 0) {
      syncDevices.value = res.data
    }
  })
}

onMounted(() => {
  getAllDeviceStatus()
})
const switchPanel = () => {
  visible.value = !visible.value
}
const closePanel = (val: boolean) => {
  visible.value = val
}

const handleSyncProgress = (data: FlightAreaSyncProgress) => {
  let has = false
  const status = { sync_code: data.result, sync_status: data.status, sync_msg: data.message }
  syncDevices.value.forEach(device => {
    if (data.sn === device.device_sn) {
      device.flight_area_status = status
      has = true
    }
  })
  if (!has) {
    syncDevices.value.push({ device_sn: data.sn, flight_area_status: status })
  }
}
useFlightAreaSyncProgressEvent(handleSyncProgress)

</script>

<style lang="scss" scoped>
.flight-area-sync-panel {
  height: 70px;
  cursor: pointer;
}
</style>
