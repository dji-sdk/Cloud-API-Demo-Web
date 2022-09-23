import { commonColor } from '/@/utils/color'

export interface DeviceValue {
  key: string; // 'domain-type-subtype'
  domain: string; // 表示一个领域，作为一个命名空间，暂时分 飞机类-0, 负载类-1,RC类-2,机场类-3 4种
  type: number; // 设备类型枚举
  sub_type: number; // 设备类型枚举 负载一般表示镜头
}

// domain
export enum DOMAIN {
  DRONE = '0', // 飞行器
  PAYLOAD = '1', // 负载
  RC = '2', // 遥控
  DOCK = '3', // 机场
}

// DJI飞机类型
export enum DRONE_TYPE {
  M30 = 67,
  M300 = 60,
  Phantom4 = 11,
  Phantom4Pro = 18,
  Phantom4RTK = 59,
  Phantom4Advanced = 27,
  Mavic3EnterpriseAdvanced= 77,
}

// DJI负载类型枚举值
export enum PAYLOAD_TYPE {
  FPV = 39,
  H20 = 42,
  H20T = 43,
  H20N = 61,
  EP600 = 50,
  EP800 = 90742,
  M30D = 52,
  M30T = 53,
  XT2 = 26,
  XTS = 41,
  Z30 = 20,
  DockTopCamera = 165,

  M3E = 66,
  M3T = 67,
  // UNKNOWN = 65535
}

// RC type
export enum RC_TYPE {
  RC = 56,
  RCPlus = 119,
  RC144 = 144,
}

// DOCK type
export enum DOCK_TYPE {
  Dock = 1,
}

// 设备sub_type 从0升序
export enum DEVICE_SUB_TYPE {
  ZERO,
  ONE,
  TWO,
  THREE,
  UNKNOWN = 65535,
}

