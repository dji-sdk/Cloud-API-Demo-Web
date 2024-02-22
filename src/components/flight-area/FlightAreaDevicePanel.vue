<template>
  <div class="flight-area-device-panel">
    <Title title="Choose Synchronous Devices">
      <div style="position: absolute; right: 10px;">
        <a style="color: white;" @click="closePanel"><CloseOutlined /></a>
      </div>
    </Title>
    <div class="scrollbar">
      <div id="data" v-if="data.length !== 0">
        <div v-for="dock in data" :key="dock.device_sn">
          <div class="pt5 panel flex-row" @click="selectDock(dock)" :style="{opacity: selectedDocksMap[dock.device_sn] ? 1 : 0.5 }">
            <div style="width: 88%">
              <div class="title">
                <RobotFilled class="fz20"/>
                <a-tooltip :title="dock.nickname">
                  <div class="pr10 ml5" style="width: 120px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ dock.nickname }}</div>
                </a-tooltip>
              </div>
              <div class="ml10 mr10 pr5 pl5 flex-align-center flex-row flex-justify-between" style="background: #595959;">
                <div>
                  Custom Flight Area
                </div>
                <div>
                  <div v-if="!dock.status">
                    <a-tooltip title="Dock offline">
                      <ApiOutlined />
                    </a-tooltip>
                  </div>
                  <div v-else-if="deviceStatusMap[dock.device_sn]?.flight_area_status?.sync_status === ESyncStatus.SYNCHRONIZED">
                    <a-tooltip title="Data synced">
                      <CheckCircleTwoTone twoToneColor="#28d445"/>
                    </a-tooltip>
                  </div>
                  <div v-else-if="deviceStatusMap[dock.device_sn]?.flight_area_status?.sync_status === ESyncStatus.SYNCHRONIZING
                                  || deviceStatusMap[dock.device_sn]?.flight_area_status?.sync_status === ESyncStatus.WAIT_SYNC">
                    <a-tooltip title="To be synced">
                      <SyncOutlined spin />
                    </a-tooltip>
                  </div>
                  <div v-else>
                    <a-tooltip :title="deviceStatusMap[dock.device_sn]?.flight_area_status?.sync_msg || 'No synchronization'">
                      <ExclamationCircleTwoTone twoToneColor="#e70102" />
                    </a-tooltip>
                  </div>
                </div>
              </div>
            </div>
            <div class="box" v-if="selectedDocksMap[dock.device_sn]">
              <CheckOutlined />
            </div>
          </div>
        </div>
        <DividerLine style="position: absolute; bottom: 68px;" />
        <div class="flex-row flex-justify-between footer">
          <a-button class="mr10" @click="closePanel">Cancel
          </a-button>
          <a-button type="primary" :disabled="confirmDisabled" @click="syncDeviceFlightArea">Sync
          </a-button>
        </div>
      </div>
      <div v-else>
        <a-empty :image-style="{ height: '60px', marginTop: '60px' }" />
      </div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { CloseOutlined, RobotFilled, CheckOutlined, ApiOutlined, CheckCircleTwoTone, SyncOutlined, ExclamationCircleTwoTone } from '@ant-design/icons-vue'
import Title from '/@/components/workspace/Title.vue'
import { defineEmits, onMounted, ref, defineProps, computed } from 'vue'
import { getBindingDevices } from '/@/api/manage'
import { EDeviceTypeName, ELocalStorageKey } from '/@/types'
import { IPage } from '/@/api/http/type'
import { Device } from '/@/types/device'
import DividerLine from '../workspace/DividerLine.vue'
import { message } from 'ant-design-vue'
import { GetDeviceStatus, syncFlightArea } from '/@/api/flight-area'
import { ESyncStatus } from '/@/types/flight-area'

const props = defineProps<{
  data: GetDeviceStatus[]
}>()
const emit = defineEmits(['closePanel'])
const closePanel = () => {
  emit('closePanel', false)
}

const confirmDisabled = ref(false)

const deviceStatusMap = computed(() => props.data.reduce((obj: Record<string, GetDeviceStatus>, val: GetDeviceStatus) => {
  obj[val.device_sn] = val
  return obj
}, {} as Record<string, GetDeviceStatus>))
const workspaceId = localStorage.getItem(ELocalStorageKey.WorkspaceId) || ''
const body: IPage = {
  page: 1,
  total: 0,
  page_size: 10,
}
const data = ref<Device[]>([])
const selectedDocksMap = ref<Record<string, boolean>>({})

const getDocks = async () => {
  await getBindingDevices(workspaceId, body, EDeviceTypeName.Dock).then(res => {
    if (res.code !== 0) {
      return
    }
    data.value.push(...res.data.list)
    body.page = res.data.pagination.page
    body.page_size = res.data.pagination.page_size
    body.total = res.data.pagination.total
  })
}

const selectDock = (dock: Device) => {
  if (!dock.status) {
    message.info(`Dock(${dock.nickname}) is offline.`)
    return
  }
  if (deviceStatusMap.value[dock.device_sn]?.flight_area_status?.sync_status === ESyncStatus.SYNCHRONIZING ||
      deviceStatusMap.value[dock.device_sn]?.flight_area_status?.sync_status === ESyncStatus.WAIT_SYNC) {
    message.info('The dock is synchronizing.')
    return
  }
  selectedDocksMap.value[dock.device_sn] = !selectedDocksMap.value[dock.device_sn]
}

onMounted(() => {
  getDocks()
  const key = setInterval(() => {
    if (body.total === 0 || Math.ceil(body.total / body.page_size) <= body.page) {
      clearInterval(key)
      return
    }
    body.page++
    getDocks()
  }, 1000)
})

const syncDeviceFlightArea = () => {
  const keys = Object.keys(selectedDocksMap.value)
  if (keys.length === 0) {
    message.warn('Please select the docks that need to be synchronized.')
    return
  }
  confirmDisabled.value = true
  Object.keys(selectedDocksMap.value).forEach(k => {
    const device = deviceStatusMap.value[k]
    if (device) {
      device.flight_area_status = { sync_code: 0, sync_status: ESyncStatus.WAIT_SYNC, sync_msg: '' }
    }
  })
  syncFlightArea(keys).then(res => {
    if (res.code === 0) {
      message.success('The devices are synchronizing...')
      selectedDocksMap.value = {}
    }
  }).finally(() => setTimeout(() => {
    confirmDisabled.value = false
  }, 3000))
}

</script>

<style lang="scss" scoped>
.flight-area-device-panel {
  position: absolute;
  left: 285px;
  width: 280px;
  height: 100vh;
  float: right;
  top: 0;
  z-index: 1000;
  color: white;
  background: #282828;
  .footer {
    position: absolute;
    width: 100%;
    bottom: 10px;
    padding: 10px;
    button {
      width: 45%;
      border: 0;
    }
  }
  .scrollbar {
    overflow-y: auto;
    height: calc(100vh - 150px);
  }
  .box {
    font-size: 22px;
    line-height: 60px;
  }
}
</style>
