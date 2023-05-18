export enum DRC_METHOD {
  HEART_BEAT = 'heart_beat',
  DRONE_CONTROL = 'drone_control', // 飞行控制-虚拟摇杆
  DRONE_EMERGENCY_STOP = 'drone_emergency_stop', // 急停
  OSD_INFO_PUSH = 'osd_info_push', // 高频osd信息上报
  HSI_INFO_PUSH = 'hsi_info_push', // 避障信息上报
  DELAY_TIME_INFO_PUSH = 'delay_info_push', // 图传链路延时信息上报
}

// 手动控制
export interface DroneControlProtocol {
  x?: number; // 水平方向速度，正值为A指令  负值为D指令 单位：m/s
  y?: number; // 前进后退方向速度，正值为W指令  负值为S指令 单位：m/s
  h?: number;// 上下高度值，正值为上升指令  负值为下降指令 单位：m
  w?: number; // 机头角速度，正值为顺时针，负值为逆时针 单位：degree/s   （web端暂无此设计）
  seq?: number; // 从0计时
}

// 低延时osd
export interface DRCOsdInfo {
  attitude_head: number;// 飞机姿态head角，单位：度
  latitude: number;// 飞机经纬度
  longitude: number;
  altitude: number;
  speed_x: number;
  speed_y: number;
  speed_z: number;
  gimbal_pitch: number;// 云台pitch角
  gimbal_roll: number;// 云台roll角
  gimbal_yaw: number;// 云台yaw角
}

// 态势感知-HSI
export interface DRCHsiInfo {
  up_distance: number;// 上方的障碍物距离，单位：mm
  down_distance: number;// 下方的障碍物距离，单位：mm
  around_distances: number[]; // 水平方向观察点,分布在[0,360)区间，表示障碍物与飞机距离，单位为mm。 0对应机头方向正前方，顺时针分布，例如0度为机头正前方，90度为飞机正右方
  up_enable: boolean; // 上视避障开关状态，true：已开启 false：已关闭
  up_work: boolean; // 上视避障工作状态，true：正常工作 false：异常或离线
  down_enable: boolean; // 下视避障开关状态，true：已开启 false：已关闭
  down_work: boolean; // 下视避障工作状态，true：正常工作 false：异常或离线
  left_enable: boolean; // 左视避障开关状态，true：已开启 false：已关闭
  left_work: boolean; // 左视避障工作状态，true：正常工作 false：异常或离线
  right_enable: boolean; // 右视避障开关状态，true：已开启 false：已关闭
  right_work: boolean; // 右视避障工作状态，true：正常工作 false：异常或离线
  front_enable: boolean; // 前视避障开关状态，true：已开启 false：已关闭
  front_work: boolean; // 前视避障工作状态，true：正常工作 false：异常或离线
  back_enable: boolean; // 后视避障开关状态，true：已开启 false：已关闭
  back_work: boolean; // 后视避障工作状态，true：正常工作 false：异常或离线
  vertical_enable: boolean; // 垂直方向综合开关状态，当本协议中上、下视开关状态均为true时，输出true：已开启，否则输出false：已关闭
  vertical_work: boolean; // 垂直方向避障工作状态，当本协议中上、下视工作均为true时，输出true：正常工作，否则输出false：异常或离线
  horizontal_enable: boolean; // 水平方向综合开关状态，当本协议中前、后、左、右、开关状态均为true时，输出true：已开启，否则输出false：已关闭
  horizontal_work: boolean; // 水平方向避障工作综合状态，当本协议中前、后、左、右视工作均为true时，输出true：正常工作，否则输出false：异常或离线
}

export interface LiveViewDelayItem {
  video_id: string;
  liveview_delay_time: number;
}

// 链路时延信息
export interface DRCDelayTimeInfo {
  sdr_cmd_delay: number; // sdr链路命令延时，单位：ms
  liveview_delay_list: LiveViewDelayItem[];
}

export interface DrcResponseInfo {
  result: number;
  output: {
    seq: number
  }
}
