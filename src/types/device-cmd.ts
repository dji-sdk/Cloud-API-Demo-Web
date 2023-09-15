import { AlarmModeEnum, BatteryStoreModeEnum, DroneBatteryModeEnum, LinkWorkModeEnum } from '/@/types/airport-tsa'
// 机场指令集
export enum DeviceCmd {
  // 简单指令
  DebugModeOpen = 'debug_mode_open', // 调试模式开启
  DebugModeClose = 'debug_mode_close', // 调试模式关闭
  SupplementLightOpen = 'supplement_light_open', // 打开补光灯
  SupplementLightClose = 'supplement_light_close', // 关闭补光灯
  ReturnHome = 'return_home', // 一键返航
  ReturnHomeCancel = 'return_home_cancel', // 取消返航
  // 复杂指令
  DeviceReboot = 'device_reboot', // 机场重启
  DroneOpen = 'drone_open', // 飞行器开机
  DroneClose = 'drone_close', // 飞行器关机
  // DeviceCheck = 'device_check', // 一键排障（一键起飞自检）
  DeviceFormat = 'device_format', // 机场数据格式化
  DroneFormat = 'drone_format', // 飞行器数据格式化
  CoverOpen = 'cover_open', // 打开舱盖
  CoverClose = 'cover_close', // 关闭舱盖
  PutterOpen = 'putter_open', // 推杆展开
  PutterClose = 'putter_close', // 推杆闭合
  ChargeOpen = 'charge_open', // 打开充电
  ChargeClose = 'charge_close', // 关闭充电
  AlarmStateSwitch = 'alarm_state_switch', // 机场声光报警
  BatteryStoreModeSwitch = 'battery_store_mode_switch', // 电池保养
  DroneBatteryModeSwitch = 'battery_maintenance_switch', // 飞行器电池保养
  SdrWorkModeSwitch = 'sdr_workmode_switch', // 增强图传
}

export type DeviceCmdItemAction = AlarmModeEnum | BatteryStoreModeEnum | DroneBatteryModeEnum | LinkWorkModeEnum

export interface DeviceCmdItem{
  label: string, // 标题
  status: string, // 当前状态
  operateText: string, // 按钮文字
  cmdKey: DeviceCmd, // 请求指令
  oppositeCmdKey?: DeviceCmd, // 相反状态指令
  action?: DeviceCmdItemAction, // 参数
  func: string, // 处理函数
  loading: boolean // 按钮loading
  disabled?: boolean // 按钮disabled
}
export const noDebugCmdList: DeviceCmdItem[] = [
  {
    label: 'Return Home',
    status: '--',
    operateText: 'Return Home',
    cmdKey: DeviceCmd.ReturnHome,
    func: 'returnHome',
    loading: false,
  },
  {
    label: 'Return Home Cancel',
    status: '--',
    operateText: 'Return Home Cancel',
    cmdKey: DeviceCmd.ReturnHomeCancel,
    func: 'returnHomeCancel',
    loading: false,
  }
]

// 机场指令
export const cmdList: DeviceCmdItem[] = [
  {
    // iconName: ,
    label: '机场系统',
    status: '工作中',
    operateText: '重启',
    cmdKey: DeviceCmd.DeviceReboot,
    func: 'deviceReboot',
    loading: false,
    // btnAnimationIconName: '',
    // operateTips: '',
    // statusColor: '',
  },
  {
    label: '飞行器',
    status: '关机',
    operateText: '开机',
    cmdKey: DeviceCmd.DroneOpen,
    oppositeCmdKey: DeviceCmd.DroneClose,
    func: 'droneStatus',
    loading: false,
  },
  {
    label: '舱盖',
    status: '关',
    operateText: '开启',
    cmdKey: DeviceCmd.CoverOpen,
    oppositeCmdKey: DeviceCmd.CoverClose,
    func: 'coverStatus',
    loading: false,
  },
  {
    label: '推杆',
    status: '闭合',
    operateText: '展开',
    cmdKey: DeviceCmd.PutterOpen,
    oppositeCmdKey: DeviceCmd.PutterClose,
    func: 'putterStatus',
    loading: false,
  },
  {
    label: '充电状态',
    status: '未充电',
    operateText: '充电',
    cmdKey: DeviceCmd.ChargeOpen,
    oppositeCmdKey: DeviceCmd.ChargeClose,
    func: 'chargeStatus',
    loading: false,
  },
  {
    label: '机场存储',
    status: '--',
    operateText: '格式化',
    cmdKey: DeviceCmd.DeviceFormat,
    func: 'deviceFormat',
    loading: false,
  },
  {
    label: '飞行器存储',
    status: '--',
    operateText: '格式化',
    cmdKey: DeviceCmd.DroneFormat,
    func: 'droneFormat',
    loading: false,
  },
  {
    label: '补光灯',
    status: '关',
    operateText: '打开',
    cmdKey: DeviceCmd.SupplementLightOpen,
    oppositeCmdKey: DeviceCmd.SupplementLightClose,
    func: 'supplementLightStatus',
    loading: false,
  },
  {
    label: '机场声光报警',
    status: '关',
    operateText: '打开',
    cmdKey: DeviceCmd.AlarmStateSwitch,
    action: AlarmModeEnum.OPEN,
    func: 'alarmState',
    loading: false,
  },
  {
    label: '机场电池存储模式',
    status: '计划',
    operateText: '应急',
    cmdKey: DeviceCmd.BatteryStoreModeSwitch,
    action: BatteryStoreModeEnum.BATTERY_EMERGENCY_STORE,
    func: 'batteryStoreMode',
    loading: false,
  },
  {
    label: '飞机电池保养',
    status: '--',
    operateText: '保养',
    cmdKey: DeviceCmd.DroneBatteryModeSwitch,
    action: DroneBatteryModeEnum.OPEN,
    func: 'droneBatteryMode',
    loading: false,
    disabled: true,
  },
  {
    label: '4g 增强',
    status: '--',
    operateText: '开启',
    cmdKey: DeviceCmd.SdrWorkModeSwitch,
    action: LinkWorkModeEnum.FourG_FUSION_MODE,
    func: 'sdrWorkMode',
    loading: false,
  },
]

