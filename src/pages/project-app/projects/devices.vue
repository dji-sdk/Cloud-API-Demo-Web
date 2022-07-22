
<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal" @select="select">
    <a-menu-item :key="EDeviceTypeName.Aircraft" class="ml20">
      Aircraft
    </a-menu-item>
    <a-menu-item :key="EDeviceTypeName.Dock">
      Dock
    </a-menu-item>
  </a-menu>
  <div class="table flex-display flex-column">
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
            {{ text }}
          </template>
        </div>
      </template>
      <template v-for="col in ['sn', 'workspace']" #[col]="{ text }" :key="col">
        <a-tooltip :title="text">
            <span>{{ text }}</span>
        </a-tooltip>
      </template>
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
      <template #action="{ record }">
        <div class="editable-row-operations">
          <span v-if="editableData[record.device_sn]">
            <a-tooltip title="Confirm changes">
              <span @click="save(record)" style="color: #28d445;"><CheckOutlined /></span>
            </a-tooltip>
            <a-tooltip title="Modification canceled">
              <span @click="() => delete editableData[record.device_sn]" class="ml15" style="color: #e70102;"><CloseOutlined /></span>
            </a-tooltip>
          </span>
          <span v-else class="flex-align-center flex-row" style="color: #2d8cf0">
            <a-tooltip v-if="current.indexOf(EDeviceTypeName.Dock) !== -1" title="Hms Info">
              <FileSearchOutlined @click="showHms(record)"/>
            </a-tooltip>
            <a-tooltip title="Edit">
             <EditOutlined @click="edit(record)" class="ml10" />
            </a-tooltip>
            <a-tooltip title="Delete">
              <DeleteOutlined @click="() => { deleteTip = true, deleteSn = record.device_sn }" class="ml15" />
            </a-tooltip>
          </span>
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

    <a-drawer
      title="Hms Info"
      placement="right"
      v-model:visible="hmsVisible"
      :width="800">
      <div class="flex-row flex-align-center">
        <div style="width: 240px;">
          <a-range-picker
            v-model:value="time"
            format="YYYY-MM-DD"
            :placeholder="['Start Time', 'End Time']"
            @change="onTimeChange"/>
        </div>
        <div class="ml5">
          <a-select
            style="width: 150px"
            v-model:value="param.level"
            @select="onLevelSelect">
            <a-select-option
              v-for="item in levels"
              :key="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="ml5">
          <a-select
            v-model:value="param.domain"
            :disabled="!param.children_sn || !param.device_sn"
            style="width: 150px"
            @select="onDeviceTypeSelect">
            <a-select-option
              v-for="item in deviceTypes"
              :key="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="ml5">
          <a-input-search
            v-model:value="param.message"
            placeholder="input search message"
            style="width: 200px"
            @search="getHms"/>
        </div>
      </div>
      <div>
        <a-table :columns="hmsColumns"  :scroll="{ x: '100%', y: 600 }" :data-source="hmsData.data" :pagination="hmsPaginationProp" @change="refreshHmsData" row-key="hms_id"
          :rowClassName="rowClassName" :loading="loading">
          <template #time="{ record }">
            <div>{{ record.create_time }}</div>
            <div :style="record.update_time ? '' : record.level === EHmsLevel.CAUTION ? 'color: orange;' :
              record.level === EHmsLevel.WARN ? 'color: red;' : 'color: #28d445;'">{{ record.update_time ?? 'It is happening...' }}</div>
          </template>
          <template #level="{ text }">
            <div class="flex-row flex-align-center">
              <div :class="text === EHmsLevel.CAUTION ? 'caution' : text === EHmsLevel.WARN ? 'warn' : 'notice'" style="width: 10px; height: 10px; border-radius: 50%;"></div>
              <div style="margin-left: 3px;">{{ EHmsLevel[text] }}</div>
            </div>
          </template>
          <template v-for="col in ['code', 'message']" #[col]="{ text }" :key="col">
            <a-tooltip :title="text">
                <span>{{ text }}</span>
            </a-tooltip>
          </template>
        </a-table>
      </div>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { ColumnProps, TableState } from 'ant-design-vue/lib/table/interface'
