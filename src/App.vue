<template>
  <div id="demo-app" class="demo-app">
    <router-view />
    <!-- <div class="map-wrapper">
      <GMap/>
    </div> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useMyStore } from './store'
import GMap from '/@/components/GMap.vue'

export default defineComponent({
  name: 'App',
  components: { GMap },

  setup () {
    const store = useMyStore()
    return {}
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
