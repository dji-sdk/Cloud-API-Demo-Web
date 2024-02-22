import { message } from 'ant-design-vue'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { EBizCode } from '../types'

interface WebSocketOptions {
  data: any
  cache?: boolean | string
  destroyCache?: string
}

export interface MessageHandler {
  (data : {[key: string]: any}): void
}

export interface CommonHostWs<T> {
  sn: string
  host: T
}

/**
 * ConnectWebSocket 类
 * TODO: 优化messageHandler: EventEmitter。暂时传入回调函数
 */
class ConnectWebSocket {
  _url: string
  _socket: ReconnectingWebSocket | null
  _hasInit: boolean
  _messageHandler: MessageHandler | null

  constructor (url: string) {
    this._url = url
    this._socket = null
    this._hasInit = false
    this._messageHandler = null
  }

  initSocket () {
    if (this._hasInit) {
      return
    }
    if (!this._url) {
      return
    }

    // 会自动重连，无需处理重连逻辑
    this._socket = new ReconnectingWebSocket(this._url, [], {
      maxReconnectionDelay: 20000, // 断开后最大的重连时间： 20s，每多一次重连，会增加 1.3 倍，5 * 1.3 * 1.3 * 1.3...
      minReconnectionDelay: 5000, // 断开后最短的重连时间： 5s
      maxRetries: 5
    })

    this._hasInit = true

    this._socket.addEventListener('open', this._onOpen.bind(this))
    this._socket.addEventListener('close', this._onClose.bind(this))
    this._socket.addEventListener('error', this._onError.bind(this))
    this._socket.addEventListener('message', this._onMessage.bind(this))
  }

  _onOpen () {
    console.log('连接成功')
  }

  _onClose () {
    console.log('连接已断开')
  }

  _onError () {
    console.log('连接 error')
  }

  registerMessageHandler (messageHandler: MessageHandler) {
    this._messageHandler = messageHandler
  }

  _onMessage (msg: MessageEvent) {
    const data = JSON.parse(msg.data)
    this._messageHandler && this._messageHandler(data)
    // console.log('接受消息', message)
  }

  sendMessage = (message: WebSocketOptions): void => {
    this._socket?.send(JSON.stringify(message.data))
  }

  close () {
    this._socket?.close()
  }
}

export default ConnectWebSocket
