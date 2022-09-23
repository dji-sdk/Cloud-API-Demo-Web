<template>
  <a-modal
    title="设备日志上传"
    v-model:visible="sVisible"
    width="900px"
    :footer="null"
    @update:visible="onVisibleChange">
    <div class="device-log-upload-wrap">
      <div class="page-action-row">
        <a-button type="primary" :disabled="deviceLogUploadBtnDisabled" @click="uploadDeviceLog">上传日志</a-button>
      </div>
      <div class="device-log-list">
        <div class="log-list-item">
          <a-table  :columns="airportLogColumns"
                    :scroll="{ x: '100%', y: 600 }"
                    :data-source="airportTableLogState.logList?.list"
                    :loading="airportTableLogState.tableLoading"
                    :row-selection="airportTableLogState.rowSelection"
                    rowKey="boot_index"
                    :pagination = "false">
            <template #log_time="{record}">
              <div>{{getLogTime(record)}}</div>
            </template>
            <template #size="{record}">
              <div>{{getLogSize(record.size)}}</div>
            </template>
          </a-table>
        </div>
        <div class="log-list-item">
          <a-table  :columns="droneLogColumns"
                    :scroll="{ x: '100%', y: 600 }"
                    :data-source="droneTableLogState.logList?.list"
                    :loading="droneTableLogState.tableLoading"
                    :row-selection="droneTableLogState.rowSelection"
                    rowKey="boot_index"
                    :pagination = "false">
            <template #log_time="{record}">
              <div>{{getLogTime(record)}}</div>
            </template>
            <template #size="{record}">
              <div>{{getLogSize(record.size)}}</div>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { watchEffect, reactive, ref, computed, defineProps, defineEmits } from 'vue'
import { ColumnProps, TableState } from 'ant-design-vue/lib/table/interface'
import { IPage } from '/@/api/http/type'
import { Device, DOMAIN } from '/@/types/device'
import { getDeviceLogList, postDeviceUpgrade, DeviceLogFileInfo, UploadDeviceLogBody, DeviceLogItem } from '/@/api/device-log'
import { message } from 'ant-design-vue'
import { useDeviceLogUploadDetail } from './use-device-log-upload-detail'

const props = defineProps<{
  visible: boolean,
  device: null | Device,
}>()
const emit = defineEmits(['update:visible', 'upload-log-ok'])

const sVisible = ref(false)

watchEffect(() => {
  sVisible.value = props.visible
  // 显示弹框时，获取设备日志信息
  if (props.visible) {
    getDeviceLogInfo()
  }
})

function onVisibleChange (sVisible: boolean) {
  setVisible(sVisible)
  if (!sVisible) {
    resetTableLogState()
  }
}

function setVisible (v: boolean, e?: Event) {
  sVisible.value = v
  emit('update:visible', v, e)
}

// 表格
const airportLogColumns: ColumnProps[] = [
  { title: '机场日志', dataIndex: 'time', width: 100, slots: { customRender: 'log_time' } },
  { title: '文件大小', dataIndex: 'size', width: 25, slots: { customRender: 'size' } },
]

const droneLogColumns: ColumnProps[] = [
  { title: '飞行器日志', dataIndex: 'time', width: 100, slots: { customRender: 'log_time' } },
  { title: '文件大小', dataIndex: 'size', width: 25, slots: { customRender: 'size' } },
]

const airportTableLogState = reactive({
  logList: {} as DeviceLogFileInfo,
  tableLoading: false,
  selectRow: [],
  rowSelection: {
    columnWidth: 15,
    selectedRowKeys: [] as number[],
    onChange: (selectedRowKeys:number[], selectedRows: []) => {
      airportTableLogState.rowSelection.selectedRowKeys = selectedRowKeys
      airportTableLogState.selectRow = selectedRows
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
  }
})

function resetTableLogState () {
  airportTableLogState.logList = {} as DeviceLogFileInfo
  airportTableLogState.selectRow = []
  airportTableLogState.tableLoading = false
}

const droneTableLogState = reactive({
  logList: {} as DeviceLogFileInfo,
  tableLoading: false,
  selectRow: [],
  rowSelection: {
    columnWidth: 15,
    selectedRowKeys: [] as number[],
    onChange: (selectedRowKeys: number[], selectedRows: []) => {
      droneTableLogState.rowSelection.selectedRowKeys = selectedRowKeys
      droneTableLogState.selectRow = selectedRows
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    },
  }
})

const deviceLogUploadBtnDisabled = computed(() => {
  return (airportTableLogState.rowSelection.selectedRowKeys && airportTableLogState.rowSelection.selectedRowKeys.length <= 0) &&
  (droneTableLogState.rowSelection.selectedRowKeys && droneTableLogState.rowSelection.selectedRowKeys.length <= 0)
})

// 获取设备内日志
async function getDeviceLogInfo () {
  airportTableLogState.tableLoading = true
  droneTableLogState.tableLoading = true
  try {
    const { code, data } = await getDeviceLogList({
      device_sn: props.device?.device_sn || '',
      domain: [DOMAIN.DOCK, DOMAIN.DRONE]
    })
    if (code === 0) {
      const { files } = data
      if (files && files.length > 0) {
        files.forEach(file => {
          if (file.module === DOMAIN.DOCK) {
            airportTableLogState.logList = file
          } else if (file.module === DOMAIN.DRONE) {
            droneTableLogState.logList = file
          }
        })
      }
    }
  } catch (err) {
  }
  airportTableLogState.tableLoading = false
  droneTableLogState.tableLoading = false
}

// 日志上传
async function uploadDeviceLog () {
  const body = {
    device_sn: props.device?.device_sn || '',
    files: [] as any
  } as UploadDeviceLogBody
  if (airportTableLogState.selectRow && airportTableLogState.selectRow.length > 0) {
    body.files.push({
      list: airportTableLogState.selectRow,
      device_sn: airportTableLogState.logList.device_sn,
      module: airportTableLogState.logList.module
    })
  }
  if (droneTableLogState.selectRow && droneTableLogState.selectRow.length > 0) {
    body.files.push({
      list: droneTableLogState.selectRow,
      device_sn: droneTableLogState.logList.device_sn,
      module: droneTableLogState.logList.module
    })
  }
  const { code } = await postDeviceUpgrade(body)
  if (code === 0) {
    message.success('日志上传任务执行成功')
    emit('upload-log-ok')
    setVisible(false)
  }
}

const { getLogTime, getLogSize } = useDeviceLogUploadDetail()

</script>

<style lang="scss" scoped>
.device-log-upload-wrap{

  .device-log-list{
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    .log-list-item{
      width: 420px;
    }
  }
}
</style>
