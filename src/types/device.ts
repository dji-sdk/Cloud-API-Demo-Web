import { EDeviceTypeName } from ".";

export interface Device {
  device_name: string,
  device_sn: string,
  nickname: string,
  firmware_version: string,
  status: string,
  workspace_name: string,
  bound_time: string,
  login_time: string,
  children?: Device[]
  domain: string
}

export interface DeviceStatus {
  sn: string,
  online_status: boolean,
  device_callsign: string,
  user_id: string,
  user_callsign: string
  bound_status: boolean,
  model: string,
  gateway_sn: string,
  domain: string
}

export interface OSDVisible {
  sn: string,
  model: string,
  callsign: string,
  visible: boolean,
  is_dock: boolean,
  gateway_sn: string,
  gateway_callsign: string,
}

export interface GatewayOsd {
  capacity_percent: string,
  transmission_signal_quality: string,
  longitude: number,
  latitude: number,
}
export interface DeviceOsd {
  longitude: number,
  latitude: number,
  gear: number,
  mode_code: number,
  height: string,
  home_distance: string,
  horizontal_speed: string,
  vertical_speed: string,
  wind_speed: string,
  wind_direction: string,
  elevation: string,
  position_state: {
    gps_number: string,
    is_fixed: number,
    rtk_number: string
  },
  battery: {
    capacity_percent: string,
    landing_power: string,
    remain_flight_time: number,
    return_home_power: string,
  }
}

export interface DockOsd {
  media_file_detail: {
    remain_upload: number
  },
  sdr: {
    up_quality: string,
    down_quality: string,
    frequency_band: number,
  },
  network_state: {
    type: number,
    quality: number,
    rate: number, 
  },
  drone_in_dock: number,
  drone_charge_state: {
    state: number,
    capacity_percent: string,
  },
  rainfall: string,
  wind_speed: string,
  environment_temperature: string,
  environment_humidity: string
  temperature: string,
  humidity: string,
  latitude: number,
  longitude: number,
  height: number,
  job_number: number,
  acc_time: number,
  first_power_on: number,
  positionState: {
    gps_number: string,
    is_fixed: number,
    rtk_number: string,
    is_calibration: number,
    quality: number,
  },
  storage: {
    total: number,
    used: number,
  },
  electric_supply_voltage: number,
  working_voltage: string,
  working_current: string,
  backup_battery_voltage: number,
  mode_code: number,
  cover_state: number,
  supplement_light_state: number,
  putter_state: number,
  sub_device: {
    device_sn: string,
    device_model_key: string,
    device_online_status: number,
    device_paired: number,
  },
}

export enum EModeCode {
  Standby,
  Preparing,
  Ready,
  Manual,
  Automatic,
  Waypoint,
  Panoramic,
  Active_Track,
  ADS_B,
  Return_To_Home,
  Landing,
  Forced_Landing,
  Three_Blades_Landing,
  Upgrading,
  Disconnected,
}

export enum EGear {
  A,
  P,
  NAV,
  FPV,
  FARM,
  S,
  F,
  M,
  G,
  T
}

export enum EDeviceType {
  M30 = '0-67-0' as any,
  M30T = '0-67-1' as any,
  M300 = '0-60-0' as any,
  Z30 = '1-20-0' as any,
  XT2 = '1-26-0' as any,
  FPV = '1-39-0' as any,
  XTS = '1-41-0' as any,
  H20 = '1-42-0' as any,
  H20T = '1-43-0' as any,
  P1 = '1-50-65535' as any,
  M30_Camera = '1-52-0' as any,
  M30T_Camera = '1-53-0' as any,
  H20N = '1-61-0' as any,
  DJI_Dock_Camera = '1-165-0' as any,
  L1 = '1-90742-0' as any,
}

export enum EDockModeCode {
  Disconnected = -1,
  Idle,
  Debugging,
  Remote_Debugging,
  Upgrading,
  Working,
}

export interface DeviceHms {
  hms_id: string,
  tid: string,
  bid: string,
  sn: string,
  level: number,
  module: number,
  key: string,
  message_en: string,
  message_zh: string,
  create_time: string,
  update_time: string,
  domain: string
}