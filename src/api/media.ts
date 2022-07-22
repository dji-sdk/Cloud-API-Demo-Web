import request, { IPage, IWorkspaceResponse } from '/@/api/http/request'
const HTTP_PREFIX = '/media/api/v1'

// Get Media Files
export const getMediaFiles = async function (wid: string, pagination: IPage): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/files/${wid}/files?page=${pagination.page}&page_size=${pagination.page_size}`
  const result = await request.get(url)
  return result.data
}
// Download Media File
export const downloadMediaFile = async function (workspaceId: string, fingerprint: string): Promise<any> {
  const url = `${HTTP_PREFIX}/files/${workspaceId}/file/${fingerprint}/url`
  const result = await request.get(url, { responseType: 'blob' })
  if (result.data.code) {
    return result.data
  }
  return result
}
