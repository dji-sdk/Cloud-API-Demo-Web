import { Firmware, FirmwareQueryParam, FirmwareUploadParam } from '/@/types/device-firmware'
import request, { CommonListResponse, IListWorkspaceResponse, IPage, IWorkspaceResponse } from '/@/api/http/request'
import { Device } from '/@/types/device'

const HTTP_PREFIX = '/manage/api/v1'

// login
export interface LoginBody {
 username: string,
 password: string,
 flag: number,
}
export interface BindBody {
  device_sn: string,
  user_id: string,
  workspace_id: string,
  domain?: string
}
export interface HmsQueryBody {
  sns: string[],
  children_sn: string,
  device_sn: string,
  language: string,
  level: number | string,
  begin_time: number,
  end_time: number,
  message: string,
  domain: number,
}

export const login = async function (body: LoginBody): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/login`
  const result = await request.post(url, body)
  return result.data
}

// Refresh Token
export const refreshToken = async function (body: {}): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/token/refresh`
  const result = await request.post(url, body)
  return result.data
}

// Get Platform Info
export const getPlatformInfo = async function (): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/workspaces/current`
  const result = await request.get(url)
  return result.data
}

// Get User Info
export const getUserInfo = async function (): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/users/current`
  const result = await request.get(url)
  return result.data
}

// Get Device Topo
export const getDeviceTopo = async function (workspace_id: string): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/devices/${workspace_id}/devices`
  const result = await request.get(url)
  return result.data
}

// Get Livestream Capacity
export const getLiveCapacity = async function (body: {}): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/live/capacity`
  const result = await request.get(url, body)
  return result.data
}

// Start Livestream
export const startLivestream = async function (body: {}): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/live/streams/start`
  const result = await request.post(url, body)
  return result.data
}

// Stop Livestream
export const stopLivestream = async function (body: {}): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/live/streams/stop`
  const result = await request.post(url, body)
  return result.data
}
// Update Quality
export const setLivestreamQuality = async function (body: {}): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/live/streams/update`
  const result = await request.post(url, body)
  return result.data
}

export const getAllUsersInfo = async function (wid: string, body: IPage): Promise<CommonListResponse<any>> {
  const url = `${HTTP_PREFIX}/users/${wid}/users?&page=${body.page}&page_size=${body.page_size}`
  const result = await request.get(url)
  return result.data
}

export const updateUserInfo = async function (wid: string, user_id: string, body: {}): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/users/${wid}/users/${user_id}`
  const result = await request.put(url, body)
  return result.data
}

export const bindDevice = async function (body: BindBody): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/devices/${body.device_sn}/binding`
  const result = await request.post(url, body)
  return result.data
}

export const unbindDevice = async function (device_sn: string): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/devices/${device_sn}/unbinding`
  const result = await request.delete(url)
  return result.data
}

export const getDeviceBySn = async function (workspace_id: string, device_sn: string): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/devices/${workspace_id}/devices/${device_sn}`
  const result = await request.get(url)
  return result.data
}

/**
 * 获取绑定设备信息
 * @param workspace_id
 * @param body
 * @param domain
 * @returns
 */
export const getBindingDevices = async function (workspace_id: string, body: IPage, domain: number): Promise<IListWorkspaceResponse<Device>> {
  const url = `${HTTP_PREFIX}/devices/${workspace_id}/devices/bound?&page=${body.page}&page_size=${body.page_size}&domain=${domain}`
  const result = await request.get(url)
  return result.data
}

export const updateDevice = async function (body: {}, workspace_id: string, device_sn: string): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/devices/${workspace_id}/devices/${device_sn}`
  const result = await request.put(url, body)
  return result.data
}

export const getUnreadDeviceHms = async function (workspace_id: string, device_sn: string): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/devices/${workspace_id}/devices/hms/${device_sn}`
  const result = await request.get(url)
  return result.data
}

export const updateDeviceHms = async function (workspace_id: string, device_sn: string): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/devices/${workspace_id}/devices/hms/${device_sn}`
  const result = await request.put(url)
  return result.data
}

export const getDeviceHms = async function (body: HmsQueryBody, workspace_id: string, pagination: IPage): Promise<IListWorkspaceResponse<any>> {
  let url = `${HTTP_PREFIX}/devices/${workspace_id}/devices/hms?page=${pagination.page}&page_size=${pagination.page_size}` +
    `&level=${body.level ?? ''}&begin_time=${body.begin_time ?? ''}&end_time=${body.end_time ?? ''}&message=${body.message ?? ''}&language=${body.language}`
  body.sns.forEach((sn: string) => {
    if (sn !== '') {
      url = url.concat(`&device_sn=${sn}`)
    }
  })
  const result = await request.get(url)
  return result.data
}

export const changeLivestreamLens = async function (body: {}): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/live/streams/switch`
  const result = await request.post(url, body)
  return result.data
}

export const getFirmwares = async function (workspace_id: string, page: IPage, body: FirmwareQueryParam): Promise<IListWorkspaceResponse<Firmware>> {
  const url = `${HTTP_PREFIX}/workspaces/${workspace_id}/firmwares?page=${page.page}&page_size=${page.page_size}` +
    `&device_name=${body.device_name}&product_version=${body.product_version}&status=${body.firmware_status ?? ''}`
  const result = await request.get(url)
  return result.data
}

export const importFirmareFile = async function (workspaceId: string, param: FormData): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/workspaces/${workspaceId}/firmwares/file/upload`
  const result = await request.post(url, param)
  return result.data
}

export const changeFirmareStatus = async function (workspaceId: string, firmwareId: string, param: {status: boolean}): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/workspaces/${workspaceId}/firmwares/${firmwareId}`
  const result = await request.put(url, param)
  return result.data
}