export const DEVICE_MODEL_KEY = {
  M30: `${DOMAIN.DRONE}-${DRONE_TYPE.M30}-${DEVICE_SUB_TYPE.ZERO}`,
  M30T: `${DOMAIN.DRONE}-${DRONE_TYPE.M30}-${DEVICE_SUB_TYPE.ONE}`,

  M3E: `${DOMAIN.DRONE}-${DRONE_TYPE.Mavic3EnterpriseAdvanced}-${DEVICE_SUB_TYPE.ZERO}`,
  M3T: `${DOMAIN.DRONE}-${DRONE_TYPE.Mavic3EnterpriseAdvanced}-${DEVICE_SUB_TYPE.ONE}`,

  M300: `${DOMAIN.DRONE}-${DRONE_TYPE.M300}-${DEVICE_SUB_TYPE.ZERO}`,
  Phantom4: `${DOMAIN.DRONE}-${DRONE_TYPE.Phantom4}-${DEVICE_SUB_TYPE.ZERO}`,
  Phantom4Pro: `${DOMAIN.DRONE}-${DRONE_TYPE.Phantom4Pro}-${DEVICE_SUB_TYPE.ZERO}`,
  Phantom4RTK: `${DOMAIN.DRONE}-${DRONE_TYPE.Phantom4RTK}-${DEVICE_SUB_TYPE.ZERO}`,
  Phantom4Advanced: `${DOMAIN.DRONE}-${DRONE_TYPE.Phantom4Advanced}-${DEVICE_SUB_TYPE.ZERO}`,

  FPV: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.FPV}-${DEVICE_SUB_TYPE.ZERO}`,
  H20: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.H20}-${DEVICE_SUB_TYPE.ZERO}`,
  H20T: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.H20T}-${DEVICE_SUB_TYPE.ZERO}`,
  H20N: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.H20N}-${DEVICE_SUB_TYPE.ZERO}`,
  EP600: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.EP600}-${DEVICE_SUB_TYPE.UNKNOWN}`,
  EP800: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.EP800}-${DEVICE_SUB_TYPE.ZERO}`,
  M30Camera: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.M30D}-${DEVICE_SUB_TYPE.ZERO}`,
  M30TCamera: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.M30T}-${DEVICE_SUB_TYPE.ZERO}`,

  M3ECamera: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.M3E}-${DEVICE_SUB_TYPE.ZERO}`,
  M3TCamera: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.M3T}-${DEVICE_SUB_TYPE.ZERO}`,
  // M3MCamera: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.M3M}-${DEVICE_SUB_TYPE.ZERO}`,

  XT2: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.XT2}-${DEVICE_SUB_TYPE.ZERO}`,
  XTS: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.XTS}-${DEVICE_SUB_TYPE.ZERO}`,
  Z30: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.Z30}-${DEVICE_SUB_TYPE.ZERO}`,
  DockTopCamera: `${DOMAIN.PAYLOAD}-${PAYLOAD_TYPE.DockTopCamera}-${DEVICE_SUB_TYPE.ZERO}`,

  RC: `${DOMAIN.RC}-${RC_TYPE.RC}-${DEVICE_SUB_TYPE.ZERO}`,
  RCPlus: `${DOMAIN.RC}-${RC_TYPE.RCPlus}-${DEVICE_SUB_TYPE.ZERO}`,

  Dock: `${DOMAIN.DOCK}-${DOCK_TYPE.Dock}-${DEVICE_SUB_TYPE.ZERO}`,
}

export const DEVICE_NAME = {
  // drone
  [DEVICE_MODEL_KEY.M30]: 'M30',
  [DEVICE_MODEL_KEY.M30T]: 'M30T',
  [DEVICE_MODEL_KEY.M3E]: 'Mavic 3E',
  [DEVICE_MODEL_KEY.M3T]: 'Mavic 3T',
  // [DEVICE_MODEL_KEY.M3M]: 'Mavic 3M',
  [DEVICE_MODEL_KEY.M300]: 'M300 RTK',
  [DEVICE_MODEL_KEY.Phantom4]: 'Phantom 4',
  [DEVICE_MODEL_KEY.Phantom4Pro]: 'Phantom 4 Pro',
  [DEVICE_MODEL_KEY.Phantom4RTK]: 'Phantom 4 RTK',
  [DEVICE_MODEL_KEY.Phantom4Advanced]: 'Phantom 4 Advanced',

  // payload
  [DEVICE_MODEL_KEY.FPV]: 'FPV',
  [DEVICE_MODEL_KEY.H20]: 'H20',
  [DEVICE_MODEL_KEY.H20T]: 'H20T',
  [DEVICE_MODEL_KEY.H20N]: 'H20N',
  [DEVICE_MODEL_KEY.EP600]: 'P1',
  [DEVICE_MODEL_KEY.EP800]: 'L1',
  [DEVICE_MODEL_KEY.M30Camera]: 'M30 Camera',
  [DEVICE_MODEL_KEY.M30TCamera]: 'M30T Camera',
  [DEVICE_MODEL_KEY.M3ECamera]: 'Mavic 3E',
  [DEVICE_MODEL_KEY.M3TCamera]: 'Mavic 3T',
  // [DEVICE_MODEL_KEY.M3MCamera]: 'Mavic 3M',
  [DEVICE_MODEL_KEY.XT2]: 'XT2',
  [DEVICE_MODEL_KEY.XTS]: 'XTS',
  [DEVICE_MODEL_KEY.Z30]: 'Z30',
  [DEVICE_MODEL_KEY.DockTopCamera]: 'Dock Camera',

  // rc
  [DEVICE_MODEL_KEY.RC]: 'RC',
  [DEVICE_MODEL_KEY.RCPlus]: 'RC Plus',

  // dock
  [DEVICE_MODEL_KEY.Dock]: 'Dock',
}

// 固件升级类型
export enum DeviceFirmwareTypeEnum {
  ToUpgraded = 3, // 普通升级
  ConsistencyUpgrade =2, // 一致性升级
}

// 固件升级状态
export enum DeviceFirmwareStatusEnum {
  None = 1, // 无需升级
  ToUpgraded = 2, // 待升级
  ConsistencyUpgrade = 3, // 一致性升级
  DuringUpgrade = 4, // 升级中
}

export const DeviceFirmwareStatus = {
  [DeviceFirmwareStatusEnum.None]: '',
  [DeviceFirmwareStatusEnum.ToUpgraded]: '待升级',
  [DeviceFirmwareStatusEnum.ConsistencyUpgrade]: '一致性升级',
  [DeviceFirmwareStatusEnum.DuringUpgrade]: '升级中',
}

export const DeviceFirmwareStatusColor = {
  [DeviceFirmwareStatusEnum.None]: commonColor.WHITE,
  [DeviceFirmwareStatusEnum.ToUpgraded]: commonColor.BLUE,
  [DeviceFirmwareStatusEnum.ConsistencyUpgrade]: commonColor.WARN,
  [DeviceFirmwareStatusEnum.DuringUpgrade]: commonColor.NORMAL,
}

export interface Device {
  device_name: string,
  device_sn: string,
  nickname: string,
  firmware_version: string,
  firmware_status: DeviceFirmwareStatusEnum,
  status: string,
  workspace_name: string,
  bound_time: string,
  login_time: string,
  children?: Device[],
  domain: string,
  firmware_progress?: number, // 升级进度
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

// TODO: 设备拓扑管理优化
// 设备信息
export interface DeviceInfoType {
  gateway: GatewayOsd, // 遥控器
  dock: DockOsd, // 机场
  device: DeviceOsd, // 飞机
}
