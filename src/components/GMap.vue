<template>
  <div class="g-map-wrapper">
    <div id="g-container" :style="{ width: '100%', height: '100%' }" />
    <div
      class="g-action-panle"
      :style="{ right: drawVisible ? '316px' : '16px' }"
    >
      <div :class="state.currentType === 'pin' ? 'g-action-item selection' : 'g-action-item'" @click="draw('pin', true)">
        <a><a-image :src="pin" :preview="false" /></a>
      </div>
      <div :class="state.currentType === 'polyline' ? 'g-action-item selection' : 'g-action-item'" @click="draw('polyline', true)">
        <a><LineOutlined :rotate="135" class="fz20"/></a>
      </div>
      <div :class="state.currentType === 'polygon' ? 'g-action-item selection' : 'g-action-item'" @click="draw('polygon', true)">
        <a><BorderOutlined class="fz18" /></a>
      </div>
      <div v-if="mouseMode" class="g-action-item" @click="draw('off', false)">
        <a style="color: red;"><CloseOutlined /></a>
      </div>
    </div>
    <div v-if="osdVisible.visible && !osdVisible.is_dock" class="osd-panel fz12">
      <div class="pl5 pr5 flex-align-center flex-row flex-justify-between" style="border-bottom: 1px solid #515151; height: 18%;">
        <span>{{ osdVisible.callsign }}</span>
        <span><a class="fz16" style="color: white;" @click="() => osdVisible.visible = false"><CloseOutlined /></a></span>
      </div>
      <div style="height: 82%;">
        <div class="flex-column flex-align-center flex-justify-center" style="float: left; width: 60px; height: 100%; background: #2d2d2d;">
          <a-tooltip :title="osdVisible.model">
            <div style="width: 90%;" class="flex-column flex-align-center flex-justify-center">
              <span><a-image :src="M30" :preview="false"/></span>
              <span>{{ osdVisible.model }}</span>
            </div>
          </a-tooltip>
        </div>
        <div class="osd">
            <a-row>
              <a-col span="16" :style="deviceInfo.device.mode_code === EModeCode.Disconnected ? 'color: red; font-weight: 700;': 'color: rgb(25,190,107)'">{{ EModeCode[deviceInfo.device.mode_code] }}</a-col>
            </a-row>
            <a-row>
              <a-col span="6">
                <a-tooltip title="Signal strength">
                  <span>HD</span>
                  <span class="ml10">{{ deviceInfo.gateway?.transmission_signal_quality }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="RC Battery Level">
                  <span><ThunderboltOutlined class="fz14"/></span>
                  <span class="ml10">{{ deviceInfo.gateway && deviceInfo.gateway.capacity_percent !== str ? deviceInfo.gateway.capacity_percent + ' %' : deviceInfo.gateway.capacity_percent }}</span>
                </a-tooltip>
              </a-col>

              <a-col span="6">
                <a-tooltip title="Drone Battery Level">
                  <span><ThunderboltOutlined class="fz14"/></span>
                  <span class="ml10">{{ deviceInfo.device.battery.capacity_percent !== str ? deviceInfo.device.battery.capacity_percent + ' %' : deviceInfo.device.battery.capacity_percent }}</span>
                </a-tooltip>
              </a-col>
            </a-row>
            <a-row>
              <a-tooltip title="RTK Fixed">
                <a-col span="6" class="flex-row flex-align-center flex-justify-start">
                  <span>Fixed</span>
                  <span class="ml10 circle" :style="deviceInfo.device.position_state.is_fixed === 1 ? 'backgroud: rgb(25,190,107);' : ' background: red;'"></span>
                </a-col>
              </a-tooltip>
              <a-col span="6">
                <a-tooltip title="GPS">
                  <span>GPS</span>
                  <span class="ml10">{{ deviceInfo.device.position_state.gps_number }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="RTK">
                  <span><TrademarkOutlined class="fz14"/></span>
                  <span class="ml10">{{ deviceInfo.device.position_state.rtk_number }}</span>
                </a-tooltip>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="6">
                <a-tooltip title="Flight Mode">
                  <span><ControlOutlined class="fz16" /></span>
                  <span class="ml10">{{ EGear[deviceInfo.device.gear] }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Altitude above sea level">
                  <span>ASL</span>
                  <span class="ml10">{{ deviceInfo.device.height === str ? str : deviceInfo.device.height.toFixed(2) + ' m'}}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Altitude above takeoff level">
                  <span>ALT</span>
                  <span class="ml10">{{ deviceInfo.device.elevation === str ? str : deviceInfo.device.elevation.toFixed(2) + ' m' }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Distance to Home Point">
                  <span>H</span>
                  <span class="ml10">{{ deviceInfo.device.home_distance === str ? str : deviceInfo.device.home_distance.toFixed(2) + ' m' }}</span>
                </a-tooltip>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="6">
                <a-tooltip title="Horizontal Speed">
                  <span>H.S</span>
                  <span class="ml10">{{ deviceInfo.device.horizontal_speed === str ? str : deviceInfo.device.horizontal_speed.toFixed(2) + ' m/s'}}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Vertical Speed">
                  <span>V.S</span>
                  <span class="ml10">{{ deviceInfo.device.vertical_speed === str ? str : deviceInfo.device.vertical_speed.toFixed(2) + ' m/s'}}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Wind Speed">
                  <span>W.S</span>
                  <span class="ml10">{{ deviceInfo.device.wind_speed === str ? str : (deviceInfo.device.wind_speed / 10).toFixed(2) + ' m/s'}}</span>
                </a-tooltip>
              </a-col>
            </a-row>
        </div>
      </div>
      <div class="battery-slide" v-if="deviceInfo.device.battery.remain_flight_time !== 0">
        <div style="background: #535759;" class="width-100"></div>
        <div class="capacity-percent" :style="{ width: deviceInfo.device.battery.capacity_percent + '%'}"></div>
        <div class="return-home" :style="{ width: deviceInfo.device.battery.return_home_power + '%'}"></div>
        <div class="landing" :style="{ width: deviceInfo.device.battery.landing_power + '%'}"></div>
        <div class="white-point" :style="{ left: deviceInfo.device.battery.landing_power + '%'}"></div>
        <div class="battery" :style="{ left: deviceInfo.device.battery.capacity_percent + '%' }">
          {{ Math.floor(deviceInfo.device.battery.remain_flight_time / 60) }}:
          {{ 10 > (deviceInfo.device.battery.remain_flight_time % 60) ? '0' : ''}}{{deviceInfo.device.battery.remain_flight_time % 60 }}
        </div>
      </div>
    </div>
    <!-- 机场OSD -->
    <div v-if="osdVisible.visible && osdVisible.is_dock" class="osd-panel fz12">
      <div class="fz16 pl5 pr5 flex-align-center flex-row flex-justify-between" style="border-bottom: 1px solid #515151; height: 10%;">
        <span>{{ osdVisible.gateway_callsign }}</span>
        <span><a style="color: white;" @click="() => osdVisible.visible = false"><CloseOutlined /></a></span>
      </div>
        <!-- 机场 -->
      <div class ="flex-display" style="border-bottom: 1px solid #515151;">
        <div class="flex-column flex-align-stretch flex-justify-center" style="width: 60px; background: #2d2d2d;">
          <a-tooltip :title="osdVisible.model">
            <div class="flex-column  flex-align-center flex-justify-center" style="width: 90%;">
              <span><RobotFilled style="font-size: 48px;"/></span>
              <span class="mt10">Dock</span>
            </div>
          </a-tooltip>
        </div>
        <div class="osd flex-1" style="flex: 1">
            <a-row>
              <a-col span="16" :style="deviceInfo.dock.mode_code === EDockModeCode.Disconnected ? 'color: red; font-weight: 700;': 'color: rgb(25,190,107)'">
                {{ EDockModeCode[deviceInfo.dock.mode_code] }}</a-col>
            </a-row>
            <a-row>
              <a-col span="12">
                <a-tooltip title="Accumulated Running Time">
                  <span><HistoryOutlined /></span>
                  <span class="ml10">
                    <span v-if="deviceInfo.dock.acc_time >= 2592000"> {{ Math.floor(deviceInfo.dock.acc_time / 2592000) }}m </span>
                    <span v-if="(deviceInfo.dock.acc_time % 2592000) >= 86400"> {{ Math.floor((deviceInfo.dock.acc_time % 2592000) / 86400) }}d </span>
                    <span v-if="(deviceInfo.dock.acc_time % 2592000 % 86400) >= 3600"> {{ Math.floor((deviceInfo.dock.acc_time % 2592000 % 86400) / 3600) }}h </span>
                    <span v-if="(deviceInfo.dock.acc_time % 2592000 % 86400 % 3600) >= 60"> {{ Math.floor((deviceInfo.dock.acc_time % 2592000 % 86400 % 3600) / 60) }}min </span>
                    <span>{{ Math.floor(deviceInfo.dock.acc_time % 2592000 % 86400 % 3600 % 60) }} s</span>
                  </span>
                </a-tooltip>
              </a-col>
              <a-col span="12">
                <a-tooltip title="Last login">
                  <span><FieldTimeOutlined /></span>
                  <span class="ml10">{{ new Date(deviceInfo.dock.first_power_on).toLocaleString() }}
                  </span>
                </a-tooltip>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="12">
                <a-tooltip title="Network State">
                  <span :style="deviceInfo.dock.network_state.quality === 2 ? 'color: #00ee8b' :
                    deviceInfo.dock.network_state.quality === 1 ? 'color: yellow' : 'color: red'">
                    <span v-if="deviceInfo.dock.network_state.type === 1"><SignalFilled /></span>
                    <span v-else><GlobalOutlined /></span>
                  </span>
                  <span class="ml10" >{{ deviceInfo.dock.network_state.rate }} KB/S</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Media File Remain Upload">
                  <span><CloudUploadOutlined class="fz14"/></span>
                  <span class="ml10">{{ deviceInfo.dock.media_file_detail?.remain_upload }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip>
                  <template #title>
                    <p>total: {{ deviceInfo.dock.storage.total }}</p>
                    <p>used: {{ deviceInfo.dock.storage.used  }}</p>
                  </template>
                  <span><FolderOpenOutlined /></span>
                  <span class="ml10" v-if="deviceInfo.dock.storage.total > 0">
                    <a-progress type="circle" :width="20" :percent="deviceInfo.dock.storage.used * 100/ deviceInfo.dock.storage.total"
                      :strokeWidth="20" :showInfo="false" :strokeColor="deviceInfo.dock.storage.used * 100 / deviceInfo.dock.storage.total > 80 ? 'red' : '#00ee8b' "/>
                  </span>
                </a-tooltip>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="6">
                <a-tooltip title="Wind Speed">
                  <span>W.S</span>
                  <span class="ml10">{{ deviceInfo.dock.wind_speed === str ? str : (deviceInfo.dock.wind_speed / 10).toFixed(2) + ' m/s'}}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Rainfall">
                  <span>🌧</span>
                  <span class="ml10">{{ deviceInfo.dock.rainfall === str ? str : deviceInfo.dock.rainfall + ' mm/h' }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Environment Temperature">
                  <span>°C</span>
                  <span class="ml10">{{ deviceInfo.dock.environment_temperature }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Environment Humidity">
                  <span>💦</span>
                  <span class="ml10">{{ deviceInfo.dock.environment_humidity === str ? str : deviceInfo.dock.environment_humidity }}</span>
                </a-tooltip>
              </a-col>
            </a-row>
            <a-row>
               <a-col span="6">
                <a-tooltip title="Dock Temperature">
                  <span>°C</span>
                  <span class="ml10">{{ deviceInfo.dock.temperature }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Dock Humidity">
                  <span>💦</span>
                  <span class="ml10">{{ deviceInfo.dock.humidity === str ? str : deviceInfo.dock.humidity }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Working Voltage">
                  <span style="border: 1px solid; border-radius: 50%; width: 18px; height: 18px; line-height: 16px; text-align: center; float: left;">V</span>
                  <span class="ml10">{{ deviceInfo.dock.working_voltage === str ? str : deviceInfo.dock.working_voltage + ' mV' }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Working Current">
                  <span style="border: 1px solid; border-radius: 50%; width: 18px; height: 18px; line-height: 15px; text-align: center; float: left;" >A</span>
                  <span class="ml10">{{ deviceInfo.dock.working_current === str ? str : deviceInfo.dock.working_current + ' mA' }}</span>
                </a-tooltip>
              </a-col>
            </a-row>
            <a-row class="p5">
              <a-col span="24">
                <a-button type="primary" :disabled="controlPanelVisible" size="small" @click="dockDebugOnOff(osdVisible.gateway_sn, true)">
                  远程调试
                </a-button>
              </a-col>
            </a-row>
            <DockControlPanel v-if="controlPanelVisible" :sn="osdVisible.gateway_sn"  :deviceInfo="deviceInfo" @close-control-panel="dockDebugOnOff">
            </DockControlPanel>
        </div>
      </div>
      <!--  飞机-->
      <div class ="flex-display">
        <div class="flex-column flex-align-stretch flex-justify-center" style="width: 60px;  background: #2d2d2d;">
          <a-tooltip :title="osdVisible.model">
            <div style="width: 90%;" class="flex-column flex-align-center flex-justify-center">
              <span><a-image :src="M30" :preview="false"/></span>
              <span>M30</span>
            </div>
          </a-tooltip>
        </div>
        <div class="osd flex-1">
            <a-row>
              <a-col span="16" :style="!deviceInfo.device || deviceInfo.device?.mode_code === EModeCode.Disconnected ? 'color: red; font-weight: 700;': 'color: rgb(25,190,107)'">
                {{ !deviceInfo.device ? EModeCode[EModeCode.Disconnected] : EModeCode[deviceInfo.device?.mode_code] }}</a-col>
            </a-row>
            <a-row>
              <a-col span="6">
                <a-tooltip title="Upward Quality">
                  <span><SignalFilled /><ArrowUpOutlined style="font-size: 9px; vertical-align: top;" /></span>
                  <span class="ml10">{{ deviceInfo.dock.sdr?.up_quality }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Downward Quality">
                  <span><SignalFilled /><ArrowDownOutlined style="font-size: 9px; vertical-align: top;" /></span>
                  <span class="ml10">{{ deviceInfo.dock.sdr?.down_quality }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Drone Battery Level">
                  <span><ThunderboltOutlined class="fz14"/></span>
                  <span class="ml10">{{ deviceInfo.device && deviceInfo.device.battery.capacity_percent !== str ? deviceInfo.device?.battery.capacity_percent + ' %' : str }}</span>
                </a-tooltip>
              </a-col>
            </a-row>
            <a-row>
              <a-tooltip title="RTK Fixed">
                <a-col span="6" class="flex-row flex-align-center flex-justify-start">
                  <span>Fixed</span>
                  <span class="ml10 circle" :style="deviceInfo.device?.position_state.is_fixed === 1 ? 'backgroud: rgb(25,190,107);' : ' background: red;'"></span>
                </a-col>
              </a-tooltip>
              <a-col span="6">
                <a-tooltip title="GPS">
                  <span>GPS</span>
                  <span class="ml10">{{ deviceInfo.device ? deviceInfo.device.position_state.gps_number : str }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="RTK">
                  <span><TrademarkOutlined class="fz14"/></span>
                  <span class="ml10">{{ deviceInfo.device ? deviceInfo.device.position_state.rtk_number : str }}</span>
                </a-tooltip>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="6">
                <a-tooltip title="Flight Mode">
                  <span><ControlOutlined class="fz16" /></span>
                  <span class="ml10">{{ deviceInfo.device ? EGear[deviceInfo.device?.gear] : str }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Altitude above sea level">
                  <span>ASL</span>
                  <span class="ml10">{{ !deviceInfo.device || deviceInfo.device.height === str ? str : deviceInfo.device?.height.toFixed(2) + ' m'}}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Altitude above takeoff level">
                  <span>ALT</span>
                  <span class="ml10">{{ !deviceInfo.device || deviceInfo.device.elevation === str ? str : deviceInfo.device?.elevation.toFixed(2) + ' m' }}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Distance to Home Point">
                  <span style="border: 1px solid; border-radius: 50%; width: 18px; height: 18px; line-height: 15px; text-align: center;  display: block; float: left;" >H</span>
                  <span class="ml10">{{ !deviceInfo.device || deviceInfo.device.home_distance === str ? str : deviceInfo.device?.home_distance.toFixed(2) + ' m' }}</span>
                </a-tooltip>
              </a-col>
            </a-row>
            <a-row>
              <a-col span="6">
                <a-tooltip title="Horizontal Speed">
                  <span>H.S</span>
                  <span class="ml10">{{ !deviceInfo.device || deviceInfo.device?.horizontal_speed === str ? str : deviceInfo.device?.horizontal_speed.toFixed(2) + ' m/s'}}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Vertical Speed">
                  <span>V.S</span>
                  <span class="ml10">{{ !deviceInfo.device || deviceInfo.device.vertical_speed === str ? str : deviceInfo.device?.vertical_speed.toFixed(2) + ' m/s'}}</span>
                </a-tooltip>
              </a-col>
              <a-col span="6">
                <a-tooltip title="Wind Speed">
                  <span>W.S</span>
                  <span class="ml10">{{ !deviceInfo.device || deviceInfo.device.wind_speed === str ? str : (deviceInfo.device?.wind_speed / 10).toFixed(2) + ' m/s'}}</span>
                </a-tooltip>
              </a-col>
            </a-row>
        </div>
      </div>
      <div class="battery-slide" v-if="deviceInfo.device && deviceInfo.device.battery.remain_flight_time !== 0" style="border: 1px solid red">
        <div style="background: #535759;" class="width-100"></div>
        <div class="capacity-percent" :style="{ width: deviceInfo.device.battery.capacity_percent + '%'}"></div>
        <div class="return-home" :style="{ width: deviceInfo.device.battery.return_home_power + '%'}"></div>
        <div class="landing" :style="{ width: deviceInfo.device.battery.landing_power + '%'}"></div>
        <div class="white-point" :style="{ left: deviceInfo.device.battery.landing_power + '%'}"></div>
        <div class="battery" :style="{ left: deviceInfo.device.battery.capacity_percent + '%' }">
          {{ Math.floor(deviceInfo.device.battery.remain_flight_time / 60) }}:
          {{ 10 > (deviceInfo.device.battery.remain_flight_time % 60) ? '0' : ''}}{{deviceInfo.device.battery.remain_flight_time % 60 }}
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import {
  generateLineContent,
  generatePointContent,
  generatePolyContent
} from '../utils/map-layer-utils'
import { postElementsReq } from '/@/api/layer'
import { MapDoodleType, MapElementEnum } from '/@/constants/map'
import { useGMapManage } from '/@/hooks/use-g-map'
import { useGMapCover } from '/@/hooks/use-g-map-cover'
import { useMouseTool } from '/@/hooks/use-mouse-tool'
import { getApp } from '/@/root'
import { useMyStore } from '/@/store'
import { GeojsonCoordinate } from '/@/types/map'
import { MapDoodleEnum } from '/@/types/map-enum'
import { PostElementsBody } from '/@/types/mapLayer'
import { uuidv4 } from '/@/utils/uuid'
import { gcj02towgs84, wgs84togcj02 } from '/@/vendors/coordtransform'
import { deviceTsaUpdate } from '/@/hooks/use-g-map-tsa'
import { DeviceOsd, DeviceStatus, DockOsd, EGear, EModeCode, GatewayOsd, EDockModeCode } from '/@/types/device'
import pin from '/@/assets/icons/pin-2d8cf0.svg'
import M30 from '/@/assets/icons/m30.png'
import {
  BorderOutlined, LineOutlined, CloseOutlined, ControlOutlined, TrademarkOutlined, ArrowDownOutlined,
  ThunderboltOutlined, SignalFilled, GlobalOutlined, HistoryOutlined, CloudUploadOutlined,
  FieldTimeOutlined, CloudOutlined, CloudFilled, FolderOpenOutlined, RobotFilled, ArrowUpOutlined
} from '@ant-design/icons-vue'
import { EDeviceTypeName } from '../types'
import DockControlPanel from './g-map/DockControlPanel.vue'
import { useDockControl } from './g-map/useDockControl'

export default defineComponent({
  components: {
    BorderOutlined,
    LineOutlined,
    CloseOutlined,
    ControlOutlined,
    TrademarkOutlined,
    ThunderboltOutlined,
    SignalFilled,
    GlobalOutlined,
    HistoryOutlined,
    CloudUploadOutlined,
    FieldTimeOutlined,
    CloudOutlined,
    CloudFilled,
    FolderOpenOutlined,
    RobotFilled,
    ArrowUpOutlined,
    ArrowDownOutlined,
    DockControlPanel
  },
  name: 'GMap',
  props: {},
  setup () {
    const useMouseToolHook = useMouseTool()
    const useGMapManageHook = useGMapManage()
    const deviceTsaUpdateHook = ref()

    const mouseMode = ref(false)
    const store = useMyStore()
    const state = reactive({
      currentType: '',
      coverIndex: 0
    })
    const str: string = '--'
    const deviceInfo = reactive({
      gateway: {
        capacity_percent: str,
        transmission_signal_quality: str,
      } as GatewayOsd,
      dock: {
        media_file_detail: {
          remain_upload: 0
        },
        sdr: {
          up_quality: str,
          down_quality: str,
          frequency_band: -1,
        },
        network_state: {
          type: 0,
          quality: 0,
          rate: 0,
        },
        drone_in_dock: 0,
        drone_charge_state: {
          state: 0,
          capacity_percent: str,
        },
        rainfall: str,
        wind_speed: str,
        environment_temperature: str,
        environment_humidity: str,
        temperature: str,
        humidity: str,
        job_number: 0,
        acc_time: 0,
        first_power_on: 0,
        positionState: {
          gps_number: str,
          is_fixed: 0,
          rtk_number: str,
          is_calibration: 0,
          quality: 0,
        },
        storage: {
          total: 0,
          used: 0,
        },
        electric_supply_voltage: 0,
        working_voltage: str,
        working_current: str,
        backup_battery_voltage: 0,
        mode_code: -1,
        cover_state: -1,
        supplement_light_state: -1,
        putter_state: -1,

      } as DockOsd,
      device: {
        gear: -1,
        mode_code: EModeCode.Disconnected,
        height: str,
        home_distance: str,
        horizontal_speed: str,
        vertical_speed: str,
        wind_speed: str,
        wind_direction: str,
        elevation: str,
        position_state: {
          gps_number: str,
          is_fixed: 0,
          rtk_number: str
        },
        battery: {
          capacity_percent: str,
          landing_power: str,
          remain_flight_time: 0,
          return_home_power: str,
        },
        latitude: 0,
        longitude: 0,
      } as DeviceOsd
    })
    const shareId = computed(() => {
      return store.state.layerBaseInfo.share
    })
    const defaultId = computed(() => {
      return store.state.layerBaseInfo.default
    })
    const drawVisible = computed(() => {
      return store.state.drawVisible
    })
    const osdVisible = computed(() => {
      return store.state.osdVisible
    })

    watch(() => store.state.deviceStatusEvent,
      data => {
        deviceTsaUpdateHook.value = deviceTsaUpdate()
        if (Object.keys(data.deviceOnline).length !== 0) {
          deviceTsaUpdateHook.value.initMarker(data.deviceOnline.domain, data.deviceOnline.device_callsign, data.deviceOnline.sn)
          store.state.deviceStatusEvent.deviceOnline = {} as DeviceStatus
        }
        if (Object.keys(data.deviceOffline).length !== 0) {
          deviceTsaUpdateHook.value.removeMarker(data.deviceOffline.sn)
          if ((data.deviceOffline.sn === osdVisible.value.sn) || (osdVisible.value.is_dock && data.deviceOffline.sn === osdVisible.value.gateway_sn)) {
            osdVisible.value.visible = false
            store.commit('SET_OSD_VISIBLE_INFO', osdVisible)
          }
          store.state.deviceStatusEvent.deviceOffline = {}
        }
      },
      {
        deep: true
      }
    )

    watch(() => store.state.deviceState, data => {
      if (!deviceTsaUpdateHook.value) {
        deviceTsaUpdateHook.value = deviceTsaUpdate()
      }
      if (data.currentType === EDeviceTypeName.Gateway && data.gatewayInfo[data.currentSn]) {
        deviceTsaUpdateHook.value.moveTo(data.currentSn, data.gatewayInfo[data.currentSn].longitude, data.gatewayInfo[data.currentSn].latitude)
        if (osdVisible.value.visible && osdVisible.value.gateway_sn !== '') {
          deviceInfo.gateway = data.gatewayInfo[osdVisible.value.gateway_sn]
        }
      }
      if (data.currentType === EDeviceTypeName.Aircraft && data.deviceInfo[data.currentSn]) {
        deviceTsaUpdateHook.value.moveTo(data.currentSn, data.deviceInfo[data.currentSn].longitude, data.deviceInfo[data.currentSn].latitude)
        if (osdVisible.value.visible && osdVisible.value.sn !== '') {
          deviceInfo.device = data.deviceInfo[osdVisible.value.sn]
        }
      }
      if (data.currentType === EDeviceTypeName.Dock && data.dockInfo[data.currentSn]) {
        if (osdVisible.value.visible && osdVisible.value.is_dock && osdVisible.value.gateway_sn !== '') {
          deviceInfo.dock = data.dockInfo[osdVisible.value.gateway_sn]
          deviceInfo.device = data.deviceInfo[deviceInfo.dock.sub_device?.device_sn]
        }
      }
    }, {
      deep: true
    })

    watch(
      () => store.state.wsEvent,
      newData => {
        const useGMapCoverHook = useGMapCover()
        const event = newData
        let exist = false
        if (Object.keys(event.mapElementCreat).length !== 0) {
          console.log(event.mapElementCreat)
          const ele = event.mapElementCreat
          store.state.Layers.forEach(layer => {
            layer.elements.forEach(e => {
              if (e.id === ele.id) {
                exist = true
                console.log('true')
              }
            })
          })
          if (exist === false) {
            setLayers({
              id: ele.id,
              name: ele.name,
              resource: ele.resource
            })

            updateCoordinates('wgs84-gcj02', ele)
            useGMapCoverHook.init2DPin(
              ele.name,
              ele.resource.content.geometry.coordinates,
              ele.resource.content.properties.color,
              {
                id: ele.id,
                name: ele.name
              }
            )
          }

          store.state.wsEvent.mapElementCreat = {}
        }
        if (Object.keys(event.mapElementUpdate).length !== 0) {
          console.log(event.mapElementUpdate)
          console.log('该功能还未实现，请开发商自己增加')
          store.state.wsEvent.mapElementUpdate = {}
        }
        if (Object.keys(event.mapElementDelete).length !== 0) {
          console.log(event.mapElementDelete)
          console.log('该功能还未实现，请开发商自己增加')
          store.state.wsEvent.mapElementDelete = {}
        }
      },
      {
        deep: true
      }
    )

    function draw (type: MapDoodleType, bool: boolean) {
      state.currentType = type
      useMouseToolHook.mouseTool(type, getDrawCallback)
      mouseMode.value = bool
    }

    // dock 控制指令
    const {
      controlPanelVisible,
      setControlPanelVisible,
      sendDockControlCmd,
      dockDebugOnOff,
    } = useDockControl()

    onMounted(() => {
      const app = getApp()
      useGMapManageHook.globalPropertiesConfig(app)
    })
    function getDrawCallback ({ obj }) {
      switch (state.currentType) {
        case MapDoodleEnum.PIN:
          postPinPositionResource(obj)
          break
        case MapDoodleEnum.POLYLINE:
          postPolylineResource(obj)
          break
        case MapDoodleEnum.POLYGON:
          postPolygonResource(obj)
          break
        default:
          break
      }
    }
    async function postPinPositionResource (obj) {
      const req = getPinPositionResource(obj)
      setLayers(req)
      const coordinates = req.resource.content.geometry.coordinates
      updateCoordinates('gcj02-wgs84', req);
      (req.resource.content.geometry.coordinates as GeojsonCoordinate).push((coordinates as GeojsonCoordinate)[2])
      const result = await postElementsReq(shareId.value, req)
      obj.setExtData({ id: req.id, name: req.name })
      store.state.coverList.push(obj)
      // console.log(store.state.coverList)
    }
    async function postPolylineResource (obj) {
      const req = getPolylineResource(obj)
      setLayers(req)
      updateCoordinates('gcj02-wgs84', req)
      const result = await postElementsReq(shareId.value, req)
      obj.setExtData({ id: req.id, name: req.name })
      store.state.coverList.push(obj)
      // console.log(store.state.coverList)
    }
    async function postPolygonResource (obj) {
      const req = getPoygonResource(obj)
      setLayers(req)
      updateCoordinates('gcj02-wgs84', req)
      const result = await postElementsReq(shareId.value, req)
      obj.setExtData({ id: req.id, name: req.name })
      store.state.coverList.push(obj)
      // console.log(store.state.coverList)
    }

    function getPinPositionResource (obj) {
      const position = obj.getPosition()
      const resource = generatePointContent(position)
      const name = obj._originOpts.title
      const id = uuidv4()
      return {
        id,
        name,
        resource
      }
    }
    function getPolylineResource (obj) {
      const path = obj.getPath()
      const resource = generateLineContent(path)
      const { name, id } = getBaseInfo(obj._opts)
      return {
        id,
        name,
        resource
      }
    }
    function getPoygonResource (obj) {
      const path = obj.getPath()
      const resource = generatePolyContent(path)
      const { name, id } = getBaseInfo(obj._opts)
      return {
        id,
        name,
        resource
      }
    }
    function getBaseInfo (obj) {
      const name = obj.title
      const id = uuidv4()
      return { name, id }
    }
    function setLayers (resource: PostElementsBody) {
      const layers = store.state.Layers
      const layer = layers.find(item => item.id.includes(shareId.value))
      // layer.id = 'private_layer' + uuidv4()
      // layer?.elements.push(resource)
      if (layer?.elements) {
        ;(layer?.elements as any[]).push(resource)
      }
      console.log('layers', layers)
      store.commit('SET_LAYER_INFO', layers)
    }
    function updateCoordinates (transformType: string, element: any) {
      const geoType = element.resource?.content.geometry.type
      const type = element.resource?.type as number
      if (element.resource) {
        if (MapElementEnum.PIN === type) {
          const coordinates = element.resource?.content.geometry
            .coordinates as GeojsonCoordinate
          if (transformType === 'wgs84-gcj02') {
            const transResult = wgs84togcj02(
              coordinates[0],
              coordinates[1]
            ) as GeojsonCoordinate
            element.resource.content.geometry.coordinates = transResult
          } else if (transformType === 'gcj02-wgs84') {
            const transResult = gcj02towgs84(
              coordinates[0],
              coordinates[1]
            ) as GeojsonCoordinate
            element.resource.content.geometry.coordinates = transResult
          }
        } else if (MapElementEnum.LINE === type && geoType === 'LineString') {
          const coordinates = element.resource?.content.geometry
            .coordinates as GeojsonCoordinate[]
          if (transformType === 'wgs84-gcj02') {
            coordinates.forEach(coordinate => {
              coordinate = wgs84togcj02(
                coordinate[0],
                coordinate[1]
              ) as GeojsonCoordinate
            })
          } else if (transformType === 'gcj02-wgs84') {
            coordinates.forEach(coordinate => {
              coordinate = gcj02towgs84(
                coordinate[0],
                coordinate[1]
              ) as GeojsonCoordinate
            })
          }
          element.resource.content.geometry.coordinates = coordinates
        } else if (MapElementEnum.LINE === type && geoType === 'Polygon') {
          const coordinates = element.resource?.content.geometry
            .coordinates[0] as GeojsonCoordinate[]

          if (transformType === 'wgs84-gcj02') {
            coordinates.forEach(coordinate => {
              coordinate = wgs84togcj02(
                coordinate[0],
                coordinate[1]
              ) as GeojsonCoordinate
            })
          } else if (transformType === 'gcj02-wgs84') {
            coordinates.forEach(coordinate => {
              coordinate = gcj02towgs84(
                coordinate[0],
                coordinate[1]
              ) as GeojsonCoordinate
            })
          }
          element.resource.content.geometry.coordinates = [coordinates]
        }
      }
    }
    return {
      draw,
      mouseMode,
      drawVisible,
      osdVisible,
      pin,
      state,
      M30,
      deviceInfo,
      EGear,
      EModeCode,
      str,
      EDockModeCode,
      controlPanelVisible,
      dockDebugOnOff,
    }
  }
})
</script>

<style lang="scss" scoped>

.g-map-wrapper {
  height: 100%;
  width: 100%;

  .g-action-panle {
    position: absolute;
    top: 16px;
    right: 16px;
    .g-action-item {
      width: 28px;
      height: 28px;
      background: white;
      color: $primary;
      border-radius: 2px;
      line-height: 28px;
      text-align: center;
      margin-bottom: 2px;
    }
    .g-action-item:hover {
      border: 1px solid $primary;
      border-radius: 2px;
    }
  }
  .selection {
    border: 1px solid $primary;
    border-radius: 2px;
  }

  // antd button 光晕
  &:deep(.ant-btn){
    &::after {
      display: none;
    }
  }
}
.osd-panel {
  position: absolute;
  left: 350px;
  top: 10px;
  width: 480px;
  background: black;
  color: white;
  border-radius: 2px;
  opacity: 0.7;
}
.osd > div {
  padding-top: 5px;
  padding-left: 5px;
}

.circle {
  border-radius: 50%;
  width: 10px;
  height: 10px;
}

.battery-slide {
  .capacity-percent {
    background: #00ee8b;
  }
  .return-home {
    background: #ff9f0a;
  }
  .landing {
    background: #f5222d;
  }
  .white-point {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: white;
    bottom: -0.5px;
  }
  .battery {
    background: #141414;
    color: #00ee8b;
    margin-top: -10px;
    height: 20px;
    width: auto;
    border-left: 1px solid #00ee8b;
    padding: 0 5px;
  }
}
.battery-slide > div {
  position: absolute;
  min-height: 2px;
  border-radius: 2px;
}
</style>
