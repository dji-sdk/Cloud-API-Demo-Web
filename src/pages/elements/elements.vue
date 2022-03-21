<template>
  <div class="element-map-wrapper">
     <GMap/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import GMap from '/@/components/GMap.vue'
export default defineComponent({
  name: 'Elements',
  components: { GMap },
  setup () {
    return {
    }
  },
})
</script>

<style lang="scss" scoped>
</style>
