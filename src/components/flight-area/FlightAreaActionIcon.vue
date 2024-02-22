<template>
  <div @click="selectCurrent">
    <a-dropdown class="height-100 width-100 icon-panel">
        <FlightAreaIcon :type="actionMap[selectedKey].type" :is-circle="actionMap[selectedKey].isCircle" :hide-title="true"/>
        <template #overlay>
          <a-menu @click="selectAction" mode="vertical-right" :selectedKeys="[selectedKey]">
            <a-menu-item v-for="(v, k) in actionMap" :key="k">
              <FlightAreaIcon :type="v.type" :is-circle="v.isCircle"/>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue'
import { EFlightAreaType } from '../../types/flight-area'
import FlightAreaIcon from './FlightAreaIcon.vue'

const emit = defineEmits(['select-action', 'click'])

const actionMap: Record<string, { type: EFlightAreaType, isCircle: boolean}> = {
  1: {
    type: EFlightAreaType.DFENCE,
    isCircle: true,
  },
  2: {
    type: EFlightAreaType.DFENCE,
    isCircle: false,
  },
  3: {
    type: EFlightAreaType.NFZ,
    isCircle: true,
  },
  4: {
    type: EFlightAreaType.NFZ,
    isCircle: false,
  },

}

const selectedKey = ref<string>('1')
const selectAction = (item: any) => {
  selectedKey.value = item.key
  emit('select-action', actionMap[item.key])
}
const selectCurrent = () => {
  emit('click', actionMap[selectedKey.value])
}
</script>

<style lang="scss">
  .icon-panel {
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
</style>
