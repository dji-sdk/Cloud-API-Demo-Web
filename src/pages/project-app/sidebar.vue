<template>
  <div class="demo-project-sidebar-wrapper">
    <router-link
      v-for="item in options"
      :key="item.key"
      :to="item.path"
      :class="{
        'menu-item': true,
        selected: selectedRoute(item),
        disabled: item.key > 6
      }"
    >
      <a-tooltip :title="item.label" placement="right">
        <span>{{ item.label }}</span>
      </a-tooltip>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { getRoot } from '/@/root'
interface IOptions {
  key: number
  label: string
  path:
    | string
    | {
        path: string
        query?: any
      }
  icon: string
}

export default defineComponent({
  name: 'Sidebar',
  setup () {
    const root = getRoot()
    const options = [
      { key: 0, label: 'livestream', path: '/livestream', icon: 'livestream' },
      { key: 1, label: 'tsa', path: '/tsa', icon: 'tsa' },
      { key: 2, label: 'layer', path: '/layer', icon: 'layer' },
      { key: 3, label: 'media', path: '/media', icon: 'media' },
      { key: 4, label: 'wayline', path: '/wayline', icon: 'wayline' }
    ]

    function selectedRoute (item: IOptions) {
      const path = typeof item.path === 'string' ? item.path : item.path.path
      return root.$route.path?.indexOf(path) === 0
    }

    return {
      options,
      selectedRoute
    }
  }
})
</script>

<style scoped lang="scss">
.demo-project-sidebar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  border-right: 1px solid #4f4f4f;
  color: $text-white-basic;
  // flex: 1;
  overflow: hidden;
  .menu-item {
    width: 100%;
    padding: 16px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $text-white-basic;
    cursor: pointer;
    &.selected {
      background-color: $dark-highlight;
      color: $primary;
    }
    &.disabled {
      pointer-events: none;
      opacity: 0.45;
    }
  }
  .filling {
    flex: 1;
  }

  .setting-icon {
    font-size: 24px;
    margin-bottom: 24px;
    color: $text-white-basic;
  }

}
</style>
<style>
.ant-tooltip-open {
  border: 0;
}
</style>
