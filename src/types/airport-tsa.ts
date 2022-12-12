// 机场存储容量：总容量（单位：KB）、已使用（单位：KB）
export interface AirportStorage {
  total: number, // 单位：KB
  used: number
}

// 舱盖状态
export enum CoverStateEnum {
  Close = 0, // 关闭
  Open = 1, // 打开
  HalfOpen = 2, // 半打开
  Failed = 3 // 失败
}

// 推杆状态
export enum PutterStateEnum {
  Close = 0, // 关闭
  Open = 1, // 打开
  HalfOpen = 2, // 半打开
  Failed = 3 // 失败
}

// 充电状态
export enum ChargeStateEnum {
  NotCharge = 0, // 空闲
  Charge = 1, // 正在充电
}

export interface DroneChargeState {
  state: ChargeStateEnum,
  capacity_percent: string,
}

// 补光灯状态
export enum SupplementLightStateEnum {
  Close = 0, // 关闭
  Open = 1, // 打开
}

// 机场声光报警状态
export enum AlarmModeEnum {
  CLOSE = 0, // 关闭
  OPEN = 1, // 开启
}

// 电池保养
export enum BatteryStoreModeEnum {
  BATTERY_PLAN_STORE = 1, // 电池计划存储策略
  BATTERY_EMERGENCY_STORE = 2, // 电池应急存储策略
}

// 飞行器电池保养
export enum DroneBatteryStateEnum {
  NoMaintenanceRequired = 0, // 0-无需保养
  MaintenanceRequired = 1, // 1-待保养
  MaintenanceInProgress = 2, // 2-正在保养
}

export enum DroneBatteryModeEnum {
  CLOSE = 0, // 关闭
  OPEN = 1, // 开启
}

// 4g链路连接状态
export enum FourGLinkStateEnum {
  CLOSE = 0, // 断开
  OPEN = 1, // 连接
}

//  Sdr链路连接状态
export enum SdrLinkStateEnum {
  CLOSE = 0, // 断开
  OPEN = 1, // 连接
}

// 机场的图传链路模式
export enum LinkWorkModeEnum {
  SDR = 0, // sdr模式
  FourG_FUSION_MODE = 1, // 4G融合模式
}
