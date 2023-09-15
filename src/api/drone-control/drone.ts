import request, { IWorkspaceResponse } from '/@/api/http/request'
// import { ELocalStorageKey } from '/@/types'

const API_PREFIX = '/control/api/v1'
// const workspaceId: string = localStorage.getItem(ELocalStorageKey.WorkspaceId) || '

// 获取飞行控制权
export async function postFlightAuth (sn: string): Promise<IWorkspaceResponse<null>> {
  const resp = await request.post(`${API_PREFIX}/devices/${sn}/authority/flight`)
  return resp.data
}
export enum WaylineLostControlActionInCommandFlight {
  CONTINUE = 0,
  EXEC_LOST_ACTION = 1
}
export enum LostControlActionInCommandFLight {
  HOVER = 0, // 悬停
  Land = 1, // 着陆
  RETURN_HOME = 2, // 返航
}
export enum ERthMode {
  SMART = 0,
  SETTING = 1
}
export enum ECommanderModeLostAction {
  CONTINUE = 0,
  EXEC_LOST_ACTION = 1
}
export enum ECommanderFlightMode {
  SMART = 0,
  SETTING = 1
}
export interface PointBody {
  latitude: number;
  longitude: number;
  height: number;
}
export interface PostFlyToPointBody {
  max_speed: number,
  points: PointBody[]
}

// 飞向目标点
export async function postFlyToPoint (sn: string, body: PostFlyToPointBody): Promise<IWorkspaceResponse<null>> {
  const resp = await request.post(`${API_PREFIX}/devices/${sn}/jobs/fly-to-point`, body)
  return resp.data
}

// 停止飞向目标点
export async function deleteFlyToPoint (sn: string): Promise<IWorkspaceResponse<null>> {
  const resp = await request.delete(`${API_PREFIX}/devices/${sn}/jobs/fly-to-point`)
  return resp.data
}

export interface PostTakeoffToPointBody{
  target_height: number;
  target_latitude: number;
  target_longitude: number;
  security_takeoff_height: number; // 安全起飞高
  max_speed: number; // flyto过程中能达到的最大速度, 单位m/s 跟飞机档位有关
  rc_lost_action: LostControlActionInCommandFLight; // 失控行为
  rth_altitude: number; // 返航高度
  exit_wayline_when_rc_lost: WaylineLostControlActionInCommandFlight;
  rth_mode: ERthMode;
  commander_mode_lost_action: ECommanderModeLostAction;
  commander_flight_mode: ECommanderFlightMode;
  commander_flight_height: number;
}

// 一键起飞
export async function postTakeoffToPoint (sn: string, body: PostTakeoffToPointBody): Promise<IWorkspaceResponse<null>> {
  const resp = await request.post(`${API_PREFIX}/devices/${sn}/jobs/takeoff-to-point`, body)
  return resp.data
}
