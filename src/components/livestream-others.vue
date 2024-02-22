<template>
  <div class="flex-column flex-justify-start flex-align-center">
    <video
      :style="{ width: '720px', height: '480px' }"
      id="video-webrtc"
      ref="videowebrtc"
      controls
      autoplay
      class="mt20"
    ></video>
    <p class="fz24">Live streaming source selection</p>

    <div class="flex-row flex-justify-center flex-align-center mt10">
      <template v-if="liveState && isDockLive">
        <span class="mr10">Lens:</span>
        <a-radio-group v-model:value="lensSelected" button-style="solid">
          <a-radio-button v-for="lens in lensList" :key="lens" :value="lens">{{lens}}</a-radio-button>
        </a-radio-group>
      </template>
      <template v-else>
      <a-select
        style="width: 150px"
        placeholder="Select Live Type"
        @select="onLiveTypeSelect"
        v-model:value="livetypeSelected"
      >
        <a-select-option
          v-for="item in liveTypeList"
          :key="item.label"
          :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <a-select
        class="ml10"
        style="width:150px"
        placeholder="Select Drone"
        v-model:value="droneSelected"
      >
        <a-select-option
          v-for="item in droneList"
          :key="item.value"
          :value="item.value"
          @click="onDroneSelect(item)"
          >{{ item.label }}</a-select-option
        >
      </a-select>
      <a-select
        class="ml10"
        style="width:150px"
        placeholder="Select Camera"
        v-model:value="cameraSelected"
      >
        <a-select-option
          v-for="item in cameraList"
          :key="item.value"
          :value="item.value"
          @click="onCameraSelect(item)"
          >{{ item.label }}</a-select-option
        >
      </a-select>
      <!-- <a-select
        class="ml10"
        style="width:150px"
        placeholder="Select Lens"
        v-model:value="videoSelected"
      >
        <a-select-option
          v-for="item in videoList"
          :key="item.value"
          :value="item.value"
          @click="onVideoSelect(item)"
          >{{ item.label }}</a-select-option
        >
      </a-select> -->
      </template>
      <a-select
        class="ml10"
        style="width:150px"
        placeholder="Select Clarity"
        @select="onClaritySelect"
        v-model:value="claritySelected"
      >
        <a-select-option
          v-for="item in clarityList"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</a-select-option
        >
      </a-select>
    </div>
    <div class="mt20">
      <p class="fz10" v-if="livetypeSelected == 2">
        Please use VLC media player to play the RTSP livestream !!!
      </p>
      <p class="fz10" v-if="livetypeSelected == 2">
        RTSP Parameter:{{ rtspData }}
      </p>
    </div>
    <div class="mt10 flex-row flex-justify-center flex-align-center">
      <a-button v-if="liveState && isDockLive" type="primary" large @click="onSwitch">Switch Lens</a-button>
      <a-button v-else type="primary" large @click="onStart">Play</a-button>
      <a-button class="ml20" type="primary" large @click="onStop"
        >Stop</a-button
      >
      <a-button class="ml20" type="primary" large @click="onUpdateQuality"
        >Update Clarity</a-button
      >
      <a-button v-if="!liveState || !isDockLive" class="ml20" type="primary" large @click="onRefresh"
        >Refresh Live Capacity</a-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'
import { CURRENT_CONFIG as config } from '/@/api/http/config'
import { changeLivestreamLens, getLiveCapacity, setLivestreamQuality, startLivestream, stopLivestream } from '/@/api/manage'
import { getRoot } from '/@/root'
import jswebrtc from '/@/vendors/jswebrtc.min.js'
import srs from '/@/vendors/srs.sdk.js'

const root = getRoot()

interface SelectOption {
  value: any,
  label: string,
  more?: any
}

