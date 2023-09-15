<template>
  <div class="project-tsa-wrapper ">
    <div>
      <a-row>
        <a-col :span="1"></a-col>
        <a-col :span="11">My Username</a-col>
        <a-col :span="11" align="right" style="font-weight: 700">{{ username }}</a-col>
        <a-col :span="1"></a-col>
      </a-row>
    </div>
    <div class="scrollbar" :style="{ height: scorllHeight + 'px'}">
      <a-collapse :bordered="false" expandIconPosition="right" accordion style="background: #232323;">
        <a-collapse-panel :key="EDeviceTypeName.Dock" header="Dock" style="border-bottom: 1px solid #4f4f4f;">
          <div v-if="onlineDocks.data.length === 0" style="height: 150px; color: white;">
            <a-empty :image="noData" :image-style="{ height: '60px' }" />
          </div>
          <div v-else class="fz12" style="color: white;">
            <div v-for="dock in onlineDocks.data" :key="dock.sn" style="background: #3c3c3c; height: 90px; width: 250px; margin-bottom: 10px;">
              <div style="border-radius: 2px; height: 100%; width: 100%;" class="flex-row flex-justify-between flex-align-center">
                <div style="float: left; padding: 0px 5px 8px 8px; width: 88%">
                  <div style="width: 80%; height: 30px; line-height: 30px; font-size: 16px;">
                    <a-tooltip :title="`${dock.gateway.callsign} - ${dock.callsign ?? 'No Drone'}`">
                      <div class="text-hidden" style="max-width: 200px;">{{ dock.gateway.callsign }} - {{ dock.callsign ?? 'No Drone' }}</div>
                    </a-tooltip>
                  </div>
                  <div class="mt5 flex-align-center flex-row flex-justify-between" style="background: #595959;">
                    <div class="flex-align-center flex-row">
                      <span class="ml5 mr5"><RobotOutlined /></span>
                      <div class="font-bold text-hidden" style="max-width: 80px;" :style="dockInfo[dock.gateway.sn] && dockInfo[dock.gateway.sn].basic_osd?.mode_code !== EDockModeCode.Disconnected ? 'color: #00ee8b' :  'color: red;'">
                        {{ dockInfo[dock.gateway.sn] ? EDockModeCode[dockInfo[dock.gateway.sn].basic_osd?.mode_code] : EDockModeCode[EDockModeCode.Disconnected] }}
                      </div>
                    </div>
                    <div class="mr5 flex-align-center flex-row" style="width: 85px; margin-right: 0; height: 18px;">
                      <div v-if="hmsInfo[dock.gateway.sn]" class="flex-align-center flex-row">
                          <div :class="hmsInfo[dock.gateway.sn][0].level === EHmsLevel.CAUTION ? 'caution-blink' :
                            hmsInfo[dock.gateway.sn][0].level === EHmsLevel.WARN ? 'warn-blink' : 'notice-blink'" style="width: 18px; height: 16px; text-align: center;">
                            <span :style="hmsInfo[dock.gateway.sn].length > 99 ? 'font-size: 11px' : 'font-size: 12px'">{{ hmsInfo[dock.gateway.sn].length }}</span>
                            <span class="fz10">{{ hmsInfo[dock.gateway.sn].length > 99 ? '+' : ''}}</span>
                          </div>
                        <a-popover trigger="click" placement="bottom" color="black" v-model:visible="hmsVisible[dock.gateway.sn]"
                          @visibleChange="readHms(hmsVisible[dock.gateway.sn], dock.gateway.sn)"
                          :overlayStyle="{width: '200px', height: '300px'}">
                          <div :class="hmsInfo[dock.gateway.sn][0].level === EHmsLevel.CAUTION ? 'caution' :
                            hmsInfo[dock.gateway.sn][0].level === EHmsLevel.WARN ? 'warn' : 'notice'" style="margin-left: 3px; width: 62px; height: 16px;">
                            <span class="word-loop">{{ hmsInfo[dock.gateway.sn][0].message_en }}</span>
                          </div>
                          <template #content>
                            <a-collapse style="background: black; height: 300px; overflow-y: auto;" :bordered="false" expand-icon-position="right" :accordion="true">
                              <a-collapse-panel v-for="hms in hmsInfo[dock.gateway.sn]" :key="hms.hms_id" :showArrow="false"
                                style=" margin: 0 auto 3px auto; border: 0; width: 140px; border-radius: 3px"
                                :class="hms.level === EHmsLevel.CAUTION ? 'caution' : hms.level === EHmsLevel.WARN ? 'warn' : 'notice'"
                                >
                                <template #header="{ isActive }">
                                  <div class="flex-row flex-align-center" style="width: 130px;">
                                    <div style="width: 110px;">
                                      <span class="word-loop">{{ hms.message_en }}</span>
                                    </div>
                                    <div style="width: 20px; height: 15px; font-size: 10px; z-index: 2 " class="flex-row flex-align-center flex-justify-center"
                                      :class="hms.level === EHmsLevel.CAUTION ? 'caution' : hms.level === EHmsLevel.WARN ? 'warn' : 'notice'"
                                    >
                                      <DoubleRightOutlined :rotate="isActive ? 90 : 0" />
                                    </div>
                                  </div>
                                </template>

                                <a-tooltip :title="hms.create_time">
                                  <div style="color: white;" class="text-hidden">{{ hms.create_time }}</div>
                                </a-tooltip>
                              </a-collapse-panel>
                            </a-collapse>
                          </template>
                        </a-popover>
                      </div>
                      <div v-else class="width-100" style="height: 90%; background: rgba(0, 0, 0, 0.35)"></div>
                    </div>
                  </div>
                  <div class="mt5 flex-align-center flex-row flex-justify-between" style="background: #595959;">
                    <div class="flex-row">
                      <span class="ml5 mr5"><RocketOutlined /></span>
                      <div class="font-bold text-hidden" style="max-width: 80px" :style="deviceInfo[dock.sn] && deviceInfo[dock.sn].mode_code !== EModeCode.Disconnected ? 'color: #00ee8b' :  'color: red;'">
                        {{ deviceInfo[dock.sn] ? EModeCode[deviceInfo[dock.sn].mode_code] : EModeCode[EModeCode.Disconnected] }}
                      </div>
                    </div>
                    <div class="mr5 flex-align-center flex-row" style="width: 85px; margin-right: 0; height: 18px;">
                      <div v-if="hmsInfo[dock.sn]" class="flex-align-center flex-row">
                        <div :class="hmsInfo[dock.sn][0].level === EHmsLevel.CAUTION ? 'caution-blink' :
                          hmsInfo[dock.sn][0].level === EHmsLevel.WARN ? 'warn-blink' : 'notice-blink'" style="width: 18px; height: 16px; text-align: center;">
                          <span :style="hmsInfo[dock.sn].length > 99 ? 'font-size: 11px' : 'font-size: 12px'">{{ hmsInfo[dock.sn].length }}</span>
                          <span class="fz10">{{ hmsInfo[dock.sn].length > 99 ? '+' : ''}}</span>
                        </div>
                        <a-popover trigger="click" placement="bottom" color="black" v-model:visible="hmsVisible[dock.sn]" @visibleChange="readHms(hmsVisible[dock.sn], dock.sn)"
                          :overlayStyle="{width: '200px', height: '300px'}">
                          <div :class="hmsInfo[dock.sn][0].level === EHmsLevel.CAUTION ? 'caution' :
                            hmsInfo[dock.sn][0].level === EHmsLevel.WARN ? 'warn' : 'notice'" style="margin-left: 3px; width: 62px; height: 16px;">
                            <span class="word-loop">{{ hmsInfo[dock.sn][0].message_en }}</span>
                          </div>
                          <template #content>
                            <a-collapse style="background: black; height: 300px; overflow-y: auto;" :bordered="false" expand-icon-position="right" :accordion="true">
                              <a-collapse-panel v-for="hms in hmsInfo[dock.sn]" :key="hms.hms_id" :showArrow="false"
                                style=" margin: 0 auto 3px auto; border: 0; width: 140px; border-radius: 3px"
                                :class="hms.level === EHmsLevel.CAUTION ? 'caution' : hms.level === EHmsLevel.WARN ? 'warn' : 'notice'"
                                >
                                <template #header="{ isActive }">
                                  <div class="flex-row flex-align-center" style="width: 130px;">
                                    <div style="width: 110px;">
                                      <span class="word-loop">{{ hms.message_en }}</span>
                                    </div>
                                    <div style="width: 20px; height: 15px; font-size: 10px; z-index: 2 " class="flex-row flex-align-center flex-justify-center"
                                      :class="hms.level === EHmsLevel.CAUTION ? 'caution' : hms.level === EHmsLevel.WARN ? 'warn' : 'notice'"
                                    >
                                      <DoubleRightOutlined :rotate="isActive ? 90 : 0" />
                                    </div>
                                  </div>
                                </template>

                                <a-tooltip :title="hms.create_time">
                                  <div style="color: white;" class="text-hidden">{{ hms.create_time }}</div>
                                </a-tooltip>
                              </a-collapse-panel>
                            </a-collapse>
                          </template>
                        </a-popover>
                      </div>
                      <div v-else class="width-100" style="height: 90%; background: rgba(0, 0, 0, 0.35)"></div>
                    </div>
                  </div>
                </div>
                <div style="float: right; background: #595959; height: 100%; width: 40px;" class="flex-row flex-justify-center flex-align-center">
                  <div class="fz16" @click="switchVisible($event, dock, true, dockInfo[dock.gateway.sn] && dockInfo[dock.gateway.sn].basic_osd?.mode_code !== EDockModeCode.Disconnected)">
                    <a v-if="osdVisible.gateway_sn === dock.gateway.sn && osdVisible.visible"><EyeOutlined /></a>
                    <a v-else><EyeInvisibleOutlined /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
      <a-collapse :bordered="false" expandIconPosition="right" accordion style="background: #232323;">
        <a-collapse-panel :key="EDeviceTypeName.Aircraft" header="Online Devices" style="border-bottom: 1px solid #4f4f4f;">
          <div v-if="onlineDevices.data.length === 0" style="height: 150px; color: white;">
            <a-empty :image="noData" :image-style="{ height: '60px' }" />
          </div>
          <div v-else class="fz12" style="color: white;">
            <div v-for="device in onlineDevices.data" :key="device.sn" style="background: #3c3c3c; height: 90px; width: 250px; margin-bottom: 10px;">
              <div class="battery-slide" v-if="deviceInfo[device.sn]">
                <div style="background: #535759; width: 100%;"></div>
                <div class="capacity-percent" :style="{ width: deviceInfo[device.sn].battery.capacity_percent + '%'}"></div>
                <div class="return-home" :style="{ width: deviceInfo[device.sn].battery.return_home_power + '%'}"></div>
                <div class="landing" :style="{ width: deviceInfo[device.sn].battery.landing_power + '%'}"></div>
                <div class="battery" :style="{ left: deviceInfo[device.sn].battery.capacity_percent + '%' }"></div>
              </div>
              <div style="border-bottom: 1px solid #515151; border-radius: 2px; height: 50px; width: 100%;" class="flex-row flex-justify-between flex-align-center">
                <div style="float: left; padding: 5px 5px 8px 8px; width: 88%">
                  <div style="width: 100%; height: 100%;">
                    <a-tooltip>
                      <template #title>{{ device.model ? `${device.model} - ${device.callsign}` : 'No Drone'}}</template>
                      <span class="text-hidden" style="max-width: 200px; display: block; height: 20px;">{{ device.model ? `${device.model} - ${device.callsign}` : 'No Drone'}}</span>
                    </a-tooltip>
                  </div>
                  <div class="mt5" style="background: #595959;">
                    <span class="ml5 mr5"><RocketOutlined /></span>
                    <span class="font-bold" :style="deviceInfo[device.sn] && deviceInfo[device.sn].mode_code !== EModeCode.Disconnected ? 'color: #00ee8b' :  'color: red;'">
                      {{ deviceInfo[device.sn] ? EModeCode[deviceInfo[device.sn].mode_code] : EModeCode[EModeCode.Disconnected] }}
                    </span>
                  </div>
                </div>
                <div style="float: right; background: #595959; height: 50px; width: 40px;" class="flex-row flex-justify-center flex-align-center">
                  <div class="fz16" @click="switchVisible($event, device, false, deviceInfo[device.sn] && deviceInfo[device.sn].mode_code !== EModeCode.Disconnected)">
                    <a v-if="osdVisible.sn === device.sn && osdVisible.visible"><EyeOutlined /></a>
                    <a v-else><EyeInvisibleOutlined /></a>
                  </div>
                </div>
              </div>
              <div class="flex-row flex-justify-center flex-align-center" style="height: 40px;">
                <div class="flex-row" style="height: 20px; background: #595959; width: 94%;" >
                  <span class="mr5"><a-image style="margin-left: 2px; margin-top: -2px; height: 20px; width: 20px;" :src="rc" /></span>
                  <a-tooltip>
                    <template #title>{{ device.gateway.model }} - {{ device.gateway.callsign }} </template>
                    <div class="text-hidden" style="max-width: 200px;">{{ device.gateway.model }} - {{ device.gateway.callsign }}</div>
                  </a-tooltip>
                </div>
              </div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch, WritableComputedRef } from 'vue'
