import { GeojsonCoordinate } from '../utils/genjson'
import { getRoot } from '/@/root'

export function useMapTool () {
  const root = getRoot()
  const map = root.$map
  const AMap = root.$aMap

  function panTo (coordinate: GeojsonCoordinate) {
    map.panTo(coordinate, 100)
    map.setZoom(18, false, 100)
  }
  return {
    panTo,
  }
}
