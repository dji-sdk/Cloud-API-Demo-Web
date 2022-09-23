import request, { IWorkspaceResponse, IListWorkspaceResponse } from '/@/api/http/request'
import { DeviceValue, DOMAIN } from '/@/types/device'
import { DeviceLogUploadStatusEnum } from '/@/types/device-log'
import { ELocalStorageKey } from '/@/types'
import { CURRENT_CONFIG } from '/@/api/http/config'

const MNG_API_PREFIX = '/manage/api/v1'

const workspaceId: string = localStorage.getItem(ELocalStorageKey.WorkspaceId) || ''

export interface GetDeviceUploadLogListParams {
  device_sn: string,
  page: number,
  page_size: number,
  begin_time?: number, // 开始时间
  end_time?: number, // 结束时间
  status?: DeviceLogUploadStatusEnum, // 日志上传状态
  logs_information?: string // 搜索内容
}

export interface BriefDeviceInfo {
  sn: string,
  device_model: DeviceValue,
  device_callsign: string
}

export interface DeviceLogProgressInfo{
  device_sn: string,
  device_model_domain: DOMAIN,
  progress: number, // 进度
  result: number, // 上传结果
  upload_rate: number, // 上传速率
  status: DeviceLogUploadStatusEnum // 上传状态
}

export interface DeviceLogItem {
  boot_index: number, // 日志id
  start_time: number, // 日志开始时间
  end_time: number, // 日志结束时间
  size: number // 日志大小
}

export interface DeviceLogFileInfo {
  device_sn: string,
  module: DOMAIN,
  result: number,
  object_key: string,
  file_id: string,
  list: DeviceLogItem[]
}

export interface DeviceLogFileListInfo {
  files: DeviceLogFileInfo[]
}

export interface GetDeviceUploadLogListRsp {
  logs_id: string, // 记录id
  happen_time: string, // 发生时间
  user_name: string, // 用户
  logs_information: string, // 异常描述
  create_time: string, // 上传时间
  status:DeviceLogUploadStatusEnum, // 日志上传状态
  device_topo:{ // 设备topo
    hosts: BriefDeviceInfo[],
    parents: BriefDeviceInfo[]
  },
  logs_progress: DeviceLogProgressInfo[], // 日志上传进度
  device_logs: DeviceLogFileListInfo // 设备日志
}

/**
 * 获取设备上传日志列表信息
 * @param params
 * @returns
 */
export async function getDeviceUploadLogList (params: GetDeviceUploadLogListParams): Promise<IListWorkspaceResponse<GetDeviceUploadLogListRsp>> {
  const resp = await request.get(`${MNG_API_PREFIX}/workspaces/${workspaceId}/devices/${params.device_sn}/logs-uploaded`, {
    params: params
  })
  return resp.data
}

export interface GetDeviceLogListParams{
  device_sn: string,
  domain: DOMAIN[]
}

/**
 * 获取设备日志列表信息
 * @param params
 * @returns
 */
export async function getDeviceLogList (params: GetDeviceLogListParams): Promise<IWorkspaceResponse<DeviceLogFileListInfo>> {
  const domain = params.domain ? params.domain : []
  const resp = await request.get(`${MNG_API_PREFIX}/workspaces/${workspaceId}/devices/${params.device_sn}/logs`, {
    params: {
      domain_list: domain.join(',')
    }
  })
  return resp.data
}

export interface UploadDeviceLogBody {
  device_sn: string
  happen_time: string // 发生时间
  logs_information: string // 异常描述
  files:{
    list: DeviceLogItem[],
    device_sn: string,
    module: DOMAIN
  }[]
}

/**
 * 上传设备日志
 * @param body
 * @returns
 */
export async function postDeviceUpgrade (body: UploadDeviceLogBody): Promise<IWorkspaceResponse<{}>> {
  const resp = await request.post(`${MNG_API_PREFIX}/workspaces/${workspaceId}/devices/${body.device_sn}/logs`, body)
  return resp.data
}

export type DeviceLogUploadAction = 'cancel'

export interface CancelDeviceLogUploadBody {
  device_sn: string
  status: DeviceLogUploadAction
  module_list: DOMAIN[]
}

// 取消上传
export async function cancelDeviceLogUpload (body: CancelDeviceLogUploadBody): Promise<IWorkspaceResponse<{}>> {
  const url = `${MNG_API_PREFIX}/workspaces/${workspaceId}/devices/${body.device_sn}/logs`
  const result = await request.delete(url, {
    data: body
  })
  return result.data
}

export interface DeleteDeviceLogUploadBody {
  device_sn: string
  logs_id: string
}

// 取消上传
export async function deleteDeviceLogUpload (body: DeleteDeviceLogUploadBody): Promise<IWorkspaceResponse<{}>> {
  const url = `${MNG_API_PREFIX}/workspaces/${workspaceId}/devices/${body.device_sn}/logs/${body.logs_id}`
  const result = await request.delete(url, {
    data: body
  })
  return result.data
}

export interface GetUploadDeviceLogUrlParams{
  logs_id: string,
  file_id: string,
}

// export interface GetUploadDeviceLogRsp{
//   url: string
// }

/**
 * 获取设备上传日志url
 * @param params
 * @returns
 */
export async function getUploadDeviceLogUrl (params: GetUploadDeviceLogUrlParams): Promise<IWorkspaceResponse<string>> {
  const resp = await request.get(`${MNG_API_PREFIX}/workspaces/${workspaceId}/logs/${params.logs_id}/url/${params.file_id}`)
  return resp.data
}
