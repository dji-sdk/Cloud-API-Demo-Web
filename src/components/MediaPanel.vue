<template>
  <div class="header">Media Files</div>
  <a-spin :spinning="loading" :delay="1000" tip="downloading" size="large">
    <div class="media-panel-wrapper">
      <a-table class="media-table" :columns="columns" :data-source="mediaData.data" row-key="fingerprint"
        :pagination="paginationProp" :scroll="{ x: '100%', y: 600 }" @change="refreshData">
        <template v-for="col in ['name', 'path']" #[col]="{ text }" :key="col">
          <a-tooltip :title="text">
              <a v-if="col === 'name'">{{ text }}</a>
              <span v-else>{{ text }}</span>
          </a-tooltip>
        </template>
        <template #original="{ text }">
          {{ text }}
        </template>
        <template #action="{ record }">
          <a-tooltip title="download">
            <a class="fz18" @click="downloadMedia(record)"><DownloadOutlined /></a>
          </a-tooltip>
        </template>
      </a-table>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import { TableState } from 'ant-design-vue/lib/table/interface'
import { onMounted, reactive } from 'vue'
import { IPage } from '../api/http/type'
import { ELocalStorageKey } from '../types/enums'
import { downloadFile } from '../utils/common'
import { downloadMediaFile, getMediaFiles } from '/@/api/media'
import { DownloadOutlined } from '@ant-design/icons-vue'
import { message, Pagination } from 'ant-design-vue'
import { load } from '@amap/amap-jsapi-loader'

const workspaceId = localStorage.getItem(ELocalStorageKey.WorkspaceId)!
const loading = ref(false)

const columns = [
  {
    title: 'File Name',
    dataIndex: 'file_name',
    ellipsis: true,
    slots: { customRender: 'name' }
  },
  {
    title: 'File Path',
    dataIndex: 'file_path',
    ellipsis: true,
    slots: { customRender: 'path' }
  },
  // {
  //   title: 'FileSize',
  //   dataIndex: 'size',
  // },
  {
    title: 'Drone',
    dataIndex: 'drone'
  },
  {
    title: 'Payload Type',
    dataIndex: 'payload'
  },
  {
    title: 'Original',
    dataIndex: 'is_original',
    slots: { customRender: 'original' }
  },
  {
    title: 'Created',
    dataIndex: 'create_time'
  },
  {
    title: 'Action',
    slots: { customRender: 'action' }
  }
]
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

type Pagination = TableState['pagination']

interface MediaFile {
  fingerprint: string,
  drone: string,
  payload: string,
  is_original: string,
  file_name: string,
  file_path: string,
  create_time: string,
  file_id: string,
}

const mediaData = reactive({
  data: [] as MediaFile[]
})

onMounted(() => {
  getFiles()
})

function getFiles () {
  getMediaFiles(workspaceId, body).then(res => {
    mediaData.data = res.data.list
    paginationProp.total = res.data.pagination.total
    paginationProp.current = res.data.pagination.page
    console.info(mediaData.data[0])
  })
}

function refreshData (page: Pagination) {
  body.page = page?.current!
  body.page_size = page?.pageSize!
  getFiles()
}

function downloadMedia (media: MediaFile) {
  loading.value = true
  downloadMediaFile(workspaceId, media.file_id).then(res => {
    if (!res) {
      return
    }
    const data = new Blob([res])
    downloadFile(data, media.file_name)
  }).finally(() => {
    loading.value = false
  })
}

</script>

<style lang="scss" scoped>
.media-panel-wrapper {
  width: 100%;
  padding: 16px;
  .media-table {
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
