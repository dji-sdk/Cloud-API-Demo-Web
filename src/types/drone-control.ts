import { ControlSource } from './device'
import { ECommanderModeLostAction, ERthMode, LostControlActionInCommandFLight, WaylineLostControlActionInCommandFlight } from '/@/api/drone-control/drone'

export enum ControlSourceChangeType {
  Flight = 1,
  Payload = 2,
}

// 控制权变化消息
export interface ControlSourceChangeInfo {
  sn: string,
  type: ControlSourceChangeType,
  control_source: ControlSource
}

// 飞向目标点结果
export interface FlyToPointMessage {
  sn: string,
  result: number,
  message: string,
}

// 一键起飞结果
export interface TakeoffToPointMessage {
  sn: string,
  result: number,
  message: string,
}

// 设备端退出drc模式
export interface DrcModeExitNotifyMessage {
  sn: string,
  result: number,
  message: string,
}

// 飞行控制模式状态
export interface DrcStatusNotifyMessage {
  sn: string,
  result: number,
  message: string,
}

export const WaylineLostControlActionInCommandFlightOptions = [
  { label: 'Continue', value: WaylineLostControlActionInCommandFlight.CONTINUE },
  { label: 'Execute Lost Action', value: WaylineLostControlActionInCommandFlight.EXEC_LOST_ACTION }
]

export const LostControlActionInCommandFLightOptions = [
  { label: 'Return Home', value: LostControlActionInCommandFLight.RETURN_HOME },
  { label: 'Hover', value: LostControlActionInCommandFLight.HOVER },
  { label: 'Landing', value: LostControlActionInCommandFLight.Land }
]

export const RthModeInCommandFlightOptions = [
  { label: 'Smart Height', value: ERthMode.SMART },
  { label: 'Setting Height', value: ERthMode.SETTING }
]

export const CommanderModeLostActionInCommandFlightOptions = [
  { label: 'Continue', value: ECommanderModeLostAction.CONTINUE },
  { label: 'Execute Lost Action', value: ECommanderModeLostAction.EXEC_LOST_ACTION }
]

export const CommanderFlightModeInCommandFlightOptions = [
  { label: 'Smart Height', value: ERthMode.SMART },
  { label: 'Setting Height', value: ERthMode.SETTING }
]

// 云台重置模式
export enum GimbalResetMode {
  Recenter = 0,
  Down = 1,
  RecenterGimbalPan = 2,
  PitchDown = 3,
}

export const GimbalResetModeOptions = [
  { label: 'Gimbal Recenter', value: GimbalResetMode.Recenter },
  { label: 'Gimbal down', value: GimbalResetMode.Down },
  { label: 'Recenter Gimbal Pan', value: GimbalResetMode.RecenterGimbalPan },
  { label: 'Gimbal Pitch Down', value: GimbalResetMode.PitchDown }
]
