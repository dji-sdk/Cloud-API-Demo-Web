import { InjectionKey } from 'vue'
import { ActionTree, createStore, GetterTree, MutationTree, Store, StoreOptions, useStore } from 'vuex'
import { getLayers } from '/@/api/layer'
import { LayerType } from '/@/types/mapLayer'
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
  GatewayInfo: { // remote controller, dock

  },
  DeviceInfo: { // drone

  },
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
  }
})

export type RootStateType = ReturnType<typeof initStateFunc>

const getters: GetterTree<RootStateType, RootStateType> = {
}
const mutations: MutationTree<RootStateType> = {
  SET_LAYER_INFO (state, info) {
    state.Layers = info
  },
  SET_DEVICE_INFO (state, info) {
    state.DeviceInfo = info
    // console.log(state.DeviceInfo)
  },
  SET_GATEWAY_INFO (state, info) {
    state.GatewayInfo = info
    // console.log(state.GatewayInfo)
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
