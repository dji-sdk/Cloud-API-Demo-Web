import { DeviceInfoType } from '/@/types/device'
import { DeviceCmd, DeviceCmdItem, DeviceCmdExecuteInfo, DeviceCmdStatusText, DeviceCmdExecuteStatus } from '/@/types/device-cmd'
import { AirportStorage, CoverStateEnum, PutterStateEnum, ChargeStateEnum, SupplementLightStateEnum } from '/@/types/airport-tsa'
import { getBytesObject } from './bytes'
import { DEFAULT_PLACEHOLDER } from './constants'

/**
 * 根据osd 更新信息
 * @param cmdList
 * @param deviceInfo
 * @returns
 */
export function updateDeviceCmdInfoByOsd (cmdList: DeviceCmdItem[], deviceInfo: DeviceInfoType) {
  const { device, dock, gateway } = deviceInfo || {}
  if (!cmdList || cmdList.length < 1) {
    return
  }
  cmdList.forEach(cmdItem => {
    if (cmdItem.loading) {
      return
    }
    if (cmdItem.cmdKey === DeviceCmd.DeviceReboot) { // 重启
      // console.log('DeviceReboot')
    } else if (cmdItem.cmdKey === DeviceCmd.DroneOpen || cmdItem.cmdKey === DeviceCmd.DroneClose) { // 飞行器开关机
      getDroneState(cmdItem, device)
    } else if (cmdItem.cmdKey === DeviceCmd.CoverOpen || cmdItem.cmdKey === DeviceCmd.CoverClose) { // 舱盖开关
      getCoverState(cmdItem, dock)
    } else if (cmdItem.cmdKey === DeviceCmd.PutterOpen || cmdItem.cmdKey === DeviceCmd.PutterClose) { // 推杆闭合展开
      getPutterState(cmdItem, dock)
    } else if (cmdItem.cmdKey === DeviceCmd.ChargeOpen || cmdItem.cmdKey === DeviceCmd.ChargeClose) { // 充电状态
      getChargeState(cmdItem, dock)
    } else if (cmdItem.cmdKey === DeviceCmd.DeviceFormat) { // 机场存储
      deviceFormat(cmdItem, dock)
    } else if (cmdItem.cmdKey === DeviceCmd.DroneFormat) { // 飞行器存储
      droneFormat(cmdItem, device)
    } else if (cmdItem.cmdKey === DeviceCmd.SupplementLightOpen || cmdItem.cmdKey === DeviceCmd.SupplementLightClose) { // 补光灯开关
      getSupplementLightState(cmdItem, dock)
    }
  })
}

// 飞行器开关机
function getDroneState (cmdItem: DeviceCmdItem, droneProperties: any) {
  if (!droneProperties) {
    cmdItem.status = DeviceCmdStatusText.DroneStatusCloseNormalText
    cmdItem.operateText = DeviceCmdStatusText.DroneStatusCloseBtnText
    if (cmdItem.cmdKey !== DeviceCmd.DroneOpen) {
      exchangeDeviceCmd(cmdItem)
    }
  } else {
    cmdItem.status = DeviceCmdStatusText.DroneStatusOpenNormalText
    cmdItem.operateText = DeviceCmdStatusText.DroneStatusOpenBtnText
    if (cmdItem.cmdKey !== DeviceCmd.DroneClose) {
      exchangeDeviceCmd(cmdItem)
    }
  }
}

// 舱盖开关
function getCoverState (cmdItem: DeviceCmdItem, airportProperties: any) {
  const coverState = airportProperties?.cover_state as CoverStateEnum

  if (coverState === CoverStateEnum.Close || coverState === CoverStateEnum.Failed) {
    cmdItem.status = DeviceCmdStatusText.DeviceCoverCloseNormalText
    cmdItem.operateText = DeviceCmdStatusText.DeviceCoverCloseBtnText
    if (cmdItem.cmdKey !== DeviceCmd.CoverOpen) {
      exchangeDeviceCmd(cmdItem)
    }
  } else if (coverState === CoverStateEnum.Open || coverState === CoverStateEnum.HalfOpen) {
    cmdItem.status = DeviceCmdStatusText.DeviceCoverOpenNormalText
    cmdItem.operateText = DeviceCmdStatusText.DeviceCoverOpenBtnText
    if (cmdItem.cmdKey !== DeviceCmd.CoverClose) {
      exchangeDeviceCmd(cmdItem)
    }
  }
}

