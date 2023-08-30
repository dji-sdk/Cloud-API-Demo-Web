<template>
  <div>
    <!-- 根据需求这部分先注释 -->
    <!-- <div class="folder-herder">
      <a-radio-group @change="changeType"  v-model:value="typeValue" button-style="solid">
        <a-radio-button class="radio-button" :value="true"
        >机场文件</a-radio-button
        >
        <a-radio-button class="radio-button" :value="false"
        >普通文件</a-radio-button
        >
      </a-radio-group>
    </div>
    <div class="height-100 project-media-wrapper">
      <div
          class="folder-container"
          v-for="(item, key) in folderData.data"
          :key="key"
          @click="selectFolder(key)"
      >
        <a-tag color="blue" v-if="folderData.id === item.id">now</a-tag>
        <div>
          <div class="title">{{ item.name }}</div>
          <div style="font-size: 13px; margin-left: 12px">
            时间-{{ item.time }}
          </div>
        </div>
      </div>
    </div> -->
  </div>

</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ELocalStorageKey } from '/@/types/enums'
// import { getFolder } from '/@/api/media'
import EventBus from '/@/event-bus'

const workspaceId: string = localStorage.getItem(ELocalStorageKey.WorkspaceId)!
const typeValue = ref<boolean>(false)

const folderData = reactive<any>({
  data: [],
  id: null,
})

// onMounted(() => {
//   getFolderArr()
// })

// async function getFolderArr () {
//   folderData.data = []
//   const result = await getFolder(workspaceId)
//   folderData.id = result.data[0].id
//   folderData.data = result.data
//   loadFiles()
// }

function changeType (val: any) {
  typeValue.value = val.target.value
  // getFolderArr()
}

function selectFolder (index: number) {
  if (folderData.id !== folderData.data[index].id) {
    folderData.id = folderData.data[index].id
    loadFiles()
  }
}

// 发布到 getFolderFiles 事件，数据为: id
function loadFiles () {
  EventBus.emit('getFolderFiles', folderData.id)
}

</script>

<style lang="scss" scoped>
.folder-herder {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 20px;
  border-bottom: 0.2px solid rgb(183, 183, 183);

  .radio-button {
    width: 120px;
    text-align: center;
  }
}

.project-media-wrapper {
  overflow-y: scroll;
  margin-bottom: 20px;

  .folder-container {
    display: flex;
    padding: 8px 15px;
    justify-content: start;
    align-items: center;
    border-bottom: 0.2px solid rgb(183, 183, 183);
    .title {
      font-size: 15px;
      margin-left: 10px;
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      overflow: hidden;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
