<template>
  <div class="header" ref="headerRef">
    <a-button  type="primary" large class="btn-primary btn-primary" @click='openFileDialog'>创建文件夹</a-button>
    <div v-show="state.selectedRowIds.length" class="other-btn">
      <a-button   large class="btn-primary btn-primary">压缩并下载</a-button>
      <a-button   large class="btn-primary btn-primary" @click="move()">移动</a-button>
      <a-button   large class="btn-primary btn-primary" @click="deleteRow()">删除</a-button>
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
                      <img src="../assets/icons/search-icon.svg" class="search-icon"/>
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
      <span v-for="(item,index) in breadList" :key="item" @click="jumpToPath(index)" :class="[index!=breadList.length-1?'tab-click':'']">{{ item }}<span v-if="index!=breadList.length-1" >/</span></span>
    </div>
      <a-table :columns="columns" ref='tableRef' :data-source="mediaData.data" :scroll="{ x: '100%', y:`calc(100vh - ${otherHeight}px)` }" :row-selection="rowSelection" :pagination="false">
        <template v-for="col in ['file_name','payload','drone','create_time']" #[col]="{ text,index }" :key="col">
            <div @click="goDetail(mediaData.data[index],index)" v-if="col=='file_name'">
              <img src="../assets/icons/folder.svg" v-if='mediaData.data[index].file_type==0'>
              <img src="../assets/icons/zip.svg" v-if='mediaData.data[index].file_type==2'>
              <a-image :width="30" :hight="30" v-if='mediaData.data[index].file_type==1' :src="mediaData.data[index].picture_url" :preview="{
              src: mediaData.data[index].picture_url}"
              />
              <template v-if="index===state.index">
                <a-input v-model:value="state.changeName"  class="edit-input space"></a-input>
                <a @click="createFile(mediaData.data[index].id)" style="margin-right: 6px;"><CheckOutlined /></a>
                <CloseOutlined @click.stop="cancelEdit" />
              </template>
              <a-tooltip :title="text" v-else>
                <a class="space"> {{ text }}</a>
              </a-tooltip>
            </div>
            <div v-else>{{ text||'--' }}</div>
        </template>
        <template #action="{ record, index }">
          <a-tooltip title="下载">
            <a class="fz18 space" @click="downloadMedia(record)"><DownloadOutlined /></a>
          </a-tooltip>
          <a-tooltip title="编辑">
            <a class="fz18 space" @click="editName(index)"><EditOutlined /></a>
          </a-tooltip>
          <a-tooltip title="删除">
            <a class="fz18 space" @click="deleteRow(index)"><DeleteOutlined /></a>
          </a-tooltip>
          <a-tooltip title="移入">
            <a class="fz18 space" @click="move(mediaData.data[index].id)"><LoginOutlined /></a>
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
          <a-button  type="primary" large class="btn-primary" @click='createFile()'>确定</a-button>
        </div>
      </template>
    </a-modal>
    <a-modal v-model:visible="state.folderTree" :closable="false"  :maskClosable="false">
    <template #title>
        <div ref="modalTitleRef" style="width: 100%; cursor: move" class="model-title">移动到</div>
      </template>
      <a-directory-tree
      @select="selectTree"
    :tree-data="treeList"
    :field-names="fieldNames"
  >
    <template #title="{ file_name}" >
      <span >{{ file_name }}</span>
    </template>
  </a-directory-tree>
      <template #footer>
        <div>
          <a-button   large class="btn-primary" @click='state.folderTree=false'>取消</a-button>
          <a-button  type="primary" large class="btn-primary" @click='moveSubmit()'>确定</a-button>
        </div>
      </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import { TableState } from 'ant-design-vue/lib/table/interface'
import { onMounted, reactive, nextTick } from 'vue'
import { IPage } from '../api/http/type'
import { ELocalStorageKey } from '../types/enums'
import { downloadFile } from '../utils/common'
import { downloadMediaFile, getMediaFiles, operateFile, deleteFile, floderTreeData } from '/@/api/media'
import {
  ZoomInOutlined,
  DownloadOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  LoginOutlined
} from '@ant-design/icons-vue'
import { message, Pagination } from 'ant-design-vue'
const workspaceId = localStorage.getItem(ELocalStorageKey.WorkspaceId)
const loading = ref(false)
const searchParam = reactive({ timestamp: [], type: [], name: '' })
const state = reactive({ rowid: '', selectedRowIds: [], folderOpen: false, fileName: '新建文件夹', fatherId: 0, changeName: '', index: '', folderTree: false })
const tableRef = ref()
const headerRef = ref()
// 面包屑对应的文件名
const breadList = ref(['全部文件'])
// 面包屑对应的父级id
const fatherids = ref([0])
// 所在层级
const breadNum = ref(0)
const columns = [
  {
    title: '文件名称',
    dataIndex: 'file_name',
    ellipsis: true,
    width: 300,
    slots: { customRender: 'file_name' }
  },
  {
    title: '拍摄负载',
    dataIndex: 'payload',
    ellipsis: true,
    slots: { customRender: 'payload' }

  },
  {
    title: '大小',
    dataIndex: 'drone',
    slots: { customRender: 'drone' }
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 120,
    slots: { customRender: 'action' }

  }
]
const body: IPage = {
  page: 1,
  total: 0,
  page_size: 50
}
const paginationProp = reactive({
  page_size: 10,
  page: 1,
  total: 0
})
const treeList = ref([])
const otherHeight = ref(0)
const fieldNames = reactive({
  children: 'children',
  title: 'file_name',
  key: 'id',
  value: 'id',
})
const expandedKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const checkedKeys = ref<string[]>([])
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
  id:number
}

