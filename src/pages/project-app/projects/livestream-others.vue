<template>
  <div class="flex-column flex-justify-start flex-align-center">
    <video
      :style="{ width: '720px', height: '480px' }"
      id="video-webrtc"
      ref="videowebrtc"
      controls
      class="mt20"
    ></video>
    <p class="fz24">Live streaming source selection</p>
    <div class="flex-row flex-justify-center flex-align-center mt10">
      <a-select
        style="width: 150px"
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
      <a-select
        class="ml10"
        style="width:150px"
        placeholder="Select Drone"
        @select="onDroneSelect"
      >
        <a-select-option
          v-for="item in droneList"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</a-select-option
        >
      </a-select>
      <a-select
        class="ml10"
        style="width:150px"
        placeholder="Select Camera"
        @select="onCameraSelect"
      >
        <a-select-option
          v-for="item in cameraList"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</a-select-option
        >
      </a-select>
      <a-select
        class="ml10"
        style="width:150px"
        placeholder="Select Lens"
        @select="onVideoSelect"
      >
        <a-select-option
          class="ml10"
          v-for="item in videoList"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</a-select-option
        >
      </a-select>
      <a-select
        class="ml10"
        style="width:150px"
        placeholder="Select Clarity"
        @select="onClaritySelect"
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
      <p class="fz20">Livestate:{{ liveState == 0 ? 'Stop' : 'Playing' }}</p>
      <p class="fz10" v-if="livetypeSelected == 2">
        Please use VLC media player to play the RTSP livestream !!!
      </p>
      <p class="fz10" v-if="livetypeSelected == 2">
        RTSP Parameter:{{ rtspData }}
      </p>
    </div>
    <div class="mt10 flex-row flex-justify-center flex-align-center">
      <a-button type="primary" large @click="onStart">Play</a-button>
      <a-button class="ml20" type="primary" large @click="onStop"
        >Stop</a-button
      >
      <a-button class="ml20" type="primary" large @click="onRefresh"
        >Refresh Live Capacity</a-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { CURRENT_CONFIG as config } from '/@/api/http/config'
import { getLiveCapacity, startLivestream, stopLivestream } from '/@/api/manage'
import { getRoot } from '/@/root'
import jswebrtc from '/@/vendors/jswebrtc.min.js'
const root = getRoot()

const liveTypeList = [
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
  }
]
const clarityList = [
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
const videoSeleted = ref()
const claritySeleted = ref()
const videoId = ref()
const liveState = ref(0)
const livetypeSelected = ref()
const rtspData = ref()

const onRefresh = async () => {
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
        console.log(livestreamSource)

        const temp: Array<{}> = []
        if (livestreamSource.value) {
          livestreamSource.value.forEach(ele => {
            temp.push({ label: ele.sn, value: ele.sn })
          })
          console.log(temp)
          droneList.value = temp
          console.log(droneList.value)
        }
      }
    })
    .catch(error => {
      console.error(error)
    })
}

onMounted(() => {
  onRefresh()
})
const onStart = async () => {
  const that = this
  console.log(
    '直播参数：',
    livetypeSelected.value,
    droneSelected.value,
    cameraSelected.value,
    videoSeleted.value,
    claritySeleted.value
  )
  const timestamp = new Date().getTime().toString()
  const liveTimestamp = timestamp
  if (
    livetypeSelected.value == null ||
    droneSelected.value == null ||
    cameraSelected.value == null ||
    videoSeleted.value == null ||
    claritySeleted.value == null
  ) {
    console.warn('waring: not select live para!!!')
    return
  }
  videoId.value =
    droneSelected.value + '/' + cameraSelected.value + '/' + videoSeleted.value
  let liveURL = ''
  switch (livetypeSelected.value) {
    case 1: {
      // RTMP
      liveURL = config.rtmpURL + timestamp
      break
    }
    case 2: {
      // RTSP
      liveURL = config.rtspPara
      break
    }
    case 3: {
      // GB28181
      liveURL = config.gb28181Para
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
    video_quality: claritySeleted.value
  })
    .then(res => {
      if (livetypeSelected.value === 3) {
        const url = res.data.url
        const videoElement = videowebrtc.value
        // gb28181,it will fail if not wait.
        message.loading({
          content: '直播等待中。。。',
          duration: 4,
          onClose () {
            const player = new jswebrtc.Player(url, {
              video: videoElement,
              autoplay: true,
              onPlay: obj => {
                console.log('start play livestream')
              }
            })
            liveState.value = 1
          }
        })
      } else if (livetypeSelected.value === 2) {
        console.log(res)
        rtspData.value =
          'url:' +
          res.data.url +
          '&username:' +
          res.data.username +
          '&password:' +
          res.data.password
      } else if (livetypeSelected.value === 1) {
        const url = res.data.url
        const videoElement = videowebrtc.value
        console.log('start live:', url)
        const player = new jswebrtc.Player(url, {
          video: videoElement,
          autoplay: true,
          onPlay: obj => {
            console.log('start play livestream')
            liveState.value = 1
          }
        })
      }
    })
    .catch(err => {
      console.error(err)
    })
}
const onStop = () => {
  stopLivestream({
    video_id: videoId.value
  }).then(res => {
    liveState.value = 0
    console.log('stop play livestream')
  })
}
const onLiveTypeSelect = (val: any) => {
  livetypeSelected.value = val
}
const onDroneSelect = (val: any) => {
  droneSelected.value = val
  const temp: Array<{}> = []
  if (droneSelected.value) {
    const droneTemp = livestreamSource.value
    droneTemp.forEach(ele => {
      const drone = ele
      if (drone.sn === droneSelected.value) {
        const cameraListTemp = drone.cameras_list
        cameraListTemp.forEach(ele => {
          temp.push({ label: ele.name, value: ele.index })
        })
        cameraList.value = temp
      }
    })
  }
}
const onCameraSelect = (val: any) => {
  cameraSelected.value = val
  const result: Array<{}> = []
  if (cameraSelected.value) {
    const droneTemp = livestreamSource.value
    droneTemp.forEach(ele => {
      const drone = ele
      if (drone.sn === droneSelected.value) {
        const cameraListTemp = drone.cameras_list
        cameraListTemp.forEach(ele => {
          const camera = ele
          if (camera.index === cameraSelected.value) {
            const videoListTemp = camera.videos_list
            videoListTemp.forEach(ele => {
              result.push({ label: ele.type, value: ele.index })
            })
            videoList.value = result
          }
        })
      }
    })
  }
}
const onVideoSelect = (val: any) => {
  videoSeleted.value = val
}
const onClaritySelect = (val: any) => {
  claritySeleted.value = val
}
</script>

<style lang="scss" scoped>
@import '/@/styles/index.scss';
</style>
