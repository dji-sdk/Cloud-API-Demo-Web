<template>
  <div class="project-wayline-wrapper height-100">
    <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #4f4f4f; font-weight: 450;">
      <a-row>
        <a-col :span="1"></a-col>
        <a-col :span="22">Flight Route Library</a-col>
        <a-col :span="1"></a-col>
      </a-row>
    </div>
    <div class="height-100">
    <a-spin :spinning="loading" :delay="1000" tip="downloading" size="large">
      <div class="scrollbar uranus-scrollbar" v-if="waylinesData.data.length !== 0" @scroll="onScroll">
        <div v-for="wayline in waylinesData.data" :key="wayline.id">
          <div class="wayline-panel" style="padding-top: 5px;" @click="selectRoute(wayline)">
            <div class="title">
              <a-tooltip :title="wayline.name">
                <div class="pr10" style="width: 120px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ wayline.name }}</div>
              </a-tooltip>
              <div class="ml10"><UserOutlined /></div>
              <a-tooltip :title="wayline.user_name">
                <div class="ml5 pr10" style="width: 80px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ wayline.user_name }}</div>
              </a-tooltip>
              <div class="fz20">
                <a-dropdown>
                  <a style="color: white;">
                    <EllipsisOutlined />
                  </a>
                  <template #overlay>
                    <a-menu theme="dark" class="more" style="background: #3c3c3c;">
                      <a-menu-item @click="downloadWayline(wayline.id, wayline.name)">
                        <span>Download</span>
                      </a-menu-item>
                      <a-menu-item @click="showWaylineTip(wayline.id)">
                        <span>Delete</span>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
            <div class="ml10 mt5" style="color: hsla(0,0%,100%,0.65);">
              <span><RocketOutlined /></span>
              <span class="ml5">{{ Object.keys(EDeviceType)[Object.values(EDeviceType).indexOf(wayline.drone_model_key)] }}</span>
              <span class="ml10"><CameraFilled style="border-top: 1px solid; padding-top: -3px;" /></span>
              <span class="ml5" v-for="payload in wayline.payload_model_keys" :key="payload.id">
                {{ Object.keys(EDeviceType)[Object.values(EDeviceType).indexOf(payload)] }}
              </span>
            </div>
            <div class="mt5 ml10" style="color: hsla(0,0%,100%,0.35);">
              <span class="mr10">Update at {{ new Date(wayline.update_time).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <a-empty :image-style="{ height: '60px', marginTop: '60px' }" />
      </div>
      <a-modal v-model:visible="deleteTip" width="450px" :closable="false" :maskClosable="false" centered :okButtonProps="{ danger: true }" @ok="deleteWayline">
          <p class="pt10 pl20" style="height: 50px;">Wayline file is unrecoverable once deleted. Continue?</p>
          <template #title>
              <div class="flex-row flex-justify-center">
                  <span>Delete</span>
              </div>
          </template>
      </a-modal>
    </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from '@vue/reactivity'
import { message } from 'ant-design-vue'
import { onMounted, onUpdated, ref } from 'vue'
import { deleteWaylineFile, downloadWaylineFile, getWaylineFiles } from '/@/api/wayline'
import { ELocalStorageKey } from '/@/types'
import { EllipsisOutlined, RocketOutlined, CameraFilled, UserOutlined } from '@ant-design/icons-vue'
import { EDeviceType } from '/@/types/device'
import { useMyStore } from '/@/store'
import { WaylineFile } from '/@/types/wayline'
import { downloadFile } from '/@/utils/common'
import { IPage } from '/@/api/http/type'

const loading = ref(false)
const store = useMyStore()
const pagination :IPage = {
  page: 1,
  total: 0,
  page_size: 10
}

const waylinesData = reactive({
  data: [] as WaylineFile[]
})

const workspaceId = localStorage.getItem(ELocalStorageKey.WorkspaceId)!
const deleteTip = ref(false)
const deleteWaylineId = ref<string>('')
const canRefresh = ref(true)

onMounted(() => {
  getWaylines()
})

onUpdated(() => {
  const element = document.getElementsByClassName('scrollbar').item(0) as HTMLDivElement
  const parent = element?.parentNode as HTMLDivElement
  setTimeout(() => {
    if (element?.scrollHeight < parent?.clientHeight && pagination.total > waylinesData.data.length) {
      if (canRefresh.value) {
        pagination.page++
        getWaylines()
      }
    } else if (element && element.className.indexOf('height-100') === -1) {
      element.className = element.className + ' height-100'
    }
  }, 300)
})

function getWaylines () {
  if (!canRefresh.value) {
    return
  }
  canRefresh.value = false
  getWaylineFiles(workspaceId, {
    page: pagination.page,
    page_size: pagination.page_size,
    order_by: 'update_time desc'
  }).then(res => {
    if (res.code !== 0) {
      return
    }
    res.data.list.forEach((wayline: WaylineFile) => waylinesData.data.push(wayline))
    pagination.total = res.data.pagination.total
    pagination.page = res.data.pagination.page
  }).finally(() => {
    canRefresh.value = true
  })
}

function showWaylineTip (waylineId: string) {
  deleteWaylineId.value = waylineId
  deleteTip.value = true
}

function deleteWayline () {
  deleteWaylineFile(workspaceId, deleteWaylineId.value).then(res => {
    if (res.code === 0) {
      message.success('Wayline file deleted')
    }
    deleteWaylineId.value = ''
    deleteTip.value = false
    pagination.total--
    waylinesData.data = []
    setTimeout(getWaylines, 500)
  })
}

function downloadWayline (waylineId: string, fileName: string) {
  loading.value = true
  downloadWaylineFile(workspaceId, waylineId).then(res => {
    if (!res) {
      return
    }
    const data = new Blob([res], { type: 'application/zip' })
    downloadFile(data, fileName + '.kmz')
  }).finally(() => {
    loading.value = false
  })
}

function selectRoute (wayline: WaylineFile) {
  store.commit('SET_SELECT_WAYLINE_INFO', wayline)
}

function onScroll (e: any) {
  const element = e.srcElement
  if (element.scrollTop + element.clientHeight === element.scrollHeight && Math.ceil(pagination.total / pagination.page_size) > pagination.page && canRefresh.value) {
    pagination.page++
    getWaylines()
  }
}

</script>

<style lang="scss" scoped>
.wayline-panel {
  background: #3c3c3c;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  height: 90px;
  width: 95%;
  font-size: 13px;
  border-radius: 2px;
  cursor: pointer;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
    font-weight: bold;
    margin: 0px 10px 0 10px;
  }
}
.uranus-scrollbar {
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #c5c8cc transparent;
}
</style>
