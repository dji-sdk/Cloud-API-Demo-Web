<template>
  <a-layout>
  <div class="width100 flex-column flex-justify-start flex-align-start" style="background-color: white;">

    <p class="fz16 ml10 mt15 mb10 color-text-title color-font-bold" style="color: #939393">
      When enabled, photos and videos will be automatically uploaded to this server
    </p>
    <div
      class="flex-row flex-align-center mt20"
      style="width: 100%;"
    >
      <p class="ml10 mb0 fz16" style="margin-right: 73vw;">Auto Photo Upload</p>
      <a-switch
        v-model:checked="enablePhotoUpload"
        @change="onPhotoUpload"
      ></a-switch>
    </div>
    <div
      class="flex-row flex-align-center flex-justify-between"
      style="width: 100%"
    >
      <a-radio-group
        class="mt10 ml20"
        v-if="enablePhotoUpload === true"
        v-model:value="photoType"
        defaultChecked="0"
        @change="onPhototype"
      >
        <a-radio :value="EPhotoType.Original">Original Photo</a-radio>
        <a-radio class="ml20" :value="EPhotoType.Preview">Preview Photo</a-radio>
      </a-radio-group>
    </div>
    <div class="ml10 mr10" style="width: 96%; margin-top: -10px;">
      <a-divider />
    </div>
    <div
      class="flex-row flex-align-center"
      style="width: 100%; margin-top: -10px;"
    >
      <p class="ml10 mb0 fz16" style="margin-right: 73vw;">Auto Video Upload</p>
      <a-switch
        @change="onVideoUpload"
        v-model:checked="enableVideoUpload"
      ></a-switch>
    </div>
    <div class="ml10 mr10" style="width: 96%; margin-top: -10px;">
      <a-divider />
    </div>
    <div
      class="flex-row flex-align-center flex-justify-between mb15"
      style="width: 100%; margin-top: -10px;"
    >
      <p class="ml10 mb0 fz16 color-font-bold">
        Path for uploading media resources in dual-controller mode
      </p>
      <a-radio-group
        class="mt0 mb0"
        v-model:value="uploadPath"
        button-style="solid"
        @change="onUploadPath"
      >
        <a-radio-button :value="EDownloadOwner.Mine">Mine</a-radio-button>
        <a-radio-button :value="EDownloadOwner.Others">Another</a-radio-button>
      </a-radio-group>
    </div>
  </div>
  </a-layout>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import apiPilot from '/@/api/pilot-bridge'
import { getRoot } from '/@/root'
import { EComponentName, EPhotoType, EDownloadOwner } from '/@/types'

const root = getRoot()

const enablePhotoUpload = ref<boolean>(apiPilot.getAutoUploadPhoto())
const enableVideoUpload = ref<boolean>(apiPilot.getAutoUploadVideo())
const photoType = ref<number>(apiPilot.getUploadPhotoType())
const uploadPath = ref<number>(apiPilot.getDownloadOwner())

const onPhotoUpload = () => {
  apiPilot.setAutoUploadPhoto(enablePhotoUpload.value)
}
const onVideoUpload = () => {
  apiPilot.setAutoUploadVideo(enableVideoUpload.value)
}
const onPhototype = () => {
  apiPilot.setUploadPhotoType(photoType.value)
}
const onUploadPath = (e: any) => {
  apiPilot.setDownloadOwner(uploadPath.value)
}
onMounted(() => {
  console.error(apiPilot.getUploadPhotoType())
  console.error(apiPilot.getAutoUploadVideo())
})
</script>

<style lang="scss" scoped>
// @import '/@/styles/index.scss';
</style>
