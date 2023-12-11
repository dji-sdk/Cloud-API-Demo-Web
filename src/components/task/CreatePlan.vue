<template>
  <div class="create-plan-wrapper">
    <div class="header">
      Create Plan
    </div>
    <div class="content">
      <a-form ref="valueRef" layout="horizontal" :hideRequiredMark="true" :rules="rules" :model="planBody" labelAlign="left">
        <a-form-item label="Plan Name" name="name" :labelCol="{span: 23}">
          <a-input style="background: black;"  placeholder="Please enter plan name" v-model:value="planBody.name"/>
        </a-form-item>
        <!-- 航线 -->
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
              <span class="ml5">{{ DEVICE_NAME[wayline.drone_model_key] }}</span>
              <span class="ml10"><CameraFilled style="border-top: 1px solid; padding-top: -3px;" /></span>
              <span class="ml5" v-for="payload in wayline.payload_model_keys" :key="payload.id">
                {{ DEVICE_NAME[payload] }}
              </span>
            </div>
            <div class="mt5 ml10" style="color: hsla(0,0%,100%,0.35);">
              <span class="mr10">Update at {{ new Date(wayline.update_time).toLocaleString() }}</span>
            </div>
          </div>
        </a-form-item>
        <!-- 设备 -->
        <a-form-item label="Device" :wrapperCol="{offset: 10}" v-model:value="planBody.dock_sn" name="dock_sn">
          <router-link
            :to="{name: 'select-plan'}"
            @click="selectDevice"
          >Select Device</router-link>
        </a-form-item>
        <a-form-item v-if="planBody.dock_sn" style="margin-top: -15px;">
          <div class="panel" style="padding-top: 5px;">
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
        <a-form-item label="Plan Timer" class="plan-timer-form-item">
          <div style="white-space: nowrap;">
            <a-radio-group v-model:value="planBody.task_type" button-style="solid">
              <a-radio-button v-for="type in TaskTypeOptions" :value="type.value" :key="type.value">{{ type.label }}</a-radio-button>
            </a-radio-group>
          </div>
        </a-form-item>
        <!-- execute date -->
        <a-form-item label="Date" v-if="planBody.task_type === TaskType.Timed || planBody.task_type === TaskType.Condition" name="select_execute_date" :labelCol="{span: 23}">
          <a-range-picker
            v-model:value="planBody.select_execute_date"
            :disabledDate="(current: Moment) => current < moment().subtract(1, 'days')"
            format="YYYY-MM-DD"
            :placeholder="['Start Time', 'End Time']"
            style="width: 100%;"
          />
        </a-form-item>
        <!-- execute time -->
        <a-form-item label="Time" v-if="planBody.task_type === TaskType.Timed || planBody.task_type === TaskType.Condition"
          name="select_execute_time" ref="select_execute_time" :labelCol="{span: 23}" :autoLink="false">
          <div class="mb10 flex-row flex-align-center flex-justify-around" v-for="n in planBody.select_time_number" :key="n">
            <a-time-picker
              v-model:value="planBody.select_time[n - 1][0]"
              format="HH:mm:ss"
              show-time
              placeholder="Start Time"
              :style="planBody.task_type === TaskType.Condition ? 'width: 40%' : 'width: 82%'"
              @change="() => $refs.select_execute_time.onFieldChange()"
            />
            <template v-if="planBody.task_type === TaskType.Condition">
              <div><span style="color: white;">-</span></div>
              <a-time-picker
                v-model:value="planBody.select_time[n - 1][1]"
                format="HH:mm:ss"
                show-time
                placeholder="End Time"
                style="width: 40%;"
              />
            </template>
            <div class="ml5" style="font-size:18px">
              <PlusCircleOutlined class="mr5" style="color: #1890ff" @click="addTime"/>
              <MinusCircleOutlined :style="planBody.select_time_number === 1 ? 'color: gray' : 'color: red;'" @click="removeTime"/>
            </div>
          </div>
        </a-form-item>
        <template v-if="planBody.task_type === TaskType.Condition">
          <!-- battery capacity -->
          <a-form-item label="Start task when battery level reaches" :labelCol="{span: 23}" name="min_battery_capacity">
            <a-input-number class="width-100" v-model:value="planBody.min_battery_capacity" :min="50" :max="100"
            :formatter="(value: number) => `${value}%`" :parser="(value: string) => value.replace('%', '')">
            </a-input-number>
          </a-form-item>
          <!-- storage capacity -->
          <a-form-item label="Start task when storage level reaches (MB)" :labelCol="{span: 23}" name="storage_capacity">
            <a-input-number v-model:value="planBody.min_storage_capacity" class="width-100">
            </a-input-number>
          </a-form-item>
        </template>
        <!-- RTH Altitude Relative to Dock -->
        <a-form-item label="RTH Altitude Relative to Dock (m)" :labelCol="{span: 23}" name="rth_altitude">
          <a-input-number v-model:value="planBody.rth_altitude" :min="20" :max="1500" class="width-100" required>
          </a-input-number>
        </a-form-item>
        <!-- Lost Action -->
        <a-form-item label="Lost Action" :labelCol="{span: 23}" name="out_of_control_action">
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
            <a-button class="mr10" style="background: #3c3c3c;" @click="closePlan">Cancel
            </a-button>
            <a-button type="primary" @click="onSubmit" :disabled="disabled">OK
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
import { Device, DEVICE_NAME } from '/@/types/device'
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
  file_id: computed(() => store.state?.waylineInfo.id),
  dock_sn: computed(() => store.state?.dockInfo.device_sn),
  task_type: TaskType.Immediate,
  select_execute_date: [moment(), moment()] as Moment[],
  select_time_number: 1,
  select_time: [[]] as Moment[][],
  rth_altitude: '',
  out_of_control_action: OutOfControlAction.ReturnToHome,
  min_battery_capacity: 90 as number,
  min_storage_capacity: undefined as number | undefined,
})

