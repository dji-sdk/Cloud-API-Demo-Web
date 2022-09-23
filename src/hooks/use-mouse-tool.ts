import { reactive } from 'vue'
import pin2d8cf0 from '/@/assets/icons/pin-2d8cf0.svg'
import { MapDoodleType } from '/@/constants/map'
import { getRoot } from '/@/root'
import { MapDoodleEnum } from '/@/types/map-enum'

export function useMouseTool () {
  const root = getRoot()

  const state = reactive({
    pinNum: 0,
    polylineNum: 0,
    PolygonNum: 0,
    currentType: '',
  })

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
      draggable: true,
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
      draggable: true,
      title: type + state.PolygonNum++
    })
    root?.$mouseTool.on('draw', getDrawCallback)
  }

  function drawOff (type:MapDoodleType) {
    root?.$mouseTool.close()
    root?.$mouseTool.off('draw')
  }

  function mouseTool (type: MapDoodleType, getDrawCallback: Function) {
    state.currentType = type
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
