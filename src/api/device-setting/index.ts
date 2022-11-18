import request, { IWorkspaceResponse } from '/@/api/http/request'
import { ELocalStorageKey } from '/@/types'
import { NightLightsStateEnum, DistanceLimitStatus, ObstacleAvoidance } from '/@/types/device-setting'

const MNG_API_PREFIX = '/manage/api/v1'
const workspaceId: string = localStorage.getItem(ELocalStorageKey.WorkspaceId) || ''

export interface PutDevicePropsBody {
  night_lights_state?: NightLightsStateEnum;// 夜航灯开关
  height_limit?: number;// 限高设置
  distance_limit_status?: DistanceLimitStatus;// 限远开关
  obstacle_avoidance?: ObstacleAvoidance;// 飞行器避障开关设置
}

/**
 * 设置设备属性
 * @param params
 * @returns
 */
//  /manage/api/v1/devices/{{workspace_id}}/devices/{{device_sn}}/property
export async function putDeviceProps (deviceSn: string, body: PutDevicePropsBody): Promise<IWorkspaceResponse<{}>> {
  const resp = await request.put(`${MNG_API_PREFIX}/devices/${workspaceId}/devices/${deviceSn}/property`, body)
  return resp.data
}