const liveTypeList: SelectOption[] = [
  {
    value: 1,
    label: 'RTMP'
  },
  {
    value: 2,
    label: 'RTSP'
  },
  {
    value: 3,
    label: 'GB28181'
  },
  {
    value: 4,
    label: 'WEBRTC'
  }
]
const clarityList: SelectOption[] = [
  {
    value: 0,
    label: 'Adaptive'
  },
  {
    value: 1,
    label: 'Smooth'
  },
  {
    value: 2,
    label: 'Standard'
  },
  {
    value: 3,
    label: 'HD'
  },
  {
    value: 4,
    label: 'Super Clear'
  }
]

const videowebrtc = ref(null)
const livestreamSource = ref()
const droneList = ref()
const cameraList = ref()
const videoList = ref()
const droneSelected = ref()
const cameraSelected = ref()
const videoSelected = ref()
const claritySelected = ref()
const videoId = ref()
const liveState = ref<boolean>(false)
const livetypeSelected = ref()
const rtspData = ref()
const lensList = ref<string[]>([])
const lensSelected = ref<String>()
const isDockLive = ref(false)
const nonSwitchable = 'normal'
let webrtc: any = null

const onRefresh = async () => {
  droneList.value = []
  cameraList.value = []
  videoList.value = []
  droneSelected.value = null
  cameraSelected.value = null
  videoSelected.value = null
  await getLiveCapacity({})
    .then(res => {
      console.log(res)
      if (res.code === 0) {
        if (res.data === null) {
          console.warn('warning: get live capacity is null!!!')
          return
        }
        const resData: Array<[]> = res.data
        console.log('live_capacity:', resData)
        livestreamSource.value = resData

        const temp: Array<SelectOption> = []
        if (livestreamSource.value) {
          livestreamSource.value.forEach((ele: any) => {
            temp.push({ label: ele.name + '-' + ele.sn, value: ele.sn, more: ele.cameras_list })
          })
          droneList.value = temp
        }
      }
    })
    .catch(error => {
      message.error(error)
      console.error(error)
    })
}

onMounted(() => {
  onRefresh()
})
const onStart = async () => {
  console.log(
    'Param:',
    livetypeSelected.value,
    droneSelected.value,
    cameraSelected.value,
    videoSelected.value,
    claritySelected.value
  )
  const timestamp = new Date().getTime().toString()
  if (
    livetypeSelected.value == null ||
    droneSelected.value == null ||
    cameraSelected.value == null ||
    claritySelected.value == null
  ) {
    message.warn('waring: not select live para!!!')
    return
  }
  videoId.value =
    droneSelected.value + '/' + cameraSelected.value + '/' + (videoSelected.value || nonSwitchable + '-0')

  let liveURL = ''
  switch (livetypeSelected.value) {
    case 1: {
      // RTMP
      liveURL = config.rtmpURL + timestamp
      break
    }
    case 2: {
      // RTSP
      liveURL = `userName=${config.rtspUserName}&password=${config.rtspPassword}&port=${config.rtspPort}`
      break
    }
    case 3: {
      liveURL = `serverIP=${config.gbServerIp}&serverPort=${config.gbServerPort}&serverID=${config.gbServerId}&agentID=${config.gbAgentId}&agentPassword=${config.gbPassword}&localPort=${config.gbAgentPort}&channel=${config.gbAgentChannel}`
      break
    }
    case 4: {
      break
    }
    default:
      console.warn('warning: live type is not correct!!!')
      break
  }
  await startLivestream({
    url: liveURL,
    video_id: videoId.value,
    url_type: livetypeSelected.value,
    video_quality: claritySelected.value
  })
    .then(res => {
      if (res.code !== 0) {
        return
      }
      if (livetypeSelected.value === 3) {
        const url = res.data.url
        const videoElement = videowebrtc.value
        // gb28181,it will fail if not wait.
        message.loading({
          content: 'Loding...',
          duration: 4,
          onClose () {
            const player = new jswebrtc.Player(url, {
              video: videoElement,
              autoplay: true,
              onPlay: (obj: any) => {
                console.log('start play livestream')
              }
            })
          }
        })
      } else if (livetypeSelected.value === 2) {
        console.log(res)
        rtspData.value = 'url:' + res.data.url
      } else if (livetypeSelected.value === 1) {
        const url = res.data.url
        const videoElement = videowebrtc.value
        console.log('start live:', url)
        console.log(videoElement)
        const player = new jswebrtc.Player(url, {
          video: videoElement,
          autoplay: true,
          onPlay: (obj: any) => {
            console.log('start play livestream')
          }
        })
      } else if (livetypeSelected.value === 4) {
        const videoElement = videowebrtc.value as unknown as HTMLMediaElement
        videoElement.muted = true
        playWebrtc(videoElement, res.data.url)
      }
      liveState.value = true
    })
    .catch(err => {
      console.error(err)
    })
}
const onStop = () => {
  videoId.value =
    droneSelected.value + '/' + cameraSelected.value + '/' + (videoSelected.value || nonSwitchable + '-0')

  stopLivestream({
    video_id: videoId.value
  }).then(res => {
    if (res.code === 0) {
      message.success(res.message)
      liveState.value = false
      lensSelected.value = undefined
      console.log('stop play livestream')
    }
  })
}

