import { ELocalStorageKey } from '../types/enums'
import request, { IWorkspaceResponse } from '/@/api/http/request'
import { mapLayers } from '/@/constants/mock-layers'
import { elementGroupsReq, PostElementsBody, PutElementsBody } from '/@/types/mapLayer'
const PREFIX = '/map/api/v1'
const workspace_id = localStorage.getItem(ELocalStorageKey.WorkspaceId)
type UnknownResponse = Promise<IWorkspaceResponse<unknown>>
// get elements group
// export const getLayers = async (reqParams: elementGroupsReq): UnknownResponse => {
//   const url = `${PREFIX}/workspaces/${workspace_id}/element_groups`
//   const result = await request.get(url, {
//     params: {
//       group_id: reqParams.groupId,
//       is_distributed: reqParams.isDistributed
//     },
//   })
//   return result.data
// }
export const getLayers = async (reqParams: elementGroupsReq): UnknownResponse => {
  return mapLayers
}

// Get elements groups request
export const getElementGroupsReq = async (body: elementGroupsReq): Promise<IWorkspaceResponse<any>> => {
  const url = `${PREFIX}/workspaces/` + workspace_id + '/element-groups'
  const result = await request.get(url, body)
  return result.data
}
// add element
export const postElementsReq = async (pid: string, body: PostElementsBody): Promise<IWorkspaceResponse<{ id: string }>> => {
  const url = `${PREFIX}/workspaces/` + workspace_id + `/element-groups/${pid}/elements`
  const result = await request.post(url, body)
  return result.data
}
// Update map element request
export const updateElementsReq = async (id: string, body: PutElementsBody): Promise<IWorkspaceResponse<{ id: string }>> => {
  const url = `${PREFIX}/workspaces/` + workspace_id + `/elements/${id}`
  const result = await request.put(url, body)
  return result.data
}
// Delete map element
export const deleteElementReq = async (id: string, body: {}): Promise<any> => {
  const url = `${PREFIX}/workspaces/` + workspace_id + `/elements/${id}`
  const result = await request.delete(url, body)
  return result.data
}

// Delete layer elements
export const deleteLayerEleReq = async (id: string, body: {}): Promise<any> => {
  const url = `${PREFIX}/workspaces/` + workspace_id + `/element-groups/${id}/elements`
  const result = await request.delete(url, body)
  return result.data
}