import { h, onMounted, reactive, ref, UnwrapRef } from 'vue'
import { IPage } from '/@/api/http/type'
import { BindBody, bindDevice, getBindingDevices, getDeviceHms, HmsQueryBody, unbindDevice, updateDevice } from '/@/api/manage'
import { EDeviceTypeName, EHmsLevel, ELocalStorageKey } from '/@/types'
import { EditOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, FileSearchOutlined } from '@ant-design/icons-vue'
import { Device, DeviceHms } from '/@/types/device'
import moment, { Moment } from 'moment'

interface DeviceData {
  device: Device[]
}
const loading = ref(true)
const deleteTip = ref<boolean>(false)
const deleteSn = ref<string>()
const hmsVisible = ref<boolean>(false)
const columns: ColumnProps[] = [
  { title: 'Model', dataIndex: 'device_name', width: '10%', className: 'titleStyle' },
  { title: 'SN', dataIndex: 'device_sn', width: '10%', className: 'titleStyle', ellipsis: true, slots: { customRender: 'sn' } },
  {
    title: 'Name',
    dataIndex: 'nickname',
    width: '15%',
    sorter: (a: Device, b: Device) => a.nickname.localeCompare(b.nickname),
    className: 'titleStyle',
    ellipsis: true,
    slots: { customRender: 'nickname' }
  },
  { title: 'Firmware Version', dataIndex: 'firmware_version', width: '10%', className: 'titleStyle' },
  { title: 'Status', dataIndex: 'status', width: '100px', className: 'titleStyle', slots: { customRender: 'status' } },
  {
    title: 'Workspace',
    dataIndex: 'workspace_name',
    width: '10%',
    className: 'titleStyle',
    ellipsis: true,
    slots: { customRender: 'workspace' },
    customRender: ({ text, record, index }) => {
      const obj = {
        children: text,
        props: {} as any,
      }
      if (current.value.indexOf(EDeviceTypeName.Aircraft) !== -1 || (!record.child_device_sn && record.domain === EDeviceTypeName.Dock)) {
        return obj
      }

      obj.props.rowSpan = record.domain === EDeviceTypeName.Dock ? 2 : 0
      return obj
    }
  },
  { title: 'Joined', dataIndex: 'bound_time', width: '15%', sorter: (a: Device, b: Device) => a.bound_time.localeCompare(b.bound_time), className: 'titleStyle' },
  { title: 'Last Online', dataIndex: 'login_time', width: '15%', sorter: (a: Device, b: Device) => a.login_time.localeCompare(b.login_time), className: 'titleStyle' },
  {
    title: 'Actions',
    dataIndex: 'actions',
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

const body: IPage = {
  page: 1,
  total: 0,
  page_size: 50
}
const workspaceId: string = localStorage.getItem(ELocalStorageKey.WorkspaceId)!

const editableData: UnwrapRef<Record<string, Device>> = reactive({})

const current = ref([EDeviceTypeName.Aircraft])

onMounted(() => {
  getDevices(workspaceId, body, current.value[0])
})

function judgeCurrentType (type: EDeviceTypeName): boolean {
  return current.value.indexOf(type) !== -1
}

function getDevices (workspaceId: string, body: IPage, domain: string) {
  loading.value = true
  getBindingDevices(workspaceId, body, domain).then(res => {
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
    loading.value = false
  })
}

function refreshData (page: Pagination) {
  body.page = page?.current!
  body.page_size = page?.pageSize!
  getDevices(workspaceId, body, current.value[0])
}

function edit (record: Device) {
  editableData[record.device_sn] = record
}

function save (record: Device) {
  delete editableData[record.device_sn]
  updateDevice({ nickname: record.nickname }, workspaceId, record.device_sn)
}

function showDeleteTip (sn: any) {
  deleteTip.value = true
}

function unbind () {
  deleteTip.value = false
  unbindDevice(deleteSn.value?.toString()!).then(res => {
    if (res.code !== 0) {
      return
    }
    getDevices(workspaceId, body, current.value[0])
  })
}

function select (item: any) {
  getDevices(workspaceId, body, item.key)
}

const hmsColumns: ColumnProps[] = [
  { title: 'Alarm Begin | End Time', dataIndex: 'create_time', width: '25%', className: 'titleStyle', slots: { customRender: 'time' } },
  { title: 'Level', dataIndex: 'level', width: '120px', className: 'titleStyle', slots: { customRender: 'level' } },
  { title: 'Device', dataIndex: 'domain', width: '12%', className: 'titleStyle' },
  { title: 'Error Code', dataIndex: 'key', width: '20%', className: 'titleStyle', slots: { customRender: 'code' } },
  { title: 'Hms Message', dataIndex: 'message_en', className: 'titleStyle', ellipsis: true, slots: { customRender: 'message' } },
]

interface DeviceHmsData {
  data: DeviceHms[]
}
const hmsData = reactive<DeviceHmsData>({
  data: []
})

const hmsPaginationProp = reactive({
  pageSizeOptions: ['20', '50', '100'],
  showQuickJumper: true,
  showSizeChanger: true,
  pageSize: 50,
  current: 1,
  total: 0
})

const hmsPage: IPage = {
  page: 1,
  total: 0,
  page_size: 50
}

function showHms (dock: Device) {
  hmsVisible.value = true
  if (dock.domain === EDeviceTypeName.Dock) {
    param.domain = ''
    getDeviceHmsBySn(dock.device_sn, dock.children?.[0].device_sn ?? '')
  }
  if (dock.domain === EDeviceTypeName.Aircraft) {
    param.domain = EDeviceTypeName.Aircraft
    getDeviceHmsBySn('', dock.device_sn)
  }
}

function refreshHmsData (page: Pagination) {
  hmsPage.page = page?.current!
  hmsPage.page_size = page?.pageSize!
  getHms()
}

const param = reactive<HmsQueryBody>({
  sns: [],
  device_sn: '',
  children_sn: '',
  language: 'en',
  begin_time: new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0),
  end_time: new Date().setHours(23, 59, 59, 999),
  domain: '',
  level: '',
  message: ''
})

const levels = [
  {
    label: 'All',
    value: ''
  }, {
    label: EHmsLevel[0],
    value: EHmsLevel.NOTICE
  }, {
    label: EHmsLevel[1],
    value: EHmsLevel.CAUTION
  }, {
    label: EHmsLevel[2],
    value: EHmsLevel.WARN
  }
]

const deviceTypes = [
  {
    label: 'All',
    value: ''
  }, {
    label: EDeviceTypeName.Aircraft,
    value: EDeviceTypeName.Aircraft
  }, {
    label: EDeviceTypeName.Dock,
    value: EDeviceTypeName.Dock
  }
]

const time = ref([moment(param.begin_time), moment(param.end_time)])

function getHms () {
  getDeviceHms(param, workspaceId, hmsPage)
    .then(res => {
      hmsPaginationProp.total = res.data.pagination.total
      hmsPaginationProp.current = res.data.pagination.page
      hmsData.data = res.data.list
      hmsData.data.forEach(hms => {
        hms.domain = hms.sn === param.children_sn ? EDeviceTypeName.Aircraft : EDeviceTypeName.Dock
      })
    })
}

function getDeviceHmsBySn (sn: string, childSn: string) {
  param.device_sn = sn
  param.children_sn = childSn
  param.sns = [param.device_sn, param.children_sn]
  getHms()
}

function onTimeChange (newTime: [Moment, Moment]) {
  param.begin_time = newTime[0].valueOf()
  param.end_time = newTime[1].valueOf()
  getHms()
}

function onDeviceTypeSelect (val: string) {
  param.sns = [param.device_sn, param.children_sn]
  if (val === EDeviceTypeName.Dock) {
    param.sns = [param.device_sn, '']
  }
  if (val === EDeviceTypeName.Aircraft) {
    param.sns = ['', param.children_sn]
  }
  getHms()
}

function onLevelSelect (val: number) {
  param.level = val
  getHms()
}
</script>
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
