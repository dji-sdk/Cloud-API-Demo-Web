import { DOMAIN } from '/@/types/device'
import { commonColor } from '/@/utils/color'

// 日志上传状态
export enum DeviceLogUploadStatusEnum {
  Uploading = 1, //  上传中
  Done = 2, // 完成
  Canceled = 3, // 取消
  Failed = 4, // 失败
}

export const DeviceLogUploadStatusMap = {
  [DeviceLogUploadStatusEnum.Uploading]: '上传中',
  [DeviceLogUploadStatusEnum.Done]: '上传成功',
  [DeviceLogUploadStatusEnum.Canceled]: '取消上传',
  [DeviceLogUploadStatusEnum.Failed]: '上传失败',
}

export const DeviceLogUploadStatusColor = {
  [DeviceLogUploadStatusEnum.Uploading]: commonColor.BLUE,
  [DeviceLogUploadStatusEnum.Done]: commonColor.NORMAL,
  [DeviceLogUploadStatusEnum.Canceled]: commonColor.WARN,
  [DeviceLogUploadStatusEnum.Failed]: commonColor.FAIL,
}

// 设备日志上传 ws 消息状态
export enum DeviceLogUploadStatus {
  FilePull = 'file_pull', // 拉取日志 可以作为 正在处理中
  FileZip = 'file_zip', // 拉取日志,日志压缩可以作为 正在处理中
  FileUploading = 'file_uploading', // 正在上传
  Canceled = 'canceled', // 取消
  Timeout = 'timeout', // 超时
  Failed = 'failed', // 失败
  OK = 'ok', // 上传成功
  // Paused = 'paused' // 暂停
}

export interface DeviceLogUploadInfo {
  sn: string,
  bid: string,
  output:{
    logs_id: string
    status: DeviceLogUploadStatus,
    files: {
        device_sn: string,
        device_model_domain: DOMAIN,
        progress: number,
        result: number,
        upload_rate: number,
        status: DeviceLogUploadStatus
    }[]
  }
  result: number,
}

// ws status => log status
export const DeviceLogUploadWsStatusMap = {
  [DeviceLogUploadStatus.FilePull]: DeviceLogUploadStatusEnum.Uploading,
  [DeviceLogUploadStatus.FileZip]: DeviceLogUploadStatusEnum.Uploading,
  [DeviceLogUploadStatus.FileUploading]: DeviceLogUploadStatusEnum.Uploading,
  [DeviceLogUploadStatus.OK]: DeviceLogUploadStatusEnum.Done,
  [DeviceLogUploadStatus.Failed]: DeviceLogUploadStatusEnum.Failed,
  [DeviceLogUploadStatus.Canceled]: DeviceLogUploadStatusEnum.Canceled,
  [DeviceLogUploadStatus.Timeout]: DeviceLogUploadStatusEnum.Failed,
}