const mediaData = reactive({
  data: [] as MediaFile[]
})

onMounted(() => {
  // pathId.value = val
  nextTick(() => {
    if (tableRef.value.$el) {
      const tableContainer = tableRef.value.$el.querySelector('.ant-table-body')
      tableContainer.addEventListener('scroll', handleScroll)
    }
    getHeight()
  })
  getFiles(workspaceId, paginationProp)
})
const handleScroll = () => {
  const tableContainer = tableRef.value.$el.querySelector('.ant-table-body')
  const scrollPosition = tableContainer.scrollTop
  const isAtTop = scrollPosition === 0
  const isAtBottom = tableContainer.scrollHeight - scrollPosition === tableContainer.clientHeight
  if (isAtBottom) {
    // 已滚动到底部，执行相应操作
    if (paginationProp.total > mediaData.data.length) {
      getFiles(workspaceId, paginationProp, state.fatherId)
    }
  }
}
function getFiles (...data) {
  loading.value = true
  getMediaFiles(...data).then(res => {
    mediaData.data = mediaData.data.concat(res.data.list)
    paginationProp.total = res.data.pagination.total
    paginationProp.page = res.data.pagination.page
  }).finally(() => {
    loading.value = false
  })
}

function refreshData (page: Pagination) {
  body.page = page?.current!
  body.page_size = page?.pageSize!
  getFiles(workspaceId, paginationProp)
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
    state.selectedRowIds = selectedRows.map((item:any) => item.id)
  },

}
const openFileDialog = () => {
  state.folderOpen = true
  state.fileName = '新建文件夹'
}
const goDetail = (param:any, index?:any) => {
  if (param.file_type === 0 && state.index === '') {
    state.fatherId = param.id
    loading.value = true
    breadNum.value++
    fatherids.value.push(param.id)
    breadList.value[breadNum.value] = param.file_name
    mediaData.data = []
    getFiles(workspaceId, paginationProp, param.id)
  }
}
const jumpToPath = (index:any) => {
  if (index !== breadNum.value) {
    breadList.value.splice(index + 1)
    fatherids.value.splice(index + 1)
    breadNum.value = index
    state.fatherId = fatherids.value[index]
    mediaData.data = []
    getFiles(workspaceId, paginationProp, fatherids.value[index])
  }
}
// 操作文件夹（新增或者修改）
const createFile = (id?:any) => {
  state.fileName = id ? state.changeName : state.fileName
  if (!state.fileName) {
    message.warning('文件夹名称不能为空')
    return
  }
  const param = id ? { id: id, file_name: state.fileName, father_id: state.fatherId } : { file_name: state.fileName, father_id: state.fatherId }
  operateFile(workspaceId, param).then(res => {
    if (res.code === 0) {
      state.index = ''
      const msg = id ? '修改成功' : '新建成功'
      message.success(msg)
      state.folderOpen = false
      mediaData.data = []
      getFiles(workspaceId, paginationProp, param.father_id)
    }
  })
}
// 编辑项目名称
const editName = (index:any) => {
  state.index = index
  state.changeName = mediaData.data[index].file_name
}
// 取消编辑
const cancelEdit = () => {
  state.index = ''
  state.changeName = ''
}
const deleteRow = (index?:any) => {
  deleteFile(workspaceId, index ? mediaData.data[index].id : state.selectedRowIds).then(res => {
    if (res.code === 0) {
      state.selectedRowIds = []
      message.success('删除成功')
      mediaData.data = []
      getFiles(workspaceId, paginationProp, state.fatherId)
    }
  })
}
// 移动确认
const moveSubmit = () => {
  const param = { ids: state.selectedRowIds.length ? state.selectedRowIds : [state.rowid], father_id: selectedKeys.value }
  operateFile(workspaceId, param).then(res => {
    if (res.code === 0) {
      message.success('移动成功')
      state.folderTree = false
      mediaData.data = []
      getFiles(workspaceId, paginationProp, state.fatherId)
    }
  })
}
// 打开移动弹框
const move = (id?:any) => {
  state.rowid = id
  floderTreeData(workspaceId).then(res => {
    if (res.code === 0) {
      treeList.value = res.data
      state.folderTree = true
    }
  })
}
const selectTree = (seid:any, e:any) => {
  selectedKeys.value = e.node.dataRef.id
}
const getHeight = () => {
  // 32表格padding值，60误差值
  otherHeight.value = document.querySelector('.header').offsetHeight + 32 + 60 + document.querySelector('.bread-content').offsetHeight
}
</script>

<style lang="scss" scoped>
.media-panel-wrapper {
  width: 100%;
  padding: 16px;
  .bread-content{
    background: #fff;
    padding: 16px;
    .tab-click{
     cursor: pointer;
     color:#333;
    }
  }
  .media-table {
    background: #fff;
  }
  .action-area {
    color: $primary;
    cursor: pointer;
  }
}
::v-deep {
  .ant-input{
    border-right:none
  }
  .ant-input-group-addon{
  background-color: #fff;
}
}
.search-icon{
  width:16px;
}
.video-img{
  width:25px;
  height: 25px;
  margin-right: 8px;
}
.space{
  margin-left: 6px;
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
  .edit-input{
    width: 100px !important;
    margin-right: 10px;
  }
  .ant-modal-header{
    padding: 0 0 !important;
  }
}
</style>
