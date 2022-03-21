<template>
  <div class="flex-column flex-justify-start flex-align-center">
    <a-button
      class="mt10  "
      style="width:90%"
      type="primary"
      @click="onAgoraLiveStream"
      >Agora Live</a-button
    >
    <a-button
      class="mt10"
      style="width:90%"
      type="primary"
      @click="onOthersLive"
      >RTMP/GB28181 Live</a-button
    >
  </div>
  <div v-if="enableAgoraLive">
    <a-modal
      style="top:0"
      v-model:visible="enableAgoraLive"
      title="Agora Live"
      width="100%"
      :maskClosable="false"
      wrapClassName="full-modal"
      :footer="null"
    >
      <LiveAgora />
    </a-modal>
  </div>
  <div v-if="enableOthersLive">
    <a-modal
      style="top:0"
      v-model:visible="enableOthersLive"
      title="RTMP/GB28181/RTSP Live"
      width="100%"
      :maskClosable="false"
      wrapClassName="full-modal"
      :footer="null"
    >
      <LiveOthers />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import LiveAgora from './livestream-agora.vue'
import LiveOthers from './livestream-others.vue'
import { getRoot } from '/@/root'
const root = getRoot()

const enableAgoraLive = ref(false)
const enableOthersLive = ref(false)
const onAgoraLiveStream = () => {
  console.log('agora')
  enableAgoraLive.value = true
}
const onOthersLive = () => {
  console.log('liveview')
  enableOthersLive.value = true
}
</script>

<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
