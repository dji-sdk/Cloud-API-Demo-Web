<template>
<a-modal :visible="sVisible"
         :title="title"
         :closable="false"
         centered
         @update:visible="onVisibleChange"
         @cancel="onCancel"
         @ok="onConfirm">
         <div>
          升级固件版本: {{ deviceUpgradeInfo?.product_version }}
         </div>
</a-modal>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, Ref, watchEffect } from 'vue'
import { Device, DeviceFirmwareStatusEnum, DeviceFirmwareStatus, DeviceFirmwareTypeEnum } from '/@/types/device'
import { getDeviceUpgradeInfo, GetDeviceUpgradeInfoRsp, DeviceUpgradeBody } from '/@/api/device-upgrade'

const props = defineProps<{
  visible: boolean,
  title: string,
  device: null | Device,
}>()

const emit = defineEmits(['update:visible', 'ok', 'cancel'])

const deviceUpgradeInfo:Ref<GetDeviceUpgradeInfoRsp> = ref({} as GetDeviceUpgradeInfoRsp)
const sVisible = ref(false)

watchEffect(() => {
  sVisible.value = props.visible
  // 显示弹框时，获取设备升级信息
  if (props.visible) {
    initDeviceUpgradeInfo()
  }
})

function onVisibleChange (sVisible: boolean) {
  setVisible(sVisible)
}

function setVisible (v: boolean, e?: Event) {
  sVisible.value = v
  emit('update:visible', v, e)
}

// 获取设备升级信息
async function initDeviceUpgradeInfo () {
  if (!props.device?.device_name) {
    return
  }
  const { code, data } = await getDeviceUpgradeInfo({ device_name: props.device?.device_name })
  if (code === 0) {
    deviceUpgradeInfo.value = data && data[0]
  }
}

// 提交
function checkConfirm () {
  if (!deviceUpgradeInfo.value.product_version) {
    return false
  }
  if (!props.device) {
    return false
  }
  if (props.device.firmware_status !== DeviceFirmwareStatusEnum.ToUpgraded && props.device.firmware_status !== DeviceFirmwareStatusEnum.ConsistencyUpgrade) {
    return false
  }
  return true
}

function onConfirm (e: Event) {
  if (!checkConfirm()) {
    return
  }
  setVisible(false, e)
  emit('ok', [{
    device_name: props.device?.device_name,
    sn: props.device?.device_sn,
    product_version: deviceUpgradeInfo.value.product_version,
    firmware_upgrade_type: props.device?.firmware_status === DeviceFirmwareStatusEnum.ToUpgraded ? DeviceFirmwareTypeEnum.ToUpgraded : DeviceFirmwareTypeEnum.ConsistencyUpgrade // 1-普通升级，2-一致性升级
  }] as DeviceUpgradeBody, e)
}

function onCancel (e: Event) {
  setVisible(false, e)
  emit('cancel', e)
}
</script>

<style lang="scss" scoped>
</style>
