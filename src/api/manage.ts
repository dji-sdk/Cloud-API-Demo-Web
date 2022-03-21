import request, { IWorkspaceResponse } from '/@/api/http/request'
const HTTP_PREFIX = '/manage/api/v1'

// login
interface loginBody {
 username: string,
 password: string
}
export const login = async function (body: loginBody): Promise<IWorkspaceResponse<any>> {
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
export const getPlatformInfo = async function (body: {}): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/workspaces/current`
  const result = await request.get(url, body)
  return result.data
}

// Get User Info
export const getUserInfo = async function (body: {}): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/users/current`
  const result = await request.get(url, body)
  return result.data
}

// Get Device Topo
export const getDeviceTopo = async function (body: {}): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/devices/devices`
  const result = await request.get(url, body)
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