const drawerVisible = ref(false)
const valueRef = ref()
const rules = {
  name: [
    { required: true, message: 'Please enter plan name.' },
    { max: 20, message: 'Length should be 1 to 20' }
  ],
  file_id: [{ required: true, message: 'Select Route' }],
  dock_sn: [{ required: true, message: 'Select Device' }],
  select_execute_time: [{
    validator: async (rule: RuleObject, value: Moment[]) => {
      validEndTime()
      validStartTime()
      if (planBody.select_time.length < planBody.select_time_number) {
        throw new Error('Select time')
      }
      validOverlapped()
    }
  }],
  select_execute_date: [{ required: true, message: 'Select date' }],
  rth_altitude: [
    {
      validator: async (rule: RuleObject, value: string) => {
        if (!/^[0-9]{1,}$/.test(value)) {
          throw new Error('RTH Altitude Require number')
        }
      },
    }
  ],
  min_battery_capacity: [
    {
      validator: async (rule: RuleObject, value: any) => {
        if (TaskType.Condition === planBody.task_type && !value) {
          throw new Error('Please enter battery capacity')
        }
      },
    }
  ],
  out_of_control_action: [{ required: true, message: 'Select Lost Action' }],
}

function validStartTime (): Error | void {
  for (let i = 0; i < planBody.select_time.length; i++) {
    if (!planBody.select_time[i][0]) {
      throw new Error('Select start time')
    }
  }
}
function validEndTime (): Error | void {
  if (TaskType.Condition !== planBody.task_type) return
  for (let i = 0; i < planBody.select_time.length; i++) {
    if (!planBody.select_time[i][1]) {
      throw new Error('Select end time')
    }
    if (planBody.select_time[i][0] && planBody.select_time[i][1].isSameOrBefore(planBody.select_time[i][0])) {
      throw new Error('End time should be later than start time')
    }
  }
}
function validOverlapped (): Error | void {
  if (TaskType.Condition !== planBody.task_type) return
  const arr = planBody.select_time.slice()
  arr.sort((a, b) => a[0].unix() - b[0].unix())
  arr.forEach((v, i, arr) => {
    if (i > 0 && v[0] < arr[i - 1][1]) {
      throw new Error('Overlapping time periods.')
    }
  })
}

function onSubmit () {
  console.info(dock, '12131231')
  valueRef.value.validate().then(() => {
    disabled.value = true
    const createPlanBody = { ...planBody } as unknown as CreatePlan
    if (planBody.select_execute_date.length === 2) {
      createPlanBody.task_days = []
      for (let i = planBody.select_execute_date[0]; i.isSameOrBefore(planBody.select_execute_date[1]); i.add(1, 'days')) {
        createPlanBody.task_days.push(i.unix())
      }
    }
    createPlanBody.task_periods = []
    if (TaskType.Immediate !== planBody.task_type) {
      for (let i = 0; i < planBody.select_time.length; i++) {
        const result = []
        result.push(planBody.select_time[i][0].unix())
        if (TaskType.Condition === planBody.task_type) {
          result.push(planBody.select_time[i][1].unix())
        }
        createPlanBody.task_periods.push(result)
      }
    }
    createPlanBody.rth_altitude = Number(createPlanBody.rth_altitude)
    if (wayline.value && wayline.value.template_types && wayline.value.template_types.length > 0) {
      createPlanBody.wayline_type = wayline.value.template_types[0]
    }
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

function addTime () {
  valueRef.value.validateFields(['select_execute_time']).then(() => {
    planBody.select_time_number++
    planBody.select_time.push([])
  })
}
function removeTime () {
  if (planBody.select_time_number === 1) return
  planBody.select_time_number--
  planBody.select_time.splice(planBody.select_time_number)
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
        width: 33%;
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
