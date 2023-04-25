export enum ERouterName {
    ELEMENT = 'element',
    PROJECT = 'project',
    HOME = 'home',
    TSA = 'tsa',
    LAYER = 'layer',
    MEDIA = 'media',
    WAYLINE = 'wayline',
    LIVESTREAM = 'livestream',
    LIVING = 'living',
    WORKSPACE = 'workspace',
    MEMBERS = 'members',
    DEVICES = 'devices',
    TASK = 'task',
    CREATE_PLAN = 'create-plan',
    SELECT_PLAN = 'select-plan',
    FIRMWARES = 'firmwares',

    PILOT = 'pilot-login',
    PILOT_HOME = 'pilot-home',
    PILOT_MEDIA = 'pilot-media',
    PILOT_LIVESHARE = 'pilot-liveshare',
    PILOT_BIND = 'pilot-bind'
}

export enum EStorageKey {
    LANG_CODE = 'DJI_CREATE_VITE_H5_APP:lang_code',
    TEST_TOOLS_POSITION_STORAGE_KEY = 'DJI_CREATE_VITE_H5_APP:test_tools_position',
    SESSION_ID = 'DJI_CREATE_VITE_H5_APP:sess'
}

export enum EStatusValue {
    CONNECTED = 'Connected',
    DISCONNECT = 'Disconnect',
    LIVING = 'Living'
}

export enum ELiveStatusValue {
    DISCONNECT,
    CONNECTED,
    LIVING
}

export enum EComponentName {
    Thing = 'thing',
    Liveshare = 'liveshare',
    Api = 'api',
    Ws = 'ws',
    Map = 'map',
    Tsa = 'tsa',
    Media = 'media',
    Mission = 'mission'
}

export enum ELocalStorageKey {
    Username = 'username',
    WorkspaceId = 'workspace_id',
    Token = 'x-auth-token',
    PlatformName = 'platform_name',
    WorkspaceName = 'workspace_name',
    WorkspaceDesc = 'workspace_desc',
    Flag = 'flag',
    UserId = 'user_id',
    Device = 'device',
    GatewayOnline = 'gateway_online',
}

export enum EPhotoType {
    Original = 0,
    Preview = 1,
    Unknown = -1
}

export enum EDownloadOwner {
    Mine = 0,
    Others = 1,
    Unknown = -1
}

export enum EUserType {
    Web = 1,
    Pilot = 2,
}

export enum EBizCode {
    GatewayOsd = 'gateway_osd',
    DeviceOsd = 'device_osd',
    DockOsd = 'dock_osd',
    MapElementCreate = 'map_element_create',
    MapElementUpdate = 'map_element_update',
    MapElementDelete = 'map_element_delete',
    DeviceOnline = 'device_online',
    DeviceOffline = 'device_offline',
    DeviceHms = 'device_hms',

    // 机场任务
    FlightTaskProgress = 'flighttask_progress', // 机场任务执行进度
    FlightTaskMediaProgress = 'file_upload_callback', // 机场任务媒体上传进度
    FlightTaskMediaHighestPriority = 'highest_priority_upload_flighttask_media', // 机场任务媒体优先级上报

    // 设备指令
    DeviceReboot = 'device_reboot', // 机场重启
    DroneOpen = 'drone_open', // 飞行器开机
    DroneClose = 'drone_close', // 飞行器关机
    DeviceFormat = 'device_format', // 机场数据格式化
    DroneFormat = 'drone_format', // 飞行器数据格式化
    CoverOpen = 'cover_open', // 打开舱盖
    CoverClose = 'cover_close', // 关闭舱盖
    PutterOpen = 'putter_open', // 推杆展开
    PutterClose = 'putter_close', // 推杆闭合
    ChargeOpen = 'charge_open', // 打开充电
    ChargeClose = 'charge_close', // 关闭充电

    // 设备升级
    DeviceUpgrade = 'ota_progress', // 设备升级

    // 设备日志
    DeviceLogUploadProgress = 'fileupload_progress', // 设备日志上传

    // 飞行指令消息
    ControlSourceChange = 'control_source_change', // 控制权更新
    FlyToPointProgress = 'fly_to_point_progress', // 飞向目标点
    TakeoffToPointProgress = 'takeoff_to_point_progress', // 一键起飞
    JoystickInvalidNotify = 'joystick_invalid_notify', // 设备端退出drc模式
    DrcStatusNotify = 'drc_status_notify', // 飞行控制模式状态
}

export enum EDeviceTypeName {
    Aircraft = 0,
    Gateway = 2,
    Dock = 3,
}

export enum EHmsLevel {
    NOTICE,
    CAUTION,
    WARN,
}
