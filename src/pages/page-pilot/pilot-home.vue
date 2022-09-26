<template>
  <a-layout class="page">
    <a-layout-sider class="left" width="40%" style="border-radius: 4px;">
      <div style="width:90%; height: 90%; margin: 4vh">
        <a-layout style="height: 20%; margin-top: 3vh; background-color: white; ">
          <a-layout-sider width="25%" theme="light" align="center">
            <a-avatar :size="60" :src="cloudapi">
            </a-avatar>
          </a-layout-sider>
          <a-layout-content style="margin-left: 1vw;" @click="showStatus">
            <div style="height: 50%;">
              <span style="font-size: 16px; font-weight: bolder">{{ workspaceName }}</span>
              <RightOutlined style="float: right; margin-top: 5px; color: #8894a0" />
            </div>
            <div style="height: 50%;">
              <CloudSyncOutlined v-if="state === EStatusValue.CONNECTED" style="color: #75c5f6" />
              <SyncOutlined spin v-else/>
              <span style="color: #737373; margin-left: 3px;">{{ state }}</span>
            </div>
            <a-drawer  placement="right" v-model:visible="drawerVisible" width="340px">
              <div class="mb10 flex-row flex-justify-center flex-align-center">
                <p class="fz14" style="font-weight: 100;">Module State</p>
              </div>
              <div class= "width-100 mb10 flex-align-start" v-for="m in modules" :key="m.name" style="height: 30px;">

                <div class="ml5" style="float: left; color: #000000;">{{m.name}}：</div>
                <div class="ml10" style="float: right; margin-bottom: 8px;">
                  <span :key="m.state" :class="m.state.value === EStatusValue.CONNECTED ? 'green' : 'red'">{{ m.state.value }}&nbsp;</span>
                  <a-button-group >
                  <a-button class="ml5" type="primary" size="small" @click.stop="moduleInstall(m)">install</a-button>
                  <a-button class="ml5 mr5" type="danger" size="small" @click.stop="moduleUninstall(m)">uninstall</a-button>
                  </a-button-group>
                </div>
                <a-divider />

              </div>
            </a-drawer>
          </a-layout-content>

        </a-layout>
        <a-divider  style="height: 2px; background-color: #f5f5f5; margin-top: 3vh;" />

        <a-button id="exitBtn" class="fz18" @click="confirmAgain"
        style="width: 10vw; height: 10vh; position: fixed; bottom: 13vh; left: 15vw; background-color: #e6e6e6; color: red; border: 0;"
        type="primary">Exit
        </a-button>
        <a-modal v-model:visible="exitVisible" width="300px" :closable="false">
          <template #footer>
            <a-button type="text" style="width: 48%; float: left;" @click="onBack">Cancel</a-button>
            <a-button type="text" style="width: 48%;" @click="onExit">Exit</a-button>
          </template>
          <p>Data will not be synchronized between DJI Pilot and this server after exiting.</p>
        </a-modal>
      </div>
    </a-layout-sider>
    <a-layout-content class="right flex-column">
      <div class="mb5">
        <span class="ml5" style="color: #939393;">Serial Number</span>
      </div>
      <div class="fz16" style="background-color: white; border-radius: 4px;">
        <a-row style="border-bottom: 1px solid #f4f8f9; height: 45px;" align="middle">
          <a-col :span="1"></a-col>
            <a-col :span="9">
            Remote Control Sn
            </a-col>
          <a-col :span="13" class="flex-align-end flex-column">
            <span style="color: #737373">{{ device.data.gateway_sn }}</span>
          </a-col>
        </a-row>
        <a-row style="border-bottom: 1px solid #f4f8f9; height: 45px;" align="middle" v-if="device.data.online_status">
          <a-col :span="1"></a-col>
          <a-col :span="9">Aircraft Sn</a-col>
          <a-col :span="13" class="flex-align-end flex-column" >
            <span style="color: #737373">{{ device.data.sn }}</span>
          </a-col>
        </a-row>
      </div>
      <div class="mt5 mb5">
        <span class="ml5" style="color: #939393;">Settings</span>
      </div>
      <div class="fz16" style="background-color: white; border-radius: 4px;">
        <a-row v-if="device.data.online_status" style="border-bottom: 1px solid #f4f8f9; height: 45px;" align="middle" @click="bindingDevice">
          <a-col :span="1"></a-col>
          <a-col :span="11">
            Device Binding
          </a-col>
          <a-col :span="10" style="text-align: right">
            <span v-if="device.data.bound_status" style="color: #737373">Aircraft bound</span>
            <span v-else style="color: #737373">Aircraft not bound</span>
          </a-col>
          <a-col :span="2" class="flex-align-center flex-column" >
            <RightOutlined style="color: #8894a0; font-size: 20px;" />
          </a-col>
        </a-row>
        <a-row style="border-bottom: 1px solid #f4f8f9; height: 45px;" align="middle" @click="onMediaSetting">
          <a-col :span="1"></a-col>
          <a-col :span="21">
            Media File Upload
          </a-col>
          <a-col :span="2" class="flex-align-center flex-column" >
            <RightOutlined style="color: #8894a0; font-size: 20px;" />
          </a-col>
        </a-row>
        <a-row style="border-bottom: 1px solid #f4f8f9; height: 45px;" align="middle" @click="onLiveshareSetting">
          <a-col :span="1"></a-col>
          <a-col :span="21">Livestream Manually</a-col>
          <a-col :span="2" class="flex-align-center flex-column">
            <RightOutlined style="color: #8894a0; font-size: 20px;" />
          </a-col>
        </a-row>
        <a-row style="border-bottom: 1px solid #f4f8f9; height: 45px;" align="middle" @click="onOpen3rdApp">
          <a-col :span="1"></a-col>
          <a-col :span="21">Open 3rd Party APP</a-col>
          <a-col :span="2" class="flex-align-center flex-column">
            <RightOutlined style="color: #8894a0; font-size: 20px;" />
          </a-col>
        </a-row>
      </div>
    </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
