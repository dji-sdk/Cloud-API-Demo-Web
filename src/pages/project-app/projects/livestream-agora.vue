<template>
  <div class="flex-column flex-justify-start flex-align-center">
    <p class="fz24">Live streaming source selection</p>
    <div class="flex-row flex-justify-center flex-align-center mt10">
      <a-select
        style="width:150px"
        placeholder="Select Drone"
        @select="onDroneSelect"
      >
        <a-select-option
          v-for="item in dronePara.droneList"
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
          v-for="item in dronePara.cameraList"
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
          v-for="item in dronePara.videoList"
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
    <p class="fz24 mt10">Agora Parameter</p>
    <p class="fz16">
      Note: Obtain The Following Parameters From https://console.agora.io
    </p>
    <div class="flex-row flex-justify-center flex-align-center">
      <a-input v-model:value="agoraPara.appid" placeholder="APP ID"></a-input>
      <a-input
        class="ml10"
        v-model:value="agoraPara.token"
        placeholder="Token"
      ></a-input>
      <a-input
        class="ml10"
        v-model:value="agoraPara.channel"
        placeholder="Channel"
      ></a-input>
    </div>
    <div class="mt20">
      <p class="fz20">
        Livestate:{{ livePara.liveState == false ? 'Stop' : 'Playing' }}
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
    <div id="player"></div>
  </div>
</template>

<script lang="ts" setup>
import AgoraRTC from 'agora-rtc-sdk-ng'
import { onMounted, reactive } from 'vue'
import { CURRENT_CONFIG as config } from '/@/api/http/config'
import { getLiveCapacity, startLivestream, stopLivestream } from '/@/api/manage'
import { getRoot } from '/@/root'

const root = getRoot()

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

let agoraClient = {} as any
const agoraPara = reactive({
  appid: config.agoraAPPID,
  token: config.agoraToken,
  channel: config.agoraChannel,
  uid: null,
  stream: {}
})
const dronePara = reactive({
  livestreamSource: [],
  droneList: [],
  cameraList: [],
  videoList: [],
  droneSelected: '',
  cameraSelected: '',
  videoSelected: '',
  claritySelected: ''
})
const livePara = reactive({
  url: '',
  webrtc: {} as any,
  videoId: '',
  liveState: false
})

const onRefresh = async () => {
  await getLiveCapacity({})
    .then(res => {
      console.log(res)
      if (res.code === 0) {
        if (res.data === null) {
          console.warn('warning: get live capacity is null!!!')
          return
        }
        dronePara.livestreamSource = res.data
        dronePara.droneList = []

        console.log('live_capacity:', dronePara.livestreamSource)

        if (dronePara.livestreamSource) {
          dronePara.livestreamSource.forEach((ele: any) => {
            dronePara.droneList.push({ label: ele.sn, value: ele.sn })
          })
          console.log(dronePara.droneList)
        }
      }
    })
    .catch(error => {
      console.error(error)
    })
}

onMounted(() => {
  onRefresh()
  agoraClient = AgoraRTC.createClient({ mode: 'live', codec: 'h264' })
  agoraClient.setClientRole('audience')

  // Subscribe when a remote user publishes a stream
  agoraClient.on('user-published', async (user: any, mediaType: string) => {
    await agoraClient.subscribe(user, mediaType)
    if (mediaType === 'video') {
      console.log('subscribe success')
      // Get `RemoteVideoTrack` in the `user` object.
      const remoteVideoTrack = user.videoTrack
      // Dynamically create a container in the form of a DIV element for playing the remote video track.
      const remotePlayerContainer: any = document.getElementById('player')
      // Specify the ID of the DIV container. You can use the `uid` of the remote user.
      remotePlayerContainer.id = agoraPara.uid
      remotePlayerContainer.textContent = 'uid: ' + agoraPara.uid
      remotePlayerContainer.style.width = '640px'
      remotePlayerContainer.style.height = '480px'
      remoteVideoTrack.play(remotePlayerContainer)
    }
  })
  agoraClient.on('user-unpublished', async (user: any) => {
    console.log('unpublish live:', user)
    await agoraClient.leave()
  })
})

const handleError = (err: any) => {
  console.error(err)
}
const handleJoinChannel = (uid: any) => {
  agoraPara.uid = uid
}

const onStart = async () => {
  const that = this
  console.log(
    'drone parameter：',
    dronePara.droneSelected,
    dronePara.cameraSelected,
    dronePara.videoSelected,
    dronePara.claritySelected
  )
  const timestamp = new Date().getTime().toString()
  const liveTimestamp = timestamp
  if (
    dronePara.droneSelected == null ||
    dronePara.cameraSelected == null ||
    dronePara.videoSelected == null ||
    dronePara.claritySelected == null
  ) {
    console.warn('waring: not select live para!!!')
  }
  livePara.videoId =
    dronePara.droneSelected +
    '/' +
    dronePara.cameraSelected +
    '/' +
    dronePara.videoSelected
  console.log(agoraPara)
  await agoraClient
    .join(agoraPara.appid, agoraPara.channel, agoraPara.token, null)
    .then((res: any) => {
      console.log('agora uid:', res)
      agoraPara.uid = res
    })
  console.log(agoraPara.token)
  agoraPara.token = encodeURIComponent(agoraPara.token)
  console.log('agoraToken:', agoraPara.token)
  livePara.url =
    'channel=' +
    agoraPara.channel +
    '&sn=' +
    dronePara.droneSelected +
    '&token=' +
    agoraPara.token +
    '&uid=' +
    agoraPara.uid

  await startLivestream({
    url: livePara.url,
    video_id: livePara.videoId,
    url_type: 0,
    video_quality: dronePara.claritySelected
  })
    .then(res => {
      livePara.liveState = true
    })
    .catch(err => {
      console.error(err)
    })
}
const onStop = async () => {
  stopLivestream({
    video_id: livePara.videoId
  }).then(res => {
    livePara.liveState = false
    console.log('stop play livestream')
  })
}
const onDroneSelect = (val: any) => {
  dronePara.droneSelected = val
  if (dronePara.droneSelected) {
    const droneTemp = dronePara.livestreamSource
    droneTemp.forEach(ele => {
      const drone = ele
      if (drone.sn === dronePara.droneSelected) {
        const cameraListTemp = drone.cameras_list
        dronePara.cameraList = []
        cameraListTemp.forEach((ele: any) => {
          dronePara.cameraList.push({ label: ele.name, value: ele.index })
        })
      }
    })
  }
}
const onCameraSelect = (val: any) => {
  dronePara.cameraSelected = val

  if (dronePara.cameraSelected) {
    const droneTemp = dronePara.livestreamSource
    droneTemp.forEach(ele => {
      const drone = ele
      if (drone.sn === dronePara.droneSelected) {
        const cameraListTemp = drone.cameras_list
        cameraListTemp.forEach((ele: any) => {
          const camera = ele
          if (camera.index === dronePara.cameraSelected) {
            const videoListTemp = camera.videos_list
            dronePara.videoList = []
            videoListTemp.forEach((ele: any) => {
              dronePara.videoList.push({ label: ele.type, value: ele.index })
            })
          }
        })
      }
    })
  }
}
const onVideoSelect = (val: any) => {
  dronePara.videoSelected = val
}
const onClaritySelect = (val: any) => {
  dronePara.claritySelected = val
}
</script>

<style lang="scss" scoped>
@import '/@/styles/index.scss';
</style>
