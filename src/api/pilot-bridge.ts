import { message } from 'ant-design-vue'
import { EComponentName, EPhotoType, ERouterName } from '../types'
import { CURRENT_CONFIG } from './http/config'
import { EVideoPublishType, LiveStreamStatus } from '../types/live-stream'
import { getRoot } from '/@/root'

const root = getRoot()
export const components = new Map()
declare let window:any
interface JsResponse{
  code:number,
  message:string,
  data:any
}

export interface ThingParam {
  host: string,
  username: string,
  password: string,
  connectCallback: string
}

export interface LiveshareParam {
  videoPublishType: string, // video-on-demand、video-by-manual、video-demand-aux-manual
  statusCallback: string
}

export interface MapParam {
  userName: string,
  elementPreName: string
}

export interface WsParam {
  host: string,
  token: string,
  connectCallback: string
}

export interface ApiParam {
  host: string,
  token: string
}

export interface MediaParam {
  autoUploadPhoto: boolean, // 是否自动上传图片, 非必需
  autoUploadPhotoType: number, // 自动上传的照片类型，0：原图， 1：缩略图， 非必需
  autoUploadVideo: boolean // 是否自动上传视频， 非必需
}

function returnBool (response: string): boolean {
  const res: JsResponse = JSON.parse(response)
  const isError = errorHint(res)
  if (JSON.stringify(res.data) !== '{}') {
    return isError && res.data
  }
  return isError
}

function returnString (response: string): string {
  const res: JsResponse = JSON.parse(response)
  return errorHint(res) ? res.data : ''
}

function returnNumber (response: string): number {
  const res: JsResponse = JSON.parse(response)
  return errorHint(res) ? res.data : -1
}

function errorHint (response: JsResponse): boolean {
  if (response.code !== 0) {
    message.error(response.message)
    console.error(response.message)
    return false
  }
  return true
}

