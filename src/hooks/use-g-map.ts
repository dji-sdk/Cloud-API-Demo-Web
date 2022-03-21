import AMapLoader from '@amap/amap-jsapi-loader'
import { App, reactive } from 'vue'
import { AMapConfig } from '/@/constants/index'

export function useGMapManage () {
  const state = reactive({
    mapEntity: null,
    mapObj: null,
    mouseTool: null,
  })
  async function initMap (container: string, app:App) {
    AMapLoader.load({
      ...AMapConfig
    }).then((AMap) => {
      state.mapObj = AMap
      state.mapEntity = new AMap.Map(container, {
        center: [113.935913, 22.525335],
        zoom: 15
      })
      state.mouseTool = new AMap.MouseTool(state.mapEntity)
      app.config.globalProperties.$aMap = state.mapEntity
      app.config.globalProperties.$aMapObj = state.mapObj
      app.config.globalProperties.$mouseTool = state.mouseTool
    }).catch(e => {
      console.log(e)
    })
  }
  function globalPropertiesConfig (app:App) {
    initMap('g-container', app)
  }
  return {
    globalPropertiesConfig,
  }
}
