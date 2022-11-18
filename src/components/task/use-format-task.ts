import { DEFAULT_PLACEHOLDER } from '/@/utils/constants'
import { Task } from '/@/api/wayline'
import { TaskStatusColor, TaskStatusMap, TaskTypeMap, OutOfControlActionMap } from '/@/types/task'

export function useFormatTask () {
  function formatTaskType (task: Task) {
    return TaskTypeMap[task.task_type] || DEFAULT_PLACEHOLDER
  }

  function formatTaskTime (time: string) {
    return time || DEFAULT_PLACEHOLDER
  }

  function formatLostAction (task: Task) {
    return OutOfControlActionMap[task.out_of_control_action] || DEFAULT_PLACEHOLDER
  }

  function formatTaskStatus (task: Task) {
    const statusObj = {
      text: '',
      color: ''
    }
    const { status } = task
    statusObj.text = TaskStatusMap[status]
    statusObj.color = TaskStatusColor[status]
    return statusObj
  }

  return {
    formatTaskType,
    formatTaskTime,
    formatLostAction,
    formatTaskStatus,
  }
}
