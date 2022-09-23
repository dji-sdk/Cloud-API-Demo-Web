import { message } from 'ant-design-vue'
import { ref } from 'vue'
import { postSendCmd } from '/@/api/device-cmd'
import { DeviceCmd } from '/@/types/device-cmd'

export function useDockControl () {
  const controlPanelVisible = ref(false)

  function setControlPanelVisible (visible: boolean) {
    controlPanelVisible.value = visible
  }

  // 远程调试开关
  async function dockDebugOnOff (sn: string, on: boolean) {
    const success = await sendDockControlCmd({
      sn: sn,
      cmd: on ? DeviceCmd.DebugModeOpen : DeviceCmd.DebugModeClose
    }, false)
    if (success) {
      setControlPanelVisible(on)
    }
  }

  // 发送指令
  async function sendDockControlCmd (params: {
    sn: string,
    cmd: DeviceCmd
  }, tip = true) {
    try {
      const { code, message: msg } = await postSendCmd({ dock_sn: params.sn, device_cmd: params.cmd })
      if (code === 0) {
        tip && message.success('指令发送成功')
        return true
      }
      throw (msg)
    } catch (e) {
      tip && message.error('指令发送失败')
      return false
    }
  }

  return {
    controlPanelVisible,
    setControlPanelVisible,
    sendDockControlCmd,
    dockDebugOnOff,
  }
}
