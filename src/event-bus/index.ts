import mitt, { Emitter } from 'mitt'

type Events = {
  deviceUpgrade: any; // 设备升级
  deviceLogUploadProgress: any // 设备日志上传
  deviceTaskProgress: any // 设备任务进度
};

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
