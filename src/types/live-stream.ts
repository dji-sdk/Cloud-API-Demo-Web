
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
