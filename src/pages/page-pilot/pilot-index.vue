<template>
  <div class="login flex-column flex-justify-center flex-align-center m0 b0">
    <a-image
      style="width: 17vw; height: 10vw; margin-bottom: 50px"
      :src="djiLogo"
    />
    <p class="logo fz35 pb50">Pilot Cloud API Demo</p>
    <a-form
      layout="inline"
      :model="formState"
      class="flex-row flex-justify-center flex-align-center"
    >
      <a-form-item>
        <a-input v-model:value="formState.username" placeholder="Username">
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
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref, UnwrapRef } from 'vue'
import { CURRENT_CONFIG } from '/@/api/http/config'
import { login, LoginBody, refreshToken } from '/@/api/manage'
import apiPilot from '/@/api/pilot-bridge'
import { getRoot } from '/@/root'
import router from '/@/router'
import { EComponentName, ELocalStorageKey, ERouterName, EUserType } from '/@/types'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import djiLogo from '/@/assets/icons/dji_logo.png'

const root = getRoot()

const formState: UnwrapRef<LoginBody> = reactive({
  username: 'pilot',
  password: 'pilot123',
  flag: EUserType.Pilot,
})
const isVerified = ref<boolean>(false)
onMounted(async () => {
  verifyLicense()
  if (!isVerified.value) {
    return
  }

  apiPilot.setPlatformMessage('Cloud Api Platform', '', '')

  const token = localStorage.getItem(ELocalStorageKey.Token)
  if (token) {
    await refreshToken({})
      .then(res => {
        apiPilot.setComponentParam(EComponentName.Api, {
          host: CURRENT_CONFIG.baseURL,
          token: res.data.access_token
        })
        const jsres = apiPilot.loadComponent(EComponentName.Api, apiPilot.getComponentParam(EComponentName.Api))
        if (!jsres) {
          message.error('Failed to load api module.')
          return
        }
        apiPilot.setToken(res.data.access_token)
        localStorage.setItem(ELocalStorageKey.Token, res.data.access_token)
        root.$router.push(ERouterName.PILOT_HOME)
      })
      .catch(err => {
        message.error(err)
      })
  }
})
const onSubmit = async (e: any) => {
  await login(formState)
    .then(res => {
      if (!isVerified.value) {
        message.error('Please verify the license firstly.')
        return
      }
      console.log('login res:', res)
      if (res.code === 0) {
        apiPilot.setComponentParam(EComponentName.Api, {
          host: CURRENT_CONFIG.baseURL,
          token: res.data.access_token
        })
        const jsres = apiPilot.loadComponent(
          EComponentName.Api,
          apiPilot.getComponentParam(EComponentName.Api)
        )
        console.log('load api module res:', jsres)
        apiPilot.setToken(res.data.access_token)
        localStorage.setItem(ELocalStorageKey.Token, res.data.access_token)
        localStorage.setItem(ELocalStorageKey.WorkspaceId, res.data.workspace_id)
        localStorage.setItem(ELocalStorageKey.UserId, res.data.user_id)
        localStorage.setItem(ELocalStorageKey.Username, res.data.username)
        localStorage.setItem(ELocalStorageKey.Flag, EUserType.Pilot.toString())
        message.success('Login Success')
        root.$router.push(ERouterName.PILOT_HOME)
      }
    })
    .catch(err => {
      message.error(err)
    })
}

function verifyLicense () {
  isVerified.value = apiPilot.platformVerifyLicense(CURRENT_CONFIG.appId, CURRENT_CONFIG.appKey, CURRENT_CONFIG.appLicense) &&
    apiPilot.isPlatformVerifySuccess()
  if (isVerified.value) {
    message.success('The license verification is successful.')
  } else {
    message.error('Filed to verify the license. Please check license whether the license is correct, or apply again.')
  }
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
