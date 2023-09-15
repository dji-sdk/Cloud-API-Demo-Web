
export enum MapElementColor {
    Blue = '#2D8CF0',
    Green = '#19BE6B',
    Yellow = '#FFBB00',
    Red = '#E23C39',
    Orange = '#B620E0',
    Default = '#212121'
  }
export const MapElementDefaultColor = MapElementColor.Default

export enum MapDoodleColor {
  PinColor = '#2D8CF0',
  PolylineColor = '#3366FF',
  PolygonColor = '#FF33FF',
  CircleColor = '#FFBB00'
}

export enum MapElementEnum {
  PIN = 0,
  LINE = 1,
  POLY = 2,
  CIR = 3
}
export type MapDoodleType = 'pin' | 'polyline' | 'polygon' | 'circle' |'off'
