import mitt, { Emitter } from 'mitt'

type Events = {
  deviceUpgrade: any; // 设备升级
  deviceLogUploadProgress: any // 设备日志上传
  flightTaskWs: any // 机场任务消息
};

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
