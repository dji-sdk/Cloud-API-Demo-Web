import ReconnectingWebSocket from 'reconnecting-websocket'
import { ELocalStorageKey } from '../types/enums'
import { CURRENT_CONFIG as config } from '/@/api/http/config'

let socket: ReconnectingWebSocket

export default {
  init (getMsgFunc: any) {
    const token: string = localStorage.getItem(ELocalStorageKey.Token)!
    const wspath = config.websocketURL + '?x-auth-token=' + encodeURI(token)
    socket = new ReconnectingWebSocket(wspath, '', { maxRetries: 5 })
    socket.onopen = this.onOpen
    socket.onerror = this.onError
    socket.onmessage = getMsgFunc
    socket.onclose = this.onClose
    return socket
  },
  onOpen () {
    console.log('ws opened')
  },
  onError (err: any) {
    console.error(err)
  },
  onClose () {
    console.log('ws closed')
  },
  sendMsg (data: any) {
    socket.send(data)
  },
  close () {
    socket.close()
  }
}
