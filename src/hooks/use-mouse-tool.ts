import { reactive } from 'vue'
import pin2d8cf0 from '/@/assets/icons/pin-2d8cf0.svg'
import { MapDoodleType } from '/@/constants/map'
import { getRoot } from '/@/root'
import { MapDoodleEnum } from '/@/types/map-enum'
import { EFlightAreaType } from '../types/flight-area'
import { message } from 'ant-design-vue'

export function useMouseTool () {
  const root = getRoot()

  const state = reactive({
    pinNum: 0,
    polylineNum: 0,
    PolygonNum: 0,
    currentType: '',
  })
  const flightAreaColorMap = {
    [EFlightAreaType.DFENCE]: '#19be6b',
    [EFlightAreaType.NFZ]: '#ff0000',
  }
  function drawPin (type:MapDoodleType, getDrawCallback:Function) {
    root?.$mouseTool.marker({
      title: type + state.pinNum,
      icon: pin2d8cf0,
    })
    state.pinNum++
    root?.$mouseTool.on('draw', getDrawCallback)
  }

  function drawPolyline (type:MapDoodleType, getDrawCallback:Function) {
    root?.$mouseTool.polyline({
      strokeColor: '#2d8cf0',
      strokeOpacity: 1,
      strokeWeight: 2,
      strokeStyle: 'solid',
      title: type + state.polylineNum++
    })
    root?.$mouseTool.on('draw', getDrawCallback)
  }

  function drawPolygon (type:MapDoodleType, getDrawCallback:Function) {
    root?.$mouseTool.polygon({
      strokeColor: '#2d8cf0',
      strokeOpacity: 1,
      strokeWeight: 2,
      fillColor: '#1791fc',
      fillOpacity: 0.4,
      title: type + state.PolygonNum++
    })
    root?.$mouseTool.on('draw', getDrawCallback)
  }

  function drawOff (type:MapDoodleType) {
    root?.$mouseTool.close()
    root?.$mouseTool.off('draw')
  }

  function drawFlightAreaPolygon (type: EFlightAreaType, getDrawFlightAreaCallback: Function) {
    root?.$mouseTool.polygon({
      strokeColor: flightAreaColorMap[type],
      strokeOpacity: 1,
      strokeWeight: 4,
      extData: {
        type: type,
        mapType: 'polygon',
      },
      strokeStyle: 'dashed',
      strokeDasharray: EFlightAreaType.NFZ === type ? [10, 2] : [10, 1, 2],
      fillColor: flightAreaColorMap[type],
      fillOpacity: EFlightAreaType.NFZ === type ? 0.3 : 0,
    })
    root?.$mouseTool.on('draw', getDrawFlightAreaCallback)
  }

  function drawFlightAreaCircle (type: EFlightAreaType, getDrawFlightAreaCallback: Function) {
    root?.$mouseTool.circle({
      strokeColor: flightAreaColorMap[type],
      strokeOpacity: 1,
      strokeWeight: 6,
      extData: {
        type: type,
        mapType: 'circle',
      },
      strokeStyle: 'dashed',
      strokeDasharray: EFlightAreaType.NFZ === type ? [10, 2] : [10, 1, 2],
      fillColor: flightAreaColorMap[type],
      fillOpacity: EFlightAreaType.NFZ === type ? 0.3 : 0,
    })
    root?.$mouseTool.on('draw', getDrawFlightAreaCallback)
  }

  function mouseTool (type: MapDoodleType, getDrawCallback: Function, flightAreaType?: EFlightAreaType) {
    state.currentType = type
    if (flightAreaType) {
      switch (type) {
        case MapDoodleEnum.POLYGON:
          drawFlightAreaPolygon(flightAreaType, getDrawCallback)
          return
        case MapDoodleEnum.CIRCLE:
          drawFlightAreaCircle(flightAreaType, getDrawCallback)
          return
        default:
          message.error(`Invalid type: ${flightAreaType}`)
          return
      }
    }
    switch (type) {
      case MapDoodleEnum.PIN:
        drawPin(type, getDrawCallback)
        break
      case MapDoodleEnum.POLYLINE:
        drawPolyline(type, getDrawCallback)
        break
      case MapDoodleEnum.POLYGON:
        drawPolygon(type, getDrawCallback)
        break
      case MapDoodleEnum.Close:
        drawOff(type)
        break
    }
  }

  return {
    mouseTool
  }
}
