import request, { IWorkspaceResponse } from '/@/api/http/request'
import { ELocalStorageKey } from '/@/types'

// DRC 链路
const DRC_API_PREFIX = '/control/api/v1'
const workspaceId: string = localStorage.getItem(ELocalStorageKey.WorkspaceId) || ''

export interface PostDrcBody {
  client_id?: string // token过期时，用于续期则必填
  expire_sec?: number // 过期时间，单位秒，默认3600
}

export interface DrcParams {
  address: string
  username: string
  password: string
  client_id: string
  expire_time: number // 过期时间
  enable_tls: boolean // 是否开启tls
}

// 获取 mqtt 连接认证
export async function postDrc (body: PostDrcBody): Promise<IWorkspaceResponse<DrcParams>> {
  const resp = await request.post(`${DRC_API_PREFIX}/workspaces/${workspaceId}/drc/connect`, body)
  return resp.data
}

export interface DrcEnterBody {
  client_id: string
  dock_sn: string
  expire_sec?: number // 过期时间，单位秒，默认3600
  device_info?: {
    osd_frequency?: number
    hsi_frequency?: number
  }
}

export interface DrcEnterResp {
  sub: string[] // 需要订阅接收的topic
  pub: string[] // 推送的topic地址
}

// 进入飞行控制 （建立drc连接&获取云控控制权）
export async function postDrcEnter (body: DrcEnterBody): Promise<IWorkspaceResponse<DrcEnterResp>> {
  const resp = await request.post(`${DRC_API_PREFIX}/workspaces/${workspaceId}/drc/enter`, body)
  return resp.data
}

export interface DrcExitBody {
  client_id: string
  dock_sn: string
}

// 退出飞行控制 （退出drc连接&退出云控控制权）
export async function postDrcExit (body: DrcExitBody): Promise<IWorkspaceResponse<null>> {
  const resp = await request.post(`${DRC_API_PREFIX}/workspaces/${workspaceId}/drc/exit`, body)
  return resp.data
}
