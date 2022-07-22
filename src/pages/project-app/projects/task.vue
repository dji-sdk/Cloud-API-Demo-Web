<template>
  <div>
    <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #4f4f4f; font-weight: 450;">
      <a-row>
        <a-col :span="1"></a-col>
        <a-col :span="20">Task Plan Library</a-col>
        <a-col :span="2">
          <span v-if="!createPlanTip">
            <router-link :to="{ name: 'create-plan'}">
              <PlusOutlined style="color: white; font-size: 16px;" @click="() => createPlanTip = true"/>
            </router-link>
          </span>
          <span v-else>
            <router-link :to="{ name: 'task'}">
              <MinusOutlined style="color: white; font-size: 16px;" @click="() => createPlanTip = false"/>
            </router-link>
          </span>
        </a-col>
        <a-col :span="1"></a-col>
      </a-row>
    </div>
    <div v-if="createPlanTip">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue'
import { onMounted, onUnmounted, ref } from 'vue'

const createPlanTip = ref(false)

</script>

<style lang="scss">

</style>
