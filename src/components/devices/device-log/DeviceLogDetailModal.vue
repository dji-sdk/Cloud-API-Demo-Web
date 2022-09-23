<template>
  <a-modal
    title="日志上传详情"
    v-model:visible="sVisible"
    width="900px"
    :footer="null"
    @update:visible="onVisibleChange">
    <div class="device-log-detail-wrap">
      <div class="device-log-list">
        <div class="log-list-item">
          <a-button type="primary" class="download-btn" :disabled="!airportTableLogState.logList?.file_id"  size="small" @click="onDownloadLog(airportTableLogState.logList.file_id)">
             下载机场日志
          </a-button>
          <a-table  :columns="airportLogColumns"
                    :scroll="{ x: '100%', y: 600 }"
                    :data-source="airportTableLogState.logList?.list"
                    rowKey="boot_index"
                    :pagination = "false"
                    >
            <template #log_time="{record}">
              <div>{{getLogTime(record)}}</div>
            </template>
            <template #size="{record}">
              <div>{{getLogSize(record.size)}}</div>
            </template>
          </a-table>
        </div>
        <div class="log-list-item">
          <a-button type="primary"  class="download-btn" :disabled="!droneTableLogState.logList?.file_id" size="small" @click="onDownloadLog(droneTableLogState.logList.file_id)">
             下载飞行器日志
          </a-button>
          <a-table  :columns="droneLogColumns"
                    :scroll="{ x: '100%', y: 600 }"
                    :data-source="droneTableLogState.logList?.list"
                    rowKey="boot_index"
                    :pagination = "false"
          >
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
import { watchEffect, reactive, ref, defineProps, defineEmits } from 'vue'
import { ColumnProps, TableState } from 'ant-design-vue/lib/table/interface'
import { IPage } from '/@/api/http/type'
import { DOMAIN } from '/@/types/device'
import { DeviceLogFileInfo, GetDeviceUploadLogListRsp, getUploadDeviceLogUrl } from '/@/api/device-log'
import { useDeviceLogUploadDetail } from './use-device-log-upload-detail'
import { download } from '/@/utils/download'

const props = defineProps<{
  visible: boolean,
  deviceLog: null | GetDeviceUploadLogListRsp,
}>()
const emit = defineEmits(['update:visible'])

const sVisible = ref(false)

watchEffect(() => {
  sVisible.value = props.visible
  if (props.visible) {
    classifyDeviceLog()
  }
})

function onVisibleChange (sVisible: boolean) {
  setVisible(sVisible)
}

function setVisible (v: boolean, e?: Event) {
  sVisible.value = v
  emit('update:visible', v, e)
}

// 表格
const airportLogColumns: ColumnProps[] = [
  { title: '机场日志', dataIndex: 'time', width: '70%', slots: { customRender: 'log_time' } },
  { title: '文件大小', dataIndex: 'size', width: '30%', slots: { customRender: 'size' } },
]

const droneLogColumns: ColumnProps[] = [
  { title: '飞行器日志', dataIndex: 'time', width: '70%', slots: { customRender: 'log_time' } },
  { title: '文件大小', dataIndex: 'size', width: '30%', slots: { customRender: 'size' } },
]

const airportTableLogState = reactive({
  logList: {} as DeviceLogFileInfo,
})

const droneTableLogState = reactive({
  logList: {} as DeviceLogFileInfo,
})

function classifyDeviceLog () {
  if (!props.deviceLog) return
  const { device_logs } = props.deviceLog
  const { files } = device_logs || {}
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

const { getLogTime, getLogSize } = useDeviceLogUploadDetail()

async function onDownloadLog (fileId: string) {
  const { data } = await getUploadDeviceLogUrl({
    file_id: fileId,
    logs_id: props.deviceLog?.logs_id || ''
  })
  if (data) {
    download(data)
  // download('https:/github.com/dji-sdk/Mobile-SDK-Android-V5/archive/refs/heads/dev-sdk-main.zip')
  }
}

</script>

<style lang="scss" scoped>
.device-log-detail-wrap{

  .device-log-list{
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    .log-list-item{
      width: 420px;

      .download-btn{
        margin-bottom: 10px;
      }
    }
  }
}
</style>
>
