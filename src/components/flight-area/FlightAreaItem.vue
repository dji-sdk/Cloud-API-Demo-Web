<template>
  <div class="panel" style="padding-top: 5px;" :class="{disable: !flightArea.status}">
    <div class="title">
      <a-tooltip :title="flightArea.name">
        <div class="pr10" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ flightArea.name }}</div>
      </a-tooltip>
    </div>
    <div class="mt5 ml10" style="color: hsla(0,0%,100%,0.35);">
      <span class="mr10">Update at {{ formatDateTime(flightArea.update_time).toLocaleString() }}</span>
    </div>
    <div class="flex-row flex-justify-between flex-align-center ml10 mt5" style="color: hsla(0,0%,100%,0.65);">
      <FlightAreaIcon :type="flightArea.type" :isCircle="EGeometryType.CIRCLE === flightArea.content.geometry.type"/>
      <div class="mr10 operate">
        <a-popconfirm v-if="flightArea.status" title="Is it determined to disable the current area?" okText="Disable" @confirm="changeAreaStatus(false)">
          <stop-outlined />
        </a-popconfirm>
        <a-popconfirm v-else @confirm="changeAreaStatus(true)" title="Is it determined to enable the current area?" okText="Enable" >
          <check-circle-outlined />
        </a-popconfirm>
        <EnvironmentFilled class="ml10" @click="clickLocation"/>
        <a-popconfirm title="Is it determined to delete the current area?" okText="Delete" okType="danger" @confirm="deleteArea">
          <delete-outlined class="ml10" />
        </a-popconfirm>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, reactive, defineEmits, computed } from 'vue'
import { GetFlightArea, changeFlightAreaStatus } from '../../api/flight-area'
import FlightAreaIcon from './FlightAreaIcon.vue'
import { formatDateTime } from '../../utils/time'
import { EGeometryType } from '../../types/flight-area'
import { StopOutlined, CheckCircleOutlined, DeleteOutlined, EnvironmentFilled } from '@ant-design/icons-vue'

const props = defineProps<{
  data: GetFlightArea
}>()
const emit = defineEmits(['delete', 'update', 'location'])

const flightArea = computed(() => props.data)
const changeAreaStatus = (status: boolean) => {
  changeFlightAreaStatus(props.data.area_id, status).then(res => {
    if (res.code === 0) {
      flightArea.value.status = status
      emit('update', flightArea)
    }
  })
}
const deleteArea = () => {
  emit('delete', flightArea.value.area_id)
}
const clickLocation = () => {
  emit('location', flightArea.value.area_id)
}

</script>

<style lang="scss" scoped>
.panel {
  background: #3c3c3c;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  height: 90px;
  width: 95%;
  font-size: 13px;
  border-radius: 2px;
  cursor: pointer;

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 30px;
    font-weight: bold;
    margin: 0px 10px 0 10px;
  }
  .operate > *{
    font-size: 16px;
  }
}

.disable {
  opacity: 50%;
}

</style>
