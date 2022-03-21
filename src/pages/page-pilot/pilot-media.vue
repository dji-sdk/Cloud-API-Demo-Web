<template>
  <div
    class="width-100vw height-100vh flex-column flex-justify-start flex-align-start"
  >
    <p class="fz16 ml10 mt10 mb10 color-text-title color-font-bold">
      If Enabled, Pilot will upload photos or videos to the server
      automatically.
    </p>
    <div
      class="flex-row flex-align-center flex-justify-between"
      style="width: 100%"
    >
      <p class="ml10 mb0 fz16" style="color: black">Auto Upload Photos</p>
      <a-switch
        class="mt0 mb0"
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
        v-if="enablePhotoUpload == true"
        v-model:value="photoType"
        defaultChecked="0"
        @change="onPhototype"
      >
        <a-radio :value="0">Original Photo</a-radio>
        <a-radio class="ml20" :value="1">Preview Photo</a-radio>
      </a-radio-group>
    </div>
    <a-divider dashed class="mt10 mb0"></a-divider>

    <div
      class="flex-row flex-align-center flex-justify-between mt10"
      style="width: 100%"
    >
      <p class="ml10 mb0 fz16" style="color: black">Auto Upload Video</p>
      <a-switch
        @change="onVideoUpload"
        v-model:checked="enableVideoUpload"
      ></a-switch>
    </div>
    <a-divider dashed class="mt10 mb0"></a-divider>

    <div
      class="flex-row flex-align-center flex-justify-between mt20"
      style="width: 100%"
    >
      <p class="ml10 mb0 fz16 color-font-bold" style="color: black">
        Path for uploading media resources in dual-controller mode
      </p>
      <a-radio-group
        class="mt0 mb0"
        v-model:value="uploadPath"
        button-style="solid"
        @change="onUploadPath"
      >
        <a-radio-button :value="0">Mine</a-radio-button>
        <a-radio-button :value="1">Another</a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import apiPilot from '/@/api/pilot-bridge'
import { getRoot } from '/@/root'

const root = getRoot()

const enablePhotoUpload = ref<boolean>(true)
const enableVideoUpload = ref<boolean>(false)
const photoType = ref<number>(1)
const uploadPath = ref<number>(0)

onMounted(() => {
  message.info('After setting, please use the physical button of the remote control to return, otherwise the setting is invalid.')

  enablePhotoUpload.value =
    apiPilot.getAutoUploadPhoto() === undefined
      ? true
      : apiPilot.getAutoUploadPhoto()
  enableVideoUpload.value =
    apiPilot.getAutoUploadVideo() === undefined
      ? false
      : apiPilot.getAutoUploadVideo()
  photoType.value =
    apiPilot.getUploadPhotoType() === undefined
      ? 1
      : apiPilot.getUploadPhotoType()
  uploadPath.value =
    apiPilot.getDownloadOwner() === undefined ? 0 : apiPilot.getDownloadOwner()

  console.log(
    enablePhotoUpload.value,
    enableVideoUpload.value,
    photoType.value,
    uploadPath.value
  )
  apiPilot.setComponentParam('media', {
    autoUploadPhoto: enablePhotoUpload.value,
    autoUploadPhotoType: photoType.value,
    autoUploadVideo: enableVideoUpload.value
  })
})
const onPhotoUpload = () => {
  apiPilot.setAutoUploadPhoto(enablePhotoUpload.value)
}
const onVideoUpload = () => {
  console.log(enableVideoUpload.value)
  apiPilot.setAutoUploadVideo(enableVideoUpload.value)
}
const onPhototype = () => {
  console.log(photoType.value)
  apiPilot.setUploadPhotoType(photoType.value)
}
const onUploadPath = (e: any) => {
  apiPilot.setDownloadOwner(uploadPath.value)
}
</script>

<style lang="scss" scoped>
// @import '/@/styles/index.scss';
</style>
