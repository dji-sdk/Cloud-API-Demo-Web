import { InjectionKey } from 'vue'
import { ActionTree, createStore, GetterTree, MutationTree, Store, StoreOptions, useStore } from 'vuex'
import { EDeviceTypeName } from '../types'
import { Device, DeviceHms, DeviceOsd, DeviceStatus, DockOsd, GatewayOsd, OSDVisible } from '../types/device'
import { getLayers } from '/@/api/layer'
import { LayerType } from '/@/types/mapLayer'
import { ETaskStatus, TaskInfo, WaylineFile } from '/@/types/wayline'
import { DevicesCmdExecuteInfo } from '/@/types/device-cmd'

const initStateFunc = () => ({
  Layers: [
    {
      name: 'default',
      id: '',
      is_distributed: true,
      elements: [],
      is_check: false,
      is_select: false,
      type: 1
    },
    {
      name: 'share',
      id: '',
      is_distributed: true,
      elements: [],
      is_check: false,
      is_select: false,
      type: 2
    }
  ],
  layerBaseInfo: {} as {
    [key:string]:string
  },
  drawVisible: false,
  coverList: [

  ] as any,
  wsEvent: {
    mapElementCreat: {},
    mapElementUpdate: {},
    mapElementDelete: {}
  },
  deviceStatusEvent: {
    deviceOnline: {} as DeviceStatus,
    deviceOffline: {}
  },
  markerInfo: {
    coverMap: {} as {
      [sn: string]: any
    },
    pathMap: {} as {
      [sn: string]: any[]
    }
  },
  deviceState: {
    // remote controller, dock
    gatewayInfo: {} as {
      [sn: string]: GatewayOsd
    },
    // drone
    deviceInfo: {} as {
      [sn: string]: DeviceOsd
    },
    dockInfo: {} as {
      [sn: string]: DockOsd
    },
    currentSn: '',
    currentType: ''
  },
  osdVisible: {
    sn: '',
    callsign: '',
    model: '',
    visible: false,
    gateway_sn: '',
    is_dock: false,
  } as OSDVisible,
  waylineInfo: {

  } as WaylineFile,
  dockInfo: {

  } as Device,
  taskProgressInfo: {

  } as {
    [bid: string]: TaskInfo
  },
  hmsInfo: {} as {
    [sn: string]: DeviceHms[]
  },
  // 机场指令执行状态信息
  devicesCmdExecuteInfo: {
  } as DevicesCmdExecuteInfo
})

export type RootStateType = ReturnType<typeof initStateFunc>

