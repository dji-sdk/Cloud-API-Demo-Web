export interface Firmware {
  firmware_id: string
  file_name: string
  product_version: string
  file_size: number
  device_name: string[]
  username: string
  release_note: string
  released_time: string
  firmware_status: boolean
}

export enum FirmwareStatusEnum {
  NONE = 'All',
  FALSE = 'Disabled',
  TRUE = 'Available'
}

export interface FirmwareQueryParam {
  product_version: string
  device_name: string
  firmware_status: FirmwareStatusEnum
}

export interface FirmwareUploadParam {
  device_name: string[]
  release_note: string
  status: boolean
}

export enum DeviceNameEnum {
  DJI_DOCK = 'DJI Dock',
  DJI_DOCK2 = 'DJI Dock2',
  MATRICE_30 = 'Matrice 30',
  MATRICE_30T = 'Matrice 30T',
  M3D = 'M3D',
  M3TD = 'M3TD',
}
