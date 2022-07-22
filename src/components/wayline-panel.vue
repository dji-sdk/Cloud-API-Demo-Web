<template>
  <div class="panel-wrapper" draggable="true">
    <div class="header">Wayline Library</div>
    <a-button type="primary" style="margin-top:20px" @click="onRefresh"
      >Refresh</a-button
    >
    <a-table class="table" :columns="columns" :data-source="data">
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
import { onMounted } from 'vue'
import { ELocalStorageKey } from '../types/enums'
import { getWaylineFiles } from '/@/api/wayline'
const columns = [
  {
    title: 'FileName',
    dataIndex: 'name',
    key: 'name',
    slots: { customRender: 'name' }
  },
  {
    title: 'TemplateType',
    dataIndex: 'template_type',
    key: 'template_type'
  },
  {
    title: 'Favorited',
    dataIndex: 'favorite',
    key: 'favorite'
  },
  {
    title: 'DroneType',
    dataIndex: 'drone_type',
    key: 'drone_type'
  },
  {
    title: 'PayloadType',
    dataIndex: 'payload_type',
    key: 'payload_type'
  },
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user'
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
    template_type: '0',
    drone_type: '0-60-0',
    payload_type: 'PM320_DUAL',
    user: 'pilot',
    favorited: 'true'
  }
])
onMounted(() => {
  onRefresh()
})
const onRefresh = async () => {
  const wid: string = localStorage.getItem(ELocalStorageKey.WorkspaceId)
  data.value = []
  const index = 1
  const res = await getWaylineFiles(wid, {
    page: 1, // 页数
    page_size: 9, // 每页大小
    order_by: 'update_time desc' // 排序, xxx_column_desc, xxx_column_asc,  xxx_column(default asc)
  })
  console.log(res)
  res.data.list.forEach(ele => {
    data.value.push({
      key: index.toString(),
      name: ele.name,
      template_type: ele.template_types[0],
      drone_type: ele.drone_model_key,
      payload_type: ele.payload_model_keys[0],
      user: ele.user_name,
      favorite: ele.favorited.toString()
    })
  })
  console.log('wayline files:', data.value)
}
</script>

<style lang="scss" scoped>
.panel-wrapper {
  width: 100%;
  .table {
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
