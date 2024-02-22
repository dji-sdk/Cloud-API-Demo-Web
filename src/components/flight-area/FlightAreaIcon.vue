<template>
  <div class="flex-row flex-align-center">
    <div class="shape" :class="type" :style="isCircle ? 'border-radius: 50%;' : ''"></div>
    <div class="ml5" v-if="!hideTitle">{{ FlightAreaTypeTitleMap[type][isCircle ? EGeometryType.CIRCLE : EGeometryType.POLYGON] }}</div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { EFlightAreaType, EGeometryType, FlightAreaTypeTitleMap } from '../../types/flight-area'

const props = defineProps<{
  type: EFlightAreaType,
  isCircle: boolean,
  hideTitle?: boolean
}>()

</script>

<style lang="scss">
  .nfz {
    border-color: red;
  }
  .dfence {
    border-color: $tag-green;
  }
  .shape {
    width: 16px;
    height: 16px;
    border-width: 3px;
    border-style: solid;
  }
</style>
