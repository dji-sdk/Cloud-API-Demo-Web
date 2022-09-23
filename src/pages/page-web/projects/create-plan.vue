<template>
  <div class="plan">
    <div class="header">
      Create Plan
    </div>
    <div class="content">
      <a-form ref="valueRef" layout="horizontal" :hideRequiredMark="true" :rules="rules" :model="planBody">
        <a-form-item label="Plan Name" name="name" :labelCol="{span: 24}">
          <a-input style="background: black;"  placeholder="Please enter plan name" v-model:value="planBody.name"/>
        </a-form-item>
        <a-form-item label="Flight Route" :wrapperCol="{offset: 7}" name="file_id">
          <router-link
            :to="{name: 'select-plan'}"
            @click="selectRoute"
          >
          Select Route
          </router-link>
        </a-form-item>
        <a-form-item v-if="planBody.file_id" style="margin-top: -15px;">
          <div class="wayline-panel" style="padding-top: 5px;">
            <div class="title">
              <a-tooltip :title="wayline.name">
                <div class="pr10" style="width: 120px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ wayline.name }}</div>
              </a-tooltip>
              <div class="ml10"><UserOutlined /></div>
              <a-tooltip :title="wayline.user_name">
                <div class="ml5 pr10" style="width: 80px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ wayline.user_name }}</div>
              </a-tooltip>
            </div>
            <div class="ml10 mt5" style="color: hsla(0,0%,100%,0.65);">
              <span><RocketOutlined /></span>
              <span class="ml5">{{ Object.keys(EDeviceType)[Object.values(EDeviceType).indexOf(wayline.drone_model_key)] }}</span>
              <span class="ml10"><CameraFilled style="border-top: 1px solid; padding-top: -3px;" /></span>
              <span class="ml5" v-for="payload in wayline.payload_model_keys" :key="payload.id">
                {{ Object.keys(EDeviceType)[Object.values(EDeviceType).indexOf(payload)] }}
              </span>
            </div>
            <div class="mt5 ml10" style="color: hsla(0,0%,100%,0.35);">
              <span class="mr10">Update at {{ new Date(wayline.update_time).toLocaleString() }}</span>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="Device" :wrapperCol="{offset: 10}" v-model:value="planBody.dock_sn" name="dock_sn">
          <router-link
            :to="{name: 'select-plan'}"
            @click="selectDevice"
          >Select Device</router-link>
        </a-form-item>
        <a-form-item v-if="planBody.dock_sn" style="margin-top: -15px;">
          <div class="panel" style="padding-top: 5px;" @click="selectDock(dock)">
            <div class="title">
              <a-tooltip :title="dock.nickname">
                <div class="pr10" style="width: 120px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ dock.nickname }}</div>
              </a-tooltip>
            </div>
            <div class="ml10 mt5" style="color: hsla(0,0%,100%,0.65);">
              <span><RocketOutlined /></span>
              <span class="ml5">{{ dock.children?.nickname }}</span>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="Immediate">
          <a-switch v-model:checked="planBody.immediate">
            <template #checkedChildren><CheckOutlined /></template>
            <template #unCheckedChildren><CloseOutlined /></template>
          </a-switch>
        </a-form-item>
        <a-form-item style="position: absolute; bottom: 0px; margin-bottom: 0; margin-left: -10px; width: 280px;">
          <div class="footer">
            <a-button class="mr10" style="background: #3c3c3c;" @click="closePlan">Cancel
            </a-button>
            <a-button type="primary" @click="onSubmit" :disabled="disabled">OK
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
  <div v-if="drawerVisible" style="position: absolute; left: 330px; width: 280px; height: 100vh; float: right; top: 0; z-index: 1000; color: white; background: #282828;">
    <div>
      <router-view :name="routeName"/>
    </div>
    <div style="position: absolute; top: 15px; right: 10px;">
      <a style="color: white;" @click="closePanel"><CloseOutlined /></a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref, toRaw, UnwrapRef } from 'vue'
import { CheckOutlined, CloseOutlined, RocketOutlined, CameraFilled, UserOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { ELocalStorageKey, ERouterName } from '/@/types'
import { useMyStore } from '/@/store'
import { WaylineFile } from '/@/types/wayline'
import { Device, EDeviceType } from '/@/types/device'
import { createPlan, CreatePlan } from '/@/api/wayline'
import { getRoot } from '/@/root'

const root = getRoot()
const store = useMyStore()

const workspaceId = localStorage.getItem(ELocalStorageKey.WorkspaceId)!

const wayline = computed<WaylineFile>(() => {
  return store.state.waylineInfo
})

const dock = computed<Device>(() => {
  return store.state.dockInfo
})

const disabled = ref(false)

const routeName = ref('')
const planBody: UnwrapRef<CreatePlan> = reactive({
  name: '',
  file_id: computed(() => store.state.waylineInfo.id),
  dock_sn: computed(() => store.state.dockInfo.device_sn),
  immediate: false,
  type: 'wayline'
})
const drawerVisible = ref(false)
const valueRef = ref()
const rules = {
  name: [
    { required: true, message: 'Please enter plan name.' },
    { max: 20, message: 'Length should be 1 to 20', trigger: 'blur' }
  ],
  file_id: [{ required: true, message: 'Select Route' }],
  dock_sn: [{ required: true, message: 'Select Device' }]
}

function onSubmit () {
  valueRef.value.validate().then(() => {
    disabled.value = true
    createPlan(workspaceId, planBody)
      .then(res => {
        message.success('Saved Successfully')
        setTimeout(() => {
          disabled.value = false
        }, 1500)
      }).finally(() => {
        closePlan()
      })
  })
}

function closePlan () {
  root.$router.push('/' + ERouterName.TASK)
}

function closePanel () {
  drawerVisible.value = false
  routeName.value = ''
}

function selectRoute () {
  drawerVisible.value = true
  routeName.value = 'WaylinePanel'
}

function selectDevice () {
  drawerVisible.value = true
  routeName.value = 'DockPanel'
}
</script>

<style lang="scss">

.plan {
  background-color: #232323;
  color: white;
  padding-bottom: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .header {
    height: 53px;
    border-bottom: 1px solid #4f4f4f;
    font-weight: 700;
    font-size: 16px;
    padding-left: 10px;
    display: flex;
    align-items: center;
  }
  .content {
    height: 100%;
    form {
      margin: 10px;
    }
    form label, input {
      color: white;
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #4f4f4f;
    min-height: 65px;
    margin-bottom: 0;
    padding-bottom: 0;
    button {
      width: 45%;
      color: white;
      border: 0;
    }
  }
}
.wayline-panel {
  background: #3c3c3c;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  height: 90px;
  width: 95%;
  font-size: 13px;
  border-radius: 2px;
  cursor: pointer;
  .title {
    display: flex;
    color: white;
    flex-direction: row;
    align-items: center;
    height: 30px;
    font-weight: bold;
    margin: 0px 10px 0 10px;
  }
}
.panel {
  background: #3c3c3c;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  height: 70px;
  width: 95%;
  font-size: 13px;
  border-radius: 2px;
  cursor: pointer;
  .title {
    display: flex;
    color: white;
    flex-direction: row;
    align-items: center;
    height: 30px;
    font-weight: bold;
    margin: 0px 10px 0 10px;
  }
}
</style>