import { EDeviceTypeName, ELocalStorageKey } from '/@/types'
import noData from '/@/assets/icons/no-data.png'
import rc from '/@/assets/icons/rc.png'
import { OnlineDevice, EModeCode, OSDVisible, EDockModeCode, DeviceOsd } from '/@/types/device'
import { useMyStore } from '/@/store'
import { getDeviceTopo, getUnreadDeviceHms, updateDeviceHms } from '/@/api/manage'
import { RocketOutlined, EyeInvisibleOutlined, EyeOutlined, RobotOutlined, DoubleRightOutlined } from '@ant-design/icons-vue'
import { EHmsLevel } from '/@/types/enums'

const store = useMyStore()
const username = ref(localStorage.getItem(ELocalStorageKey.Username))
const workspaceId = ref(localStorage.getItem(ELocalStorageKey.WorkspaceId)!)
const osdVisible = computed(() => store.state.osdVisible)
const hmsVisible = new Map<string, boolean>()
const scorllHeight = ref()

const onlineDevices = reactive({
  data: [] as OnlineDevice[]
})

const onlineDocks = reactive({
  data: [] as OnlineDevice[]
})

const deviceInfo = computed(() => store.state.deviceState.deviceInfo)
const dockInfo = computed(() => store.state.deviceState.dockInfo)
const hmsInfo = computed({
  get: () => store.state.hmsInfo,
  set: (val) => {
    return val
  }
})

