import App from './App.vue'
import router from './router'
import { antComponents } from './antd'
import { CommonComponents } from './use-common-components'
import 'virtual:svg-icons-register'
import store, { storeKey } from './store'
import { createInstance } from '/@/root'
import { useDirectives } from './directives'

import '/@/styles/index.scss'
const app = createInstance(App)

app.use(store, storeKey)
app.use(router)
app.use(CommonComponents)
app.use(antComponents)
app.use(useDirectives)
app.mount('#demo-app')
