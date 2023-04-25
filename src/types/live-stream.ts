
export interface LiveStreamStatus {
    audioBitRate: number,
    dropRate: number,
    fps: number,
    jitter: number,
    quality: number,
    rtt: number,
    status: number,
    type: number,
    videoBitRate: number
}

export interface GB28181Param {
    serverIp: string,
    serverPort: string,
    serverId: string,
    agentId: string,
    password: string,
    agentPort: string,
    agentChannel: string
}

export interface RTSPParam {
    userName: string,
    password: string,
    port: string
}

export interface LiveConfigParam {
    params: number,
    type: any
}

export enum EVideoPublishType {
    VideoOnDemand = 'video-on-demand',
    VideoByManual = 'video-by-manual',
    VideoDemandAuxManual = 'video-demand-aux-manual'
}

export enum ELiveTypeValue {
    Unknown,
    Agora,
    RTMP,
    RTSP,
    GB28181
}

export enum ELiveTypeName {
    Unknown = 'Unknown',
    Agora = 'Agora',
    RTMP = 'RTMP',
    RTSP = 'RTSP',
    GB28181 = 'GB28181'
}

export enum CameraMode {
    Photo = 0, // 拍照
    Video = 1, // 录像
}

// 镜头类型
export enum VideoType {
    NORMAL = 'normal',
    WIDE = 'wide',
    ZOOM = 'zoom',
    IR = 'ir'
}

// 镜头类型
export enum CameraType {
    WIDE = 'wide',
    ZOOM = 'zoom',
    IR = 'ir'
}

export const CameraTypeOptions = [
  { label: CameraType.WIDE, value: CameraType.WIDE },
  { label: CameraType.ZOOM, value: CameraType.ZOOM },
  { label: CameraType.IR, value: CameraType.IR },
]

export const ZoomCameraTypeOptions = [
  { label: CameraType.ZOOM, value: CameraType.ZOOM },
  { label: CameraType.IR, value: CameraType.IR },
]

export interface VideoListItem {
    video_index: string;
    video_type: VideoType;
    switchable_video_types?: Array<VideoType>;
}

export interface CameraListItem {
    available_video_number: number;
    camera_index: string;
    camera_name: string;
    coexist_video_number_max: number;
    video_list: VideoListItem[];
    // 自定义
    switchCamera?: boolean;
    content?: string;
    // 该camera由哪个控上报的
    camera_carrier_sns?: string[];
}

export interface DeviceListItem {
    sn: string;
    available_video_number: number;
    coexist_video_number_max: number;
    camera_list: CameraListItem[];
}

// export interface LiveCapacity {
//     available_video_number: number;
//     coexist_video_number_max: number;
//     device_list: DeviceListItem[];
// }

// export interface LiveStatus {
//     live_time: number; // 直播时间 该路码流已推流时间 unit: s
//     live_trendline: number; // 直播带宽的使用状态 代表直播性能趋势,0-4表示overuse，其中，数值越小，表示overuse程度越大，5表示normal状态，6~10表示underuse，其中，数值越大，表示有更多比例的带宽未能充分利用
//     video_id: string; // 直播码流标识符 某路在推视频码流的标识符，格式为 #{uav_sn}/#{camera_id}/#{video_index}
//     video_quality: number; // 直播码流的质量 0: 自动， 1: 流畅, 2: 高清， 3: 超清
//     error_status?: number; // 设备端当前状态，是错误码，需要匹配到文案上
//   }