export default {
  init (): Map<EComponentName, any> {
    const thingParam: ThingParam = {
      host: '',
      connectCallback: '',
      username: '',
      password: ''
    }
    components.set(EComponentName.Thing, thingParam)
    const liveshareParam: LiveshareParam = {
      videoPublishType: EVideoPublishType.VideoDemandAuxManual,
      statusCallback: 'liveStatusCallback'
    }
    components.set(EComponentName.Liveshare, liveshareParam)
    const mapParam: MapParam = {
      userName: '',
      elementPreName: 'PILOT'
    }
    components.set(EComponentName.Map, mapParam)
    const wsParam: WsParam = {
      host: CURRENT_CONFIG.websocketURL,
      token: '',
      connectCallback: 'wsConnectCallback'
    }
    components.set(EComponentName.Ws, wsParam)
    const apiParam: ApiParam = {
      host: '',
      token: ''
    }
    components.set(EComponentName.Api, apiParam)
    components.set(EComponentName.Tsa, {})
    const mediaParam: MediaParam = {
      autoUploadPhoto: true,
      autoUploadPhotoType: EPhotoType.Preview,
      autoUploadVideo: true
    }
    components.set(EComponentName.Media, mediaParam)
    components.set(EComponentName.Mission, {})

    return components
  },

  getComponentParam (key:EComponentName): any {
    return components.get(key)
  },
  setComponentParam (key:EComponentName, value:any) {
    components.set(key, value)
  },
  loadComponent (name:string, param:any):string {
    return returnString(window.djiBridge.platformLoadComponent(name, JSON.stringify(param)))
  },
  unloadComponent (name:string) :string {
    return returnString(window.djiBridge.platformUnloadComponent(name))
  },
  isComponentLoaded (module:string): boolean {
    return returnBool(window.djiBridge.platformIsComponentLoaded(module))
  },
  setWorkspaceId (uuid:string):string {
    return returnString(window.djiBridge.platformSetWorkspaceId(uuid))
  },
  setPlatformMessage (platformName:string, title:string, desc:string): boolean {
    return returnBool(window.djiBridge.platformSetInformation(platformName, title, desc))
  },
  getRemoteControllerSN () :string {
    return returnString(window.djiBridge.platformGetRemoteControllerSN())
  },
  getAircraftSN ():string {
    return returnString(window.djiBridge.platformGetAircraftSN())
  },
  stopwebview ():string {
    return returnString(window.djiBridge.platformStopSelf())
  },
  setLogEncryptKey (key:string):string {
    return window.djiBridge.platformSetLogEncryptKey(key)
  },
  clearLogEncryptKey ():string {
    return window.djiBridge.platformClearLogEncryptKey()
  },
  getLogPath ():string {
    return returnString(window.djiBridge.platformGetLogPath())
  },
  platformVerifyLicense (appId:string, appKey:string, appLicense:string): boolean {
    return returnBool(window.djiBridge.platformVerifyLicense(appId, appKey, appLicense))
  },
  isPlatformVerifySuccess (): boolean {
    return returnBool(window.djiBridge.platformIsVerified())
  },
  isAppInstalled (pkgName: string): boolean {
    return returnBool(window.djiBridge.platformIsAppInstalled(pkgName))
  },
  getVersion (): string {
    return window.djiBridge.platformGetVersion()
  },

  // thing
  thingGetConnectState (): boolean {
    return returnBool(window.djiBridge.thingGetConnectState())
  },

  thingGetConfigs (): ThingParam {
    const thingParam = JSON.parse(window.djiBridge.thingGetConfigs())
    return thingParam.code === 0 ? JSON.parse(thingParam.data) : {}
  },

  // api
  getToken () : string {
    return returnString(window.djiBridge.apiGetToken())
  },
  setToken (token:string):string {
    return returnString(window.djiBridge.apiSetToken(token))
  },
  getHost (): string {
    return returnString(window.djiBridge.apiGetHost())
  },

  // liveshare
  /**
   *
   * @param type
   * video-on-demand: 服务器点播，依赖于thing模块，具体的点播命令参见设备物模型的直播服务
   * video-by-manual：手动点播，配置好直播类型参数之后，在图传页面可修改直播参数，停止直播
   * video-demand-aux-manual: 混合模式，支持服务器点播，以及图传页面修改直播参数，停止直播
   */
  setVideoPublishType (type:string): boolean {
    return returnBool(window.djiBridge.liveshareSetVideoPublishType(type))
  },

  /**
   *
   * @returns
   * type: liveshare type， 0：unknown, 1:agora, 2:rtmp, 3:rtsp, 4:gb28181
   */
  getLiveshareConfig (): string {
    return returnString(window.djiBridge.liveshareGetConfig())
  },

  setLiveshareConfig (type:number, params:string):string {
    return window.djiBridge.liveshareSetConfig(type, params)
  },

  setLiveshareStatusCallback (callbackFunc:string) :string {
    return window.djiBridge.liveshareSetStatusCallback(callbackFunc)
  },
  getLiveshareStatus (): LiveStreamStatus {
    return JSON.parse(JSON.parse(window.djiBridge.liveshareGetStatus()).data)
  },
  startLiveshare (): boolean {
    return returnBool(window.djiBridge.liveshareStartLive())
  },
  stopLiveshare (): boolean {
    return returnBool(window.djiBridge.liveshareStopLive())
  },
  // WebSocket
  wsGetConnectState (): boolean {
    return returnBool(window.djiBridge.wsGetConnectState())
  },
  wsConnect (host: string, token: string, callback: string): string {
    return window.djiBridge.wsConnect(host, token, callback)
  },
  wsDisconnect (): string {
    return window.djiBridge.wsConnect()
  },
  wsSend (message: string): string {
    return window.djiBridge.wsSend(message)
  },
  // media
  setAutoUploadPhoto (auto:boolean):string {
    return window.djiBridge.mediaSetAutoUploadPhoto(auto)
  },
  getAutoUploadPhoto (): boolean {
    return returnBool(window.djiBridge.mediaGetAutoUploadPhoto())
  },
  setUploadPhotoType (type:number):string {
    return window.djiBridge.mediaSetUploadPhotoType(type)
  },
  getUploadPhotoType (): number {
    return returnNumber(window.djiBridge.mediaGetUploadPhotoType())
  },
  setAutoUploadVideo (auto:boolean):string {
    return window.djiBridge.mediaSetAutoUploadVideo(auto)
  },
  getAutoUploadVideo (): boolean {
    return returnBool(window.djiBridge.mediaGetAutoUploadVideo())
  },
  setDownloadOwner (rcIndex:number):string {
    return window.djiBridge.mediaSetDownloadOwner(rcIndex)
  },
  getDownloadOwner (): number {
    return returnNumber(window.djiBridge.mediaGetDownloadOwner())
  },
  onBackClickReg () {
    window.djiBridge.onBackClick = () => {
      if (root.$router.currentRoute.value.path === '/' + ERouterName.PILOT_HOME) {
        return false
      } else {
        history.go(-1)
        return true
      }
    }
  },
  onStopPlatform () {
    window.djiBridge.onStopPlatform = () => {
      localStorage.clear()
    }
  }
}