onMounted(() => {
  getOnlineTopo()
  setTimeout(() => {
    watch(() => store.state.deviceStatusEvent,
      data => {
        getOnlineTopo()
        if (data.deviceOnline.sn) {
          getUnreadHms(data.deviceOnline.sn)
        }
      },
      {
        deep: true
      }
    )
    getOnlineDeviceHms()
  }, 3000)
  const element = document.getElementsByClassName('scrollbar').item(0) as HTMLDivElement
  const parent = element?.parentNode as HTMLDivElement
  scorllHeight.value = parent?.clientHeight - parent?.firstElementChild?.clientHeight
})

function getOnlineTopo () {
  getDeviceTopo(workspaceId.value).then((res) => {
    if (res.code !== 0) {
      return
    }
    onlineDevices.data = []
    onlineDocks.data = []
    res.data.forEach((gateway: any) => {
      const child = gateway.children
      const device: OnlineDevice = {
        model: child?.device_name,
        callsign: child?.nickname,
        sn: child?.device_sn,
        mode: EModeCode.Disconnected,
        gateway: {
          model: gateway?.device_name,
          callsign: gateway?.nickname,
          sn: gateway?.device_sn,
          domain: gateway?.domain
        },
        payload: []
      }
      child?.payloads_list.forEach((payload: any) => {
        device.payload.push({
          index: payload.index,
          model: payload.model,
          payload_name: payload.payload_name,
          payload_sn: payload.payload_sn,
          control_source: payload.control_source,
          payload_index: payload.payload_index
        })
      })
      if (EDeviceTypeName.Dock === gateway.domain) {
        hmsVisible.set(device.sn, false)
        hmsVisible.set(device.gateway.sn, false)
        onlineDocks.data.push(device)
      }
      if (gateway.status && EDeviceTypeName.Gateway === gateway.domain) {
        onlineDevices.data.push(device)
      }
    })
  })
}

