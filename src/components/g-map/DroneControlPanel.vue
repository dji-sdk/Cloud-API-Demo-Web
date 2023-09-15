<template>
  <div class="drone-control-wrapper">
    <div class="drone-control-header">Drone Flight Control</div>
    <div class="drone-control-box">
      <div class="box">
        <div class="row">
          <div class="drone-control"><Button :ghost="!flightController" size="small"  @click="onClickFightControl">{{ flightController ? 'Exit Remote Control' : 'Enter Remote Control'}}</Button></div>
        </div>
        <div class="row">
          <div class="drone-control-direction">
            <Button size="small" ghost @mousedown="onMouseDown(KeyCode.KEY_Q)" @onmouseup="onMouseUp">
              <template #icon><UndoOutlined /></template><span class="word">Q</span>
            </Button>
            <Button size="small" ghost @mousedown="onMouseDown(KeyCode.KEY_W)" @onmouseup="onMouseUp">
              <template #icon><UpOutlined/></template><span class="word">W</span>
            </Button>
            <Button size="small" ghost @mousedown="onMouseDown(KeyCode.KEY_E)" @onmouseup="onMouseUp">
              <template #icon><RedoOutlined /></template><span class="word">E</span>
            </Button>
            <Button size="small" ghost @mousedown="onMouseDown(KeyCode.ARROW_UP)" @onmouseup="onMouseUp">
              <template #icon><ArrowUpOutlined /></template>
            </Button>
            <br />
            <Button size="small" ghost @mousedown="onMouseDown(KeyCode.KEY_A)" @onmouseup="onMouseUp">
              <template #icon><LeftOutlined/></template><span class="word">A</span>
            </Button>
            <Button size="small" ghost @mousedown="onMouseDown(KeyCode.KEY_S)" @onmouseup="onMouseUp">
              <template #icon><DownOutlined/></template><span class="word">S</span>
            </Button>
            <Button size="small" ghost @mousedown="onMouseDown(KeyCode.KEY_D)" @onmouseup="onMouseUp">
              <template #icon><RightOutlined/></template><span class="word">D</span>
            </Button>
            <Button size="small" ghost @mousedown="onMouseDown(KeyCode.ARROW_DOWN)" @onmouseup="onMouseUp">
              <template #icon><ArrowDownOutlined /></template>
            </Button>
          </div>
          <Button type="primary" size="small" danger ghost @click="handleEmergencyStop" >
            <template #icon><PauseCircleOutlined/></template><span>Break</span>
          </Button>
        </div>
        <div class="row">
          <DroneControlPopover
            :visible="flyToPointPopoverData.visible"
            :loading="flyToPointPopoverData.loading"
            @confirm="($event) => onFlyToConfirm(true)"
            @cancel="($event) =>onFlyToConfirm(false)"
          >
            <template #formContent>
              <div class="form-content">
                <div>
                  <span class="form-label">latitude:</span>
                  <a-input-number v-model:value="flyToPointPopoverData.latitude"/>
                </div>
                <div>
                  <span class="form-label">longitude:</span>
                  <a-input-number v-model:value="flyToPointPopoverData.longitude"/>
                </div>
                <div>
                  <span class="form-label">height(m):</span>
                  <a-input-number v-model:value="flyToPointPopoverData.height"/>
                </div>
              </div>
            </template>
            <Button size="small" ghost @click="onShowFlyToPopover" >
              <span>Fly to</span>
            </Button>
          </DroneControlPopover>
          <Button size="small" ghost @click="onStopFlyToPoint" >
            <span>Stop Fly to</span>
          </Button>
          <DroneControlPopover
            :visible="takeoffToPointPopoverData.visible"
            :loading="takeoffToPointPopoverData.loading"
            @confirm="($event) => onTakeoffToPointConfirm(true)"
            @cancel="($event) =>onTakeoffToPointConfirm(false)"
          >
            <template #formContent>
              <div class="form-content">
                <div>
                  <span class="form-label">latitude:</span>
                  <a-input-number v-model:value="takeoffToPointPopoverData.latitude"/>
                </div>
                <div>
                  <span class="form-label">longitude:</span>
                  <a-input-number v-model:value="takeoffToPointPopoverData.longitude"/>
                </div>
                <div>
                  <span class="form-label">height(m):</span>
                  <a-input-number v-model:value="takeoffToPointPopoverData.height"/>
                </div>
                <div>
                  <span class="form-label">Safe Takeoff Altitude(m):</span>
                  <a-input-number v-model:value="takeoffToPointPopoverData.securityTakeoffHeight"/>
                </div>
                <div>
                  <span class="form-label">Return-to-Home Altitude(m):</span>
                  <a-input-number v-model:value="takeoffToPointPopoverData.rthAltitude"/>
                </div>
                <div>
                  <span class="form-label">Lost Action:</span>
                  <a-select
                    v-model:value="takeoffToPointPopoverData.rcLostAction"
                    style="width: 120px"
                    :options="LostControlActionInCommandFLightOptions"
                  ></a-select>
                </div>
                <div>
                  <span class="form-label">Wayline Lost Action:</span>
                  <a-select
                    v-model:value="takeoffToPointPopoverData.exitWaylineWhenRcLost"
                    style="width: 120px"
                    :options="WaylineLostControlActionInCommandFlightOptions"
                  ></a-select>
                </div>
                <div>
                  <span class="form-label">Return-to-Home Mode:</span>
                  <a-select
                    v-model:value="takeoffToPointPopoverData.rthMode"
                    style="width: 120px"
                    :options="RthModeInCommandFlightOptions"
                  ></a-select>
                </div>
                <div>
                  <span class="form-label">Commander Mode Lost Action:</span>
                  <a-select
                    v-model:value="takeoffToPointPopoverData.commanderModeLostAction"
                    style="width: 120px"
                    :options="CommanderModeLostActionInCommandFlightOptions"
                  ></a-select>
                </div>
                <div>
                  <span class="form-label">Commander Flight Mode:</span>
                  <a-select
                    v-model:value="takeoffToPointPopoverData.commanderFlightMode"
                    style="width: 120px"
                    :options="CommanderFlightModeInCommandFlightOptions"
                  ></a-select>
                </div>
                <div>
                  <span class="form-label">Commander Flight Height(m):</span>
                  <a-input-number v-model:value="takeoffToPointPopoverData.commanderFlightHeight"/>
                </div>
              </div>
            </template>
            <Button size="small" ghost @click="onShowTakeoffToPointPopover" >
              <span>Take off</span>
            </Button>
            <div v-for="(cmdItem) in cmdList" :key="cmdItem.cmdKey" class="control-cmd-item">
              <Button :loading="cmdItem.loading" size="small" ghost @click="sendControlCmd(cmdItem, 0)">
                {{ cmdItem.operateText }}
              </Button>
            </div>
            <div>
              <Button size="small" ghost @click="openLivestreamAgora" >
                <span>Agora Live</span>
              </Button>
              <Button size="small" ghost @click="openLivestreamOthers" >
                <span>RTMP/GB28181 Live</span>
              </Button>
            </div>
          </DroneControlPopover>
        </div>
    </div>
    <div class="box">
      <div class="row">
        <Select v-model:value="payloadSelectInfo.value" style="width: 110px; marginRight: 5px" :options="payloadSelectInfo.options" @change="handlePayloadChange"/>
        <div class="drone-control">
          <Button type="primary" size="small" @click="onAuthPayload">Payload Control</Button>
        </div>
      </div>
      <div class="row">
        <DroneControlPopover
          :visible="gimbalResetPopoverData.visible"
          :loading="gimbalResetPopoverData.loading"
          @confirm="($event) => onGimbalResetConfirm(true)"
          @cancel="($event) =>onGimbalResetConfirm(false)"
        >
          <template #formContent>
            <div class="form-content">
              <div>
                <span class="form-label">reset mode:</span>
                <a-select
                  v-model:value="gimbalResetPopoverData.resetMode"
                  style="width: 180px"
                  :options="GimbalResetModeOptions"
                ></a-select>
              </div>
            </div>
          </template>
          <Button size="small" ghost @click="onShowGimbalResetPopover">
            <span>Gimbal Reset</span>
          </Button>
        </DroneControlPopover>
        <Button size="small" ghost @click="onSwitchCameraMode">
          <span>Camera Mode Switch</span>
        </Button>
      </div>
      <div class="row">
        <Button size="small" ghost @click="onStartCameraRecording">
          <span>Start Recording</span>
        </Button>
        <Button size="small" ghost @click="onStopCameraRecording">
          <span>Stop Recording</span>
        </Button>
      </div>
      <div class="row">
        <Button size="small" ghost  @click="onTakeCameraPhoto">
          <span>Take Photo</span>
        </Button>
        <DroneControlPopover
          :visible="zoomFactorPopoverData.visible"
          :loading="zoomFactorPopoverData.loading"
          @confirm="($event) => onZoomFactorConfirm(true)"
          @cancel="($event) =>onZoomFactorConfirm(false)"
        >
          <template #formContent>
            <div class="form-content">
              <div>
                <span class="form-label">camera type:</span>
                <a-select
                  v-model:value="zoomFactorPopoverData.cameraType"
                  style="width: 120px"
                  :options="ZoomCameraTypeOptions"
                ></a-select>
              </div>
              <div>
                <span class="form-label">zoom factor:</span>
                <a-input-number v-model:value="zoomFactorPopoverData.zoomFactor" :min="2" :max="200" />
              </div>
            </div>
          </template>
          <Button size="small" ghost @click="($event) => onShowZoomFactorPopover()">
            <span class="word" @click=";">Zoom</span>
          </Button>
        </DroneControlPopover>
        <DroneControlPopover
            :visible="cameraAimPopoverData.visible"
            :loading="cameraAimPopoverData.loading"
            @confirm="($event) => onCameraAimConfirm(true)"
            @cancel="($event) =>onCameraAimConfirm(false)"
          >
            <template #formContent>
              <div class="form-content">
                <div>
                  <span class="form-label">camera type:</span>
                  <a-select
                    v-model:value="cameraAimPopoverData.cameraType"
                    style="width: 120px"
                    :options="CameraTypeOptions"
                  ></a-select>
                </div>
                <div>
                  <span class="form-label">locked:</span>
                  <a-switch v-model:checked="cameraAimPopoverData.locked"/>
                </div>
                <div>
                  <span class="form-label">x:</span>
                  <a-input-number v-model:value="cameraAimPopoverData.x" :min="0" :max="1"/>
                </div>
                <div>
                  <span class="form-label">y:</span>
                  <a-input-number v-model:value="cameraAimPopoverData.y" :min="0" :max="1"/>
                </div>
              </div>
            </template>
            <Button size="small" ghost @click="($event) => onShowCameraAimPopover()">
              <span class="word" @click=";">AIM</span>
            </Button>
          </DroneControlPopover>
      </div>
    </div>
    </div>
    <!-- 信息提示 -->
    <DroneControlInfoPanel :message="drcInfo"></DroneControlInfoPanel>
  </div>
