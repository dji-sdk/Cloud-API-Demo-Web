<template>
  <div class="device-setting-wrapper">
    <div class="device-setting-header">Device Property Set</div>
    <div class="device-setting-box">
      <!-- 飞行器夜航灯 -->
      <div class="control-setting-item">
        <div class="control-setting-item-left">
          <div class="item-label">{{ deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].label }}</div>
          <div class="item-status">{{ deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].value }}</div>
        </div>
        <div class="control-setting-item-right">
          <DeviceSettingPopover
            :visible="deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].popConfirm.visible"
            :loading="deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].popConfirm.loading"
            @confirm="onConfirm(deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].settingKey)"
            @cancel="onCancel(deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].settingKey)"
          >
            <template #formContent>
              <div class="form-content">
                <span class="form-label">{{ deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].label }}:</span>
                <a-switch checked-children="开" un-checked-children="关" v-model:checked="deviceSettingFormModel.nightLightsState" />
              </div>
            </template>
            <a @click="onShowPopConfirm(deviceSetting[DeviceSettingKeyEnum.NIGHT_LIGHTS_MODE_SET].settingKey)">Edit</a>
          </DeviceSettingPopover>
        </div>
      </div>
      <!-- 限高 -->
      <div class="control-setting-item">
        <div class="control-setting-item-left">
          <div class="item-label">{{ deviceSetting[DeviceSettingKeyEnum.HEIGHT_LIMIT_SET].label }}</div>
          <div class="item-status">{{ deviceSetting[DeviceSettingKeyEnum.HEIGHT_LIMIT_SET].value }}</div>
        </div>
        <div class="control-setting-item-right">
          <DeviceSettingPopover
            :visible="deviceSetting[DeviceSettingKeyEnum.HEIGHT_LIMIT_SET].popConfirm.visible"
            :loading="deviceSetting[DeviceSettingKeyEnum.HEIGHT_LIMIT_SET].popConfirm.loading"
            @confirm="onConfirm(deviceSetting[DeviceSettingKeyEnum.HEIGHT_LIMIT_SET].settingKey)"
            @cancel="onCancel(deviceSetting[DeviceSettingKeyEnum.HEIGHT_LIMIT_SET].settingKey)"
          >
            <template #formContent>
              <div class="form-content">
                <span class="form-label">{{ deviceSetting[DeviceSettingKeyEnum.HEIGHT_LIMIT_SET].label }}:</span>
                <a-input-number v-model:value="deviceSettingFormModel.heightLimit" :min="20" :max="1500" />
                m
              </div>
            </template>
            <a @click="onShowPopConfirm(deviceSetting[DeviceSettingKeyEnum.HEIGHT_LIMIT_SET].settingKey)">Edit</a>
          </DeviceSettingPopover>
        </div>
      </div>
      <!-- 限远 -->
      <div class="control-setting-item">
        <div class="control-setting-item-left">
          <div class="item-label">{{ deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].label }}</div>
          <div class="item-status">{{ deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].value }}</div>
        </div>
        <div class="control-setting-item-right">
          <DeviceSettingPopover
            :visible="deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].popConfirm.visible"
            :loading="deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].popConfirm.loading"
            @confirm="onConfirm(deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].settingKey)"
            @cancel="onCancel(deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].settingKey)"
          >
            <template #formContent>
              <div class="form-content">
                <span class="form-label">{{ deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].label }}:</span>
                <a-switch style="margin-right: 10px;" checked-children="开" un-checked-children="关" v-model:checked="deviceSettingFormModel.distanceLimitStatus.state" />
                <a-input-number v-model:value="deviceSettingFormModel.distanceLimitStatus.distanceLimit" :min="15" :max="8000" />
                m
              </div>
            </template>
            <a @click="onShowPopConfirm(deviceSetting[DeviceSettingKeyEnum.DISTANCE_LIMIT_SET].settingKey)">Edit</a>
          </DeviceSettingPopover>
        </div>
      </div>
      <!-- 水平避障 -->
      <div class="control-setting-item">
        <div class="control-setting-item-left">
          <div class="item-label">{{ deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].label }}</div>
          <div class="item-status">{{ deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].value }}</div>
        </div>
        <div class="control-setting-item-right">
          <DeviceSettingPopover
            :visible="deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].popConfirm.visible"
            :loading="deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].popConfirm.loading"
            @confirm="onConfirm(deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].settingKey)"
            @cancel="onCancel(deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].settingKey)"
          >
            <template #formContent>
              <div class="form-content">
                <span class="form-label">{{ deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].label }}:</span>
                <a-switch checked-children="开" un-checked-children="关" v-model:checked="deviceSettingFormModel.obstacleAvoidanceHorizon" />
              </div>
            </template>
            <a @click="onShowPopConfirm(deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_HORIZON].settingKey)">Edit</a>
          </DeviceSettingPopover>
        </div>
      </div>
      <!-- 上视避障 -->
      <div class="control-setting-item">
        <div class="control-setting-item-left">
          <div class="item-label">{{ deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].label }}</div>
          <div class="item-status">{{ deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].value }}</div>
        </div>
        <div class="control-setting-item-right">
          <DeviceSettingPopover
            :visible="deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].popConfirm.visible"
            :loading="deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].popConfirm.loading"
            @confirm="onConfirm(deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].settingKey)"
            @cancel="onCancel(deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].settingKey)"
          >
            <template #formContent>
              <div class="form-content">
                <span class="form-label">{{ deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].label }}:</span>
                <a-switch checked-children="开" un-checked-children="关" v-model:checked="deviceSettingFormModel.obstacleAvoidanceUpside" />
              </div>
            </template>
            <a @click="onShowPopConfirm(deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_UPSIDE].settingKey)">Edit</a>
          </DeviceSettingPopover>
        </div>
      </div>
      <!-- 下视避障 -->
      <div class="control-setting-item">
        <div class="control-setting-item-left">
          <div class="item-label">{{ deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].label }}</div>
          <div class="item-status">{{ deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].value }}</div>
        </div>
        <div class="control-setting-item-right">
          <DeviceSettingPopover
            :visible="deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].popConfirm.visible"
            :loading="deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].popConfirm.loading"
            @confirm="onConfirm(deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].settingKey)"
            @cancel="onCancel(deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].settingKey)"
          >
            <template #formContent>
              <div class="form-content">
                <span class="form-label">{{ deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].label }}:</span>
                <a-switch checked-children="开" un-checked-children="关" v-model:checked="deviceSettingFormModel.obstacleAvoidanceDownside" />
              </div>
            </template>
            <a @click="onShowPopConfirm(deviceSetting[DeviceSettingKeyEnum.OBSTACLE_AVOIDANCE_DOWNSIDE].settingKey)">Edit</a>
          </DeviceSettingPopover>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'
