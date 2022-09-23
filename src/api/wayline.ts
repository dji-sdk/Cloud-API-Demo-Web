import { message } from 'ant-design-vue'
import request, { IPage, IWorkspaceResponse } from '/@/api/http/request'
const HTTP_PREFIX = '/wayline/api/v1'

export interface CreatePlan {
  name: string,
  file_id: string,
  dock_sn: string,
  immediate: boolean,
  type: string,
}

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
      let text = reader.result as string
      const result = JSON.parse(text)
      message.error(result.message)
    }
    reader.readAsText(result.data, 'utf-8')
    return
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

// Create Wayline Job
export const createPlan = async function (workspaceId: string, plan: CreatePlan): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/workspaces/${workspaceId}/flight-tasks`
  const result = await request.post(url, plan)
  return result.data
}

// Get Wayline Jobs
export const getWaylineJobs = async function (workspaceId: string, page: IPage): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/workspaces/${workspaceId}/jobs?page=${page.page}&page_size=${page.page_size}`
  const result = await request.get(url)
  return result.data
}

// Execute Wayline Job
export const executeWaylineJobs = async function (workspaceId: string, plan_id: string): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/workspaces/${workspaceId}/jobs/${plan_id}`
  const result = await request.post(url)
  return result.data
}