function switchVisible (e: any, device: OnlineDevice, isDock: boolean, isClick: boolean) {
  if (!isClick) {
    e.target.style.cursor = 'not-allowed'
    return
  }
  if (device.sn === osdVisible.value.sn) {
    osdVisible.value.visible = !osdVisible.value.visible
  } else {
    osdVisible.value.sn = device.sn
    osdVisible.value.callsign = device.callsign
    osdVisible.value.model = device.model
    osdVisible.value.visible = true
    osdVisible.value.gateway_sn = device.gateway.sn
    osdVisible.value.is_dock = isDock
    osdVisible.value.gateway_callsign = device.gateway.callsign
    osdVisible.value.payloads = device.payload
  }
  store.commit('SET_OSD_VISIBLE_INFO', osdVisible)
}

function getUnreadHms (sn: string) {
  getUnreadDeviceHms(workspaceId.value, sn).then(res => {
    if (res.data.length !== 0) {
      hmsInfo.value[sn] = res.data
    }
  })
  console.info(hmsInfo.value)
}

function getOnlineDeviceHms () {
  const snList = Object.keys(dockInfo.value)
  if (snList.length === 0) {
    return
  }
  snList.forEach(sn => {
    getUnreadHms(sn)
  })
  const deviceSnList = Object.keys(deviceInfo.value)
  if (deviceSnList.length === 0) {
    return
  }
  deviceSnList.forEach(sn => {
    getUnreadHms(sn)
  })
}

