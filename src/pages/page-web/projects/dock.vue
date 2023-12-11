<template>
  <div class="height-100">
    <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #4f4f4f; font-weight: 450;">
      <a-row>
        <a-col :span="1"></a-col>
        <a-col :span="22">Devices</a-col>
        <a-col :span="1"></a-col>
      </a-row>
    </div>
    <div class="scrollbar height-100" :style="{ height: scorllHeight + 'px'}">
      <div id="data" class=" uranus-scrollbar" v-if="docksData.data.length !== 0" @scroll="onScroll">
        <div v-for="dock in docksData.data" :key="dock.device_sn">
          <div class="panel" style="padding-top: 5px;" @click="selectDock(dock)">
            <div class="title">
              <a-tooltip :title="dock.nickname">
                <div class="pr10" style="width: 120px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ dock.nickname }}</div>
              </a-tooltip>
            </div>
            <div class="ml10 mt5" style="color: hsla(0,0%,100%,0.65);">
              <span><RocketOutlined /></span>
              <span class="ml5">{{ dock.children?.nickname ?? 'No drone' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <a-empty :image-style="{ height: '60px', marginTop: '60px' }" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from '@vue/reactivity'
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { deleteWaylineFile, downloadWaylineFile, getWaylineFiles } from '/@/api/wayline'
import { EDeviceTypeName, ELocalStorageKey } from '/@/types'
import { EllipsisOutlined, RocketOutlined, CameraFilled, UserOutlined } from '@ant-design/icons-vue'
import { Device } from '/@/types/device'
import { useMyStore } from '/@/store'
import { getBindingDevices } from '/@/api/manage'
import { IPage } from '/@/api/http/type'

const store = useMyStore()

const docksData = reactive({
  data: [] as Device[]
})

const workspaceId = localStorage.getItem(ELocalStorageKey.WorkspaceId)!
const scorllHeight = ref()
const canRefresh = ref(true)

onMounted(() => {
  const parent = document.getElementsByClassName('scrollbar').item(0)?.parentNode as HTMLDivElement
  scorllHeight.value = document.body.clientHeight - parent.firstElementChild!.clientHeight
  getDocks()
  const key = setInterval(() => {
    const data = document.getElementById('data')?.lastElementChild as HTMLDivElement
    if (body.total === 0 || Math.ceil(body.total / body.page_size) <= body.page || scorllHeight.value + 50 <= data?.clientHeight + data?.offsetTop) {
      clearInterval(key)
      return
    }
    body.page++
    getDocks()
  }, 1000)
})
const body: IPage = {
  page: 1,
  total: -1,
  page_size: 10,
}

async function getDocks () {
  if (!canRefresh.value) {
    return
  }
  canRefresh.value = false

  await getBindingDevices(workspaceId, body, EDeviceTypeName.Dock).then(res => {
    if (res.code !== 0) {
      return
    }
    docksData.data.push(...res.data.list)
    body.page = res.data.pagination.page
    body.page_size = res.data.pagination.page_size
    body.total = res.data.pagination.total
  }).finally(() => {
    canRefresh.value = true
  })
}

function onScroll (e: any) {
  const element = e.srcElement
  if (element.scrollTop + element.clientHeight >= element.scrollHeight - 5 && Math.ceil(body.total / body.page_size) > body.page && canRefresh.value) {
    body.page++
    getDocks()
  }
}

function selectDock (dock: Device) {
  store.commit('SET_SELECT_DOCK_INFO', dock)
}

</script>

<style lang="scss" scoped>
.panel {
  background: #3c3c3c;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  height: 70px;
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
  height: 100%;
}
</style>
