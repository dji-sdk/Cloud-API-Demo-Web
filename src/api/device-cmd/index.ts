import request, { IWorkspaceResponse } from '/@/api/http/request'
import { DeviceCmd } from '/@/types/device-cmd'

const CMD_API_PREFIX = '/control/api/v1'

export interface SendCmdParams {
  dock_sn: string, // 机场cn
  device_cmd: DeviceCmd // 指令
}

/**
 * 发送机场控制指令
 * @param params
 * @returns
 */
// /control/api/v1/devices/{dock_sn}/jobs/{service_identifier}
export async function postSendCmd (params: SendCmdParams): Promise<IWorkspaceResponse<{}>> {
  const resp = await request.post(`${CMD_API_PREFIX}/devices/${params.dock_sn}/jobs/${params.device_cmd}`)
  return resp.data
}
