<template>
  <div class="width-100 flex-row flex-justify-between flex-align-center" style="height: 60px;">
    <div class="height-100">
      <a-avatar :size="40" shape="square" :src="cloudapi" />
      <span class="ml10 fontBold">{{ workspaceName }}</span>
    </div>

    <a-space class="fz16 height-100" size="large">
        <router-link
        v-for="item in options"
        :key="item.key"
        :to="item.path"
        :class="{
            'menu-item': true,
        }">
          <span @click="selectedRoute(item.path)" :style="selected === item.path ? 'color: #2d8cf0;' : 'color: white'">{{ item.label }}</span>
        </router-link>
    </a-space>

    <div class="height-100 fz16 flex-row flex-justify-between flex-align-center">
      <a-dropdown>
        <div class="height-100">
          <span class="fz20 mt20" style="border: 2px solid white; border-radius: 50%; display: inline-flex;"><UserOutlined /></span>
          <span class="ml10 mr10" style="float: right;">{{ username }}</span>
        </div>
        <template #overlay>
          <a-menu theme="dark" class="flex-column flex-justify-between flex-align-center">
            <a-menu-item>
              <span class="mr10" style="font-size: 16px;"><ExportOutlined /></span>
              <span @click="logout">Log Out</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { defineComponent, onMounted, ref } from 'vue'
import { getRoot } from '/@/root'
import { getPlatformInfo } from '/@/api/manage'
import { ELocalStorageKey, ERouterName } from '/@/types'
import { UserOutlined, ExportOutlined } from '@ant-design/icons-vue'
import cloudapi from '/@/assets/icons/cloudapi.png'

const root = getRoot()

interface IOptions {
  key: number
  label: string
  path:
    | string
    | {
        path: string
        query?: any
      }
  icon: string
}
const username = ref(localStorage.getItem(ELocalStorageKey.Username))
const workspaceName = ref('')
const options = [
  { key: 0, label: ERouterName.WORKSPACE.charAt(0).toUpperCase() + ERouterName.WORKSPACE.substr(1), path: '/' + ERouterName.WORKSPACE },
  { key: 1, label: ERouterName.MEMBERS.charAt(0).toUpperCase() + ERouterName.MEMBERS.substr(1), path: '/' + ERouterName.MEMBERS },
  { key: 2, label: ERouterName.DEVICES.charAt(0).toUpperCase() + ERouterName.DEVICES.substr(1), path: '/' + ERouterName.DEVICES }
]

const selected = ref<string>(root.$route.path)

onMounted(() => {
  getPlatformInfo().then(res => {
    workspaceName.value = res.data.workspace_name
  })
})

function selectedRoute (path: string) {
  selected.value = path
}

const logout = () => {
  localStorage.clear()
  root.$router.push(ERouterName.PROJECT)
}
</script>

<style lang="scss" scoped>
@import '/@/styles/index.scss';

.fontBold {
  font-weight: 500;
  font-size: 18px;
}

</style>
