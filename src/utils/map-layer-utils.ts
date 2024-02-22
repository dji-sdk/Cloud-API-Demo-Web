import { pinAMapPosition, MapGeographicPosition, Layer, LayerType, LayerElevationLoadStatus } from '/@/types/map'
import { generatePoint, generateLine, generatePolygon, generateCircle } from '/@/utils/genjson'
import { MapDoodleColor, MapElementEnum } from '/@/constants/map'
function getPinPosition (pinAMapPosition: pinAMapPosition):MapGeographicPosition {
  return { height: 0, latitude: pinAMapPosition.lat, longitude: pinAMapPosition.lng }
}

export function generatePointContent (pinAMapPosition: pinAMapPosition) {
  const position = getPinPosition(pinAMapPosition)
  return {
    type: MapElementEnum.PIN,
    content: generatePoint(position, {
      color: MapDoodleColor.PinColor,
      clampToGround: true,
    })
  }
}
function getLieOrPolyPosition (mapPosition: pinAMapPosition[]):MapGeographicPosition[] {
  const position = [] as MapGeographicPosition[]
  mapPosition.forEach(item => {
    position.push({ height: 0, latitude: item.lat, longitude: item.lng })
  })
  return position
}
export function generateLineContent (mapPosition: pinAMapPosition[]) {
  const position = getLieOrPolyPosition(mapPosition)
  return {
    type: MapElementEnum.LINE,
    content: generateLine(position, {
      color: MapDoodleColor.PolylineColor,
      directConnected: false,
    })
  }
}

export function generatePolyContent (mapPosition: pinAMapPosition[]) {
  const position = getLieOrPolyPosition(mapPosition)
  return {
    type: MapElementEnum.POLY,
    content: generatePolygon(position, {
      color: MapDoodleColor.PolygonColor,
    })
  }
}

export function generateCircleContent (pinAMapPosition: pinAMapPosition, radius: number) {
  const position = getPinPosition(pinAMapPosition)
  return generateCircle(position, { color: MapDoodleColor.PolygonColor }, radius)
}
