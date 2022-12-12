import { DEFAULT_PLACEHOLDER } from '/@/utils/constants'
import { Task } from '/@/api/wayline'
import { TaskStatusColor, TaskStatusMap, TaskTypeMap, OutOfControlActionMap, MediaStatusMap, MediaStatusColorMap, MediaStatus } from '/@/types/task'
import { isNil } from 'lodash'

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

  function formatMediaTaskStatus (task: Task) {
    const statusObj = {
      text: '',
      color: '',
      number: '',
      status: MediaStatus.Empty,
    }
    const { media_count, uploaded_count, uploading } = task
    if (isNil(media_count) || isNaN(media_count)) {
      return statusObj
    }
    const expectedFileCount = media_count || 0
    const uploadedFileCount = uploaded_count || 0
    if (media_count === 0) {
      statusObj.text = MediaStatusMap[MediaStatus.Empty]
      statusObj.color = MediaStatusColorMap[MediaStatus.Empty]
    } else if (media_count === uploaded_count) {
      statusObj.text = MediaStatusMap[MediaStatus.Success]
      statusObj.color = MediaStatusColorMap[MediaStatus.Success]
      statusObj.number = `(${uploadedFileCount}/${expectedFileCount})`
      statusObj.status = MediaStatus.Success
    } else {
      if (uploading) {
        statusObj.text = MediaStatusMap[MediaStatus.Uploading]
        statusObj.color = MediaStatusColorMap[MediaStatus.Uploading]
        statusObj.status = MediaStatus.Uploading
      } else {
        statusObj.text = MediaStatusMap[MediaStatus.ToUpload]
        statusObj.color = MediaStatusColorMap[MediaStatus.ToUpload]
        statusObj.status = MediaStatus.ToUpload
      }
      statusObj.number = `(${uploadedFileCount}/${expectedFileCount})`
    }
    return statusObj
  }

  return {
    formatTaskType,
    formatTaskTime,
    formatLostAction,
    formatTaskStatus,
    formatMediaTaskStatus,
  }
}
