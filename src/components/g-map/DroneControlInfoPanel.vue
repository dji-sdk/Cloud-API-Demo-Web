<template>
<div class="drone-control-info-wrap">
  <a-textarea v-model:value="info" placeholder="drc info" :rows="5" disabled/>
</div>
</template>

<script lang="ts" setup>
import { ref, defineProps, watch } from 'vue'

const props = defineProps<{
    message?: string,
}>()

const info = ref('')
watch(() => props.message, message => {
  info.value = message || ''
}, {
  immediate: true
})

// const emit = defineEmits(['cancel', 'confirm'])
</script>

<style lang="scss" scoped>
.drone-control-info-wrap {
  &::v-deep{
    textarea.ant-input {
      background-color: #000;
      color: #fff;
      white-space: pre-wrap;
    }
  }
}
</style>
