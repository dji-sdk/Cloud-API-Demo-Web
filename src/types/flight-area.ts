import { GeojsonCoordinate, GeojsonPolygon } from '../utils/genjson'

export enum EFlightAreaType {
  NFZ = 'nfz',
  DFENCE = 'dfence',
}

export enum EGeometryType {
  CIRCLE = 'Circle',
  POLYGON = 'Polygon',
}

export enum EFlightAreaUpdate {
  ADD = 'add',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum ESyncStatus {
  WAIT_SYNC = 'wait_sync',
  SWITCH_FAIL = 'switch_fail',
  SYNCHRONIZING = 'synchronizing',
  SYNCHRONIZED = 'synchronized',
  FAIL = 'fail',
}

export interface GeojsonCircle {
  type: 'Feature'
  properties: {
    color: string
    clampToGround?: boolean
  }
  geometry: {
    type: EGeometryType.CIRCLE
    coordinates: GeojsonCoordinate
    radius: number
  }
}

export interface DroneLocation {
  area_distance: number,
  area_id: string,
  is_in_area: boolean,
}

export interface FlightAreasDroneLocation {
  drone_locations: DroneLocation[]
}

export type FlightAreaContent = GeojsonCircle | GeojsonPolygon

export interface FlightAreaUpdate {
  operation: EFlightAreaUpdate,
  area_id: string,
  name: string,
  type: EFlightAreaType,
  content: FlightAreaContent,
  status: boolean,
  username: string,
  create_time: number,
  update_time: number,
}

export interface FlightAreaSyncProgress {
  sn: string,
  result: number,
  status: ESyncStatus,
  message: string,
}

export const FlightAreaTypeTitleMap = {
  [EFlightAreaType.NFZ]: {
    [EGeometryType.CIRCLE]: 'Circular GEO Zone',
    [EGeometryType.POLYGON]: 'Polygonal GEO Zone',
  },
  [EFlightAreaType.DFENCE]: {
    [EGeometryType.CIRCLE]: 'Circular Task Area',
    [EGeometryType.POLYGON]: 'Polygonal Task Area',
  },
}
