import { message } from 'ant-design-vue'
import request, { IPage, IWorkspaceResponse } from '/@/api/http/request'
const HTTP_PREFIX = '/media/api/v1'

// Get Media Files
export const getMediaFiles = async function (wid: string, pagination: IPage): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/files/${wid}/files?page=${pagination.page}&page_size=${pagination.page_size}`
  const result = await request.get(url)
  return result.data
}
// Download Media File
export const downloadMediaFile = async function (workspaceId: string, fileId: string): Promise<any> {
  const url = `${HTTP_PREFIX}/files/${workspaceId}/file/${fileId}/url`
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
