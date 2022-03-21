import { createApp, ComponentCustomProperties, App as VueApp } from 'vue'
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $aMap: any
    $aMapObj: any
    $mouseTool: any
  }
}
let root: ComponentCustomProperties
let app = null as any

export function createInstance (App: any): VueApp {
  app = createApp(App)
  root = app.config.globalProperties as ComponentCustomProperties
  return app
}

export function getRoot (): ComponentCustomProperties {
  return root
}

export function getApp (): VueApp {
  return app
}
