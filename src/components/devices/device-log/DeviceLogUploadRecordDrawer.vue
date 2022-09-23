<template>
  <a-drawer
    title="设备日志上传记录"
    placement="right"
    v-model:visible="sVisible"
    @update:visible="onVisibleChange"
    :width="800">
    <!-- 设备日志上传记录 -->
    <div class="device-log-upload-record-wrap">
      <div class="page-action-row">
        <a-button type="primary" @click="onUploadDeviceLog">上传日志</a-button>
      </div>
      <div class="device-log-upload-list">
        <a-table :columns="deviceLogUploadListColumns"
                  :scroll="{ x: '100%', y: 600 }"
                  :data-source="deviceUploadLogState.uploadLogList"
                  :loading="deviceUploadLogState.loading"
                  :pagination="deviceUploadLogState.paginationProp"
                  @change="onDeviceUploadLogTableChange"
                  rowKey="logs_id">
         <!-- 设备类型 -->
          <template #device_type="{ record }">
            <div>
              <div v-if="getDeviceInfo(record).parents && getDeviceInfo(record).parents.length > 0">{{ DEVICE_NAME[getDeviceInfo(record).parents[0].device_model.key]}}</div>
              <div v-if="getDeviceInfo(record).hosts && getDeviceInfo(record).hosts.length > 0">{{ DEVICE_NAME[getDeviceInfo(record).hosts[0].device_model.key]}}</div>
            </div>
          </template>
          <!-- 设备sn -->
          <template #device_sn="{ record }">
            <div>
              <div v-if="getDeviceInfo(record).parents && getDeviceInfo(record).parents.length > 0">{{ getDeviceInfo(record).parents[0].sn }}</div>
              <div v-if="getDeviceInfo(record).hosts && getDeviceInfo(record).hosts.length > 0">{{ getDeviceInfo(record).hosts[0].sn }}</div>
            </div>
          </template>
          <!-- 上传状态 -->
          <template #status="{ record }">
            <div>
              <div>
                <span class="circle-icon" :style="{backgroundColor: getDeviceLogUploadStatus(record).color}"></span>
                {{ getDeviceLogUploadStatus(record).text }}
              </div>
              <div v-if="record.status === DeviceLogUploadStatusEnum.Uploading">
                <a-progress :percent="getLogProgress(record)" />
              </div>
            </div>
          </template>
          <!-- 操作 -->
          <template #action="{ record }">
            <div class="row-action">
              <a-tooltip title="查看详情">
                  <FileTextOutlined  @click="showDeviceLogDetail(record)"/>
              </a-tooltip>
              <span v-if="record.status === DeviceLogUploadStatusEnum.Uploading">
                <a-tooltip title="取消">
                  <StopOutlined @click="onCancelUploadDeviceLog(record)"/>
                </a-tooltip>
              </span>
              <span v-else>
                <a-tooltip title="删除">
                  <DeleteOutlined @click="onDeleteUploadDeviceLog(record)"/>
                </a-tooltip>
              </span>
            </div>
          </template>
        </a-table>
      </div>
    </div>
  </a-drawer>
  <!-- 设备日志上传弹框 -->
  <DeviceLogUploadModal
     v-model:visible="deviceLogUploadModalVisible"
     :device="props.device"
     @upload-log-ok="onUploadLogOk"
  ></DeviceLogUploadModal>

  <!-- 设备日志上传详情弹框 -->
  <DeviceLogDetailModal
     v-model:visible="deviceLogDetailModalVisible"
     :deviceLog="currentDeviceLog"
  ></DeviceLogDetailModal>
</template>

