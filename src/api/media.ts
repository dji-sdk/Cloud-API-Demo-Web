import { message } from 'ant-design-vue'
import request, { IPage, IWorkspaceResponse, idData } from '/@/api/http/request'
const HTTP_PREFIX = '/media/api/v1'

// Get Media Files
export const getMediaFiles = async function (wid: string, pagination: IPage, pathId?: string): Promise<IWorkspaceResponse<any>> {
  let url = ''
  if (pathId) {
    url = `${HTTP_PREFIX}/files/${wid}/files?page=${pagination.page}&page_size=${pagination.page_size}&father_id=${pathId}`
  } else {
    url = `${HTTP_PREFIX}/files/${wid}/files?page=${pagination.page}&page_size=${pagination.page_size}`
  }
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
// 新增或修改文件夹
export const operateFile = async (wid: string, body:idData): Promise<IWorkspaceResponse<{ id: string }>> => {
  const url = `${HTTP_PREFIX}/files/${wid}/folder`
  const result = await request.post(url, body)
  return result.data
}
// 删除文件
export const deleteFile = async (wid: string, id:any): Promise<IWorkspaceResponse<{ id: string }>> => {
  const url = `${HTTP_PREFIX}/files/${wid}/folder`
  const result = await request.delete(url + '?id_arr=' + id)
  return result.data
}
// 文件数
export const floderTreeData = async (wid: string): Promise<IWorkspaceResponse<{ id: string }>> => {
  const url = `${HTTP_PREFIX}/files/${wid}/folder/tree`
  const result = await request.get(url)
  return result.data
}
