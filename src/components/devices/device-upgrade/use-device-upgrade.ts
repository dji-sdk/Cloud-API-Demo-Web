import { Ref, ref } from 'vue'
import { Device } from '/@/types/device'
import { postDeviceUpgrade, DeviceUpgradeBody } from '/@/api/device-upgrade'

export function useDeviceFirmwareUpgrade (workspaceId: string) {
  const deviceFirmwareUpgradeModalVisible = ref(false)
  const selectedDevice: Ref<null | Device> = ref(null)

  function setDeviceFirmwareUpgradeModalVisible (visible: boolean) {
    deviceFirmwareUpgradeModalVisible.value = visible
  }

  function setSelectedDevice (device: null | Device) {
    selectedDevice.value = device
  }

  // 点击设备升级
  function onDeviceUpgrade (record: Device) {
    if (!record) {
      return
    }
    setSelectedDevice(record)
    setDeviceFirmwareUpgradeModalVisible(true)
  }

  // 确认设备升级
  async function onUpgradeDeviceOk (deviceUpgradeBody: DeviceUpgradeBody) {
    const { code } = await postDeviceUpgrade(workspaceId, deviceUpgradeBody)
    if (code === 0) {
      // setDeviceFirmwareUpgradeModalVisible(false)
    }
  }

  return {
    deviceFirmwareUpgradeModalVisible,
    setDeviceFirmwareUpgradeModalVisible,
    selectedDevice,
    setSelectedDevice,
    onDeviceUpgrade,
    onUpgradeDeviceOk,
  }
}
