<template>
  <div class="login flex-column flex-justify-center flex-align-center m0 b0">
    <a-image
      style="width: 17vw; height: 10vw; margin-bottom: 50px"
      src="http://lofrev.net/wp-content/photos/2016/09/dji_logo_png.png"
    />
    <p class="logo fz35 pb50">Pilot Cloud API Demo</p>
    <a-form
      layout="inline"
      :model="formState"
      class="flex-row flex-justify-center flex-align-center"
    >
      <a-form-item>
        <a-input v-model:value="formState.user" placeholder="Username">
          <template #prefix
            ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="formState.password"
          type="password"
          placeholder="Password"
        >
          <template #prefix
            ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
          /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          class="m0"
          type="primary"
          html-type="submit"
          :disabled="formState.user === '' || formState.password === ''"
          @click="onSubmit"
        >
          Login
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { onMounted, reactive, UnwrapRef } from 'vue'
import { CURRENT_CONFIG } from '/@/api/http/config'
import { login, refreshToken } from '/@/api/manage'
import apiPilot from '/@/api/pilot-bridge'
import { getRoot } from '/@/root'

interface FormState {
  user: string
  password: string
}
const root = getRoot()

const formState: UnwrapRef<FormState> = reactive({
  user: 'pilot',
  password: 'pilot123'
})
let isVerified:any
onMounted(async () => {
  const verifyLicense = JSON.parse(apiPilot.platformVerifyLicense(CURRENT_CONFIG.appId,
    CURRENT_CONFIG.appKey, CURRENT_CONFIG.appLicense))
  const platformVerify = JSON.parse(apiPilot.isPlatformVerifySuccess())
  isVerified = platformVerify.data
  if (platformVerify.data === true) {
    message.success('The license verification is successful.')
  } else {
    message.error('Filed to verify the license. message is ' + verifyLicense.data)
    return
  }
  const token = apiPilot.getToken()
  console.log('api token:', token)
  apiPilot.setPlatformMessage('Cloud Api Platform', '', '')
  if (token && token !== undefined) {
    await refreshToken({})
      .then(res => {
        apiPilot.setComponentParam('api', {
          host: CURRENT_CONFIG.baseURL,
          token: res.data.access_token
        })
        const jsres = JSON.parse(
          apiPilot.loadComponent('api', apiPilot.getComponentParam('api'))
        )
        console.log('load api module status:', jsres)
        apiPilot.setToken(res.data.access_token)
        localStorage.setItem('x-auth-token', res.data.access_token)
        message.success('Login Success')
        root.$router.push('/pilot-home')
      })
      .catch(err => {
        console.error(err)
      })
  }
})
const onSubmit = async (e: any) => {
  await login({
    username: formState.user,
    password: formState.password
  })
    .then(res => {
      if (!isVerified) {
        message.error('Please verify the license firstly.')
        return
      }
      console.log('login res:', res)
      if (res.code === 0) {
        apiPilot.setComponentParam('api', {
          host: CURRENT_CONFIG.baseURL,
          token: res.data.access_token
        })
        const jsres = apiPilot.loadComponent(
          'api',
          apiPilot.getComponentParam('api')
        )
        console.log('load api module res:', jsres)
        apiPilot.setToken(res.data.access_token)
        localStorage.setItem('x-auth-token', res.data.access_token)
        localStorage.setItem('workspace-id', res.data.workspace_id)
        localStorage.setItem('username', res.data.username)
        message.success('Login Success')
        root.$router.push('/pilot-home')
      }
    })
    .catch(err => {
      console.error(err)
    })
}
</script>

<style lang="scss" scoped>
@import '/@/styles/index.scss';
.login {
  // background-color: $dark-highlight;
  height: 100vh;
}
.logo {
  color: $primary;
}
</style>
