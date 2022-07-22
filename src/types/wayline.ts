export interface WaylineFile {
  id: string,
  name: string,
  drone_model_key: any,
  payload_model_keys: string[],
  template_types: number[],
  update_time: number,
  user_name: string,
}

export interface TaskExt {
  current_waypoint_index: number,
  media_count: number,
}

export interface TaskProgress {
  current_step: number,
  percent: number,
}

export interface TaskInfo {
  status: string,
  progress: TaskProgress,
  ext: TaskExt,
}

export enum ETaskStatus {
  OK = 'ok',
  FAILED = 'failed'
}
