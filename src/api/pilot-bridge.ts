import { getRoot } from '/@/root'

const root = getRoot()
const components = new Map()

declare let window:any

interface JsResponse{
  code:number,
  message:string,
  data:{}
}

export default {
  init () {
    components.set('thing', {
      host: '',
      connectCallback: '',
      username: '',
      password: ''
    })
    components.set('liveshare', {
      videoPublishType: 'video-demand-aux-manual', // video-on-demand、video-by-manual、video-demand-aux-manual
      statusCallback: ''
    })
    components.set('map', {
      userName: '',
      elementPreName: ''
    })
    components.set('ws', {
      host: '',
      token: '',
      connectCallback: ''
    })
    components.set('api', {
      host: '',
      token: ''
    })
    components.set('tsa', {
    })
    components.set('media', {
      autoUploadPhoto: true, // 是否自动上传图片, 非必需
      autoUploadPhotoType: 1, // 自动上传的照片类型，0：原图， 1：缩略图， 非必需
      autoUploadVideo: true // 是否自动上传视频， 非必需
    })
    components.set('mission', {
    })
  },
  getComponentParam (key:string) {
    return components.get(key)
  },
  setComponentParam (key:string, value:any) {
    components.set(key, value)
  },
  loadComponent (name:string, param:any):string {
    return window.djiBridge.platformLoadComponent(name, JSON.stringify(param))
  },
  unloadComponent (name:string) :string {
    return window.djiBridge.platformUnloadComponent(name)
  },
  isComponentLoaded (module:string):string {
    return window.djiBridge.platformIsComponentLoaded(module)
  },
  setWorkspaceId (uuid:string):string {
    return window.djiBridge.platformSetWorkspaceId(uuid)
  },
  setPlatformMessage (platformName:string, title:string, desc:string):string {
    return window.djiBridge.platformSetInformation(platformName, title, desc)
  },
  getRemoteControllerSN () :string {
    return window.djiBridge.platformGetRemoteControllerSN()
  },
  getAircraftSN ():string {
    return window.djiBridge.platformGetAircraftSN()
  },
  stopwebview ():string {
    return window.djiBridge.platformStopSelf()
  },
  getToken () :string {
    const res:string = this.isComponentLoaded('api')
    const resObj = JSON.parse(res)
    console.log('api load status:', resObj)
    if (resObj.data === true) {
      const tokenRes = JSON.parse(window.djiBridge.apiGetToken())
      return tokenRes.data
    } else {
      console.warn('warning: not api component loaded!!')
      return ''
    }
  },
  setToken (token:string):string {
    return window.djiBridge.apiSetToken(token)
  },
  setLogEncryptKey (key:string):string {
    return window.djiBridge.platformSetLogEncryptKey(key)
  },
  clearLogEncryptKey ():string {
    return window.djiBridge.platformClearLogEncryptKey()
  },
  getLogPath ():string {
    return window.djiBridge.platformGetLogPath()
  },
  platformVerifyLicense (appId:string, appKey:string, appLicense:string):string {
    return window.djiBridge.platformVerifyLicense(appId, appKey, appLicense)
  },
  isPlatformVerifySuccess ():string {
    return window.djiBridge.platformIsVerified()
  },
  // liveshare
  /**
   *
   * @param type
   * video-on-demand: 服务器点播，依赖于thing模块，具体的点播命令参见设备物模型的直播服务
   * video-by-manual：手动点播，配置好直播类型参数之后，在图传页面可修改直播参数，停止直播
   * video-demand-aux-manual: 混合模式，支持服务器点播，以及图传页面修改直播参数，停止直播
   */
  setVideoPublishType (type:string):string {
    return window.djiBridge.liveshareSetVideoPublishType(type)
  },

  /**
   *
   * @returns
   * type: liveshare type， 0：unknown, 1:agora, 2:rtmp, 3:rtsp, 4:gb28181
   */
  getLiveshareConfig () {
    return window.djiBridge.liveshareGetConfig()
  },

  setLiveshareConfig (type:number, params:string):string {
    return window.djiBridge.liveshareSetConfig(type, params)
  },

  setLiveshareStatusCallback (callbackFunc:string) :string {
    return window.djiBridge.liveshareSetStatusCallback(callbackFunc)
  },
  getLiveshareStatus () {
    return window.djiBridge.liveshareGetStatus()
  },
  startLiveshare ():string {
    return window.djiBridge.liveshareStartLive()
  },
  stopLiveshare ():string {
    return window.djiBridge.liveshareStopLive()
  },
  // media
  setAutoUploadPhoto (auto:boolean):string {
    return window.djiBridge.mediaSetAutoUploadPhoto(auto)
  },
  getAutoUploadPhoto () {
    return window.djiBridge.mediaGetAutoUploadPhoto()
  },
  setUploadPhotoType (type:number):string {
    return window.djiBridge.mediaSetUploadPhotoType(type)
  },
  getUploadPhotoType () {
    return window.djiBridge.mediaGetUploadPhotoType()
  },
  setAutoUploadVideo (auto:boolean):string {
    return window.djiBridge.mediaSetAutoUploadVideo(auto)
  },
  getAutoUploadVideo () {
    return window.djiBridge.mediaGetAutoUploadVideo()
  },
  setDownloadOwner (rcIndex:number):string {
    return window.djiBridge.mediaSetDownloadOwner(rcIndex)
  },
  getDownloadOwner () {
    return window.djiBridge.mediaGetDownloadOwner()
  },
  onBackClickReg () {
    window.djiBridge.onBackClick = () => {
      if (root.$router.currentRoute.value.path === '/pilot-home') {
        console.log(root.$router.currentRoute.value.path)
        return false
      } else {
        console.log(root.$router.currentRoute.value.path)
        history.go(-1)
        return true
      }
    }
  }
}