import { message, Popconfirm } from 'ant-design-vue'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { CURRENT_CONFIG } from '/@/api/http/config'
import { BindBody, bindDevice, getDeviceBySn, getPlatformInfo, getUserInfo } from '/@/api/manage'
import apiPilot, { ApiParam, MapParam, ThingParam, WsParam } from '/@/api/pilot-bridge'
import { getRoot } from '/@/root'
import { EBizCode, EComponentName, EDownloadOwner, ELocalStorageKey, ERouterName, EStatusValue } from '/@/types'
import cloudapi from '/@/assets/icons/cloudapi.png'
import { RightOutlined, CloudOutlined, CloudSyncOutlined, SyncOutlined } from '@ant-design/icons-vue'
import { useMyStore } from '/@/store'
import { DeviceStatus } from '/@/types/device'
import { useConnectWebSocket } from '/@/hooks/use-connect-websocket'

const root = getRoot()
const gatewayState = ref<boolean>(localStorage.getItem(ELocalStorageKey.GatewayOnline) === 'true')
const state = ref(EStatusValue.DISCONNECT)
const thingState = ref(EStatusValue.DISCONNECT)
const apiState = ref(EStatusValue.DISCONNECT)
const liveState = ref(EStatusValue.DISCONNECT)
const wsState = ref(EStatusValue.DISCONNECT)
const mapState = ref(EStatusValue.DISCONNECT)
const tsaState = ref(EStatusValue.DISCONNECT)
const mediaState = ref(EStatusValue.DISCONNECT)
const waylineState = ref(EStatusValue.DISCONNECT)
const workspaceName = ref<string>(localStorage.getItem(ELocalStorageKey.WorkspaceName)!)
const username = ref(localStorage.getItem(ELocalStorageKey.Username)!)
const wsId = ref(localStorage.getItem(ELocalStorageKey.WorkspaceId)!)
const components = apiPilot.init()
const exitVisible = ref(false)
const drawerVisible = ref(false)
let minitor = -1

