// import Icon from '@ant-design/icons-vue'
import * as antDesign from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import { App } from 'vue'
import svgIcon from '/@/components/svgIcon.vue'

export const antComponents = {
  install (app: App): void {
    app.use(antDesign)
    // app.component('Icon', Icon)
    app.component('svg-icon', svgIcon)
  }
}
