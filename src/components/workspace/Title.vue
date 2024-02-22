<template>
  <div style="height: 40px; line-height: 50px; font-weight: 450;">
    <a-row>
      <a-col :span="1"></a-col>
      <a-col :span="(23 - (extSpan || 0))">{{ title }}</a-col>
      <a-col :span="extSpan"><slot /></a-col>
    </a-row>
  </div>
  <DividerLine />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import DividerLine from '/@/components/workspace/DividerLine.vue'

const props = defineProps < {
  extSpan?: number,
  title: string,
} >()

</script>