// 推杆状态
function getPutterState (cmdItem: DeviceCmdItem, airportProperties: any) {
  const putterState = airportProperties?.putter_state as PutterStateEnum
  if (putterState === PutterStateEnum.Close || putterState === PutterStateEnum.Failed) {
    cmdItem.status = DeviceCmdStatusText.DevicePutterCloseNormalText
    cmdItem.operateText = DeviceCmdStatusText.DevicePutterCloseBtnText
    if (cmdItem.cmdKey !== DeviceCmd.PutterOpen) {
      exchangeDeviceCmd(cmdItem)
    }
  } else if (putterState === PutterStateEnum.Open || putterState === PutterStateEnum.HalfOpen) {
    cmdItem.status = DeviceCmdStatusText.DevicePutterOpenNormalText
    cmdItem.operateText = DeviceCmdStatusText.DevicePutterOpenBtnText
    if (cmdItem.cmdKey !== DeviceCmd.PutterClose) {
      exchangeDeviceCmd(cmdItem)
    }
  }
}

// 充电状态
function getChargeState (cmdItem: DeviceCmdItem, airportProperties: any) {
  const chargeState = airportProperties?.drone_charge_state
  const state = chargeState?.state as ChargeStateEnum
  if (!state) return
  if (state === ChargeStateEnum.Charge) {
    cmdItem.status = DeviceCmdStatusText.DeviceChargeOpenNormalText
    cmdItem.operateText = DeviceCmdStatusText.DeviceChargeOpenBtnText
    if (cmdItem.cmdKey !== DeviceCmd.ChargeClose) {
      exchangeDeviceCmd(cmdItem)
    }
  } else if (state === ChargeStateEnum.NotCharge) {
    cmdItem.status = DeviceCmdStatusText.DeviceChargeCloseNormalText
    cmdItem.operateText = DeviceCmdStatusText.DeviceChargeCloseBtnText
    if (cmdItem.cmdKey !== DeviceCmd.ChargeOpen) {
      exchangeDeviceCmd(cmdItem)
    }
  }
}

// 机场存储格式化
function deviceFormat (cmdItem: DeviceCmdItem, airportProperties: any) {
  const airportStorage = airportProperties?.storage
  const value = getAirportStorage(airportStorage)
  cmdItem.status = value
}

// 机场存储格式化
function droneFormat (cmdItem: DeviceCmdItem, droneProperties: any) {
  const droneStorage = droneProperties?.storage
  const value = getAirportStorage(droneStorage)
  cmdItem.status = value
}

// 获取机场存储容量
// {
// "total": 10000, // 单位：KB
// "used": 500
// }
export function getAirportStorage (storage: AirportStorage) {
  if (!storage) {
    return DEFAULT_PLACEHOLDER
  }
  const total = storage.total
  const used = storage.used
  const byteObj = getBytesObject(total * 1024)
  const _total = byteObj.value
  const _used = getBytes(used * 1024, byteObj.index)
  return `${_used}/${_total} ${byteObj.size}`
}

function getBytes (bytes: number, index: number, fixed = 1) {
  return (bytes / Math.pow(1024, index)).toFixed(fixed)
}

// 补光灯状态
function getSupplementLightState (cmdItem: DeviceCmdItem, airportProperties: any) {
  const supplementLightState = airportProperties?.supplement_light_state
  if (supplementLightState === SupplementLightStateEnum.Close) {
    cmdItem.operateText = DeviceCmdStatusText.DeviceSupplementLightCloseBtnText
    cmdItem.status = DeviceCmdStatusText.DeviceSupplementLightCloseNormalText
    if (cmdItem.cmdKey !== DeviceCmd.SupplementLightOpen) {
      exchangeDeviceCmd(cmdItem)
    }
  } else if (supplementLightState === SupplementLightStateEnum.Open) {
    cmdItem.operateText = DeviceCmdStatusText.DeviceSupplementLightOpenBtnText
    cmdItem.status = DeviceCmdStatusText.DeviceSupplementLightOpenNormalText
    if (cmdItem.cmdKey !== DeviceCmd.SupplementLightClose) {
      exchangeDeviceCmd(cmdItem)
    }
  }
}

/**
 * 交换指令
 * @param cmd
 */
