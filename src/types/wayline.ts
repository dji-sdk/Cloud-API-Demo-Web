// 航线类型
export enum WaylineType {
  NormalWaypointWayline = 0, // 普通航点航线
  AccurateReshootingWayline = 1 // 精准复拍航线
}

export interface WaylineFile {
  id: string,
  name: string,
  drone_model_key: any,
  payload_model_keys: string[],
  template_types: WaylineType[],
  update_time: number,
  user_name: string,
}
