<template>
<div class="firmware_upgrade_wrap">
  <!-- 版本 -->
  <span class="version"> {{ device.firmware_version }}</span>
  <!-- tag -->
  <span v-if="getTagStatus(device)"
        class="status-tag pointer">
    <a-tag class="pointer"
           :color="getFirmwareTag(device.firmware_status).color"
           @click="deviceUpgrade(device)">
      {{ getFirmwareTag(device.firmware_status).text }}
    </a-tag>
  </span>
  <!-- 进度 -->
  <span v-if="device.firmware_status === DeviceFirmwareStatusEnum.DuringUpgrade">
  {{ `${device.firmware_progress}`}}
  </span>
</div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch, computed } from 'vue'
import { Device, DeviceFirmwareStatusEnum, DeviceFirmwareStatus, DeviceFirmwareStatusColor } from '/@/types/device'

const props = defineProps<{
  device: Device,
}>()

const emit = defineEmits(['device-upgrade'])
const needUpgrade = computed(() => {
  return props.device.firmware_status === DeviceFirmwareStatusEnum.ConsistencyUpgrade ||
         props.device.firmware_status === DeviceFirmwareStatusEnum.ToUpgraded
})

function getTagStatus (record: Device) {
  return record.firmware_status && record.firmware_status !== DeviceFirmwareStatusEnum.None
}

function getFirmwareTag (status: DeviceFirmwareStatusEnum) {
  return {
    text: DeviceFirmwareStatus[status] || '',
    color: DeviceFirmwareStatusColor[status] || ''
  }
}

function deviceUpgrade (record: Device) {
  if (!needUpgrade.value) return
  emit('device-upgrade', record)
}

</script>

<style lang="scss" scoped>
.firmware_upgrade_wrap{

  .status-tag{
    margin-left: 10px;
  }

  .pointer {
    cursor: pointer;
  }
}
</style>