import { DeviceInfoType } from '/@/types/device'
import { useMyStore } from '/@/store'
import { cloneDeep } from 'lodash'
import { initDeviceSetting, initDeviceSettingFormModel, DeviceSettingKeyEnum } from '/@/types/device-setting'
import { updateDeviceSettingInfoByOsd, updateDeviceSettingFormModelByOsd } from '/@/utils/device-setting'
import { useDeviceSetting } from './use-device-setting'
import DeviceSettingPopover from './DeviceSettingPopover.vue'

const props = defineProps<{
  sn: string,
  deviceInfo: DeviceInfoType,
}>()

const store = useMyStore()
const deviceSetting = ref(cloneDeep(initDeviceSetting))
const deviceSettingFormModelFromOsd = ref(cloneDeep(initDeviceSettingFormModel))
const deviceSettingFormModel = ref(cloneDeep(initDeviceSettingFormModel)) // 真实使用的formModel

// 根据设备osd信息更新信息
watch(() => props.deviceInfo, (value) => {
  updateDeviceSettingInfoByOsd(deviceSetting.value, value)
  updateDeviceSettingFormModelByOsd(deviceSettingFormModelFromOsd.value, value)
  // console.log('deviceInfo', value)
}, {
  immediate: true,
  deep: true
})

function onShowPopConfirm (settingKey: DeviceSettingKeyEnum) {
  deviceSetting.value[settingKey].popConfirm.visible = true
  deviceSettingFormModel.value = cloneDeep(deviceSettingFormModelFromOsd.value)
}

function onCancel (settingKey: DeviceSettingKeyEnum) {
  deviceSetting.value[settingKey].popConfirm.visible = false
}

async function onConfirm (settingKey: DeviceSettingKeyEnum) {
  deviceSetting.value[settingKey].popConfirm.loading = true
  const body = genDevicePropsBySettingKey(settingKey, deviceSettingFormModel.value)
  await setDeviceProps(props.sn, body)
  deviceSetting.value[settingKey].popConfirm.loading = false
  deviceSetting.value[settingKey].popConfirm.visible = false
}

// 更新设备属性
const {
  genDevicePropsBySettingKey,
  setDeviceProps,
} = useDeviceSetting()

</script>

<style lang='scss' scoped>
.device-setting-wrapper{
  border-bottom: 1px solid #515151;

  .device-setting-header{
    font-size: 14px;
    font-weight: 600;
    padding: 10px 10px 0px;
  }

  .device-setting-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 4px 10px;

    .control-setting-item{
      width: 220px;
      height: 58px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #666;
      margin: 4px 0;
      padding: 0 8px;

      .control-setting-item-left{
        display: flex;
        flex-direction: column;

        .item-label{
          font-weight: 700;
        }
      }
    }
  }
}
</style>
