
<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" @select="select">
    <a-menu-item :key="EDeviceTypeName.Aircraft" class="ml20">
      Aircraft
    </a-menu-item>
    <a-menu-item :key="EDeviceTypeName.Dock">
      Dock
    </a-menu-item>
  </a-menu>
  <div class="device-table-wrap table flex-display flex-column">
    <a-table :columns="columns" :data-source="data.device" :pagination="paginationProp" @change="refreshData" row-key="device_sn" :expandedRowKeys="expandRows"
    :row-selection="rowSelection" :rowClassName="rowClassName" :scroll="{ x: '100%', y: 600 }"
      :expandIcon="expandIcon" :loading="loading">
      <template v-for="col in ['nickname']" #[col]="{ text, record }" :key="col">
        <div>
          <a-input
            v-if="editableData[record.device_sn]"
            v-model:value="editableData[record.device_sn][col]"
            style="margin: -5px 0"
          />
          <template v-else>
            <a-tooltip :title="text">
              {{ text }}
            </a-tooltip>
          </template>
        </div>
      </template>
      <template v-for="col in ['sn', 'workspace']" #[col]="{ text }" :key="col">
        <a-tooltip :title="text">
            <span>{{ text }}</span>
        </a-tooltip>
      </template>
      <!-- 固件版本 -->
      <template #firmware_version="{ record }">
        <span v-if="judgeCurrentType(EDeviceTypeName.Dock)">
          <DeviceFirmwareUpgrade :device="record"
                                  class="table-flex-col"
                                  @device-upgrade="onDeviceUpgrade"
                                 />
        </span>
        <span v-else>
          {{ record.firmware_version }}
        </span>
      </template>
      <!-- 状态 -->
      <template #status="{ text }">
        <span v-if="text" class="flex-row flex-align-center">
            <span class="mr5" style="width: 12px; height: 12px; border-radius: 50%; background-color: green;" />
            <span>Online</span>
        </span>
        <span class="flex-row flex-align-center" v-else>
            <span class="mr5" style="width: 12px; height: 12px; border-radius: 50%; background-color: red;" />
            <span>Offline</span>
        </span>
      </template>
      <!-- 操作 -->
      <template #action="{ record }">
        <div class="editable-row-operations">
          <!-- 编辑态操作 -->
          <div v-if="editableData[record.device_sn]">
            <a-tooltip title="Confirm changes">
              <span @click="save(record)" style="color: #28d445;"><CheckOutlined /></span>
            </a-tooltip>
            <a-tooltip title="Modification canceled">
              <span @click="() => delete editableData[record.device_sn]" style="color: #e70102;"><CloseOutlined /></span>
            </a-tooltip>
          </div>
          <!-- 非编辑态操作 -->
          <div v-else class="flex-align-center flex-row" style="color: #2d8cf0">
            <a-tooltip v-if="current.indexOf(EDeviceTypeName.Dock) !== -1" title="设备日志">
              <CloudServerOutlined @click="showDeviceLogUploadRecord(record)"/>
            </a-tooltip>
            <a-tooltip v-if="current.indexOf(EDeviceTypeName.Dock) !== -1" title="Hms Info">
              <FileSearchOutlined @click="showHms(record)"/>
            </a-tooltip>
            <a-tooltip title="Edit">
              <EditOutlined @click="edit(record)"/>
            </a-tooltip>
            <a-tooltip title="Delete">
              <DeleteOutlined @click="() => { deleteTip = true, deleteSn = record.device_sn }"/>
            </a-tooltip>
          </div>
        </div>
      </template>

    </a-table>
    <a-modal v-model:visible="deleteTip" width="450px" :closable="false" centered :okButtonProps="{ danger: true }" @ok="unbind">
        <p class="pt10 pl20" style="height: 50px;">Delete device from workspace?</p>
        <template #title>
            <div class="flex-row flex-justify-center">
                <span>Delete devices</span>
            </div>
        </template>
    </a-modal>

    <!-- 设备升级 -->
    <DeviceFirmwareUpgradeModal title="设备升级"
      v-model:visible="deviceFirmwareUpgradeModalVisible"
      :device="selectedDevice"
      @ok="onUpgradeDeviceOk"
    ></DeviceFirmwareUpgradeModal>

    <!-- 设备日志上传记录 -->
    <DeviceLogUploadRecordDrawer
      v-model:visible="deviceLogUploadRecordVisible"
      :device="currentDevice"
    ></DeviceLogUploadRecordDrawer>

    <!-- hms 信息 -->
    <DeviceHmsDrawer
       v-model:visible="hmsVisible"
      :device="currentDevice">
    </DeviceHmsDrawer>
  </div>