<script lang="ts" setup>
import { watchEffect, reactive, ref, defineProps, defineEmits } from 'vue'
import { ColumnProps, TableState } from 'ant-design-vue/lib/table/interface'
import { IPage } from '/@/api/http/type'
import { Device, DOMAIN, DEVICE_NAME } from '/@/types/device'
import DeviceLogUploadModal from './DeviceLogUploadModal.vue'
import DeviceLogDetailModal from './DeviceLogDetailModal.vue'
import { getDeviceUploadLogList, GetDeviceUploadLogListRsp, cancelDeviceLogUpload, deleteDeviceLogUpload } from '/@/api/device-log'
import { StopOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons-vue'
import { DeviceLogUploadStatusEnum, DeviceLogUploadStatusMap, DeviceLogUploadStatusColor, DeviceLogUploadInfo, DeviceLogUploadWsStatusMap, DeviceLogProgressInfo } from '/@/types/device-log'
import { useDeviceLogUploadProgressEvent } from './use-device-log-upload-progress-event'
import { Modal } from 'ant-design-vue'

const props = defineProps<{
  visible: boolean,
  device: null | Device,
}>()
const emit = defineEmits(['update:visible'])

const sVisible = ref(false)

watchEffect(() => {
  sVisible.value = props.visible
  // 显示弹框时，获取设备日志上传记录信息
  if (props.visible) {
    getDeviceUploadLogInfo()
  }
})

function onVisibleChange (sVisible: boolean) {
  setVisible(sVisible)
}

function setVisible (v: boolean, e?: Event) {
  sVisible.value = v
  emit('update:visible', v, e)
}

// 日志列表
const deviceLogUploadListColumns: ColumnProps[] = [
  { title: '上传时间', dataIndex: 'create_time', width: 100 },
  { title: '设备型号', dataIndex: 'device_type', width: 80, slots: { customRender: 'device_type' } },
  { title: '设备SN', dataIndex: 'device_sn', width: 120, slots: { customRender: 'device_sn' } },
  { title: '上传状态', dataIndex: 'status', width: 120, slots: { customRender: 'status' } },
  { title: '操作', dataIndex: 'actions', width: 80, slots: { customRender: 'action' } },
]

const deviceUploadLogState = reactive({
  uploadLogList: [] as GetDeviceUploadLogListRsp[],
  loading: false,
  paginationProp: {
    pageSizeOptions: ['20', '50', '100'],
    showQuickJumper: true,
    showSizeChanger: true,
    pageSize: 50,
    current: 1,
    total: 0
  }
})

// 获取上传的设备日志
async function getDeviceUploadLogInfo () {
  deviceUploadLogState.loading = true
  try {
    const { code, data } = await getDeviceUploadLogList({
      device_sn: props.device?.device_sn || '',
      page: deviceUploadLogState.paginationProp.current,
      page_size: deviceUploadLogState.paginationProp.pageSize
    })
    if (code === 0) {
      deviceUploadLogState.uploadLogList = data.list
      deviceUploadLogState.paginationProp.total = data.pagination.total
      deviceUploadLogState.paginationProp.current = data.pagination.page
      deviceUploadLogState.paginationProp.pageSize = data.pagination.page_size
    }
    deviceUploadLogState.loading = false
  } catch (error) {
    deviceUploadLogState.loading = false
  }
}
type Pagination = TableState['pagination']

// 获取设备信息
function getDeviceInfo (deviceLogItem: GetDeviceUploadLogListRsp) {
  const { device_topo: deviceTopo } = deviceLogItem
  return deviceTopo
}

// 获取上传状态
function getDeviceLogUploadStatus (deviceLogItem: GetDeviceUploadLogListRsp) {
  const statusObj = {
    color: '',
    text: ''
  }
  const { status } = deviceLogItem
  statusObj.color = DeviceLogUploadStatusColor[status]
  statusObj.text = DeviceLogUploadStatusMap[status]
  return statusObj
}

// 获取上传进度
function getLogProgress (deviceLogItem: GetDeviceUploadLogListRsp) {
  let percent = 0
  const { logs_progress } = deviceLogItem
  if (logs_progress && logs_progress.length > 0) {
    logs_progress.forEach(log => {
      percent += (log.progress || 0)
    })
    percent = percent / logs_progress.length
  }
  return Math.floor(percent)
}

// 设备日志上传进度更新
function onDeviceLogUploadWs (data: DeviceLogUploadInfo) {
  const { sn, output } = data
  if (output) {
    const { files, status, logs_id: logId } = output || {}
    const deviceLogItem = deviceUploadLogState.uploadLogList.find(log => log.logs_id === logId)
    if (!deviceLogItem) return
    if (status) {
      deviceLogItem.status = DeviceLogUploadWsStatusMap[status]
    }
    if (files && files.length > 0) {
      const logsProgress = [] as DeviceLogProgressInfo[]
      files.forEach(file => {
        logsProgress.push({
          ...file,
          status: DeviceLogUploadWsStatusMap[file.status]
        })
      })
      deviceLogItem.logs_progress = logsProgress
    }
  }
}

useDeviceLogUploadProgressEvent(onDeviceLogUploadWs)

// 搜索
async function onDeviceUploadLogTableChange (page: Pagination) {
  deviceUploadLogState.paginationProp.current = page?.current || 1
  deviceUploadLogState.paginationProp.pageSize = page?.pageSize || 20
  await getDeviceUploadLogInfo()
}

// 查看上传设备日志详情
const deviceLogDetailModalVisible = ref(false)
const currentDeviceLog = ref({} as GetDeviceUploadLogListRsp)

function showDeviceLogDetail (deviceLogItem: GetDeviceUploadLogListRsp) {
  if (!deviceLogItem) return
  currentDeviceLog.value = deviceLogItem
  deviceLogDetailModalVisible.value = true
}

// 取消上传设备日志
async function onCancelUploadDeviceLog (deviceLogItem: GetDeviceUploadLogListRsp) {
  Modal.confirm({
    title: '取消日志上传',
    content: '您确认取消设备日志上传吗？',
    okType: 'danger',
    onOk () {
      cancelDeviceLogUploadOk()
    },
  })
}

async function cancelDeviceLogUploadOk () {
  const { code } = await cancelDeviceLogUpload({
    device_sn: props.device?.device_sn || '',
    module_list: [DOMAIN.DOCK, DOMAIN.DRONE],
    status: 'cancel'
  })
  if (code === 0) {
    await getDeviceUploadLogInfo()
  }
}

// 删除上传的设备日志
function onDeleteUploadDeviceLog (deviceLogItem: GetDeviceUploadLogListRsp) {
  Modal.confirm({
    title: '删除上传日志',
    content: '您确认删除该条已上传设备日志吗？',
    okType: 'danger',
    onOk () {
      deleteUploadDeviceLogOk(deviceLogItem)
    },
  })
}

async function deleteUploadDeviceLogOk (deviceLogItem: GetDeviceUploadLogListRsp) {
  const { code } = await deleteDeviceLogUpload({
    device_sn: props.device?.device_sn || '',
    logs_id: deviceLogItem.logs_id
  })
  if (code === 0) {
    await getDeviceUploadLogInfo()
  }
}

// 上传日志
const deviceLogUploadModalVisible = ref(false)

function onUploadDeviceLog () {
  deviceLogUploadModalVisible.value = true
}

function onUploadLogOk () {
  // 刷新列表
  getDeviceUploadLogInfo()
}
</script>

<style lang="scss" scoped>
.device-log-upload-record-wrap{
  .page-action-row{
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .device-log-upload-list{
    padding: 20px 0 10px;
  }

  .circle-icon {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 3px;
    border-radius: 50%;
    vertical-align: middle;
    flex-shrink: 0;
  }

  .row-action{
    color: #2d8cf0;

    & > span{
      margin-right: 10px;
    }
  }
}
</style>
