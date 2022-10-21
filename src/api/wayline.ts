import { message } from 'ant-design-vue'
import request, { IPage, IWorkspaceResponse, IListWorkspaceResponse } from '/@/api/http/request'
import { TaskType, TaskStatus } from '/@/types/task'
import { WaylineType } from '/@/types/wayline'

const HTTP_PREFIX = '/wayline/api/v1'

// Get Wayline Files
export const getWaylineFiles = async function (wid: string, body: {}): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/workspaces/${wid}/waylines?order_by=${body.order_by}&page=${body.page}&page_size=${body.page_size}`
  const result = await request.get(url)
  return result.data
}

// Download Wayline File
export const downloadWaylineFile = async function (workspaceId: string, waylineId: string): Promise<any> {
  const url = `${HTTP_PREFIX}/workspaces/${workspaceId}/waylines/${waylineId}/url`
  const result = await request.get(url, { responseType: 'blob' })
  if (result.data.type === 'application/json') {
    const reader = new FileReader()
    reader.onload = function (e) {
      const text = reader.result as string
      const result = JSON.parse(text)
      message.error(result.message)
    }
    reader.readAsText(result.data, 'utf-8')
  } else {
    return result.data
  }
}

// Delete Wayline File
export const deleteWaylineFile = async function (workspaceId: string, waylineId: string): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/workspaces/${workspaceId}/waylines/${waylineId}`
  const result = await request.delete(url)
  return result.data
}

export interface CreatePlan {
  name: string,
  file_id: string,
  dock_sn: string,
  task_type: TaskType, // 任务类型
  wayline_type: WaylineType, // 航线类型
  execute_time?: number // 执行时间（毫秒）
}

// Create Wayline Job
export const createPlan = async function (workspaceId: string, plan: CreatePlan): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/workspaces/${workspaceId}/flight-tasks`
  const result = await request.post(url, plan)
  return result.data
}

export interface Task {
  job_id: string,
  job_name: string,
  task_type: TaskType, // 任务类型
  file_id: string, // 航线文件id
  file_name: string, // 航线名称
  wayline_type: WaylineType, // 航线类型
  dock_sn: string,
  dock_name: string,
  workspace_id: string,
  username: string,
  execute_time: string,
  end_time: string,
  status: TaskStatus, // 任务状态
  progress: number, // 执行进度
  code: number, // 错误码
}

// Get Wayline Jobs
export const getWaylineJobs = async function (workspaceId: string, page: IPage): Promise<IListWorkspaceResponse<Task>> {
  const url = `${HTTP_PREFIX}/workspaces/${workspaceId}/jobs?page=${page.page}&page_size=${page.page_size}`
  const result = await request.get(url)
  return result.data
}

export interface DeleteTaskParams {
  job_id: string
}

// 取消机场任务
export async function deleteTask (workspaceId: string, params: DeleteTaskParams): Promise<IWorkspaceResponse<{}>> {
  const url = `${HTTP_PREFIX}/workspaces/${workspaceId}/jobs`
  const result = await request.delete(url, {
    params: params
  })
  return result.data
}