function exchangeDeviceCmd (cmdItem: DeviceCmdItem) {
  if (cmdItem.oppositeCmdKey) {
    const oppositeCmdKey = cmdItem.oppositeCmdKey
    cmdItem.oppositeCmdKey = cmdItem.cmdKey
    cmdItem.cmdKey = oppositeCmdKey
  }
}

// /**
//  * 更新简单指令发送情况更新信息
//  * @param cmd
//  */
// export function updateDeviceSingleCmdInfo (cmdItem: DeviceCmdItem) {
//   // 补光灯
//   if (cmdItem.cmdKey === DeviceCmd.SupplementLightOpen) {
//     cmdItem.status = DeviceCmdStatusText.DeviceSupplementLightOpenNormalText
//     cmdItem.operateText = DeviceCmdStatusText.DeviceSupplementLightOpenBtnText
//     exchangeDeviceCmd(cmdItem)
//   } else if (cmdItem.cmdKey === DeviceCmd.SupplementLightClose) {
//     cmdItem.status = DeviceCmdStatusText.DeviceSupplementLightCloseNormalText
//     cmdItem.operateText = DeviceCmdStatusText.DeviceSupplementLightCloseBtnText
//     exchangeDeviceCmd(cmdItem)
//   }
// }

/**
 * 根据指令执行消息更新信息
 * @param cmd
 * @param deviceCmdExecuteInfo
 * @returns
 */
