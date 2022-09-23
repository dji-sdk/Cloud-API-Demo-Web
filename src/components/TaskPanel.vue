<template>
  <div class="header">Task Plan Library</div>
  <div class="plan-panel-wrapper">
    <!-- <router-link :to=" '/' + ERouterName.CREATE_PLAN">
      <a-button type="primary">Create Plan</a-button>
    </router-link> -->
    <a-table class="plan-table" :columns="columns" :data-source="plansData.data" row-key="job_id"
      :pagination="paginationProp" :scroll="{ x: '100%', y: 600 }" @change="refreshData">
      <template #status="{ record }">
        <span v-if="taskProgressMap[record.bid]">
          <a-progress type="line" :percent="taskProgressMap[record.bid]?.progress?.percent"
            :status="taskProgressMap[record.bid]?.status.indexOf(ETaskStatus.FAILED) != -1 ? 'exception' : taskProgressMap[record.bid]?.status.indexOf(ETaskStatus.OK) != -1 ? 'success' : 'normal'">
            <template #format="percent">
              <a-tooltip :title="taskProgressMap[record.bid]?.status">
                <div style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; position: absolute; left: 5px; top: -12px;">
                  {{ percent }}% {{ taskProgressMap[record.bid]?.status }}
                </div>
              </a-tooltip>
            </template>
          </a-progress>
        </span>
      </template>
      <template #action="{ record }">
        <span class="action-area">
          <a-popconfirm
            title="Are you sure execute this task?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="executePlan(record.job_id)"
          >
            <a-button type="primary" size="small">Execute</a-button>
          </a-popconfirm>
        </span>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from '@vue/reactivity'
import { message } from 'ant-design-vue'
import { TableState } from 'ant-design-vue/lib/table/interface'
import { computed, onMounted, watch } from 'vue'
import { IPage } from '../api/http/type'
import { executeWaylineJobs, getWaylineJobs } from '../api/wayline'
import { getRoot } from '../root'
import { useMyStore } from '../store'
import { ELocalStorageKey, ERouterName } from '../types/enums'
import router from '/@/router'
import { ETaskStatus } from '/@/types/wayline'

const store = useMyStore()

const workspaceId = localStorage.getItem(ELocalStorageKey.WorkspaceId)!

const root = getRoot()
const body: IPage = {
  page: 1,
  total: 0,
  page_size: 50
}
const paginationProp = reactive({
  pageSizeOptions: ['20', '50', '100'],
  showQuickJumper: true,
  showSizeChanger: true,
  pageSize: 50,
  current: 1,
  total: 0
})

const columns = [
  {
    title: 'Plan Name',
    dataIndex: 'job_name'
  },
  {
    title: 'Flight Route Name',
    dataIndex: 'file_name',
    ellipsis: true
  },
  {
    title: 'Dock Name',
    dataIndex: 'dock_name',
    ellipsis: true
  },
  {
    title: 'Creator',
    dataIndex: 'username',
  },
  {
    title: 'Updated',
    dataIndex: 'update_time'
  },
  {
    title: 'Status',
    key: 'status',
    width: 200,
    slots: { customRender: 'status' }
  },

  {
    title: 'Action',
    slots: { customRender: 'action' }
  }
]
type Pagination = TableState['pagination']

interface TaskPlan {
  bid: string,
  job_id: string,
  job_name: string,
  file_name: string,
  dock_name: string,
  username: string,
  create_time: string,
}

const plansData = reactive({
  data: [] as TaskPlan[]
})

function createPlan () {
  root.$router.push('/' + ERouterName.CREATE_PLAN)
}

const taskProgressMap = computed(() => store.state.taskProgressInfo)

onMounted(() => {
  getPlans()
})

function getPlans () {
  getWaylineJobs(workspaceId, body).then(res => {
    if (res.code !== 0) {
      return
    }
    plansData.data = res.data.list
    paginationProp.total = res.data.pagination.total
    paginationProp.current = res.data.pagination.page
  })
}

function refreshData (page: Pagination) {
  body.page = page?.current!
  body.page_size = page?.pageSize!
  getPlans()
}

function executePlan (jobId: string) {
  executeWaylineJobs(workspaceId, jobId).then(res => {
    if (res.code === 0) {
      message.success('Executed Successfully')
      getPlans()
    }
  })
}
</script>

<style lang="scss" scoped>
.plan-panel-wrapper {
  width: 100%;
  padding: 16px;
  .plan-table {
    background: #fff;
    margin-top: 10px;
  }
  .action-area {
    color: $primary;
    cursor: pointer;
  }
}
.header {
  width: 100%;
  height: 60px;
  background: #fff;
  padding: 16px;
  font-size: 20px;
  font-weight: bold;
  text-align: start;
  color: #000;
}
</style>
