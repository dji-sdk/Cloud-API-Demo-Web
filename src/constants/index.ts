import { CURRENT_CONFIG } from '/@/api/http/config'

export const AMapConfig = {
  key: CURRENT_CONFIG.amapKey,
  version: '2.0',
  plugins: [
    'AMap.Scale',
    'AMap.ToolBar',
    'AMap.ControlBar',
    'AMap.ElasticMarker',
    'AMap.MapType',
    'AMap.Geocoder',
    'AMap.CircleEditor',
    'AMap.PolygonEditor',
    'AMap.PolylineEditor',
    'AMap.PolyEditor',
    'AMap.RangingTool',
    'AMap.Weather',
    'AMap.MouseTool',
    'AMap.MoveAnimation'
  ]
}
