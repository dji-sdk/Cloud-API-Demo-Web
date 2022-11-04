import { DeviceInfoType } from '/@/types/device'
import { DeviceSettingType, DeviceSettingKeyEnum, DistanceLimitStatusEnum, ObstacleAvoidanceStatusEnum, DeviceSettingFormModel, NightLightsStateEnum } from '/@/types/device-setting'
import { DEFAULT_PLACEHOLDER } from './constants'
import { isNil } from 'lodash'

const Unit_M = ' m'

/**
 * 根据osd 更新信息
 * @param deviceSetting
 * @param deviceInfo
 * @returns
 */
export function updateDeviceSettingInfoByOsd (deviceSetting: DeviceSettingType, deviceInfo: DeviceInfoType) {
  const { device, dock, gateway } = deviceInfo || {}
  if (!deviceSetting) {
    return
  }
  // 夜航灯
  let nightLightsState = '' as any
  if (isNil(device?.night_lights_state)) {
    deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].editable = false
    deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].value = DEFAULT_PLACEHOLDER
    nightLightsState = DEFAULT_PLACEHOLDER
  } else {
    deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].editable = true
    nightLightsState = device?.night_lights_state
    if (nightLightsState === NightLightsStateEnum.CLOSE) {
      deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].value = '关闭'
    } else if (nightLightsState === NightLightsStateEnum.OPEN) {
      deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].value = '开启'
    } else {
      deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].value = DEFAULT_PLACEHOLDER
    }
  }
  deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].trueValue = nightLightsState

  // 限高
  let heightLimit = device?.height_limit as any
  if (isNil(heightLimit) || heightLimit === 0) {
    heightLimit = DEFAULT_PLACEHOLDER
    deviceSetting[DeviceSettingKeyEnum.HEIGHT_LIMIT_SET].editable = false
  } else {
    deviceSetting[DeviceSettingKeyEnum.HEIGHT_LIMIT_SET].editable = true
  }
  deviceSetting[DeviceSettingKeyEnum.HEIGHT_LIMIT_SET].trueValue = heightLimit
  deviceSetting[DeviceSettingKeyEnum.HEIGHT_LIMIT_SET].value = heightLimit + Unit_M

  // 限远
  let distanceLimitStatus = '' as any
  if (isNil(device?.distance_limit_status?.state)) {
    distanceLimitStatus = DEFAULT_PLACEHOLDER
    deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].editable = false
    deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].value = DEFAULT_PLACEHOLDER
  } else {
    deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].editable = true
    distanceLimitStatus = device?.distance_limit_status?.state
    if (distanceLimitStatus === DistanceLimitStatusEnum.UNSET) {
      deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].value = '关闭'
    } else if (distanceLimitStatus === DistanceLimitStatusEnum.SET) {
      const distanceLimit = device?.distance_limit_status?.distance_limit
      if (distanceLimit) {
        deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].value = distanceLimit + Unit_M
      } else {
        deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].value = DEFAULT_PLACEHOLDER
      }
    } else {
      deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].value = DEFAULT_PLACEHOLDER
    }
  }
  deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].trueValue = distanceLimitStatus

  // 避障
  if (isNil(device?.obstacle_avoidance)) {
    deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].editable = false
    deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].value = DEFAULT_PLACEHOLDER
    deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].trueValue = DEFAULT_PLACEHOLDER
    deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].editable = false
    deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].value = DEFAULT_PLACEHOLDER
    deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].trueValue = DEFAULT_PLACEHOLDER
    deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].editable = false
    deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].value = DEFAULT_PLACEHOLDER
    deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].trueValue = DEFAULT_PLACEHOLDER
  } else {
    const { horizon, upside, downside } = device.obstacle_avoidance || {}
    if (isNil(horizon)) {
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].editable = false
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].value = DEFAULT_PLACEHOLDER
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].trueValue = DEFAULT_PLACEHOLDER
    } else {
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].editable = false
      if (horizon === ObstacleAvoidanceStatusEnum.CLOSE) {
        deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].value = '关闭'
      } else if (horizon === ObstacleAvoidanceStatusEnum.OPEN) {
        deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].value = '开启'
      } else {
        deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].value = DEFAULT_PLACEHOLDER
      }
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].trueValue = horizon
    }

    if (isNil(upside)) {
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].editable = false
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].value = DEFAULT_PLACEHOLDER
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].trueValue = DEFAULT_PLACEHOLDER
    } else {
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].editable = false
      if (upside === ObstacleAvoidanceStatusEnum.CLOSE) {
        deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].value = '关闭'
      } else if (upside === ObstacleAvoidanceStatusEnum.OPEN) {
        deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].value = '开启'
      } else {
        deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].value = DEFAULT_PLACEHOLDER
      }
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].trueValue = upside
    }

    if (isNil(downside)) {
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].editable = false
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].value = DEFAULT_PLACEHOLDER
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].trueValue = DEFAULT_PLACEHOLDER
    } else {
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].editable = false
      if (downside === ObstacleAvoidanceStatusEnum.CLOSE) {
        deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].value = '关闭'
      } else if (downside === ObstacleAvoidanceStatusEnum.OPEN) {
        deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].value = '开启'
      } else {
        deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].value = DEFAULT_PLACEHOLDER
      }
      deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].trueValue = downside
    }
  }
  return deviceSetting
}

