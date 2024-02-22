import request from '../http/request'
import { IWorkspaceResponse } from '../http/type'
import { EFlightAreaType, ESyncStatus, FlightAreaContent } from './../../types/flight-area'
import { ELocalStorageKey } from '/@/types/enums'
import { GeojsonCoordinate } from '/@/utils/genjson'

export interface GetFlightArea {
  area_id: string,
  name: string,
  type: EFlightAreaType,
  content: FlightAreaContent,
  status: boolean,
  username: string,
  create_time: number,
  update_time: number,
}

export interface PostFlightAreaBody {
  id: string,
  name: string,
  type: EFlightAreaType,
  content: {
    properties: {
      color: string,
      clampToGround: boolean,
    },
    geometry: {
      type: string,
      coordinates: GeojsonCoordinate | GeojsonCoordinate[][],
      radius?: number,
    }
  }
}

export interface FlightAreaStatus {
  sync_code: number,
  sync_status: ESyncStatus,
  sync_msg: string,

}
export interface GetDeviceStatus {
  device_sn: string,
  nickname?: string,
  device_name?: string,
  online?: boolean,
  flight_area_status: FlightAreaStatus,
}

const MAP_API_PREFIX = '/map/api/v1'

const workspaceId: string = localStorage.getItem(ELocalStorageKey.WorkspaceId) || ''

export async function getFlightAreaList (): Promise<IWorkspaceResponse<GetFlightArea[]>> {
  const resp = await request.get(`${MAP_API_PREFIX}/workspaces/${workspaceId}/flight-areas`)
  return resp.data
}

export async function changeFlightAreaStatus (area_id: string, status: boolean): Promise<IWorkspaceResponse<any>> {
  const resp = await request.put(`${MAP_API_PREFIX}/workspaces/${workspaceId}/flight-area/${area_id}`, { status })
  return resp.data
}

export async function saveFlightArea (body: PostFlightAreaBody): Promise<IWorkspaceResponse<any>> {
  const resp = await request.post(`${MAP_API_PREFIX}/workspaces/${workspaceId}/flight-area`, body)
  return resp.data
}

export async function deleteFlightArea (area_id: string): Promise<IWorkspaceResponse<any>> {
  const resp = await request.delete(`${MAP_API_PREFIX}/workspaces/${workspaceId}/flight-area/${area_id}`)
  return resp.data
}

export async function syncFlightArea (device_sn: string[]): Promise<IWorkspaceResponse<any>> {
  const resp = await request.post(`${MAP_API_PREFIX}/workspaces/${workspaceId}/flight-area/sync`, { device_sn })
  return resp.data
}

export async function getDeviceStatus (): Promise<IWorkspaceResponse<GetDeviceStatus[]>> {
  const resp = await request.get(`${MAP_API_PREFIX}/workspaces/${workspaceId}/device-status`)
  return resp.data
}