const onUpdateQuality = () => {
  if (!liveState.value) {
    message.info('Please turn on the livestream first.')
    return
  }
  setLivestreamQuality({
    video_id: videoId.value,
    video_quality: claritySelected.value
  }).then(res => {
    if (res.code === 0) {
      message.success('Set the clarity to ' + clarityList[claritySelected.value].label)
    }
  })
}

const onLiveTypeSelect = (val: any) => {
  livetypeSelected.value = val
}
const onDroneSelect = (val: SelectOption) => {
  droneSelected.value = val.value
  const temp: Array<SelectOption> = []
  cameraList.value = []
  cameraSelected.value = undefined
  videoSelected.value = undefined
  videoList.value = []
  lensList.value = []
  if (!val.more) {
    return
  }
  val.more.forEach((ele: any) => {
    temp.push({ label: ele.name, value: ele.index, more: ele.videos_list })
  })
  cameraList.value = temp
}
const onCameraSelect = (val: SelectOption) => {
  cameraSelected.value = val.value
  const result: Array<SelectOption> = []
  videoSelected.value = undefined
  videoList.value = []
  lensList.value = []
  if (!val.more) {
    return
  }

  val.more.forEach((ele: any) => {
    result.push({ label: ele.type, value: ele.index, more: ele.switch_video_types })
  })
  videoList.value = result
  if (videoList.value.length === 0) {
    return
  }
  const firstVideo: SelectOption = videoList.value[0]
  videoSelected.value = firstVideo.value
  lensList.value = firstVideo.more
  lensSelected.value = firstVideo.label
  isDockLive.value = lensList.value?.length > 0
}
const onVideoSelect = (val: SelectOption) => {
  videoSelected.value = val.value
  lensList.value = val.more
  lensSelected.value = val.label
}
const onClaritySelect = (val: any) => {
  claritySelected.value = val
}
const onSwitch = () => {
  if (lensSelected.value === undefined || lensSelected.value === nonSwitchable) {
    message.info('The ' + nonSwitchable + ' lens cannot be switched, please select the lens to be switched.', 8)
    return
  }
  changeLivestreamLens({
    video_id: videoId.value,
    video_type: lensSelected.value
  }).then(res => {
    if (res.code === 0) {
      message.success('Switching live camera successfully.')
    }
  })
}
const playWebrtc = (videoElement: HTMLMediaElement, url: string) => {
  if (webrtc) {
    webrtc.close()
  }
  webrtc = new srs.SrsRtcWhipWhepAsync()
  videoElement.srcObject = webrtc.stream
  webrtc.play(url).then(function (session: any) {
    console.info(session)
  }).catch(function (reason: any) {
    webrtc.close()
    console.error(reason)
  })
}
</script>

<style lang="scss" scoped>
@import '/@/styles/index.scss';
</style>
