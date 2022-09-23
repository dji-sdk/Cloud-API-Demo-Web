import { onMounted, onUnmounted } from 'vue'
import ReconnectingWebSocket from 'reconnecting-websocket'
import ConnectWebSocket, { MessageHandler } from '/@/websocket'
import { getWebsocketUrl } from '/@/websocket/util/config'

/**
 * 接收一个message函数
 * @param messageHandler
 */
export function useConnectWebSocket (messageHandler: MessageHandler) {
  const webSocket = new ConnectWebSocket(getWebsocketUrl())

  onMounted(() => {
    webSocket?.registerMessageHandler(messageHandler)
    webSocket?.initSocket()
  })

  onUnmounted(() => {
    webSocket?.close()
  })
}
