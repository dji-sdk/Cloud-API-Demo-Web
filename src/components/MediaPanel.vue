<template>
  <div class="header">
    <a-button  type="primary" large class="btn-primary" @click='createFile'>创建文件夹</a-button>
    <div v-show="state.selectedRowIds.length" class="other-btn">
      <a-button   large class="btn-primary">压缩并下载</a-button>
      <a-button   large class="btn-primary">移动</a-button>
    </div>

    <div class="search-content">
      <a-form>
        <a-row :gutter="16">
              <a-col :span="10">
                <a-form-item name="timestamp">
                  <a-range-picker v-model:value="searchParam.timestamp" show-time/>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item name="type">
                  <a-select placeholder="所有类型">
                    <a-select-option value="searchParam.type">所有类型</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item name="type">
                  <a-select placeholder="所有负载">
                    <a-select-option value="searchParam.type">所有负载</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
        </a-row>
        <a-row :gutter="16">
              <a-col :span="7">
                <a-form-item name="type">
                  <a-select placeholder="标签筛选">
                    <a-select-option value="searchParam.type">所有类型</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item name="name">
                  <a-input v-model:value="searchParam.name" placeholder="按文件名称搜索">
                    <template #addonAfter>
                      <ZoomInOutlined />
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
  <a-spin :spinning="loading"  tip="加载中..." size="large">
    <div class="media-panel-wrapper">
      <div class="bread-content">
      <span v-for="(item,index) in breadList" :key="item">{{ item }}<span v-if="index!=breadList.length-1" >/</span></span>
    </div>
      <a-table :columns="columns" :data-source="mediaData.data" :scroll="{ x: '100%', y: 400 }" :row-selection="rowSelection" :pagination="paginationProp">
        <template v-for="col in ['file_name']" #[col]="{ text,index }" :key="col">
            <div @click="goDetail(mediaData.data[index])">
              <img src="../assets/icons/folder.svg" v-if='mediaData.data[index].file_type==0'>
              <img src="../assets/icons/zip.svg" v-if='mediaData.data[index].file_type==2'>
              <a-image :width="30" :hight="30" v-if='mediaData.data[index].file_type==1' :src="mediaData.data[index].picture_url" :preview="{
              src: mediaData.data[index].picture_url}"
              />
              <a-tooltip :title="text">
                <a>&nbsp;{{ text }}</a>
              </a-tooltip>
            </div>
        </template>
        <template #action="{ record }">
          <a-tooltip title="download">
            <a class="fz18" @click="downloadMedia(record)"><DownloadOutlined /></a>
          </a-tooltip>
    </template>
  </a-table>
    </div>
  </a-spin>
  <a-modal v-model:visible="state.folderOpen" :closable="false"  :maskClosable="false">
    <template #title>
        <div ref="modalTitleRef" style="width: 100%; cursor: move" class="model-title">创建文件夹</div>
      </template>
      <a-input class="ml10"
        v-model:value="state.fileName"
        placeholder="请输入文件名"></a-input>
      <template #footer>
        <div>
          <a-button   large class="btn-primary" @click='state.folderOpen=false'>取消</a-button>
          <a-button  type="primary" large class="btn-primary" @click='state.folderOpen=true'>确定</a-button>
        </div>
      </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import { TableState } from 'ant-design-vue/lib/table/interface'
import { onMounted, reactive } from 'vue'
import { IPage } from '../api/http/type'
import { ELocalStorageKey } from '../types/enums'
import { downloadFile } from '../utils/common'
import { downloadMediaFile, getMediaFiles } from '/@/api/media'
import {
  ZoomInOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue'
import { message, Pagination } from 'ant-design-vue'
const workspaceId = localStorage.getItem(ELocalStorageKey.WorkspaceId)!
const loading = ref(false)
const pathId = ref('')
const searchParam = reactive({ timestamp: [], type: [], name: '' })
const state = reactive({ selectedRowIds: [], folderOpen: false, fileName: '' })
const breadList = ref(['全部文件'])
const breadNum = ref(0)
const columns = [
  {
    title: '文件名称',
    dataIndex: 'file_name',
    ellipsis: true,
    slots: { customRender: 'file_name' }
  },
  {
    title: '拍摄负载',
    dataIndex: 'payload',
    ellipsis: true,
  },
  {
    title: '大小',
    dataIndex: 'drone'

  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 100,
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
  page_size: 50,
  page: 1,
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
  // pathId.value = val
  getFiles()
})

function getFiles () {
  loading.value = true
  getMediaFiles(workspaceId, paginationProp).then(res => {
    mediaData.data = res.data.list
    paginationProp.total = res.data.pagination.total
    paginationProp.page = res.data.pagination.page
  }).finally(() => {
    loading.value = false
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

const rowSelection = {
  onChange: (selectedRowKeys:any, selectedRows:any) => {
    state.selectedRowIds = selectedRows.map((item:any) => item.father_id)
  },
}
const createFile = () => {
  state.folderOpen = true
}
const goDetail = (param:any) => {
  if (param.file_type !== 0) { return }
  loading.value = true
  breadNum.value++
  breadList.value[breadNum.value] = param.file_name
  getMediaFiles(workspaceId, paginationProp, param.father_id).then(res => {
    mediaData.data = res.data.list
    paginationProp.total = res.data.pagination.total
    paginationProp.page = res.data.pagination.page
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style lang="scss" scoped>
.media-panel-wrapper {
  width: 100%;
  padding: 16px;
  .bread-content{
    background: #fff;
    padding: 16px;
  }
  .media-table {
    background: #fff;
  }
  .action-area {
    color: $primary;
    cursor: pointer;
  }
}
.video-img{
  width:25px;
  height: 25px;
  margin-right: 8px;
}
.header {
  width: 100%;
  padding: 16px 16px 0 16px;
  color: #000;
  .other-btn{
    display: inline-block;
  }
  &::v-deep{
    .ant-btn{
      margin-right: 8px !important;
    }
    .ant-calendar-picker{
      width:100% !important;
    }
    .ant-form-item{
      margin-bottom: 8px !important;
    }
  }

  .btn-primary{
    margin-bottom: 16px;
  }
}

.model-title{
    text-align: center;
    border: none;
}
::v-deep{
  .ant-modal-header{
    padding: 0 0 !important;
  }
}

</style>
