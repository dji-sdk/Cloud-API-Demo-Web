<template>
  <div class="flex-column flex-justify-start flex-align-center">
    <router-link
      style="width: 90%; margin: auto;"
      v-for="item in options"
      :key="item.key"
      :to="item.path"
      :class="{
        'menu-item': true,
      }"
    >
    <a-button
      class="mt10"
      style="width:100%;"
      type="primary"
      @click="selectLivestream(item.routeName)"
      >{{ item.label }}</a-button
    >
    </router-link>
  </div>
  <div class="live" v-if="showLive">
    <a style="position: absolute; right: 10px; top: 10px; font-size: 16px; color: white;" @click="() => root.$router.push('/' + ERouterName.LIVESTREAM)"><CloseOutlined /></a>
    <router-view :name="routeName" />
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { onMounted, ref, watch } from 'vue'
import { CloseOutlined } from '@ant-design/icons-vue'
import { getRoot } from '/@/root'
import { ERouterName } from '/@/types'
const root = getRoot()
const routeName = ref<string>()
const showLive = ref<boolean>(false)

const options = [
  { key: 0, label: 'Agora Live', path: '/' + ERouterName.LIVESTREAM + '/' + ERouterName.LIVING, routeName: 'LiveAgora' },
  { key: 1, label: 'RTMP/GB28181 Live', path: '/' + ERouterName.LIVESTREAM + '/' + ERouterName.LIVING, routeName: 'LiveOthers' }
]

const selectLivestream = (route: string) => {
  routeName.value = route
}

onMounted(() => {
  watch(() => root.$route.name, data => {
    showLive.value = data === ERouterName.LIVING
  },
  {
    deep: true
  })
})
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
.live {
  position: absolute;
  z-index: 1;
  right: 50%;
  left: 50%;
  top: 50%;
  margin: auto;
  transform: translate(-50%, -50%);
  text-align: center;
  width: 800px;
  height: 700px;
  background: #232323;
}
</style>
