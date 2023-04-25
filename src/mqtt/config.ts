
import {
  IClientOptions,
} from 'mqtt'

export const OPTIONS: IClientOptions = {
  clean: true, // true: 清除会话, false: 保留会话
  connectTimeout: 10000, // mqtt 超时时间
  resubscribe: true, // 断开重连后，再次订阅原订阅
  reconnectPeriod: 10000, // 重连间隔时间： 5s
  keepalive: 1, // 心跳间隔时间：1s
}
