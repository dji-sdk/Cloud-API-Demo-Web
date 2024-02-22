import { message, notification } from 'ant-design-vue'
import { MapDoodleEnum } from '/@/types/map-enum'
import { getRoot } from '/@/root'
import { PostFlightAreaBody, saveFlightArea } from '/@/api/flight-area'
import { generateCircleContent, generatePolyContent } from '/@/utils/map-layer-utils'
import { GeojsonCoordinate } from '/@/utils/genjson'
import { gcj02towgs84, wgs84togcj02 } from '/@/vendors/coordtransform.js'
import { uuidv4 } from '/@/utils/uuid'
import { CommonHostWs } from '/@/websocket'
import { FlightAreasDroneLocation } from '/@/types/flight-area'
import rootStore from '/@/store'
import { h } from 'vue'
import { useGMapCover } from '/@/hooks/use-g-map-cover'
import moment from 'moment'
import { DATE_FORMAT } from '/@/utils/constants'

export function useFlightArea () {
  const root = getRoot()
  const store = rootStore
  const coverMap = store.state.coverMap

  let useGMapCoverHook = useGMapCover()

  const MIN_RADIUS = 10
  function checkCircle (obj: any): boolean {
    if (obj.getRadius() < MIN_RADIUS) {
      message.error(`The radius must be greater than ${MIN_RADIUS}m.`)
      root.$map.remove(obj)
      return false
    }
    return true
  }

  function checkPolygon (obj: any): boolean {
    const path: any[][] = obj.getPath()
    if (path.length < 3) {
      message.error('The path of the polygon cannot be crossed.')
      root.$map.remove(obj)
      return false
    }
    // root.$aMap.GeometryUtil.doesLineLineIntersect()
    return true
  }

  function setExtData (obj: any) {
    let ext = obj.getExtData()
    const id = uuidv4()
    const name = `${ext.type}-${moment().format(DATE_FORMAT)}`
    ext = Object.assign({}, ext, { id, name })
    obj.setExtData(ext)
    return ext
  }
  function createFlightArea (obj: any) {
    const ext = obj.getExtData()
    const data = {
      id: ext.id,
      type: ext.type,
      name: ext.name,
    }
    let coordinates: GeojsonCoordinate | GeojsonCoordinate[][]
    let content
    switch (ext.mapType) {
      case 'circle':
        content = generateCircleContent(obj.getCenter(), obj.getRadius())
        coordinates = getWgs84(content.geometry.coordinates as GeojsonCoordinate)
        break
      case 'polygon':
        content = generatePolyContent(obj.getPath()).content
        coordinates = [getWgs84(content.geometry.coordinates[0] as GeojsonCoordinate[])]
        break
      default:
        message.error(`Invalid type: ${obj.mapType}`)
        root.$map.remove(obj)
        return
    }
    content.geometry.coordinates = coordinates

    saveFlightArea(Object.assign({}, data, { content }) as PostFlightAreaBody).then(res => {
      if (res.code !== 0) {
        useGMapCoverHook.removeCoverFromMap(ext.id)
      }
    }).finally(() => root.$map.remove(obj))
  }

  function getDrawFlightAreaCallback (obj: any) {
    useGMapCoverHook = useGMapCover()
    const ext = setExtData(obj)
    switch (ext.mapType) {
      case MapDoodleEnum.CIRCLE:
        if (!checkCircle(obj)) {
          return
        }
        break
      case MapDoodleEnum.POLYGON:
        if (!checkPolygon(obj)) {
          return
        }
        break
      default:
        break
    }
    createFlightArea(obj)
  }

  const getWgs84 = <T extends GeojsonCoordinate | GeojsonCoordinate[]>(coordinate: T): T => {
    if (coordinate[0] instanceof Array) {
      return (coordinate as GeojsonCoordinate[]).map(c => gcj02towgs84(c[0], c[1])) as T
    }
    return gcj02towgs84(coordinate[0], coordinate[1])
  }

  const getGcj02 = <T extends GeojsonCoordinate | GeojsonCoordinate[]>(coordinate: T): T => {
    if (coordinate[0] instanceof Array) {
      return (coordinate as GeojsonCoordinate[]).map(c => wgs84togcj02(c[0], c[1])) as T
    }
    return wgs84togcj02(coordinate[0], coordinate[1])
  }

  const onFlightAreaDroneLocationWs = (data: CommonHostWs<FlightAreasDroneLocation>) => {
    const nearArea = data.host.drone_locations.filter(val => !val.is_in_area)
    const inArea = data.host.drone_locations.filter(val => val.is_in_area)
    notification.warning({
      key: `flight-area-${data.sn}`,
      message: `Drone(${data.sn}) flight area information`,
      description: h('div',
        [
          h('div', [
            h('span', { class: 'fz18' }, 'In the flight area: '),
            h('ul', [
              ...inArea.map(val => h('li', `There are ${val.area_distance} meters from the edge of the area(${coverMap[val.area_id][1]?.getText() || val.area_id}).`))
            ])
          ]),
          h('div', [
            h('span', { class: 'fz18' }, 'Near the flight area: '),
            h('ul', [
              ...nearArea.map(val => h('li', `There are ${val.area_distance} meters from the edge of the area(${coverMap[val.area_id][1]?.getText() || val.area_id}).`))
            ])
          ])
        ]),
      duration: null,
      style: {
        width: '420px',
        marginTop: '-8px',
        marginLeft: '-28px',
      }
    })
  }

  return {
    getDrawFlightAreaCallback,
    getGcj02,
    getWgs84,
    onFlightAreaDroneLocationWs,
  }
}
