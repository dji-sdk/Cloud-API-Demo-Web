
<template>
  <div class="table flex-display flex-column">
    <a-table :columns="columns" :data-source="data.member" :pagination="paginationProp" @change="refreshData" row-key="user_id"
    :row-selection="rowSelection" :rowClassName="(record, index) => ((index % 2) === 0 ? 'table-striped' : null)" :scroll="{ x: '100%', y: 600 }">
      <template v-for="col in ['mqtt_username', 'mqtt_password']" #[col]="{ text, record }" :key="col">
        <div>
          <a-input
            v-if="editableData[record.user_id]"
            v-model:value="editableData[record.user_id][col]"
            style="margin: -5px 0"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template #action="{ record }">
        <div class="editable-row-operations">
          <span v-if="editableData[record.user_id]">
            <a-tooltip title="Confirm changes">
              <span @click="save(record)" style="color: #28d445;"><CheckOutlined /></span>
            </a-tooltip>
            <a-tooltip title="Modification canceled">
              <span @click="() => delete editableData[record.user_id]" class="ml15" style="color: #e70102;"><CloseOutlined /></span>
            </a-tooltip>
          </span>
          <span v-else class="fz18 flex-align-center flex-row" style="color: #2d8cf0">
            <EditOutlined @click="edit(record)" />
          </span>
        </div>
      </template>

    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { message, PaginationProps } from 'ant-design-vue'
import { TableState } from 'ant-design-vue/lib/table/interface'
import { onMounted, reactive, Ref, ref, UnwrapRef } from 'vue'
import { IPage } from '/@/api/http/type'
import { getAllUsersInfo, updateUserInfo } from '/@/api/manage'
import { ELocalStorageKey } from '/@/types'
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'

export interface Member {
    user_id: string
    username: string
    user_type: string
    workspace_name: string
    create_time: string
    mqtt_username: string
    mqtt_password: string
}

interface MemberData {
  member: Member[]
}
const columns = [
  { title: 'Account', dataIndex: 'username', width: 150, sorter: (a: Member, b: Member) => a.username.localeCompare(b.username), className: 'titleStyle' },
  { title: 'User Type', dataIndex: 'user_type', width: 150, className: 'titleStyle' },
  { title: 'Workspace Name', dataIndex: 'workspace_name', width: 150, className: 'titleStyle' },
  { title: 'Mqtt Username', dataIndex: 'mqtt_username', width: 150, className: 'titleStyle', slots: { customRender: 'mqtt_username' } },
  { title: 'Mqtt Password', dataIndex: 'mqtt_password', width: 150, className: 'titleStyle', slots: { customRender: 'mqtt_password' } },
  { title: 'Joined', dataIndex: 'create_time', width: 150, sorter: (a: Member, b: Member) => a.create_time.localeCompare(b.create_time), className: 'titleStyle' },
  { title: 'Action', dataIndex: 'action', width: 100, className: 'titleStyle', slots: { customRender: 'action' } },
]

const data = reactive<MemberData>({
  member: []
})

const editableData: UnwrapRef<Record<string, Member>> = reactive({})

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
}
type Pagination = TableState['pagination']

const body: IPage = {
  page: 1,
  total: 0,
  page_size: 50
}
const workspaceId: string = localStorage.getItem(ELocalStorageKey.WorkspaceId)!

onMounted(() => {
  getAllUsers(workspaceId, body)
})

function refreshData (page: Pagination) {
  body.page = page?.current!
  body.page_size = page?.pageSize!
  getAllUsers(workspaceId, body)
}

function getAllUsers (workspaceId: string, page: IPage) {
  getAllUsersInfo(workspaceId, page).then(res => {
    const userList: Member[] = res.data.list
    data.member = userList
    paginationProp.total = res.data.pagination.total
    paginationProp.current = res.data.pagination.page
  })
}

function edit (record: Member) {
  editableData[record.user_id] = record
}

function save (record: Member) {
  delete editableData[record.user_id]
  updateUserInfo(workspaceId, record.user_id, record).then(res => {
    if (res.code !== 0) {
      message.error(res.message)
    }
  })
}

</script>
<style>

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
</style>