</template>
<script lang="ts" setup>
import { ColumnProps, TableState } from 'ant-design-vue/lib/table/interface'
import { h, onMounted, reactive, ref, UnwrapRef } from 'vue'
import { IPage } from '/@/api/http/type'
import { BindBody, bindDevice, getBindingDevices, unbindDevice, updateDevice } from '/@/api/manage'
import { EDeviceTypeName, ELocalStorageKey } from '/@/types'
import { EditOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, FileSearchOutlined, CloudServerOutlined } from '@ant-design/icons-vue'
import { Device, DeviceFirmwareStatusEnum } from '/@/types/device'
import DeviceFirmwareUpgrade from '/@/components/devices/device-upgrade/DeviceFirmwareUpgrade.vue'
import DeviceFirmwareUpgradeModal from '/@/components/devices/device-upgrade/DeviceFirmwareUpgradeModal.vue'
import { useDeviceFirmwareUpgrade } from '/@/components/devices/device-upgrade/use-device-upgrade'
import { useDeviceUpgradeEvent } from '/@/components/devices/device-upgrade/use-device-upgrade-event'
import { DeviceCmdExecuteInfo, DeviceCmdExecuteStatus } from '/@/types/device-cmd'
import DeviceLogUploadRecordDrawer from '/@/components/devices/device-log/DeviceLogUploadRecordDrawer.vue'
import DeviceHmsDrawer from '/@/components/devices/device-hms/DeviceHmsDrawer.vue'
import { message, notification } from 'ant-design-vue'

interface DeviceData {
  device: Device[]
}

const loading = ref(true)
const deleteTip = ref<boolean>(false)
const deleteSn = ref<string>()
const columns: ColumnProps[] = [
  { title: 'Model', dataIndex: 'device_name', width: 100, className: 'titleStyle' },
  { title: 'SN', dataIndex: 'device_sn', width: 100, className: 'titleStyle', ellipsis: true, slots: { customRender: 'sn' } },
  {
    title: 'Name',
    dataIndex: 'nickname',
    width: 100,
    sorter: (a: Device, b: Device) => a.nickname.localeCompare(b.nickname),
    className: 'titleStyle',
    ellipsis: true,
    slots: { customRender: 'nickname' }
  },
  { title: 'Firmware Version', dataIndex: 'firmware_version', width: 150, className: 'titleStyle', slots: { customRender: 'firmware_version' } },
  { title: 'Status', dataIndex: 'status', width: 100, className: 'titleStyle', slots: { customRender: 'status' } },
  {
    title: 'Workspace',
    dataIndex: 'workspace_name',
    width: 100,
    className: 'titleStyle',
    ellipsis: true,
    slots: { customRender: 'workspace' },
    customRender: ({ text, record, index }) => {
      const obj = {
        children: text,
        props: {} as any,
      }
      if (current.value.indexOf(EDeviceTypeName.Dock) !== -1) {
        if (record.domain === EDeviceTypeName.Aircraft) {
          obj.children = ''
        }
      }
      return obj
    }
  },
  { title: 'Joined', dataIndex: 'bound_time', width: 150, sorter: (a: Device, b: Device) => a.bound_time.localeCompare(b.bound_time), className: 'titleStyle' },
  { title: 'Last Online', dataIndex: 'login_time', width: 150, sorter: (a: Device, b: Device) => a.login_time.localeCompare(b.login_time), className: 'titleStyle' },
  {
    title: 'Actions',
    dataIndex: 'actions',
    width: 100,
    className: 'titleStyle',
    slots: { customRender: 'action' }
  },
]

const expandIcon = (props: any) => {
  if (judgeCurrentType(EDeviceTypeName.Dock) && !props.expanded) {
    return h('div',
      {
        style: 'border-left: 2px solid rgb(200,200,200); border-bottom: 2px solid rgb(200,200,200); height: 16px; width: 16px; float: left;',
        class: 'mt-5 ml0',
      })
  }
}

const rowClassName = (record: any, index: number) => {
  const className = []
  if ((index & 1) === 0) {
    className.push('table-striped')
  }
  if (record.domain !== EDeviceTypeName.Dock) {
    className.push('child-row')
  }
  return className.toString().replaceAll(',', ' ')
}

const expandRows = ref<string[]>([])
const data = reactive<DeviceData>({
  device: []
})

const paginationProp = reactive({
  pageSizeOptions: ['20', '50', '100'],
  showQuickJumper: true,
  showSizeChanger: true,
  pageSize: 50,
  current: 1,
  total: 0
})

// 获取分页信息
function getPaginationBody () {
  return {
    page: paginationProp.current,
    page_size: paginationProp.pageSize
  } as IPage
}

const rowSelection = {
  onChange: (selectedRowKeys: (string | number)[], selectedRows: []) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record: any, selected: boolean, selectedRows: []) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected: boolean, selectedRows: [], changeRows: []) => {
    console.log(selected, selectedRows, changeRows)
  },
  getCheckboxProps: (record: any) => ({
    disabled: judgeCurrentType(EDeviceTypeName.Dock) && record.domain !== EDeviceTypeName.Dock,
    style: judgeCurrentType(EDeviceTypeName.Dock) && record.domain !== EDeviceTypeName.Dock ? 'display: none' : ''
  }),
}
type Pagination = TableState['pagination']

const workspaceId: string = localStorage.getItem(ELocalStorageKey.WorkspaceId) || ''
const editableData: UnwrapRef<Record<string, Device>> = reactive({})
const current = ref([EDeviceTypeName.Aircraft])

