import request, { IWorkspaceResponse } from '/@/api/http/request'
import { CameraType, CameraMode } from '/@/types/live-stream'
import { GimbalResetMode } from '/@/types/drone-control'
// import { ELocalStorageKey } from '/@/types'

const API_PREFIX = '/control/api/v1'
// const workspaceId: string = localStorage.getItem(ELocalStorageKey.WorkspaceId) || '

export interface PostPayloadAuthBody {
  payload_index: string
}

// 获取负载控制权
export async function postPayloadAuth (sn: string, body: PostPayloadAuthBody): Promise<IWorkspaceResponse<null>> {
  const resp = await request.post(`${API_PREFIX}/devices/${sn}/authority/payload`, body)
  return resp.data
}

// TODO: 画面拖动控制
export enum PayloadCommandsEnum {
  CameraModeSwitch = 'camera_mode_switch',
  CameraPhotoTake = 'camera_photo_take',
  CameraRecordingStart = 'camera_recording_start',
  CameraRecordingStop = 'camera_recording_stop',
  CameraFocalLengthSet = 'camera_focal_length_set',
  GimbalReset = 'gimbal_reset',
  CameraAim = 'camera_aim'
}

export interface PostCameraModeBody {
  payload_index: string
  camera_mode: CameraMode
}

export interface PostCameraPhotoBody {
  payload_index: string
}

export interface PostCameraRecordingBody {
  payload_index: string
}

export interface DeleteCameraRecordingParams {
  payload_index: string
}

export interface PostCameraFocalLengthBody {
  payload_index: string,
  camera_type: CameraType,
  zoom_factor: number
}

export interface PostGimbalResetBody{
  payload_index: string,
  reset_mode: GimbalResetMode,
}

export interface PostCameraAimBody{
  payload_index: string,
  camera_type: CameraType,
  locked: boolean,
  x: number,
  y: number,
}

export type PostPayloadCommandsBody = {
  cmd: PayloadCommandsEnum.CameraModeSwitch,
  data: PostCameraModeBody
} | {
  cmd: PayloadCommandsEnum.CameraPhotoTake,
  data: PostCameraPhotoBody
} | {
  cmd: PayloadCommandsEnum.CameraRecordingStart,
  data: PostCameraRecordingBody
} | {
  cmd: PayloadCommandsEnum.CameraRecordingStop,
  data: DeleteCameraRecordingParams
} | {
  cmd: PayloadCommandsEnum.CameraFocalLengthSet,
  data: PostCameraFocalLengthBody
} | {
  cmd: PayloadCommandsEnum.GimbalReset,
  data: PostGimbalResetBody
} | {
  cmd: PayloadCommandsEnum.CameraAim,
  data: PostCameraAimBody
}

// 发送负载名称
export async function postPayloadCommands (sn: string, body: PostPayloadCommandsBody): Promise<IWorkspaceResponse<null>> {
  const resp = await request.post(`${API_PREFIX}/devices/${sn}/payload/commands`, body)
  return resp.data
}
