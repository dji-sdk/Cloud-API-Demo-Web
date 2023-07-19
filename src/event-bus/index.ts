import mitt, { Emitter } from 'mitt'

type Events = {
  deviceUpgrade: any; // 设备升级
  deviceLogUploadProgress: any // 设备日志上传
  flightTaskWs: any // 机场任务消息
  droneControlWs: any // 飞行指令信息
  droneControlMqttInfo: any // drc 链路通知
  getFolderFiles: any // 获取文件列表
};

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