function judgeCurrentType (type: EDeviceTypeName): boolean {
  return current.value.indexOf(type) !== -1
}

// 设备升级
const {
  deviceFirmwareUpgradeModalVisible,
  selectedDevice,
  onDeviceUpgrade,
  onUpgradeDeviceOk
} = useDeviceFirmwareUpgrade(workspaceId)

function onDeviceUpgradeWs (payload: DeviceCmdExecuteInfo) {
  updateDevicesByWs(data.device, payload)
}

function updateDevicesByWs (devices: Device[], payload: DeviceCmdExecuteInfo) {
  if (!devices || devices.length <= 0) {
    return
  }
  for (let i = 0; i < devices.length; i++) {
    if (devices[i].device_sn === payload.sn) {
      if (!payload.output) return
      const { status, progress, ext } = payload.output
      if (status === DeviceCmdExecuteStatus.Sent || status === DeviceCmdExecuteStatus.InProgress) { // 升级中
        const rate = ext?.rate ? (ext.rate / 1024).toFixed(2) + 'kb/s' : ''
        devices[i].firmware_status = DeviceFirmwareStatusEnum.DuringUpgrade
        devices[i].firmware_progress = (progress?.percent || 0) + '% ' + rate
      } else { // 终态：成功，失败，超时
        if (status === DeviceCmdExecuteStatus.Failed || status === DeviceCmdExecuteStatus.Timeout) {
          notification.error({
            message: `(${payload.sn}) Upgrade failed`,
            description: `Error Code: ${payload.result}`,
            duration: null
          })
        }
        // 拉取列表
        getDevices(current.value[0], true)
      }
      return
    }
    if (devices[i].children) {
      updateDevicesByWs(devices[i].children || [], payload)
    }
  }
}

useDeviceUpgradeEvent(onDeviceUpgradeWs)

// 获取设备列表信息
function getDevices (domain: number, closeLoading?: boolean) {
  if (!closeLoading) {
    loading.value = true
  }
  getBindingDevices(workspaceId, getPaginationBody(), domain).then(res => {
    if (res.code !== 0) {
      return
    }
    const resData: Device[] = res.data.list
    expandRows.value = []
    resData.forEach((val: any) => {
      if (val.children) {
        val.children = [val.children]
      }
      if (judgeCurrentType(EDeviceTypeName.Dock)) {
        expandRows.value.push(val.device_sn)
      }
    })
    data.device = resData
    paginationProp.total = res.data.pagination.total
    paginationProp.current = res.data.pagination.page
    paginationProp.pageSize = res.data.pagination.page_size
    loading.value = false
  })
}

function refreshData (page: Pagination) {
  paginationProp.current = page?.current!
  paginationProp.pageSize = page?.pageSize!
  getDevices(current.value[0])
}

// 编辑
function edit (record: Device) {
  editableData[record.device_sn] = record
}

// 保存
function save (record: Device) {
  delete editableData[record.device_sn]
  updateDevice({ nickname: record.nickname }, workspaceId, record.device_sn)
}

// 删除
function showDeleteTip (sn: any) {
  deleteTip.value = true
}

// 解绑
function unbind () {
  deleteTip.value = false
  unbindDevice(deleteSn.value?.toString()!).then(res => {
    if (res.code !== 0) {
      return
    }
    getDevices(current.value[0])
  })
}

// 选择设备
function select (item: any) {
  getDevices(item.key)
}

const currentDevice = ref({} as Device)
// 设备日志
const deviceLogUploadRecordVisible = ref(false)
function showDeviceLogUploadRecord (dock: Device) {
  deviceLogUploadRecordVisible.value = true
  currentDevice.value = dock
}

// 健康状态
const hmsVisible = ref<boolean>(false)

function showHms (dock: Device) {
  hmsVisible.value = true
  currentDevice.value = dock
}

onMounted(() => {
  getDevices(current.value[0])
})
</script>

<style lang="scss" scoped>
.device-table-wrap{
  .editable-row-operations{
    div > span {
      margin-right: 10px;
    }
  }
}
</style>

<style lang="scss">
.table {
  background-color: white;
  margin: 20px;
  padding: 20px;
  height: 88vh;
}
.table-striped {
  background-color: #f7f9fa;
}
.ant-table {
  border-top: 1px solid rgb(0,0,0,0.06);
  border-bottom: 1px solid rgb(0,0,0,0.06);
}
.ant-table-tbody tr td {
  border: 0;
}
.ant-table td {
  white-space: nowrap;
}
.ant-table-thead tr th {
  background: white !important;
  border: 0;
}
th.ant-table-selection-column {
  background-color: white !important;
}
.ant-table-header {
  background-color: white !important;
}
.child-row {
  height: 70px;
}
.notice {
  background: $success;
  overflow: hidden;
  cursor: pointer;
}
.caution {
  background: orange;
  cursor: pointer;
  overflow: hidden;
}
.warn {
  background: red;
  cursor: pointer;
  overflow: hidden;
}
</style>
