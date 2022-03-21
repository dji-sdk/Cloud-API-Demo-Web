import { MapElementEnum } from '/@/constants/map'

export interface mapLayerStyle {
  background: string
}

export interface mapLayerChildren {
  key: string
  style: mapLayerStyle
  title: string
  obj: any
}
export interface mapLayerChildrenObj {
  className: string
  key: string
  name: string
  type: string
}

// 拖拽事件
export interface DropEvent {
  node: {
    eventKey: string
    pos: string
    $parent: any
  }
  dragNode: {
    eventKey: string
  }
  dropPosition: number
  dropToGap: boolean
}
export interface mapLayer {
  key?: string
  title: string
  id: string
  name: string
  style: mapLayerStyle
  elements: any
}
export interface elementGroupsReq{
  groupId: string
  isDistributed: boolean
}
export interface PostElementsBody {
  id: string
  name: string
  resource: {
   type: MapElementEnum,
   user_name?: string,
   content: {
    type:string,
    properties:{
      color:string,
      clampToGround:boolean
    },
    geometry:{
      type:string,
      coordinates:unknown
    }
   },
  }
}

export interface Color {
  id: number
  color: string
  selected: boolean,
  name: string
}

export enum GeoType {
  LineString = 'LineString',
  Polygon = 'Polygon',
  Point = 'Point'
}
export enum ResourceStatus {
  NotShow,
  Show
}

export enum LayerElevationLoadStatus {
  Unload,
  Load
}
export interface PutElementsBody {
  name?: string
  status?: ResourceStatus
  content?: unknown
  display?: number
  elevation_load_status?: LayerElevationLoadStatus
}
export enum LayerType {
  Normal,
  Default,
  Share,
  Reconstruction
}
