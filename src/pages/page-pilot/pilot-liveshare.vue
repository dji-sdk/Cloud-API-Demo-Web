<template>
  <div
    class="width-100vw height-100vh flex-column flex-justify-start flex-align-start"
  >
    <div
      class="mt20 flex-row flex-align-center flex-justify-between"
      style="width: 100%"
    >
      <p class="ml10 mb0 fz16" style="color: black">
        Select Video Publish Mode:
      </p>
      <a-select
        style="width: 200px"
        placeholder="Select Mode"
        @select="onPublishModeSelect"
      >
        <a-select-option
          v-for="item in publishModeList"
          :key="item.label"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>

    <a-divider dashed class="mt10 mb0"></a-divider>

    <div
      class="flex-row flex-align-center flex-justify-between mt10"
      style="width: 100%"
    >
      <p class="ml10 mb0 fz16" style="color: black">Select Live Share Type:</p>
      <a-select
        style="width: 200px"
        placeholder="Select Live Type"
        @select="onLiveTypeSelect"
      >
        <a-select-option
          v-for="item in liveTypeList"
          :key="item.label"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>
    <a-divider dashed class="mt10 mb0"></a-divider>

    <div
      class="flex-row flex-align-center flex-justify-center mt20"
      style="width: 100%"
    >
      <p>Live Share State: {{ liveState }}</p>
    </div>
    <div
      class="flex-row flex-align-center flex-justify-center mt20"
      style="width: 100%"
    >
      <a-button type="primary" @click="onPlay">Play</a-button>
      <a-button class="ml20" type="primary" @click="onGetConfig"
        >Get Config</a-button
      >
      <a-button class="ml20" type="primary" @click="onGetStatus"
        >Get Status</a-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { CURRENT_CONFIG as config } from '/@/api/http/config'
import apiPilot from '/@/api/pilot-bridge'
import { getRoot } from '/@/root'

const root = getRoot()

const publishModeList = [
  {
    value: 'video-on-demand',
    label: 'video-on-demand'
  },
  {
    value: 'video-by-manual',
    label: 'video-by-manual'
  },
  {
    value: 'video-demand-aux-manual',
    label: 'video-demand-aux-manual'
  }
]
const liveTypeList = [
  {
    value: 1,
    label: 'AGORA'
  },
  {
    value: 2,
    label: 'RTMP'
  },
  {
    value: 3,
    label: 'RTSP'
  },
  {
    value: 4,
    label: 'GB28181'
  }
]
const agoraParam = {
  uid: config.agoraAPPID,
  token: config.agoraToken,
  channelId: config.agoraChannel
}
const rtmpParam = {
  url: config.rtmpURL + '12345'
}
const rtspParam = {
  userName: 'dji-live-share',
  password: '12345678',
  port: '8554'
}
const gb28181Param = {
  serverIp: '114.55.103.238',
  serverPort: '5060',
  serverId: '34020000002000000001',
  agentId: '34020000001310000004',
  password: '12345678',
  agentPort: '7060',
  agentChannel: '34020000001310000004'
}
const liveState = ref<string>('STOP')
const livetypeSelected = ref<number>(1)
const publishModeSelected = ref<string>('video-demand-aux-manual')

onMounted(() => {
  const status: any = apiPilot.getLiveshareStatus()
  console.log(status)
  // liveState.value =
  //   status.status === 0
  //     ? 'Cannot connect to server'
  //     : status.status === 1
  //       ? 'Connect to server'
  //       : 'Playing'

  // console.log(liveState.value)
})
const onLiveTypeSelect = (val: any) => {
  livetypeSelected.value = val
  message.info('set livetype:' + livetypeSelected.value, 5)
}
const onPublishModeSelect = (val: string) => {
  publishModeSelected.value = val
  message.info(
    'set publish mode res:' +
      apiPilot.setVideoPublishType(publishModeSelected.value),
    5
  )
}
const onPlay = () => {
  switch (livetypeSelected.value) {
    case 1: {
      message.info('agoraParam:' + JSON.stringify(agoraParam))
      apiPilot.setLiveshareConfig(1, JSON.stringify(agoraParam))
      apiPilot.startLiveshare()
      break
    }
    case 2: {
      message.info('rtmpParam:' + JSON.stringify(rtmpParam))
      apiPilot.setLiveshareConfig(2, JSON.stringify(rtmpParam))
      message.info(apiPilot.startLiveshare())
      break
    }
    case 3: {
      message.info('rtspParam:' + JSON.stringify(rtspParam))
      apiPilot.setLiveshareConfig(3, JSON.stringify(rtspParam))
      apiPilot.startLiveshare()
      break
    }
    case 4: {
      message.info('gb28181Param:' + JSON.stringify(gb28181Param))
      apiPilot.setLiveshareConfig(4, JSON.stringify(gb28181Param))
      apiPilot.startLiveshare()
      break
    }
  }
}
const onGetStatus = () => {
  const status = apiPilot.getLiveshareStatus()
  message.info(status, 5)
}
const onGetConfig = () => {
  const status = apiPilot.getLiveshareConfig()
  message.info(status, 5)
}
</script>

<style lang="scss" scoped>
// @import '/@/styles/index.scss';
</style>