export function updateDeviceCmdInfoByExecuteInfo (cmdList: DeviceCmdItem[], deviceCmdExecuteInfos?: DeviceCmdExecuteInfo[]) {
  if (!deviceCmdExecuteInfos || !cmdList) {
    return
  }
  cmdList.forEach(cmdItem => {
    // 获取当前设备相应指令信息
    const deviceCmdExecuteInfo = deviceCmdExecuteInfos.find(cmdExecuteInfo => cmdExecuteInfo.biz_code === cmdItem.cmdKey)
    if (deviceCmdExecuteInfo) {
      if (cmdItem.cmdKey === DeviceCmd.DeviceReboot) { // 重启
        if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.InProgress) {
          cmdItem.status = DeviceCmdStatusText.DeviceRebootInProgressText
          cmdItem.loading = true
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.Failed) {
          cmdItem.status = DeviceCmdStatusText.DeviceRebootFailedText
          cmdItem.loading = false
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.OK) {
          cmdItem.status = DeviceCmdStatusText.DeviceRebootNormalText
          cmdItem.loading = false
        }
      } else if (cmdItem.cmdKey === DeviceCmd.DroneOpen) { // 飞行器开关机
        if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.InProgress) {
          cmdItem.status = DeviceCmdStatusText.DroneStatusOpenInProgressText
          cmdItem.loading = true
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.Failed) {
          cmdItem.status = DeviceCmdStatusText.DroneStatusOpenFailedText
          cmdItem.loading = false
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.OK) {
          cmdItem.status = DeviceCmdStatusText.DroneStatusOpenNormalText
          cmdItem.operateText = DeviceCmdStatusText.DroneStatusOpenBtnText
          exchangeDeviceCmd(cmdItem)
          cmdItem.loading = false
        }
      } else if (cmdItem.cmdKey === DeviceCmd.DroneClose) {
        if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.InProgress) {
          cmdItem.status = DeviceCmdStatusText.DroneStatusCloseInProgressText
          cmdItem.loading = true
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.Failed) {
          cmdItem.status = DeviceCmdStatusText.DroneStatusCloseFailedText
          cmdItem.loading = false
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.OK) {
          cmdItem.status = DeviceCmdStatusText.DroneStatusCloseNormalText
          cmdItem.operateText = DeviceCmdStatusText.DroneStatusCloseBtnText
          exchangeDeviceCmd(cmdItem)
          cmdItem.loading = false
        }
      } else if (cmdItem.cmdKey === DeviceCmd.CoverOpen) { // 舱盖开关
        if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.InProgress) {
          cmdItem.status = DeviceCmdStatusText.DeviceCoverOpenInProgressText
          cmdItem.loading = true
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.Failed) {
          cmdItem.status = DeviceCmdStatusText.DeviceCoverOpenFailedText
          cmdItem.loading = false
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.OK) {
          cmdItem.status = DeviceCmdStatusText.DeviceCoverOpenNormalText
          cmdItem.operateText = DeviceCmdStatusText.DeviceCoverOpenBtnText
          exchangeDeviceCmd(cmdItem)
          cmdItem.loading = false
        }
      } else if (cmdItem.cmdKey === DeviceCmd.CoverClose) {
        if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.InProgress) {
          cmdItem.status = DeviceCmdStatusText.DeviceCoverCloseInProgressText
          cmdItem.loading = true
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.Failed) {
          cmdItem.status = DeviceCmdStatusText.DeviceCoverCloseFailedText
          cmdItem.loading = false
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.OK) {
          cmdItem.status = DeviceCmdStatusText.DeviceCoverCloseNormalText
          cmdItem.operateText = DeviceCmdStatusText.DeviceCoverCloseBtnText
          exchangeDeviceCmd(cmdItem)
          cmdItem.loading = false
        }
      } else if (cmdItem.cmdKey === DeviceCmd.PutterOpen) { // 推杆闭合展开
        if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.InProgress) {
          cmdItem.status = DeviceCmdStatusText.DevicePutterOpenInProgressText
          cmdItem.loading = true
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.Failed) {
          cmdItem.status = DeviceCmdStatusText.DevicePutterOpenFailedText
          cmdItem.loading = false
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.OK) {
          cmdItem.status = DeviceCmdStatusText.DevicePutterOpenNormalText
          cmdItem.operateText = DeviceCmdStatusText.DevicePutterOpenBtnText
          exchangeDeviceCmd(cmdItem)
          cmdItem.loading = false
        }
      } else if (cmdItem.cmdKey === DeviceCmd.PutterClose) {
        if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.InProgress) {
          cmdItem.status = DeviceCmdStatusText.DevicePutterCloseInProgressText
          cmdItem.loading = true
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.Failed) {
          cmdItem.status = DeviceCmdStatusText.DevicePutterCloseFailedText
          cmdItem.loading = false
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.OK) {
          cmdItem.status = DeviceCmdStatusText.DevicePutterCloseNormalText
          cmdItem.operateText = DeviceCmdStatusText.DevicePutterCloseBtnText
          exchangeDeviceCmd(cmdItem)
          cmdItem.loading = false
        }
      } else if (cmdItem.cmdKey === DeviceCmd.ChargeOpen) { // 充电状态
        if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.InProgress) {
          cmdItem.status = DeviceCmdStatusText.DeviceChargeOpenInProgressText
          cmdItem.loading = true
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.Failed) {
          cmdItem.status = DeviceCmdStatusText.DeviceChargeOpenFailedText
          cmdItem.loading = false
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.OK) {
          cmdItem.status = DeviceCmdStatusText.DeviceChargeOpenNormalText
          cmdItem.operateText = DeviceCmdStatusText.DeviceChargeOpenBtnText
          exchangeDeviceCmd(cmdItem)
          cmdItem.loading = false
        }
      } else if (cmdItem.cmdKey === DeviceCmd.ChargeClose) {
        if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.InProgress) {
          cmdItem.status = DeviceCmdStatusText.DeviceChargeCloseInProgressText
          cmdItem.loading = true
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.Failed) {
          cmdItem.status = DeviceCmdStatusText.DeviceChargeCloseFailedText
          cmdItem.loading = false
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.OK) {
          cmdItem.status = DeviceCmdStatusText.DeviceChargeCloseNormalText
          cmdItem.operateText = DeviceCmdStatusText.DeviceChargeCloseBtnText
          exchangeDeviceCmd(cmdItem)
          cmdItem.loading = false
        }
      } else if (cmdItem.cmdKey === DeviceCmd.DeviceFormat) { // 机场存储
        if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.InProgress) {
          cmdItem.status = DeviceCmdStatusText.DeviceFormatInProgressText
          cmdItem.loading = true
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.Failed) {
          cmdItem.status = DeviceCmdStatusText.DeviceFormatFailedText
          cmdItem.loading = false
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.OK) {
          cmdItem.loading = false
        }
      } else if (cmdItem.cmdKey === DeviceCmd.DroneFormat) { // 飞行器存储
        if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.InProgress) {
          cmdItem.status = DeviceCmdStatusText.DroneFormatInProgressText
          cmdItem.loading = true
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.Failed) {
          cmdItem.status = DeviceCmdStatusText.DroneFormatFailedText
          cmdItem.loading = false
        } else if (deviceCmdExecuteInfo.output.status === DeviceCmdExecuteStatus.OK) {
          cmdItem.loading = false
        }
      }
    }
  })
}
