import App from './App.vue'
import router from './router'
import { antComponents } from './antd'
import { CommonComponents } from './use-common-components'
import 'virtual:svg-icons-register'
import store, { storeKey } from './store'
import { createInstance } from '/@/root'
import dayjs from 'dayjs'
import '/@/styles/index.scss'
const app = createInstance(App)
app.use(store, storeKey)
app.use(router)
app.use(CommonComponents)
app.use(antComponents)
app.mount('#demo-app')
app.config.globalProperties.day = dayjs
