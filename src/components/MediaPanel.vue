<template>
  <div class="media-panel-wrapper">
    <div class="header">Media</div>
    <a-button type="primary" style="margin-top:20px" @click="onRefresh"
      >Refresh</a-button
    >
    <a-table class="media-table" :columns="columns" :data-source="data">
      <template #name="{ text, record }">
        <a :href="record.preview_url">{{ text }}</a>
      </template>
      <template #action>
        <span class="action-area">
          action
        </span>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import { getMediaFiles } from '/@/api/media'
const columns = [
  {
    title: 'FileName',
    dataIndex: 'name',
    key: 'name',
    slots: { customRender: 'name' }
  },
  {
    title: 'FileSize',
    dataIndex: 'size',
    key: 'size'
  },
  {
    title: 'PayloadType',
    dataIndex: 'payload_type',
    key: 'payload_type',
    ellipsis: true
  },
  {
    title: 'Action',
    key: 'action',
    slots: { customRender: 'action' }
  }
]
const data = ref([
  {
    key: '1',
    name: 'name1',
    size: 32,
    payload_type: 'PM320_DUAL',
    preview_url: ''
  }
])
const onRefresh = async () => {
  const wid = localStorage.getItem('workspace-id')
  data.value = []
  const index = 1
  const res = await getMediaFiles(wid, {})
  res.data.forEach(ele => {
    data.value.push({
      key: index.toString(),
      name: ele.file_name
    })
  })
  console.log(res)
}
</script>

<style lang="scss" scoped>
.media-panel-wrapper {
  width: 100%;
  .media-table {
    background: #fff;
    margin-top: 32px;
  }
  .header {
    width: 100%;
    height: 60px;
    background: #fff;
    padding: 16px 24px;
    font-size: 20px;
    text-align: start;
    color: #000;
  }
  .action-area {
    color: $primary;
    cursor: pointer;
  }
}
</style>
