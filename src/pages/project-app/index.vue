<template>
  <div
    v-if="showLogin"
    class="login flex-column flex-justify-center flex-align-center m0 b0"
  >
    <a-image
      style="width: 17vw; height: 10vw; margin-bottom: 50px"
      src="http://lofrev.net/wp-content/photos/2016/09/dji_logo_png.png"
    />
    <p class="logo fz35 pb50">Cloud API Demo</p>
    <a-form
      layout="inline"
      :model="formState"
      class="flex-row flex-justify-center flex-align-center"
    >
      <a-form-item>
        <a-input v-model:value="formState.user" placeholder="Username">
          <template #prefix
            ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="formState.password"
          type="password"
          placeholder="Password"
        >
          <template #prefix
            ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          class="m0"
          type="primary"
          html-type="submit"
          :disabled="formState.user === '' || formState.password === ''"
          @click="onSubmit"
        >
          Login
        </a-button>
      </a-form-item>
    </a-form>
  </div>
  <div v-else class="project-app-wrapper">
    <div class="left">
      <Sidebar />
      <div class="main-content uranus-scrollbar dark">
        <router-view />
      </div>
    </div>
    <div class="right">
      <div class="map-wrapper">
        <GMap />
      </div>
      <div class="media-wrapper" v-if="getMediaRoute()">
        <MediaPanel />
      </div>
      <div class="wayline-wrapper" v-if="getWaylineRoute()">
        <WaylinePanel />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { reactive, ref, UnwrapRef } from 'vue'
import Sidebar from './sidebar.vue'
import { login } from '/@/api/manage'
import websocket from '/@/api/websocket'
import GMap from '/@/components/GMap.vue'
import MediaPanel from '/@/components/MediaPanel.vue'
import WaylinePanel from '/@/components/wayline-panel.vue'
import { useGMapCover } from '/@/hooks/use-g-map-cover'
import { getRoot } from '/@/root'
import { useMyStore } from '/@/store'

interface FormState {
  user: string
  password: string
}

const root = getRoot()
const showLogin = ref(true)
const store = useMyStore()
const formState: UnwrapRef<FormState> = reactive({
  user: 'adminPC',
  password: 'adminPC'
})
let socket = {} as any
const gMapCoverHook = useGMapCover()

const onSubmit = async (e: any) => {
  const result = await login({
    username: formState.user,
    password: formState.password
  })
  if (result.code === 0) {
    console.log(result)
    localStorage.setItem('x-auth-token', result.data.access_token)
    localStorage.setItem('workspace-id', result.data.workspace_id)
    localStorage.setItem('username', result.data.username)
    showLogin.value = false
    message.info('login success')
    socket = websocket.init(wsGetMsg)
  }
}

// function wsInfo (data) {
//   store.commit('SET_DEVICE_INFO', data)
// }
// function getDeviceInfo () {
//   const info = store.state.DeviceInfo
//   console.log(info)
const wsGetMsg = async (res: any) => {
  const payload = JSON.parse(res.data)
  // console.log(payload)
  switch (payload.biz_code) {
    case 'gateway_osd': {
      store.commit('SET_GATEWAY_INFO', payload.data)
      break
    }
    case 'device_osd': {
      store.commit('SET_DEVICE_INFO', payload.data)
      break
    }
    case 'map_element_create': {
      store.commit('SET_MAP_ELEMENT_CREATE', payload.data)
      break
    }
    case 'map_element_update': {
      store.commit('SET_MAP_ELEMENT_UPDATE', payload.data)
      break
    }
    case 'map_element_delete': {
      store.commit('SET_MAP_ELEMENT_DELETE', payload.data)
      break
    }

    default:
      break
  }
}

function getMediaRoute () {
  return root.$route.name === 'media'
}

function getWaylineRoute () {
  return root.$route.name === 'wayline'
}
</script>

<style lang="scss" scoped>
@import '/@/styles/index.scss';
.login {
  background-color: $dark-highlight;
  height: 100vh;
}
.logo {
  color: $primary;
}
.project-app-wrapper {
  display: flex;
  position: absolute;
  transition: width 0.2s ease;
  height: 100%;
  width: 100%;
  .left {
    width: 450px;
    display: flex;
    background-color: #232323;
    float: left;
  }
  .right {
    width: 100%;
    height: 100%;
    .map-wrapper {
      width: 100%;
      height: 100%;
    }
  }
  .main-content {
    flex: 1;
    color: $text-white-basic;
  }
  .media-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: #f6f8fa;
    padding: 16px;
  }
  .wayline-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: #f6f8fa;
    padding: 16px;
  }
}
</style>