function readHms (visiable: boolean, sn: string) {
  if (!visiable) {
    updateDeviceHms(workspaceId.value, sn).then(res => {
      if (res.code === 0) {
        delete hmsInfo.value[sn]
      }
    })
  }
}

function openLivestreamOthers () {
  store.commit('SET_LIVESTREAM_OTHERS_VISIBLE', true)
}

function openLivestreamAgora () {
  store.commit('SET_LIVESTREAM_AGORA_VISIBLE', true)
}

</script>

<style lang="scss">
.project-tsa-wrapper > :first-child {
  height: 50px;
  line-height: 50px;
  align-items: center;
  border-bottom: 1px solid #4f4f4f;
}
.project-tsa-wrapper {
  height: 100%;
  .scrollbar {
    overflow: auto;
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
.ant-collapse > .ant-collapse-item > .ant-collapse-header {
  color: white;
  border: 0;
  padding-left: 14px;
}

.text-hidden {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap;
  -o-text-overflow: ellipsis;
}
.font-bold {
  font-weight: 700;
}

.battery-slide {
  width: 100%;
  .capacity-percent {
    background: #00ee8b;
  }
  .return-home {
    background: #ff9f0a;
  }
  .landing {
    background: #f5222d;
  }
  .battery {
    background: white;
    border-radius: 1px;
    width: 8px;
    height: 4px;
    margin-top: -3px;
  }
}
.battery-slide > div {
  position: relative;
  margin-top: -2px;
  min-height: 2px;
  border-radius: 2px;
  white-space: nowrap;
}
.disable {
  cursor: not-allowed;
}

.notice-blink {
  background: $success;
  animation: blink 500ms infinite;
}
.caution-blink {
  background: orange;
  animation: blink 500ms infinite;
}
.warn-blink {
  background: red;
  animation: blink 500ms infinite;
}
.notice {
  background: $success;
  overflow: hidden;
  cursor: pointer;
}
.caution {
  background: orange;
  cursor: pointer;
  overflow: hidden;
}
.warn {
  background: red;
  cursor: pointer;
  overflow: hidden;
}
.word-loop {
  white-space: nowrap;
  display: inline-block;
  animation: 10s loop linear infinite normal;
}
@keyframes blink {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
  to {
    opacity: 1;
  }
}
@keyframes loop {
  0% {
    transform: translateX(20px);
    -webkit-transform: translateX(20px);
  }
  100% {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
}

</style>
