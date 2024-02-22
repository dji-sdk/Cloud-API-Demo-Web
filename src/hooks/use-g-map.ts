import AMapLoader from '@amap/amap-jsapi-loader'
import { App, reactive } from 'vue'
import { AMapConfig } from '/@/constants/index'

export function useGMapManage () {
  const state = reactive({
    aMap: null, // Map类
    map: null, // 地图对象
    mouseTool: null,
  })

  async function initMap (container: string, app:App) {
    AMapLoader.load({
      ...AMapConfig
    }).then((AMap) => {
      state.aMap = AMap
      state.map = new AMap.Map(container, {
        center: [113.943225499, 22.577673716],
        zoom: 20
      })
      state.mouseTool = new AMap.MouseTool(state.map)

      // 挂在到全局
      app.config.globalProperties.$aMap = state.aMap
      app.config.globalProperties.$map = state.map
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
