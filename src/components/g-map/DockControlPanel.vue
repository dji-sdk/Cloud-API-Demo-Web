<template>
<div class="dock-control-panel">
  <!-- title -->
  <div class="dock-control-panel-header fz16 pl5 pr5 flex-align-center flex-row flex-justify-between">
    <span>Device Control<span class="fz12 pl15">{{ props.sn}}</span></span>
    <span @click="closeControlPanel">
    <CloseOutlined />
    </span>
  </div>
  <!-- setting -->
  <DeviceSettingBox :sn="props.sn" :deviceInfo="props.deviceInfo"></DeviceSettingBox>
  <!-- cmd -->
  <div class="control-cmd-wrapper">
    <div class="control-cmd-header">
      Device Remote Debug
      <a-switch class="debug-btn" checked-children="开" un-checked-children="关" v-model:checked="debugStatus" @change="onDeviceStatusChange"/>
    </div>
    <div class="control-cmd-box">
      <div v-for="(cmdItem, index) in cmdList" :key="cmdItem.cmdKey" class="control-cmd-item">
        <div class="control-cmd-item-left">
            <div class="item-label">{{ cmdItem.label }}</div>
            <div class="item-status">{{ cmdItem.status }}</div>
        </div>
        <div class="control-cmd-item-right">
            <a-button :disabled="!debugStatus || cmdItem.disabled" :loading="cmdItem.loading" size="small" type="primary" @click="sendControlCmd(cmdItem, index)">
            {{ cmdItem.operateText }}
            </a-button>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import {
  CloseOutlined
} from '@ant-design/icons-vue'
import { useDockControl } from './use-dock-control'
import { DeviceInfoType, EDockModeCode } from '/@/types/device'
import { cmdList as baseCmdList, DeviceCmdItem } from '/@/types/device-cmd'
import { useMyStore } from '/@/store'
import { updateDeviceCmdInfoByOsd, updateDeviceCmdInfoByExecuteInfo } from '/@/utils/device-cmd'
import DeviceSettingBox from './DeviceSettingBox.vue'

const props = defineProps<{
  sn: string,
  deviceInfo: DeviceInfoType,
}>()

const store = useMyStore()
const initCmdList = baseCmdList.map(cmdItem => Object.assign({}, cmdItem))
const cmdList = ref(initCmdList)

// 根据机场指令执行状态更新信息
watch(() => store.state.devicesCmdExecuteInfo, (devicesCmdExecuteInfo) => {
  if (props.sn && devicesCmdExecuteInfo[props.sn]) {
    updateDeviceCmdInfoByExecuteInfo(cmdList.value, devicesCmdExecuteInfo[props.sn])
  }
}, {
  immediate: true,
  deep: true,
})

// 根据设备osd信息更新信息
watch(() => props.deviceInfo, (value) => {
  updateDeviceCmdInfoByOsd(cmdList.value, value)
  // console.log('deviceInfo', value)
}, {
  immediate: true,
  deep: true
})

// dock 控制指令
const debugStatus = ref(props.deviceInfo.dock?.basic_osd?.mode_code === EDockModeCode.Remote_Debugging)
const emit = defineEmits(['close-control-panel'])

function closeControlPanel () {
  emit('close-control-panel', props.sn, debugStatus.value)
}

async function onDeviceStatusChange (status: boolean) {
  let result = false
  if (status) {
    result = await dockDebugOnOff(props.sn, true)
  } else {
    result = await dockDebugOnOff(props.sn, false)
  }
  if (!result) {
    if (status) {
      debugStatus.value = false
    } else {
      debugStatus.value = true
    }
  }
}

const {
  sendDockControlCmd,
  dockDebugOnOff
} = useDockControl()

async function sendControlCmd (cmdItem: DeviceCmdItem, index: number) {
  const success = await sendDockControlCmd({
    sn: props.sn,
    cmd: cmdItem.cmdKey,
    action: cmdItem.action
  }, true)
  if (success) {
    // updateDeviceSingleCmdInfo(cmdList.value[index])
  }
}

</script>

<style lang='scss' scoped>
.dock-control-panel{
  position: absolute;
  left: calc(100% + 10px);
  top: 0px;
  width: 480px;
  padding: 0 !important;
  background: #000;
  color: #fff;
  border-radius: 2px;

  .dock-control-panel-header{
    border-bottom: 1px solid #515151;
  }

  .control-cmd-wrapper{
    .control-cmd-header{
      font-size: 14px;
      font-weight: 600;
      padding: 10px 10px 0px;

      .debug-btn{
        margin-left: 10px;
        border:1px solid #585858;
      }
    }

    .control-cmd-box{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 4px 10px;
      .control-cmd-item{
        width: 220px;
        height: 58px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #666;
        margin: 4px 0;
        padding: 0 8px;

        .control-cmd-item-left{
          display: flex;
          flex-direction: column;

          .item-label{
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>