export enum DeviceCmdStatusText {
  DeviceRebootNormalText = '工作中',
  DeviceRebootInProgressText = '重启中...',
  DeviceRebootFailedText = '重启失败',

  DroneStatusOpenNormalText = '开',
  DroneStatusOpenInProgressText = '开机中...',
  DroneStatusOpenFailedText = '关',
  DroneStatusOpenBtnText = '关机',

  DroneStatusCloseNormalText = '关',
  DroneStatusCloseInProgressText = '关机中...',
  DroneStatusCloseFailedText = '开',
  DroneStatusCloseBtnText = '开机',

  DeviceCoverOpenNormalText = '开',
  DeviceCoverOpenInProgressText = '开启中...',
  DeviceCoverOpenFailedText = '关',
  DeviceCoverOpenBtnText = '关闭',

  DeviceCoverCloseNormalText = '关',
  DeviceCoverCloseInProgressText = '关闭中...',
  DeviceCoverCloseFailedText = '开',
  DeviceCoverCloseBtnText = '开启',

  DevicePutterOpenNormalText = '展开',
  DevicePutterOpenBtnText = '闭合',
  DevicePutterOpenInProgressText = '推杆展开中',
  DevicePutterOpenFailedText = '闭合',

  DevicePutterCloseNormalText = '闭合',
  DevicePutterCloseInProgressText = '推杆闭合中',
  DevicePutterCloseFailedText = '展开',
  DevicePutterCloseBtnText = '展开',

  DeviceChargeOpenNormalText = '充电',
  DeviceChargeOpenInProgressText = '充电中...',
  DeviceChargeOpenFailedText = '未充电',
  DeviceChargeOpenBtnText = '断电',

  DeviceChargeCloseNormalText = '断电',
  DeviceChargeCloseInProgressText = '断电中...',
  DeviceChargeCloseFailedText = '充电',
  DeviceChargeCloseBtnText = '充电',

  DeviceFormatInProgressText = '格式化...',
  DeviceFormatFailedText = '格式化失败',

  DroneFormatInProgressText = '格式化...',
  DroneFormatFailedText = '格式化失败',

  DeviceSupplementLightOpenNormalText = '开',
  DeviceSupplementLightOpenInProgressText = '开启中...',
  DeviceSupplementLightOpenFailedText = '关',
  DeviceSupplementLightOpenBtnText = '关闭',

  DeviceSupplementLightCloseNormalText = '关',
  DeviceSupplementLightCloseText = '关闭中...',
  DeviceSupplementLightCloseFailedText = '开',
  DeviceSupplementLightCloseBtnText = '打开',

  AlarmStateOpenNormalText = '开',
  AlarmStateOpenText = '开启中...',
  AlarmStateOpenFailedText = '关',
  AlarmStateOpenBtnText = '关闭',

  AlarmStateCloseNormalText = '关',
  AlarmStateCloseText = '关闭中...',
  AlarmStateCloseFailedText = '开',
  AlarmStateCloseBtnText = '打开',

  BatteryStoreModePlanNormalText = '计划',
  BatteryStoreModePlanText = '切换中...',
  BatteryStoreModePlanFailedText = '应急',
  BatteryStoreModePlanBtnText = '应急',

  BatteryStoreModeEmergencyNormalText = '应急',
  BatteryStoreModeEmergencyText = '切换中...',
  BatteryStoreModeEmergencyFailedText = '计划',
  BatteryStoreModeEmergencyBtnText = '计划',

  DroneBatteryModeMaintenanceInProgressText = '保养中',
  DroneBatteryModeMaintenanceNotNeedText = '无需保养',
  DroneBatteryModeMaintenanceNeedText = '需保养',
  DroneBatteryModeOpenBtnText = '保养',
  DroneBatteryModeCloseBtnText = '关闭保养',

  SdrWorkModeFourGOpenNormalText = '开',
  SdrWorkModeFourGOpenText = '开启中...',
  SdrWorkModeFourGOpenFailedText = '--',
  SdrWorkModeFourGOpenBtnText = '关闭',

  SdrWorkModeFourGCloseNormalText = '--',
  SdrWorkModeFourGCloseText = '关闭中...',
  SdrWorkModeFourGCloseFailedText = '开',
  SdrWorkModeFourCloseBtnText = '开启',
}

// cmd ws 消息状态
export enum DeviceCmdExecuteStatus {
  Sent = 'sent', // 已下发
  InProgress = 'in_progress', // 执行中
  OK = 'ok', // 执行成功
  Failed = 'failed', // 失败
  Canceled = 'canceled', // 取消
  Timeout = 'timeout' // 超时
}

export interface DeviceCmdExecuteInfo {
  biz_code: string,
  timestamp: number,
  sn: string,
  bid: string,
  output:{
    status: DeviceCmdExecuteStatus,
    progress?: {
      percent: number,
      step_key: string,
      step_result: number
    },
    ext?: {
      rate?: number
    }
  }
  result: number,
}

// 所有机场的指令执行状态
export interface DevicesCmdExecuteInfo {
  [key: string]: DeviceCmdExecuteInfo[], // sn --- DeviceCmdExecuteInfo
}
