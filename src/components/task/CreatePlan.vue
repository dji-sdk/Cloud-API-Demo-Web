<template>
  <div class="create-plan-wrapper">
    <div class="header">
      新建计划
    </div>
    <div class="content">
      <a-form ref="valueRef" layout="horizontal" :hideRequiredMark="true" :rules="rules" :model="planBody" labelAlign="left">
        <a-form-item label="计划名称" name="name" :labelCol="{span: 23}">
          <a-input style="background: black;"  placeholder="请输入名称" v-model:value="planBody.name"/>
        </a-form-item>
        <!-- 航线 -->
        <a-form-item label="航线" :wrapperCol="{offset: 15}" name="file_id">
          <router-link
            :to="{name: 'select-plan'}"
            @click="selectRoute"
          >
          选择航线
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
              <span class="mr10">更新时间 {{ new Date(wayline.update_time).toLocaleString() }}</span>
            </div>
          </div>
        </a-form-item>
        <!-- 设备 -->
        <a-form-item label="设备" :wrapperCol="{offset: 15}" v-model:value="planBody.dock_sn" name="dock_sn">
          <router-link
            :to="{name: 'select-plan'}"
            @click="selectDevice"
          >选择设备</router-link>
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
              <span class="ml5">{{ dock.children?.nickname ?? 'No drone' }}</span>
            </div>
          </div>
        </a-form-item>
        <!-- 任务类型 -->
        <a-form-item label="计划时间" class="plan-timer-form-item" :labelCol="{span: 23}">
          <div style="white-space: nowrap;">
            <a-radio-group v-model:value="planBody.task_type" button-style="solid">
              <a-radio-button v-for="type in TaskTypeOptions" :value="type.value" :key="type.value">{{ type.label }}</a-radio-button>
            </a-radio-group>
          </div>
        </a-form-item>
        <!-- 执行时间 -->
        <a-form-item label="开始时间" v-if="planBody.task_type === TaskType.Timed" name="select_execute_time" :labelCol="{span: 12}">
          <a-date-picker
            v-model:value="planBody.select_execute_time"
            format="YYYY-MM-DD HH:mm:ss"
              show-time
            placeholder="选择时间"
            />
        </a-form-item>
        <!-- RTH Altitude Relative to Dock -->
        <a-form-item label="返航高度 (m)" :labelCol="{span: 23}" name="rth_altitude">
          <a-input-number v-model:value="planBody.rth_altitude" :min="20" :max="1500" class="width-100" required>
          </a-input-number>
        </a-form-item>
        <!-- Lost Action -->
        <a-form-item label="失联动作" :labelCol="{span: 23}" name="out_of_control_action">
          <div style="white-space: nowrap;">
            <a-radio-group v-model:value="planBody.out_of_control_action" button-style="solid">
              <a-radio-button v-for="action in OutOfControlActionOptions" :value="action.value" :key="action.value">
                {{ action.label }}
              </a-radio-button>
            </a-radio-group>
          </div>
        </a-form-item>
        <a-form-item class="width-100" style="margin-bottom: 40px;">
          <div class="footer">
            <a-button class="mr10" style="background: #3c3c3c;" @click="closePlan">取消
            </a-button>
            <a-button type="primary" @click="onSubmit" :disabled="disabled">确认
            </a-button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
  <div v-if="drawerVisible" style="position: absolute; left: 335px; width: 280px; height: 100vh; float: right; top: 0; z-index: 1000; color: white; background: #282828;">
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
import { CloseOutlined, RocketOutlined, CameraFilled, UserOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons-vue'
import { ELocalStorageKey, ERouterName } from '/@/types'
import { useMyStore } from '/@/store'
import { WaylineType, WaylineFile } from '/@/types/wayline'
import { Device, EDeviceType } from '/@/types/device'
import { createPlan, CreatePlan } from '/@/api/wayline'
import { getRoot } from '/@/root'
import { TaskType, OutOfControlActionOptions, OutOfControlAction, TaskTypeOptions } from '/@/types/task'
import moment, { Moment } from 'moment'
import { RuleObject } from 'ant-design-vue/es/form/interface'

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
const planBody = reactive({
  name: '',
  file_id: computed(() => store.state?.waylineInfo?.id),
  dock_sn: computed(() => store.state?.dockInfo?.device_sn),
  task_type: TaskType.Immediate,
  select_execute_time: undefined as Moment| undefined,
  rth_altitude: '',
  out_of_control_action: OutOfControlAction.ReturnToHome,
})

const drawerVisible = ref(false)
const valueRef = ref()
const rules = {
  name: [
    { required: true, message: '请输入计划名称' },
    { max: 20, message: '长度为1~20', trigger: 'blur' }
  ],
  file_id: [{ required: true, message: '请选择航线' }],
  dock_sn: [{ required: true, message: '请选择设备' }],
  select_execute_time: [{ required: true, message: '请选择开始时间' }],
  rth_altitude: [
    {
      validator: async (rule: RuleObject, value: string) => {
        if (!value) {
          throw new Error('请输入返航导读')
        } else {
          if (!/^[0-9]{1,}$/.test(value)) {
            throw new Error('请输入整数')
          }
        }
      },
    }
  ],
  out_of_control_action: [{ required: true, message: 'Select Lost Action' }],
}

function onSubmit () {
  valueRef.value.validate().then(() => {
    disabled.value = true
    const createPlanBody = { ...planBody } as unknown as CreatePlan
    if (planBody.select_execute_time) {
      createPlanBody.task_days = [moment(planBody.select_execute_time).unix()]
      createPlanBody.task_periods = [createPlanBody.task_days]
    }
    createPlanBody.rth_altitude = Number(createPlanBody.rth_altitude)
    if (wayline.value && wayline.value.template_types && wayline.value.template_types.length > 0) {
      createPlanBody.wayline_type = wayline.value.template_types[0]
    }
    // console.log('planBody', createPlanBody)
    createPlan(workspaceId, createPlanBody)
      .then(res => {
        disabled.value = false
      }).finally(() => {
        closePlan()
      })
  }).catch((e: any) => {
    console.log('validate err', e)
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
.create-plan-wrapper {
  background-color: #232323;
  color: fff;
  padding-bottom: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  width: 285px;

  .header {
    height: 52px;
    border-bottom: 1px solid #4f4f4f;
    font-weight: 700;
    font-size: 16px;
    padding-left: 10px;
    display: flex;
    align-items: center;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .content {
    height: calc(100% - 54px);
    overflow-y: auto;

    form {
      margin: 10px;
    }

    form label, input, .ant-input, .ant-calendar-range-picker-separator,
    .ant-input:hover, .ant-time-picker .anticon, .ant-calendar-picker .anticon {
      background-color: #232323;
      color: #fff;
    }

    .ant-input-suffix {
      color: #fff;
    }

    .plan-timer-form-item {

      .ant-radio-button-wrapper{
        background-color: #232323;
        color: #fff;
        width: 70%;
        text-align: center;
        &.ant-radio-button-wrapper-checked{
          background-color: #1890ff;
        }
      }
    }
  }

  .footer {
    display: flex;
    padding:10px 0;

    button {
      width: 45%;
      color: #fff ;
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
