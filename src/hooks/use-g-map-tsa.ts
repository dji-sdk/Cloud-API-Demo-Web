import store from '/@/store'
import { getRoot } from '/@/root'
import { ELocalStorageKey } from '/@/types'
import { getDeviceBySn } from '/@/api/manage'
import { message } from 'ant-design-vue'

export function deviceTsaUpdate () {
  const root = getRoot()
  const AMap = root.$aMapObj

  const map = root.$aMap
  const icons: {
    [key: string]: string
  } = {
    'sub-device' : '/@/assets/icons/drone.png',
    'gateway': '/@/assets/icons/rc.png',
    'dock': '/@/assets/icons/dock.png'
  }
  const markers = store.state.markerInfo.coverMap
  const paths = store.state.markerInfo.pathMap
  
  const passedPolyline = new AMap.Polyline({
    map: map,
    strokeColor: '#939393' // 线颜色
  })

  function initIcon (type: string) {
    return new AMap.Icon({
      image: icons[type],
      imageSize: new AMap.Size(40, 40)
    })
  }

  function initMarker (type: string, name: string, sn: string, lng?: number, lat?: number) {
    if (markers[sn]) {
      return
    }
    markers[sn] = new AMap.Marker({
      position: new AMap.LngLat(lng ? lng : 113.935913, lat ? lat : 22.525335),
      icon: initIcon(type),
      title: name,
      anchor: 'top-center',
      offset: [0, -20],
    })
    root.$aMap.add(markers[sn])

    // markers[sn].on('moving', function (e: any) {
    //   let path = paths[sn]
    //   if (!path) {
    //     paths[sn] = e.passedPath
    //     return
    //   }
    //   path.push(e.passedPath[0])
    //   path.push(e.passedPath[1])
    //   passedPolyline.setPath(path)
    // })
  }
  function removeMarker (sn: string) {
    if (!markers[sn]) {
      return
    }
    root.$aMap.remove(markers[sn])
    passedPolyline.setPath([])
    delete markers[sn]
    delete paths[sn]
  }
  function addMarker(sn: string, lng?: number, lat?: number) {
    getDeviceBySn(localStorage.getItem(ELocalStorageKey.WorkspaceId)!, sn)
      .then(data => {
        if (data.code !== 0) {
          message.error(data.message)
          return
        }
        initMarker(data.data.domain, data.data.nickname, sn, lng, lat)
      })
  }
  function moveTo(sn: string, lng: number, lat: number) {
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
