<template>
  <span>
    <a-tree
      draggable
      :defaultExpandAll="true"
      class="device-map-layers"
      @drop="onDrop"
      v-bind="$attrs"
    >
      <a-tree-node
        :title="layer.name"
        :id="layer.id"
        v-for="layer in getTreeData"
        :key="layer.id"
      >
        <!-- <template #title>
                {{layer.name}}
              </template> -->
        <template v-if="layer.elements">
          <a-tree-node
            v-for="resource in layer.elements"
            :id="getLayerTreeKey('resource', resource.id)"
            :key="getLayerTreeKey('resource', resource.id)"
          >
            <template #title>
              {{ resource.name }}
            </template>
          </a-tree-node>
        </template>
      </a-tree-node>
    </a-tree>
  </span>
</template>

<script lang="ts" setup>
import { computed, defineProps, PropType, reactive } from 'vue'
import { useMyStore } from '/@/store'
import { DropEvent, mapLayer } from '/@/types/mapLayer'
import { getLayerTreeKey } from '/@/utils/layer-tree'
const store = useMyStore()
const props = defineProps({
  layerData: Array as PropType<mapLayer[]>
})
const state = reactive({
  checkedKeys: [] as string[],
  expandedKeys: [] as string[]
})
const getTreeData = computed(() => {
  // console.log('props.treeData', JSON.parse(JSON.stringify(props.layerData)))
  return JSON.parse(JSON.stringify(props.layerData))
})
const shareId = computed(() => {
  return store.state.layerBaseInfo.share
})
const defaultId = computed(() => {
  return store.state.layerBaseInfo.default
})
async function onDrop ({ node, dragNode, dropPosition, dropToGap }: DropEvent) {
  let _treeData = props.layerData || []
  let dragKey = dragNode.eventKey
  dragKey = dragKey.replaceAll('resource__', '')
  const dropPos = node.pos.split('-')
  let dropKey =
    node.eventKey.includes(shareId.value) ||
    node.eventKey.includes(defaultId.value)
      ? node.eventKey
      : node.$parent.eventKey
  if (!dragKey || !dropKey) return
  dropKey = dropKey.replaceAll('resource__', '')
  const loop = (data: mapLayer[], key: string, callback: Function) => {
    data.forEach((item, index, arr) => {
      if (item.id === key) {
        return callback(item, index, arr)
      }

      if (item.elements) {
        return loop(item.elements, key, callback)
      }
    })
  }
  const data = [..._treeData] as mapLayer[]
  // Find dragObject
  let dragObj = {} as mapLayer
  loop(data, dragKey, (item: mapLayer, index: number, arr: mapLayer[]) => {
    arr.splice(index, 1)
    dragObj = item
  })
  if (!dropToGap) {
    // Drop on the content
    loop(data, dropKey, (item: mapLayer) => {
      item.elements = item.elements || []
      // where to insert 示例添加到尾部，可以是随意位置
      item.elements.push(dragObj)
    })
  }
  _treeData = data
  // console.log('_treeData', _treeData)
}
</script>
<style lang="scss">
$antPrefix: 'ant';
.device-map-layers.#{$antPrefix}-tree {
  color: #fff;

  .#{$antPrefix}-tree-checkbox:not(.#{$antPrefix}-tree-checkbox-checked)
    .#{$antPrefix}-tree-checkbox-inner {
    background-color: unset;
  }

  .anticon {
    font-size: 16px;
  }

  // 第一个层级的 li，有左边距 16px
  > li {
    padding-left: 16px;
    padding-right: 16px;
  }

  li {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;

    &:first-child {
      padding-top: 4px;
    }

    &.#{$antPrefix}-tree-treenode-disabled
      > .#{$antPrefix}-tree-node-content-wrapper {
      height: 20px;
      span {
        color: #fff;
      }
    }
    > ul {
      width: 100%;
    }

    .#{$antPrefix}-tree-switcher {
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .#{$antPrefix}-tree-checkbox {
      z-index: 1;
    }
    .#{$antPrefix}-tree-checkbox:hover::after,
    .#{$antPrefix}-tree-checkbox-wrapper:hover
      .#{$antPrefix}-tree-checkbox::after {
      visibility: collapse;
    }

    .#{$antPrefix}-tree-title {
      display: block;
    }

    .#{$antPrefix}-tree-node-content-wrapper {
      color: #fff;
      width: calc(100% - 46px);
      flex: 1;
      box-sizing: content-box;
      height: 20px;
      min-width: 0; // 解决文字溢出不会省略的问题
      padding-right: 0;

      &:not([draggable='true']) {
        border-top: 2px transparent solid;
        border-bottom: 2px transparent solid;
      }

      &:hover {
        background-color: transparent;
      }

      > span {
        &::before {
          // position: absolute;
          // right: 0;
          // left: 0;
          height: 28px;
          transition: all 0.3s;
          content: '';
        }

        // 进度条组件需要相对最外层定位，进度条组件的position不能设置为relative
        > *:not(.progress-wrapper) {
          position: relative;
          z-index: 1;
        }
      }

      &.#{$antPrefix}-tree-node-selected {
        background-color: transparent;
        color: #2d8cf0;
        > span {
          &::before {
            background-color: #4f4f4f;
          }
        }
      }
    }
  }
  span.#{$antPrefix}-tree-switcher.#{$antPrefix}-tree-switcher_open
    .#{$antPrefix}-tree-switcher-icon {
    transform: rotate(0deg) !important;
  }
  span.#{$antPrefix}-tree-switcher.#{$antPrefix}-tree-switcher_close
    .#{$antPrefix}-tree-switcher-icon {
    transform: rotate(0deg) !important;
  }
}
</style>
