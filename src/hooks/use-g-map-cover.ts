import pin19be6b from '/@/assets/icons/pin-19be6b.svg'
import pin212121 from '/@/assets/icons/pin-212121.svg'
import pin2d8cf0 from '/@/assets/icons/pin-2d8cf0.svg'
import pinb620e0 from '/@/assets/icons/pin-b620e0.svg'
import pine23c39 from '/@/assets/icons/pin-e23c39.svg'
import pineffbb00 from '/@/assets/icons/pin-ffbb00.svg'
import { getRoot } from '/@/root'
import rootStore from '/@/store'
import { GeojsonCoordinate } from '/@/types/map'

export function useGMapCover () {
  const root = getRoot()
  const AMap = root.$aMap

  const normalColor = '#2D8CF0'
  const store = rootStore
  const coverList = store.state.coverList

  function AddCoverToMap (cover :any) {
    root.$map.add(cover)
    coverList.push(cover)
    // console.log('coverList:', store.state.coverList)
  }

  function getPinIcon (color?:string) {
    // console.log('color', color)
    const colorObj: {
      [key: number| string]: any
    } = {
      '2d8cf0': pin2d8cf0,
      '19be6b': pin19be6b,
      '212121': pin212121,
      'b620e0': pinb620e0,
      'e23c39': pine23c39,
      'ffbb00': pineffbb00,
    }
    const iconName = (color?.replaceAll('#', '') || '').toLocaleLowerCase()
    return new AMap.Icon({
      // size: new AMap.Size(40, 50),
      image: colorObj[iconName],
      // imageOffset: new AMap.Pixel(0, -60),
      // imageSize: new AMap.Size(40, 50)
    })
  }

  function init2DPin (name: string, coordinates:GeojsonCoordinate, color?:string, data?:{}) {
    console.log(name, coordinates[0], coordinates[1], color, data)
    const pin = new AMap.Marker({
      position: new AMap.LngLat(coordinates[0], coordinates[1]),
      title: name,
      icon: getPinIcon(color),
      // strokeColor: color || normalColor,
      // fillColor: color || normalColor,
      extData: data
    })
    // console.log('coordinates pin', pin)
    AddCoverToMap(pin)
  }

  function AddOverlayGroup (overlayGroup) {
    root.$map.add(overlayGroup)
    coverList.push(overlayGroup)
  }
  function initPolyline (name: string, coordinates:GeojsonCoordinate[], color?:string, data?:{}) {
    const path = [] as GeojsonCoordinate[]
    coordinates.forEach(coordinate => {
      path.push(new AMap.LngLat(coordinate[0], coordinate[1]))
    })
    const polyline = new AMap.Polyline({
      path: path,
      strokeColor: color || normalColor,
      strokeOpacity: 1,
      strokeWeight: 2,
      strokeStyle: 'solid',
      extData: data
      // draggable: true,
    })
    AddOverlayGroup(polyline)
  }

  function initPolygon (name: string, coordinates:GeojsonCoordinate[][], color?:string, data?:{}) {
    const path = [] as GeojsonCoordinate[]
    coordinates[0].forEach(coordinate => {
      path.push(new AMap.LngLat(coordinate[0], coordinate[1]))
    })
    // console.log('Polygon', path)
    const Polygon = new AMap.Polygon({
      path: path,
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: color || normalColor,
      fillOpacity: 0.4,
      // draggable: true,
      strokeColor: color || normalColor,
      extData: data
    })
    AddOverlayGroup(Polygon)
  }

  function removeCoverFromMap (id:string) {
    for (let i = 0; i < coverList.length; i++) {
      const ele = coverList[i]
      // console.log(ele)
      const extdata = ele?.getExtData()
      if (extdata?.id === id) {
        console.log(extdata)
        root.$map.remove(ele)
        coverList.slice(i, 1)
        break
      }
    }
  }

  function getElementFromMap (id:string) {
    // console.log('start', new Date().getTime())
    const ele = coverList.find(ele => ele?.getExtData().id === id)
    // console.log('end', new Date().getTime())
    return ele
    // coverList.forEach((ele:any) => {
    //   const extdata = ele?.getExtData()
    //   // console.log(extdata)
    //   if (extdata?.id === id) {
    //     return ele
    //   }
    // })
  }

  function updatePinElement (id:string, name: string, coordinates:GeojsonCoordinate, color?:string) {
    const element = getElementFromMap(id) as any
    if (element) {
      const icon = getPinIcon(color)
      element.setPosition(new AMap.LngLat(coordinates[0], coordinates[1]))
      element.setIcon(icon)
      element.setTitle(name)
    } else {
      // console.log('into init PIN')
      init2DPin(name, coordinates, color, {
        id: id,
        name: name
      })
    }
  }

  function updatePolylineElement (id:string, name: string, coordinates:GeojsonCoordinate[], color?:string) {
    const element = getElementFromMap(id) as any
    if (element) {
      const options = element.getOptions()
      options.strokeColor = color || normalColor
      element.setOptions(options)
    } else {
      initPolyline(name, coordinates, color, {
        id: id,
        name: name
      })
    }
  }

  function updatePolygonElement (id:string, name: string, coordinates:GeojsonCoordinate[][], color?:string) {
    const element = getElementFromMap(id) as any
    if (element) {
      const options = element.getOptions()
      options.fillColor = color || normalColor
      options.strokeColor = color || normalColor
      element.setOptions(options)
    } else {
      initPolygon(name, coordinates, color, {
        id: id,
        name: name
      })
    }
  }

  return {
    init2DPin,
    initPolyline,
    initPolygon,
    removeCoverFromMap,
    getElementFromMap,
    updatePinElement,
    updatePolylineElement,
    updatePolygonElement
  }
}