interface DeviceInfoData {
  data: DeviceStatus
}
const device = reactive<DeviceInfoData>({
  data: {
    sn: EStatusValue.DISCONNECT,
    online_status: false,
    device_callsign: '',
    user_id: '',
    user_callsign: '',
    bound_status: false,
    model: '',
    gateway_sn: EStatusValue.DISCONNECT,
    domain: ''
  }
})
const bindParam: BindBody = {
  device_sn: '',
  user_id: '',
  workspace_id: wsId.value
}

const modules = [{
  name: 'Cloud',
  state: thingState,
  module: EComponentName.Thing
}, {
  name: 'Api',
  state: apiState,
  module: EComponentName.Api
}, {
  name: 'Live',
  state: liveState,
  module: EComponentName.Liveshare
}, {
  name: 'Ws',
  state: wsState,
  module: EComponentName.Ws
}, {
  name: 'Map',
  state: mapState,
  module: EComponentName.Map
}, {
  name: 'Tsa',
  state: tsaState,
  module: EComponentName.Tsa
}, {
  name: 'Media',
  state: mediaState,
  module: EComponentName.Media
}, {
  name: 'Wayline',
  state: waylineState,
  module: EComponentName.Mission
}]

const store = useMyStore()

const messageHandler = async (payload: any) => {
  if (!payload) {
    return
  }
  switch (payload.biz_code) {
    case EBizCode.DeviceOnline: {
      console.info('online: ', payload)
      if (payload.data.sn === device.data.gateway_sn) {
        gatewayState.value = true
        localStorage.setItem(ELocalStorageKey.GatewayOnline, gatewayState.value.toString())
        state.value = gatewayState.value && thingState.value === EStatusValue.CONNECTED ? EStatusValue.CONNECTED : EStatusValue.DISCONNECT
        break
      }
      if (payload.data.gateway_sn === device.data.gateway_sn) {
        device.data = payload.data
        localStorage.setItem(ELocalStorageKey.Device, JSON.stringify(device.data))
      }
      break
    }
    case EBizCode.DeviceOffline: {
      console.info('offline: ', payload)
      if (payload.data.sn === device.data.sn) {
        device.data.online_status = payload.data.online_status
        localStorage.setItem(ELocalStorageKey.Device, JSON.stringify(device.data))
      }
      break
    }

    default:
      break
  }
}

// 监听ws 消息
useConnectWebSocket(messageHandler)

let bindNum: number

onMounted(() => {
  apiPilot.onBackClickReg()
  apiPilot.onStopPlatform()

  device.data.gateway_sn = apiPilot.getRemoteControllerSN()
  if (device.data.gateway_sn === EStatusValue.DISCONNECT.toString()) {
    message.warn('Data is not available, please restart the remote control.')
    return
  }
  const oldDevice = localStorage.getItem(ELocalStorageKey.Device)
  if (oldDevice) {
    device.data = JSON.parse(oldDevice)
  }
  device.data.sn = apiPilot.getAircraftSN()
  getDeviceInfo()

  const isLoaded = apiPilot.isComponentLoaded(EComponentName.Thing)
  if (isLoaded) {
    username.value = '' + localStorage.getItem(ELocalStorageKey.Username)
    workspaceName.value = '' + localStorage.getItem(ELocalStorageKey.WorkspaceName)
    refreshStatus()
    apiPilot.setPlatformMessage(
      '' + localStorage.getItem(ELocalStorageKey.PlatformName),
      workspaceName.value,
      '' + localStorage.getItem(ELocalStorageKey.WorkspaceDesc)
    )
    return
  }

  setWorkspaceInfo()

  getUserInfo().then(res => {
    username.value = res.data.username
    localStorage.setItem(ELocalStorageKey.Username, username.value)
    // thing
    const param: ThingParam = {
      host: res.data.mqtt_addr,
      username: res.data.mqtt_username,
      password: res.data.mqtt_password,
      connectCallback: 'connectCallback'
    }
    components.set(EComponentName.Thing, param)
    apiPilot.loadComponent(EComponentName.Thing, components.get(EComponentName.Thing))

    bindParam.device_sn = device.data.gateway_sn
    bindParam.user_id = res.data.user_id
    bindParam.workspace_id = res.data.workspace_id
  })
  window.connectCallback = arg => {
    connectCallback(arg)
  }
  window.wsConnectCallback = arg => {
    wsConnectCallback(arg)
  }
})

