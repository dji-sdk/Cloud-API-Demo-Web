
export interface MapGeographicPosition {
 longitude: number;
 latitude: number;
 height?: number;
}
export enum LayerType {
 Normal,
 Default,
 Share
}
export interface pinAMapPosition {
 KL: number
 className: string
 kT: number
 lng: number
 lat: number
}
export enum ResourceStatus {
 NotShow,
 Show
}
export type GeojsonCoordinate = [number, number, number?]

export interface GeojsonLine {
 type: 'Feature'
 properties: {
   color: string
   directConnected?: boolean
 }
 geometry: {
   type: 'LineString'
   coordinates: GeojsonCoordinate[]
 }
}

export interface GeojsonPolygon {
 type: 'Feature'
 properties: {
   color: string
 }
 geometry: {
   type: 'Polygon'
   coordinates: GeojsonCoordinate[][]
 }
}

export interface GeojsonPoint {
 type: 'Feature'
 properties: {
   color: string
   clampToGround?: boolean
 }
 geometry: {
   type: 'Point'
   coordinates: GeojsonCoordinate
 }
}
export type GeojsonFeature = GeojsonLine | GeojsonPolygon | GeojsonPoint

interface ResourceObjectBasic {
 user_name: string
 user_id?: string
 type:0| 1 | 2
 content: unknown
}
export interface PinResource extends ResourceObjectBasic {
 type: 0
 content: GeojsonFeature
}

export type ResourceObject = PinResource
export enum LayerElevationLoadStatus {
 Unload,
 Load
}

export interface LayerResource {
 id: string
 name: string
 order: number
 status: ResourceStatus
 resource: ResourceObject | null
 display: number
 create_time: number
 elevation_load_status?: LayerElevationLoadStatus //
}
export interface Layer {
 id: string
 name: string
 order: number
 create_time: number
 type: LayerType
 is_distributed: boolean
 is_lock: boolean
 elements: null | LayerResource[],
 is_check?: boolean
 is_select?: boolean

}