// 更新formModel
export function updateDeviceSettingFormModelByOsd (deviceSettingFormModelFromOsd: DeviceSettingFormModel, deviceInfo: DeviceInfoType) {
  const { device, dock, gateway } = deviceInfo || {}
  if (!deviceSettingFormModelFromOsd) {
    return
  }
  // 夜航灯
  const nightLightsState = device?.night_lights_state as any
  if (!isNil(nightLightsState) && nightLightsState === NightLightsStateEnum.OPEN) {
    deviceSettingFormModelFromOsd.nightLightsState = true
  } else {
    deviceSettingFormModelFromOsd.nightLightsState = false
  }

  // 限高
  const heightLimit = device?.height_limit as any
  if (isNil(heightLimit) || heightLimit === 0) {
    deviceSettingFormModelFromOsd.heightLimit = 20
  } else {
    deviceSettingFormModelFromOsd.heightLimit = heightLimit
  }

  // 限远
  const distanceLimitStatus = device?.distance_limit_status?.state as any
  if (!isNil(distanceLimitStatus) && distanceLimitStatus === DistanceLimitStatusEnum.SET) {
    deviceSettingFormModelFromOsd.distanceLimitStatus.state = true
    deviceSettingFormModelFromOsd.distanceLimitStatus.distanceLimit = device?.distance_limit_status?.distance_limit || 15
  } else {
    deviceSettingFormModelFromOsd.distanceLimitStatus.state = false
    deviceSettingFormModelFromOsd.distanceLimitStatus.distanceLimit = 15
  }

  // 避障
  if (isNil(device?.obstacle_avoidance)) {
    deviceSettingFormModelFromOsd.obstacleAvoidanceHorizon = false
    deviceSettingFormModelFromOsd.obstacleAvoidanceUpside = false
    deviceSettingFormModelFromOsd.obstacleAvoidanceDownside = false
  } else {
    const { horizon, upside, downside } = device.obstacle_avoidance || {}
    if (!isNil(horizon) && horizon === ObstacleAvoidanceStatusEnum.OPEN) {
      deviceSettingFormModelFromOsd.obstacleAvoidanceHorizon = true
    } else {
      deviceSettingFormModelFromOsd.obstacleAvoidanceHorizon = false
    }
    if (!isNil(upside) && upside === ObstacleAvoidanceStatusEnum.OPEN) {
      deviceSettingFormModelFromOsd.obstacleAvoidanceUpside = true
    } else {
      deviceSettingFormModelFromOsd.obstacleAvoidanceUpside = false
    }
    if (!isNil(downside) && downside === ObstacleAvoidanceStatusEnum.OPEN) {
      deviceSettingFormModelFromOsd.obstacleAvoidanceDownside = true
    } else {
      deviceSettingFormModelFromOsd.obstacleAvoidanceDownside = false
    }
  }
  return deviceSettingFormModelFromOsd
}
