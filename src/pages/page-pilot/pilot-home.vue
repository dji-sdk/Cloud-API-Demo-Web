<template>
  <div class="page">
    <div class="left flex-column flex-justify-start flex-align-center">
      <p class="fz26 mb0 mt10" style="color: #727272">
        {{ platformName }}
      </p>
      <p class="fz16 ml10 mb0 mt10" style="color: #2d8cf0">
        status:{{ connect }}
      </p>
      <p class="fz32 mb0 mt50" style="color: #000000">{{ workspaceName }}</p>
      <a-button
        class="fz20 mt20 flex-column flex-justify-center flex-align-center"
        style="width: 30vw; height: 12vh;"
        type="default"
        @click="onOpen3rdApp"
        >Open 3rd Party APP</a-button
      >
      <a-button
        class="fz20"
        style="width: 15vw; height: 12vh; position: fixed; bottom: 7vh"
        type="primary"
        @click="onExit"
        >Quit</a-button
      >
    </div>
    <div class="right flex-column flex-justify-start flex-align-center">
      <p class="fz24 mb0 mt10 ">Setting</p>
      <a-button class="mt10 fz16" style="width:90%" @click="onMediaSetting"
        >Media File Upload Setting</a-button
      >
      <a-button class="mt10 fz16" style="width:90%" @click="onLiveshareSetting"
        >Manual Live Share Setting</a-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { CURRENT_CONFIG } from '/@/api/http/config'
import { getPlatformInfo, getUserInfo } from '/@/api/manage'
import apiPilot from '/@/api/pilot-bridge'
import { getRoot } from '/@/root'

const root = getRoot()
const connect = ref('Disconnect')
const platformName = ref('Unknown')
const workspaceName = ref('Unknown')
const workspaceDesc = ref('Unknown')
const wsId = ref()

onMounted(() => {
  apiPilot.init()
  const token = apiPilot.getToken()
  if (token) {
    getPlatformInfo({}).then(res => {
      console.log(res)
      platformName.value = res.data.platform_name
      workspaceName.value = res.data.workspace_name
      workspaceDesc.value = res.data.workspace_desc
      wsId.value = res.data.workspace_id
      apiPilot.setPlatformMessage(
        platformName.value,
        workspaceName.value,
        workspaceDesc.value
      )
      apiPilot.setWorkspaceId(wsId.value)
    })
  }
  if (JSON.parse(apiPilot.isComponentLoaded('thing')).data === false || token) {
    getUserInfo({}).then(res => {
      const param = {
        host: res.data.mqtt_addr,
        username: res.data.mqtt_username,
        password: res.data.mqtt_password,
        connectCallback: 'connectCallback'
      }
      apiPilot.setComponentParam('thing', param)
      apiPilot.loadComponent('thing', apiPilot.getComponentParam('thing'))
    })
  } else {
    const connectState = JSON.parse(window.djiBridge.thingGetConnectState())
    if (connectState.code === 0 && connectState.data) {
      connect.value = 'Connected'
    } else {
      connect.value = 'Disconnect'
    }
  }
  apiPilot.loadComponent('liveshare', apiPilot.getComponentParam('liveshare'))
  console.log('ws token:', token)
  apiPilot.setComponentParam('ws', {
    host: CURRENT_CONFIG.websocketURL,
    token: token
  })
  apiPilot.loadComponent('ws', apiPilot.getComponentParam('ws'))
  apiPilot.setComponentParam('map', {
    userName: 'pilot1',
    elementPreName: 'PILOT'
  })
  apiPilot.loadComponent('map', apiPilot.getComponentParam('map'))
  apiPilot.loadComponent('tsa', apiPilot.getComponentParam('tsa'))
  apiPilot.loadComponent('media', apiPilot.getComponentParam('media'))
  apiPilot.loadComponent('mission', {})
  window.connectCallback = arg => {
    connectCallback(arg)
  }
  apiPilot.onBackClickReg()
})
const connectCallback = (arg: any) => {
  console.info('into callback', arg)
  if (arg) {
    connect.value = 'Connected'
    window.djiBridge.mediaSetDownloadOwner(0)
    window.djiBridge.mediaSetUploadPhotoType(1)
  } else {
    connect.value = 'Disconnect'
  }
}
const onExit = async (e: any) => {
  apiPilot.stopwebview()
}
const onMediaSetting = async (e: any) => {
  root.$router.push('/pilot-media')
}
const onLiveshareSetting = async (e: any) => {
  root.$router.push('/pilot-liveshare')
}
const onOpen3rdApp = () => {
  window.open('mydjischeme://www.dji.com')
}
</script>

<style lang="scss" scoped>
@import '/@/styles/index.scss';
.page {
  display: flex;
  position: absolute;
  transition: width 0.2s ease;
  height: 100%;
  width: 100%;
  .left {
    width: 50%;
    border-right: red solid 2px;
  }
  .right {
    width: 100%;
    height: 100%;
  }
}
</style>
