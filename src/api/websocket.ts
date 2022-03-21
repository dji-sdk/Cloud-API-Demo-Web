import ReconnectingWebSocket from 'reconnecting-websocket'
import { CURRENT_CONFIG as config } from '/@/api/http/config'

let socket = {}

export default {
  init (getMsgFunc) {
    const token = localStorage.getItem('x-auth-token')
    const wspath =
      config.websocketURL + '?x-auth-token=' + escape(token)
    socket = new ReconnectingWebSocket(wspath)
    socket.onopen = this.onOpen
    socket.onerror = this.onError
    socket.onmessage = getMsgFunc
    socket.onclose = this.onClose
    return socket
  },
  onOpen () {
    console.log('ws opened')
  },
  onError (err) {
    console.error(err)
  },
  onClose () {
    console.log('ws closed')
  },
  sendMsg (data) {
    this.socket.send(data)
  }
}
