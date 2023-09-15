import { message } from 'ant-design-vue'
import { ref } from 'vue'
import { postSendCmd } from '/@/api/device-cmd'
import { DeviceCmd, DeviceCmdItemAction } from '/@/types/device-cmd'

export function useDockControl () {
  const dockControlPanelVisible = ref(false)

  function setDockControlPanelVisible (visible: boolean) {
    dockControlPanelVisible.value = visible
  }

  // 远程调试开关
  async function dockDebugOnOff (sn: string, on: boolean) {
    const result = await sendDockControlCmd({
      sn: sn,
      cmd: on ? DeviceCmd.DebugModeOpen : DeviceCmd.DebugModeClose
    }, false)
    return result
  }

  // 发送指令
  async function sendDockControlCmd (params: {
    sn: string,
    cmd: DeviceCmd
    action?: DeviceCmdItemAction
  }, tip = true) {
    try {
      let body = undefined as any
      if (params.action !== undefined) {
        body = {
          action: params.action
        }
      }
      const { code, message: msg } = await postSendCmd({ dock_sn: params.sn, device_cmd: params.cmd }, body)
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

  // 控制面板关闭
  async function onCloseControlPanel (sn: string, debugging: boolean) {
    if (debugging) {
      await dockDebugOnOff(sn, false)
    }
    setDockControlPanelVisible(false)
  }

  return {
    dockControlPanelVisible,
    setDockControlPanelVisible,
    sendDockControlCmd,
    dockDebugOnOff,
    onCloseControlPanel,
  }
}
