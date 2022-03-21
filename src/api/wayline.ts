import request from '/@/api/http/request'
const HTTP_PREFIX = '/wayline/api/v1'

// Get Wayline Files
export const getWaylineFiles = async function (wid: string, body: {}): Promise<any> {
  const url = `${HTTP_PREFIX}/workspaces/${wid}/waylines?` + 'order_by=' + body.order_by + '&page=' + body.page + '&page_size=' + body.page_size
  const result = await request.get(url)
  return result.data
}
