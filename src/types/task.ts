import { commonColor } from '/@/utils/color'

// 任务类型
export enum TaskType {
  Immediate = 0, // 立即执行
  Single = 1, // 单次定时任务
}

export const TaskTypeMap = {
  [TaskType.Immediate]: 'Immediate',
  [TaskType.Single]: 'Timed & One-Time',
}

// 失控动作
export enum OutOfControlAction {
  ReturnToHome = 0,
  Hover = 1,
  Land = 2,
}

export const OutOfControlActionMap = {
  [OutOfControlAction.ReturnToHome]: 'Return to Home',
  [OutOfControlAction.Hover]: 'Hover',
  [OutOfControlAction.Land]: 'Land',
}

export const OutOfControlActionOptions = [
  { value: OutOfControlAction.ReturnToHome, label: OutOfControlActionMap[OutOfControlAction.ReturnToHome] },
  { value: OutOfControlAction.Hover, label: OutOfControlActionMap[OutOfControlAction.Hover] },
  { value: OutOfControlAction.Land, label: OutOfControlActionMap[OutOfControlAction.Land] },
]

// 任务状态
export enum TaskStatus {
  Wait = 1, //  待执行
  Carrying = 2, // 执行中
  Success = 3, // 完成
  CanCel = 4, // 取消
  Fail = 5, // 失败
}

export const TaskStatusMap = {
  [TaskStatus.Wait]: 'To be performed',
  [TaskStatus.Carrying]: 'In progress',
  [TaskStatus.Success]: 'Task completed',
  [TaskStatus.CanCel]: 'Task canceled',
  [TaskStatus.Fail]: 'Task failed',
}

export const TaskStatusColor = {
  [TaskStatus.Wait]: commonColor.BLUE,
  [TaskStatus.Carrying]: commonColor.BLUE,
  [TaskStatus.Success]: commonColor.NORMAL,
  [TaskStatus.CanCel]: commonColor.FAIL,
  [TaskStatus.Fail]: commonColor.FAIL,
}

// 任务执行 ws 消息状态
export enum TaskProgressStatus {
  Sent = 'sent', // 已下发
  inProgress = 'in_progress', // 执行中
  Paused = 'paused', // 暂停
  Rejected = 'rejected', // 拒绝
  Canceled = 'canceled', // 取消或终止
  Timeout = 'timeout', // 超时
  Failed = 'failed', // 失败
  OK = 'ok', // 上传成功
}

// 任务进度消息
export interface TaskProgressInfo {
  bid: string,
  output:{
    ext: {
      current_waypoint_index: number,
      media_count: number // 媒体文件
    },
    progress:{
      current_step: number,
      percent: number
    },
    status: TaskProgressStatus
  },
  result: number,
}

// ws status => log status
export const TaskProgressWsStatusMap = {
  [TaskProgressStatus.Sent]: TaskStatus.Carrying,
  [TaskProgressStatus.inProgress]: TaskStatus.Carrying,
  [TaskProgressStatus.Rejected]: TaskStatus.Fail,
  [TaskProgressStatus.OK]: TaskStatus.Success,
  [TaskProgressStatus.Failed]: TaskStatus.Fail,
  [TaskProgressStatus.Canceled]: TaskStatus.CanCel,
  [TaskProgressStatus.Timeout]: TaskStatus.Fail,
  [TaskProgressStatus.Paused]: TaskStatus.Wait,
}