</template>

<script setup lang="ts">
import { defineProps, reactive, ref, watch, computed, onMounted, watchEffect } from 'vue'
import { Select, message, Button } from 'ant-design-vue'
import { PayloadInfo, DeviceInfoType, ControlSource, DeviceOsdCamera, DrcStateEnum } from '/@/types/device'
import { useMyStore } from '/@/store'
import { postDrcEnter, postDrcExit } from '/@/api/drc'
import { useMqtt, DeviceTopicInfo } from './use-mqtt'
import { DownOutlined, UpOutlined, LeftOutlined, RightOutlined, PauseCircleOutlined, UndoOutlined, RedoOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'
import { useManualControl, KeyCode } from './use-manual-control'
import { usePayloadControl } from './use-payload-control'
import { CameraMode, CameraType, CameraTypeOptions, ZoomCameraTypeOptions, CameraListItem } from '/@/types/live-stream'
import { useDroneControlWsEvent } from './use-drone-control-ws-event'
import { useDroneControlMqttEvent } from './use-drone-control-mqtt-event'
import {
  postFlightAuth, LostControlActionInCommandFLight, WaylineLostControlActionInCommandFlight, ERthMode,
  ECommanderModeLostAction, ECommanderFlightMode
} from '/@/api/drone-control/drone'
import { useDroneControl } from './use-drone-control'
import {
  GimbalResetMode, GimbalResetModeOptions, LostControlActionInCommandFLightOptions, WaylineLostControlActionInCommandFlightOptions,
  RthModeInCommandFlightOptions, CommanderModeLostActionInCommandFlightOptions, CommanderFlightModeInCommandFlightOptions
} from '/@/types/drone-control'
import DroneControlPopover from './DroneControlPopover.vue'
import DroneControlInfoPanel from './DroneControlInfoPanel.vue'
import { noDebugCmdList as baseCmdList, DeviceCmdItem, DeviceCmd } from '/@/types/device-cmd'
import { useDockControl } from './use-dock-control'

const props = defineProps<{
  sn: string,
  deviceInfo: DeviceInfoType,
  payloads: null | PayloadInfo[]
}>()

const store = useMyStore()
const clientId = computed(() => {
  return store.state.clientId
})

const initCmdList = baseCmdList.map(cmdItem => Object.assign({}, cmdItem))
const cmdList = ref(initCmdList)

const {
  sendDockControlCmd
} = useDockControl()

async function sendControlCmd (cmdItem: DeviceCmdItem, index: number) {
  cmdItem.loading = true
  const result = await sendDockControlCmd({
    sn: props.sn,
    cmd: cmdItem.cmdKey,
    action: cmdItem.action
  }, false)
  if (result) {
    message.success('Return home successful')
    if (flightController.value) {
      exitFlightCOntrol()
    }
  } else {
    message.error('Failed to return home')
  }
  cmdItem.loading = false
}

const { flyToPoint, stopFlyToPoint, takeoffToPoint } = useDroneControl()
const MAX_SPEED = 14

const flyToPointPopoverData = reactive({
  visible: false,
  loading: false,
  latitude: null as null | number,
  longitude: null as null | number,
  height: null as null | number,
  maxSpeed: MAX_SPEED,
})

function onShowFlyToPopover () {
  flyToPointPopoverData.visible = !flyToPointPopoverData.visible
  flyToPointPopoverData.loading = false
  flyToPointPopoverData.latitude = null
  flyToPointPopoverData.longitude = null
  flyToPointPopoverData.height = null
}

async function onFlyToConfirm (confirm: boolean) {
  if (confirm) {
    if (!flyToPointPopoverData.height || !flyToPointPopoverData.latitude || !flyToPointPopoverData.longitude) {
      message.error('Input error')
      return
    }
    try {
      await flyToPoint(props.sn, {
        max_speed: flyToPointPopoverData.maxSpeed,
        points: [
          {
            latitude: flyToPointPopoverData.latitude,
            longitude: flyToPointPopoverData.longitude,
            height: flyToPointPopoverData.height
          }
        ]
      })
    } catch (error) {
    }
  }
  flyToPointPopoverData.visible = false
}

async function onStopFlyToPoint () {
  await stopFlyToPoint(props.sn)
}

const takeoffToPointPopoverData = reactive({
  visible: false,
  loading: false,
  latitude: null as null | number,
  longitude: null as null | number,
  height: null as null | number,
  securityTakeoffHeight: null as null | number,
  maxSpeed: MAX_SPEED,
  rthAltitude: null as null | number,
  rcLostAction: LostControlActionInCommandFLight.RETURN_HOME,
  exitWaylineWhenRcLost: WaylineLostControlActionInCommandFlight.EXEC_LOST_ACTION,
  rthMode: ERthMode.SETTING,
  commanderModeLostAction: ECommanderModeLostAction.CONTINUE,
  commanderFlightMode: ECommanderFlightMode.SETTING,
  commanderFlightHeight: null as null | number,
})

function onShowTakeoffToPointPopover () {
  takeoffToPointPopoverData.visible = !takeoffToPointPopoverData.visible
  takeoffToPointPopoverData.loading = false
  takeoffToPointPopoverData.latitude = null
  takeoffToPointPopoverData.longitude = null
  takeoffToPointPopoverData.securityTakeoffHeight = null
  takeoffToPointPopoverData.rthAltitude = null
  takeoffToPointPopoverData.rcLostAction = LostControlActionInCommandFLight.RETURN_HOME
  takeoffToPointPopoverData.exitWaylineWhenRcLost = WaylineLostControlActionInCommandFlight.EXEC_LOST_ACTION
  takeoffToPointPopoverData.rthMode = ERthMode.SETTING
  takeoffToPointPopoverData.commanderModeLostAction = ECommanderModeLostAction.CONTINUE
  takeoffToPointPopoverData.commanderFlightMode = ECommanderFlightMode.SETTING
  takeoffToPointPopoverData.commanderFlightHeight = null
}

async function onTakeoffToPointConfirm (confirm: boolean) {
  if (confirm) {
    if (!takeoffToPointPopoverData.height ||
        !takeoffToPointPopoverData.latitude ||
        !takeoffToPointPopoverData.longitude ||
        !takeoffToPointPopoverData.securityTakeoffHeight ||
        !takeoffToPointPopoverData.rthAltitude ||
        !takeoffToPointPopoverData.commanderFlightHeight) {
      message.error('Input error')
      return
    }
    try {
      await takeoffToPoint(props.sn, {
        target_latitude: takeoffToPointPopoverData.latitude,
        target_longitude: takeoffToPointPopoverData.longitude,
        target_height: takeoffToPointPopoverData.height,
        security_takeoff_height: takeoffToPointPopoverData.securityTakeoffHeight,
        rth_altitude: takeoffToPointPopoverData.rthAltitude,
        max_speed: takeoffToPointPopoverData.maxSpeed,
        rc_lost_action: takeoffToPointPopoverData.rcLostAction,
        exit_wayline_when_rc_lost: takeoffToPointPopoverData.exitWaylineWhenRcLost,
        rth_mode: takeoffToPointPopoverData.rthMode,
        commander_mode_lost_action: takeoffToPointPopoverData.commanderModeLostAction,
        commander_flight_mode: takeoffToPointPopoverData.commanderFlightMode,
        commander_flight_height: takeoffToPointPopoverData.commanderFlightHeight,
      })
    } catch (error) {
    }
  }
  takeoffToPointPopoverData.visible = false
}

const deviceTopicInfo: DeviceTopicInfo = reactive({
  sn: props.sn,
  pubTopic: '',
  subTopic: ''
})

useMqtt(deviceTopicInfo)

// 飞行控制
// const drcState = computed(() => {
//   return store.state.deviceState?.dockInfo[props.sn]?.link_osd?.drc_state === DrcStateEnum.CONNECTED
// })
const flightController = ref(false)

async function onClickFightControl () {
  if (flightController.value) {
    exitFlightCOntrol()
    return
  }
  enterFlightControl()
}

// 进入飞行控制
async function enterFlightControl () {
  try {
    const { code, data } = await postDrcEnter({
      client_id: clientId.value,
      dock_sn: props.sn,
    })
    if (code === 0) {
      flightController.value = true
      if (data.sub && data.sub.length > 0) {
        deviceTopicInfo.subTopic = data.sub[0]
      }
      if (data.pub && data.pub.length > 0) {
        deviceTopicInfo.pubTopic = data.pub[0]
      }
      // 获取飞行控制权
      if (droneControlSource.value !== ControlSource.A) {
        await postFlightAuth(props.sn)
      }
      message.success('Get flight control successfully')
    }
  } catch (error: any) {
  }
}

// 退出飞行控制
async function exitFlightCOntrol () {
  try {
    const { code } = await postDrcExit({
      client_id: clientId.value,
      dock_sn: props.sn,
    })
    if (code === 0) {
      flightController.value = false
      deviceTopicInfo.subTopic = ''
      deviceTopicInfo.pubTopic = ''
      message.success('Exit flight control')
    }
  } catch (error: any) {
  }
}

// drc mqtt message
const { drcInfo, errorInfo } = useDroneControlMqttEvent(props.sn)

const {
  handleKeyup,
  handleEmergencyStop,
  resetControlState,
} = useManualControl(deviceTopicInfo, flightController)

function onMouseDown (type: KeyCode) {
  handleKeyup(type)
}

function onMouseUp () {
  resetControlState()
}

// 负载控制
const payloadSelectInfo = {
  value: null as any,
  controlSource: undefined as undefined | ControlSource,
  options: [] as any,
  payloadIndex: '' as string,
  camera: undefined as undefined | DeviceOsdCamera // 当前负载osd信息
}

const handlePayloadChange = (value: string) => {
  const payload = props.payloads?.find(item => item.payload_sn === value)
  if (payload) {
    payloadSelectInfo.payloadIndex = payload.payload_index || ''
    payloadSelectInfo.controlSource = payload.control_source
    payloadSelectInfo.camera = undefined
  }
}

// function getCurrentCamera (cameraList: CameraListItem[], cameraIndex?: string):CameraListItem | null {
//   let camera = null
//   cameraList.forEach(item => {
//     if (item.camera_index === cameraIndex) {
//       camera = item
//     }
//   })
//   return camera
// }

// const currentCamera = computed(() => {
//   return getCurrentCamera(props.deviceInfo.dock.basic_osd.live_capacity?.device_list[0]?.camera_list as CameraListItem[], camera_index)
// })
// 更新负载信息
watch(() => props.payloads, (payloads) => {
  if (payloads && payloads.length > 0) {
    payloadSelectInfo.value = payloads[0].payload_sn
    payloadSelectInfo.controlSource = payloads[0].control_source || ControlSource.B
    payloadSelectInfo.payloadIndex = payloads[0].payload_index || ''
    payloadSelectInfo.options = payloads.map(item => ({ label: item.payload_name, value: item.payload_sn }))
    payloadSelectInfo.camera = undefined
  } else {
    payloadSelectInfo.value = null
    payloadSelectInfo.controlSource = undefined
    payloadSelectInfo.options = []
    payloadSelectInfo.payloadIndex = ''
    payloadSelectInfo.camera = undefined
  }
}, {
  immediate: true,
  deep: true
})
watch(() => props.deviceInfo.device, (droneOsd) => {
  if (droneOsd && droneOsd.cameras) {
    payloadSelectInfo.camera = droneOsd.cameras.find(item => item.payload_index === payloadSelectInfo.payloadIndex)
  } else {
    payloadSelectInfo.camera = undefined
  }
}, {
  immediate: true,
  deep: true
})

// ws 消息通知
const { droneControlSource, payloadControlSource } = useDroneControlWsEvent(props.sn, payloadSelectInfo.value)
watch(() => payloadControlSource, (controlSource) => {
  payloadSelectInfo.controlSource = controlSource.value
}, {
  immediate: true,
  deep: true
})
const {
  checkPayloadAuth,
  authPayload,
  resetGimbal,
  switchCameraMode,
  takeCameraPhoto,
  startCameraRecording,
  stopCameraRecording,
  changeCameraFocalLength,
  cameraAim,
} = usePayloadControl()

async function onAuthPayload () {
  const result = await authPayload(props.sn, payloadSelectInfo.payloadIndex)
  if (result) {
    payloadControlSource.value = ControlSource.A
  }
}

const gimbalResetPopoverData = reactive({
  visible: false,
  loading: false,
  resetMode: null as null | GimbalResetMode,
})

function onShowGimbalResetPopover () {
  gimbalResetPopoverData.visible = !gimbalResetPopoverData.visible
  gimbalResetPopoverData.loading = false
  gimbalResetPopoverData.resetMode = null
}

async function onGimbalResetConfirm (confirm: boolean) {
  if (confirm) {
    if (gimbalResetPopoverData.resetMode === null) {
      message.error('Please select reset mode')
      return
    }
    gimbalResetPopoverData.loading = true
    try {
      await resetGimbal(props.sn, {
        payload_index: payloadSelectInfo.payloadIndex,
        reset_mode: gimbalResetPopoverData.resetMode
      })
    } catch (err) {
    }
  }
  gimbalResetPopoverData.visible = false
}

async function onSwitchCameraMode () {
  if (!checkPayloadAuth(payloadSelectInfo.controlSource)) {
    return
  }
  const currentCameraMode = payloadSelectInfo.camera?.camera_mode
  await switchCameraMode(props.sn, {
    payload_index: payloadSelectInfo.payloadIndex,
    camera_mode: currentCameraMode === CameraMode.Photo ? CameraMode.Video : CameraMode.Photo
  })
}

async function onTakeCameraPhoto () {
  if (!checkPayloadAuth(payloadSelectInfo.controlSource)) {
    return
  }
  await takeCameraPhoto(props.sn, payloadSelectInfo.payloadIndex)
}

async function onStartCameraRecording () {
  if (!checkPayloadAuth(payloadSelectInfo.controlSource)) {
    return
  }
  await startCameraRecording(props.sn, payloadSelectInfo.payloadIndex)
}

async function onStopCameraRecording () {
  if (!checkPayloadAuth(payloadSelectInfo.controlSource)) {
    return
  }
  await stopCameraRecording(props.sn, payloadSelectInfo.payloadIndex)
}

const zoomFactorPopoverData = reactive({
  visible: false,
  loading: false,
  cameraType: null as null | CameraType,
  zoomFactor: null as null | number,
})

function onShowZoomFactorPopover () {
  zoomFactorPopoverData.visible = !zoomFactorPopoverData.visible
  zoomFactorPopoverData.loading = false
  zoomFactorPopoverData.cameraType = null
  zoomFactorPopoverData.zoomFactor = null
}

async function onZoomFactorConfirm (confirm: boolean) {
  if (confirm) {
    if (!zoomFactorPopoverData.zoomFactor || zoomFactorPopoverData.cameraType === null) {
      message.error('Please input Zoom Factor')
      return
    }
    zoomFactorPopoverData.loading = true
    try {
      await changeCameraFocalLength(props.sn, {
        payload_index: payloadSelectInfo.payloadIndex,
        camera_type: zoomFactorPopoverData.cameraType,
        zoom_factor: zoomFactorPopoverData.zoomFactor
      })
    } catch (err) {
    }
  }
  zoomFactorPopoverData.visible = false
}

const cameraAimPopoverData = reactive({
  visible: false,
  loading: false,
  cameraType: null as null | CameraType,
  locked: false,
  x: null as null | number,
  y: null as null | number,
})

function onShowCameraAimPopover () {
  cameraAimPopoverData.visible = !cameraAimPopoverData.visible
  cameraAimPopoverData.loading = false
  cameraAimPopoverData.cameraType = null
  cameraAimPopoverData.locked = false
  cameraAimPopoverData.x = null
  cameraAimPopoverData.y = null
}

function openLivestreamOthers () {
  store.commit('SET_LIVESTREAM_OTHERS_VISIBLE', true)
}

function openLivestreamAgora () {
  store.commit('SET_LIVESTREAM_AGORA_VISIBLE', true)
}

async function onCameraAimConfirm (confirm: boolean) {
  if (confirm) {
    if (cameraAimPopoverData.cameraType === null || cameraAimPopoverData.x === null || cameraAimPopoverData.y === null) {
      message.error('Input error')
      return
    }
    try {
      await cameraAim(props.sn, {
        payload_index: payloadSelectInfo.payloadIndex,
        camera_type: cameraAimPopoverData.cameraType,
        locked: cameraAimPopoverData.locked,
        x: cameraAimPopoverData.x,
        y: cameraAimPopoverData.y,
      })
    } catch (error) {
    }
  }
  cameraAimPopoverData.visible = false
}

watch(() => errorInfo, (errorInfo) => {
  if (errorInfo.value) {
    message.error(errorInfo.value)
    console.error(errorInfo.value)
    errorInfo.value = ''
  }
}, {
  immediate: true,
  deep: true
})
</script>

<style lang='scss' scoped>
.drone-control-wrapper{
  // border-bottom: 1px solid #515151;

  .drone-control-header{
    font-size: 14px;
    font-weight: 600;
    padding: 10px 10px 0px;
  }

  .drone-control-box {
    display: flex;
    flex-wrap: 1;
    .box {
      width: 50%;
      padding: 5px;
      border: 0.5px solid rgba(255,255,255,0.3);

      .row {
        display: flex;
        flex-wrap: wrap;
        padding: 2px;

        + .row{
          margin-bottom: 6px;
        }

        &::v-deep{
          .ant-btn{
            font-size: 12px;
            padding: 0px 4px;
            margin-right: 5px;
          }
        }
      }

      .drone-control{
         &::v-deep{

          .ant-select-single:not(.ant-select-customize-input) .ant-select-selector{
           padding: 0 2px;
          }
        }
      }

      .drone-control-direction{
        margin-right: 10px;

        .ant-btn {
          // padding: 0px 1px;
          margin-right: 0;
        }

        .word{
          width: 12px;
          margin-left: 2px;
          font-size: 12px;
          color: #aaa;
        }
      }
    }
  }
}
</style>
