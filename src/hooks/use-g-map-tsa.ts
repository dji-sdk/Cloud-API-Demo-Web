import store from '/@/store'
import { getRoot } from '/@/root'
import { ELocalStorageKey } from '/@/types'
import { getDeviceBySn } from '/@/api/manage'
import { message } from 'ant-design-vue'
import dockIcon from '/@/assets/icons/dock.png'
import rcIcon from '/@/assets/icons/rc.png'
import droneIcon from '/@/assets/icons/drone.png'

export function deviceTsaUpdate () {
  const root = getRoot()
  const AMap = root.$aMap

  const icons = new Map([
    ['sub-device', droneIcon],
    ['gateway', rcIcon],
    ['dock', dockIcon]
  ])
  const markers = store.state.markerInfo.coverMap
  const paths = store.state.markerInfo.pathMap

  // Fix: 航迹初始化报错
  // TODO: 从时序上解决
  let trackLine = null as any
  function getTrackLineInstance () {
    if (!trackLine) {
      trackLine = new AMap.Polyline({
        map: root.$map,
        strokeColor: '#939393' // 线颜色
      })
    }
    return trackLine
  }

  function initIcon (type: string) {
    return new AMap.Icon({
      image: icons.get(type),
      imageSize: new AMap.Size(40, 40),
      size: new AMap.Size(40, 40)
    })
  }

  function initMarker (type: string, name: string, sn: string, lng?: number, lat?: number) {
    if (AMap === undefined) {
      location.reload()
      return
    }
    if (markers[sn]) {
      return
    }
    markers[sn] = new AMap.Marker({
      position: new AMap.LngLat(lng || 113.935913, lat || 22.525335),
      icon: initIcon(type),
      title: name,
      anchor: 'top-center',
      offset: [0, -20],
    })
    root.$map.add(markers[sn])
    // markers[sn].on('moving', function (e: any) {
    //   let path = paths[sn]
    //   if (!path) {
    //     paths[sn] = e.passedPath
    //     return
    //   }
    //   path.push(e.passedPath[0])
    //   path.push(e.passedPath[1])
    //   getTrackLineInstance().setPath(path)
    // })
  }

  function removeMarker (sn: string) {
    if (!markers[sn]) {
      return
    }
    root.$map.remove(markers[sn])
    getTrackLineInstance().setPath([])
    delete markers[sn]
    delete paths[sn]
  }

  function addMarker (sn: string, lng?: number, lat?: number) {
    getDeviceBySn(localStorage.getItem(ELocalStorageKey.WorkspaceId)!, sn)
      .then(data => {
        if (data.code !== 0) {
          message.error(data.message)
          return
        }
        initMarker(data.data.domain, data.data.nickname, sn, lng, lat)
      })
  }

  function moveTo (sn: string, lng: number, lat: number) {
    let marker = markers[sn]
    if (!marker) {
      addMarker(sn, lng, lat)
      marker = markers[sn]
      return
    }
    marker.moveTo([lng, lat], {
      duration: 1800,
      autoRotation: true
    })
  }

  return {
    marker: markers,
    initMarker,
    removeMarker,
    moveTo
  }
}
