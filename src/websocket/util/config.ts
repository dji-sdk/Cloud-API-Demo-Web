import { ELocalStorageKey } from '/@/types/enums'
import { CURRENT_CONFIG } from '/@/api/http/config'

export function getWebsocketUrl () {
  const token: string = localStorage.getItem(ELocalStorageKey.Token) || '' as string
  const url = CURRENT_CONFIG.websocketURL + '?x-auth-token=' + encodeURI(token)
  return url
}
