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
