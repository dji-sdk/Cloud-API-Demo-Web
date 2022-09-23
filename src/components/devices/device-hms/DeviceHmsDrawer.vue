<template>
  <a-drawer
    title="Hms Info"
    placement="right"
    v-model:visible="sVisible"
    @update:visible="onVisibleChange"
    :destroyOnClose="true"
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
</template>

<!-- 暂时只抽取该组件 -->
<script lang="ts" setup>
import { watchEffect, reactive, ref, defineProps, defineEmits } from 'vue'
import { getDeviceHms, HmsQueryBody } from '/@/api/manage'
import moment, { Moment } from 'moment'
import { ColumnProps, TableState } from 'ant-design-vue/lib/table/interface'
import { Device, DeviceHms } from '/@/types/device'
import { IPage } from '/@/api/http/type'
import { EDeviceTypeName, EHmsLevel, ELocalStorageKey } from '/@/types'

const props = defineProps<{
  visible: boolean,
  device: null | Device,
}>()
const emit = defineEmits(['update:visible', 'ok', 'cancel'])

const workspaceId: string = localStorage.getItem(ELocalStorageKey.WorkspaceId) || ''
// 健康状态
const sVisible = ref(false)

watchEffect(() => {
  sVisible.value = props.visible
  // 显示弹框时，获取设备hms信息
  if (props.visible) {
    showHms()
  }
})

function onVisibleChange (sVisible: boolean) {
  setVisible(sVisible)
}

function setVisible (v: boolean, e?: Event) {
  sVisible.value = v
  emit('update:visible', v, e)
}

const loading = ref(false)

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

type Pagination = TableState['pagination']

const hmsPaginationProp = reactive({
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
    page: hmsPaginationProp.current,
    page_size: hmsPaginationProp.pageSize
  } as IPage
}

function showHms () {
  const dock = props.device
  if (!dock) return
  if (dock.domain === EDeviceTypeName.Dock) {
    getDeviceHmsBySn(dock.device_sn, dock.children?.[0].device_sn ?? '')
  }
  if (dock.domain === EDeviceTypeName.Aircraft) {
    param.domain = EDeviceTypeName.Aircraft
    getDeviceHmsBySn('', dock.device_sn)
  }
}

function refreshHmsData (page: Pagination) {
  hmsPaginationProp.current = page?.current!
  hmsPaginationProp.pageSize = page?.pageSize!
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

const time = ref([moment(param.begin_time), moment(param.end_time)])

function getHms () {
  loading.value = true
  getDeviceHms(param, workspaceId, getPaginationBody())
    .then(res => {
      hmsPaginationProp.total = res.data.pagination.total
      hmsPaginationProp.current = res.data.pagination.page
      hmsData.data = res.data.list
      hmsData.data.forEach(hms => {
        hms.domain = hms.sn === param.children_sn ? EDeviceTypeName.Aircraft : EDeviceTypeName.Dock
      })
      loading.value = false
    }).catch(_err => {
      loading.value = false
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
