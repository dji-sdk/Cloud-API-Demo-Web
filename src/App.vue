<template>
  <div class="demo-app">
    <a-locale-provider :locale="zhCN">
      <router-view />
    </a-locale-provider>
    <!-- <div class="map-wrapper">
      <GMap/>
    </div> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useMyStore } from './store'
import GMap from '/@/components/GMap.vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
export default defineComponent({
  name: 'App',
  components: { GMap },

  setup () {
    const store = useMyStore()
    return { zhCN }
  }
})
</script>
<style lang="scss" scoped>
.demo-app {
  width: 100%;
  height: 100%;

  .map-wrapper {
    height: 100%;
    width: 100%;
  }
}
</style>

<style lang="scss">
#demo-app {
  width: 100%;
  height: 100%
}
</style>