const connectCallback = async (arg: any) => {
  if (arg) {
    thingState.value = EStatusValue.CONNECTED
    // liveshare
    apiPilot.loadComponent(EComponentName.Liveshare, components.get(EComponentName.Liveshare))

    // ws
    const wsParam: WsParam = components.get(EComponentName.Ws)
    wsParam.token = apiPilot.getToken()
    apiPilot.loadComponent(EComponentName.Ws, components.get(EComponentName.Ws))

    // map
    const mapParam: MapParam = components.get(EComponentName.Map)
    mapParam.userName = username.value
    apiPilot.loadComponent(EComponentName.Map, components.get(EComponentName.Map))

    // tsa
    apiPilot.loadComponent(EComponentName.Tsa, components.get(EComponentName.Tsa))

    // media
    apiPilot.loadComponent(EComponentName.Media, components.get(EComponentName.Media))
    apiPilot.setDownloadOwner(EDownloadOwner.Mine.valueOf())

    // mission
    apiPilot.loadComponent(EComponentName.Mission, {})

    bindNum = setInterval(() => {
      bindDevice(bindParam).then(bindRes => {
        if (bindRes.code !== 0) {
          message.error(bindRes.message)
          console.error(bindRes.message)
        } else {
          clearInterval(bindNum)
        }
      })
    }, 2000)
    setTimeout(getDeviceInfo, 3000)
  } else {
    thingState.value = EStatusValue.DISCONNECT
  }
  refreshStatus()
}
const wsConnectCallback = async (arg: any) => {
  if (arg) {
    wsState.value = EStatusValue.CONNECTED
  } else {
    wsState.value = EStatusValue.DISCONNECT
  }
}

const confirmAgain = () => {
  exitVisible.value = true
}

const onBack = () => {
  exitVisible.value = false
}

const onExit = () => {
  localStorage.clear()
  apiPilot.stopwebview()
}

const bindingDevice = async () => {
  root.$router.push(ERouterName.PILOT_BIND)
}

const onMediaSetting = async (e: any) => {
  root.$router.push(ERouterName.PILOT_MEDIA)
}
const onLiveshareSetting = async (e: any) => {
  root.$router.push(ERouterName.PILOT_LIVESHARE)
}
const onOpen3rdApp = () => {
  const packageName = 'com.dji.sample'
  const isInstalled = apiPilot.isAppInstalled(packageName)
  if (isInstalled) {
    window.open('https://www.dji.com')
  } else {
    message.error(packageName + ' is not installed.')
  }
}

const showStatus = async () => {
  minitor = setInterval(() => {
    refreshStatus()
    if (!drawerVisible.value) {
      clearInterval(minitor)
    }
  }, 2000)
  drawerVisible.value = true
}

function setWorkspaceInfo () {
  if (localStorage.getItem(ELocalStorageKey.WorkspaceName)) {
    apiPilot.setPlatformMessage(
      '' + localStorage.getItem(ELocalStorageKey.PlatformName),
      workspaceName.value,
      '' + localStorage.getItem(ELocalStorageKey.WorkspaceDesc)
    )
    apiPilot.setWorkspaceId(wsId.value)

    return
  }
  getPlatformInfo().then(res => {
    console.log(res)
    workspaceName.value = res.data.workspace_name
    wsId.value = res.data.workspace_id
    localStorage.setItem(ELocalStorageKey.PlatformName, res.data.platform_name)
    localStorage.setItem(ELocalStorageKey.WorkspaceName, workspaceName.value)
    localStorage.setItem(ELocalStorageKey.WorkspaceDesc, res.data.workspace_desc)
    apiPilot.setPlatformMessage(
      res.data.platform_name,
      workspaceName.value,
      res.data.workspace_desc
    )
    apiPilot.setWorkspaceId(wsId.value)
  })
}

