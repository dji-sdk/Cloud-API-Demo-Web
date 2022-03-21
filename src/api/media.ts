import request from '/@/api/http/request'
const HTTP_PREFIX = '/media/api/v1'

// Get Media Files
export const getMediaFiles = async function (wid: string, body: {}): Promise<any> {
  const url = `${HTTP_PREFIX}/files/${wid}/files`
  const result = await request.get(url, body)
  return result.data
}