const getters: GetterTree<RootStateType, RootStateType> = {
}
const mutations: MutationTree<RootStateType> = {
  SET_LAYER_INFO (state, info) {
    state.Layers = info
  },
  SET_DEVICE_INFO (state, info) {
    state.deviceState.deviceInfo[info.sn] = info.host
    state.deviceState.currentSn = info.sn
    state.deviceState.currentType = EDeviceTypeName.Aircraft
  },
  SET_GATEWAY_INFO (state, info) {
    state.deviceState.gatewayInfo[info.sn] = info.host
    state.deviceState.currentSn = info.sn
    state.deviceState.currentType = EDeviceTypeName.Gateway
  },
  SET_DOCK_INFO (state, info) {
    state.deviceState.currentSn = info.sn
    state.deviceState.currentType = EDeviceTypeName.Dock
    const dock = state.deviceState.dockInfo[info.sn]
    if (info.host.sdr && state.deviceState.dockInfo[info.sn]) {
      dock.sdr = info.host.sdr
      dock.media_file_detail = info.host.media_file_detail
      return
    }
    const sdr = dock?.sdr
    const mediaFileDetail = dock?.media_file_detail
    state.deviceState.dockInfo[info.sn] = info.host
    state.deviceState.dockInfo[info.sn].sdr = sdr
    state.deviceState.dockInfo[info.sn].media_file_detail = mediaFileDetail
  },
  SET_DRAW_VISIBLE_INFO (state, bool) {
    state.drawVisible = bool
  },
  SET_MAP_ELEMENT_CREATE (state, info) {
    state.wsEvent.mapElementCreat = info
  },
  SET_MAP_ELEMENT_UPDATE (state, info) {
    state.wsEvent.mapElementUpdate = info
  },
  SET_MAP_ELEMENT_DELETE (state, info) {
    state.wsEvent.mapElementDelete = info
  },
  SET_DEVICE_ONLINE (state, info) {
    state.deviceStatusEvent.deviceOnline = info
  },
  SET_DEVICE_OFFLINE (state, info) {
    state.deviceStatusEvent.deviceOffline = info
    delete state.deviceState.gatewayInfo[info.sn]
    delete state.deviceState.deviceInfo[info.sn]
    delete state.deviceState.dockInfo[info.sn]
    delete state.hmsInfo[info.sn]
    // delete state.markerInfo.coverMap[info.sn]
    // delete state.markerInfo.pathMap[info.sn]
  },
  SET_OSD_VISIBLE_INFO (state, info) {
    state.osdVisible = info
  },
  SET_SELECT_WAYLINE_INFO (state, info) {
    state.waylineInfo = info
  },
  SET_SELECT_DOCK_INFO (state, info) {
    state.dockInfo = info
  },
  SET_FLIGHT_TASK_PROGRESS (state, info) {
    const taskInfo: TaskInfo = info.output

    if (taskInfo.status === ETaskStatus.OK || taskInfo.status === ETaskStatus.FAILED) {
      taskInfo.status = taskInfo.status.concat('(Code:').concat(info.result).concat(')')
      setTimeout(() => {
        delete state.taskProgressInfo[info.bid]
      }, 60000)
    }
    state.taskProgressInfo[info.bid] = info.output
  },
  SET_DEVICE_HMS_INFO (state, info) {
    const hmsList: Array<DeviceHms> = state.hmsInfo[info.sn]
    state.hmsInfo[info.sn] = info.host.concat(hmsList ?? [])
  },
  SET_DEVICES_CMD_EXECUTE_INFO (state, info) { // 保存设备指令ws消息推送
    if (!info.sn) {
      return
    }
    if (state.devicesCmdExecuteInfo[info.sn]) {
      const index = state.devicesCmdExecuteInfo[info.sn].findIndex(cmdExecuteInfo => cmdExecuteInfo.biz_code === info.biz_code)
      if (index >= 0) {
        // 丢弃前面的消息
        if (state.devicesCmdExecuteInfo[info.sn][index].timestamp > info.timestamp) {
          return
        }
        state.devicesCmdExecuteInfo[info.sn][index] = info
      } else {
        state.devicesCmdExecuteInfo[info.sn].push(info)
      }
    } else {
      state.devicesCmdExecuteInfo[info.sn] = [info]
    }
  }
}

const actions: ActionTree<RootStateType, RootStateType> = {
  async getAllElement ({ commit }) {
    const result = await getLayers({
      groupId: '',
      isDistributed: true
    })
    commit('SET_LAYER_INFO', result.data?.list)
    console.log(result)
  },
  updateElement ({ state }, content: {type: 'is_check' | 'is_select', id: string, bool:boolean}) {
    const key = content.id.replaceAll('resource__', '')
    const type = content.type
    const layers = state.Layers
    const layer = layers.find(item => item.id === key)
    if (layer) {
      layer[type] = content.bool
    }
  },
  setLayerInfo ({ state }, layers) {
    // const layers = state.Layers
    const obj:{
      [key:string]:string
    } = {}
    layers.forEach(layer => {
      if (layer.type === LayerType.Default) {
        obj.default = layer.id
      } else {
        if (layer.type === LayerType.Share) {
          obj.share = layer.id
        }
      }
    })
    state.layerBaseInfo = obj
    console.log('state.layerBaseInfo', state.layerBaseInfo)
  },
  getLayerInfo ({ state }, id:string) {
    return state.layerBaseInfo[id]
  }
}

const storeOptions: StoreOptions<RootStateType> = {
  state: initStateFunc,
  getters,
  mutations,
  actions
}

const rootStore = createStore(storeOptions)

export default rootStore

export const storeKey: InjectionKey<Store<RootStateType>> = Symbol('')

type AllStateStoreTypes = RootStateType & {
  // moduleName: moduleType
}

export function useMyStore<T = AllStateStoreTypes> () {
  return useStore<T>(storeKey)
}