function refreshStatus () {
  thingState.value = apiPilot.thingGetConnectState() ? EStatusValue.CONNECTED : EStatusValue.DISCONNECT
  apiState.value = apiPilot.isComponentLoaded(EComponentName.Api) ? EStatusValue.CONNECTED : EStatusValue.DISCONNECT
  liveState.value = apiPilot.isComponentLoaded(EComponentName.Liveshare) ? EStatusValue.CONNECTED : EStatusValue.DISCONNECT
  wsState.value = apiPilot.isComponentLoaded(EComponentName.Ws) && apiPilot.wsGetConnectState()
    ? EStatusValue.CONNECTED
    : EStatusValue.DISCONNECT
  mapState.value = apiPilot.isComponentLoaded(EComponentName.Map) ? EStatusValue.CONNECTED : EStatusValue.DISCONNECT
  tsaState.value = apiPilot.isComponentLoaded(EComponentName.Tsa) ? EStatusValue.CONNECTED : EStatusValue.DISCONNECT
  mediaState.value = apiPilot.isComponentLoaded(EComponentName.Media) ? EStatusValue.CONNECTED : EStatusValue.DISCONNECT
  waylineState.value = apiPilot.isComponentLoaded(EComponentName.Mission) ? EStatusValue.CONNECTED : EStatusValue.DISCONNECT
  state.value = thingState.value === EStatusValue.CONNECTED && gatewayState.value ? EStatusValue.CONNECTED : EStatusValue.DISCONNECT
}

function moduleInstall (m: any) {
  let param
  switch (m.module) {
    case EComponentName.Thing:
      param = apiPilot.thingGetConfigs()
      break
    case EComponentName.Api: {
      const apiParam: ApiParam = {
        host: apiPilot.getHost(),
        token: apiPilot.getToken()
      }
      param = apiParam
      break
    }
    case EComponentName.Map: {
      const mapParam: MapParam = components.get(EComponentName.Map)
      mapParam.userName = '' + localStorage.getItem(ELocalStorageKey.Username)
      param = mapParam
      break
    }
    case EComponentName.Ws: {
      const wsParam: WsParam = components.get(EComponentName.Ws)
      wsParam.token = '' + localStorage.getItem(ELocalStorageKey.Token)
      param = wsParam
      break
    }
    default:
      param = components.get(m.module)
  }

  components.set(m.module, param)
  console.info(components.get(m.module))
  apiPilot.loadComponent(m.module, components.get(m.module))
  refreshStatus()
}

function moduleUninstall (m: any) {
  message.info('uninstall ' + m.module)
  apiPilot.unloadComponent(m.module)
  refreshStatus()
}

function getDeviceInfo () {
  if (device.data.sn === EStatusValue.DISCONNECT) {
    return
  }
  getDeviceBySn(bindParam.workspace_id, device.data.sn).then(res => {
    if (res.code !== 0) {
      return
    }
    device.data.online_status = res.data.status
    device.data.bound_status = res.data.bound_status
    device.data.device_callsign = res.data.nickname
    device.data.model = res.data.device_name
    localStorage.setItem(ELocalStorageKey.Device, JSON.stringify(device.data))
  })
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
    height: 90%;
    background-color: white;
    margin-top: 6vh;
    margin-left: 2vh;
  }
  .right {
    height: 90%;
    margin-top: 6vh;
    margin-left: 5vh;
    margin-right: 5vh;
  }
}
.green {
  color: green
}
.red {
  color: red;
}
#exitBtn:hover :active {
  background-color: rgb(77, 75, 75);
  width: 10vw;
  height: 10vh;
  position: fixed;
  bottom: 13vh;
  left: 15vw;
  line-height: 10vh;
}

</style>
