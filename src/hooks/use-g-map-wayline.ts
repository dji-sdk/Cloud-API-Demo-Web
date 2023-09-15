import { getRoot } from '/@/root'
import { GeojsonCoordinate } from '/@/types/map'
/* 航线定位 */
export function initPloyline (path:GeojsonCoordinate[]) {
  const root = getRoot()
  const AMap = root.$aMap
  const map = root.$map
  const polyline = new AMap.Polyline({
    path: path,
    strokeWeight: 10, // 线条宽度，默认为 1
    strokeColor: '#3366bb', // 线条颜色
    lineJoin: 'round',
    lineCap: 'round',
    showDir: true // 折线拐点连接处样式
  })
  map.add(polyline)
  map.setCenter(path[0])
  map.setZoom(14)
  return polyline
}
