<template>
  <div>
    <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #4f4f4f; font-weight: 450;">
      <a-row>
        <a-col :span="1"></a-col>
        <a-col :span="20">Task Plan Library</a-col>
        <a-col :span="2">
          <span v-if="taskRoute">
            <router-link :to="{ name: ERouterName.CREATE_PLAN}">
              <PlusOutlined class="route-icon"/>
            </router-link>
          </span>
          <span v-else>
            <router-link :to="{ name: ERouterName.TASK}">
              <MinusOutlined class="route-icon"/>
            </router-link>
          </span>
        </a-col>
        <a-col :span="1"></a-col>
      </a-row>
    </div>
    <div v-if="!taskRoute">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ERouterName } from '/@/types/enums'

const route = useRoute()

const taskRoute = computed(() => {
  return route.name === ERouterName.TASK
})
</script>

<style lang="scss">
.route-icon {
  color: #fff;
  font-size: 16px;
}
</style>
