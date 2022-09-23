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
    FlightTaskProgress = 'flighttask_progress',
    DeviceHms = 'device_hms',

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
    DeviceLogUploadProgress = 'fileupload_progress' // 设备日志上传上传
}

export enum EDeviceTypeName {
    Aircraft = 'sub-device',
    Gateway = 'gateway',
    Dock = 'dock',
}

export enum EHmsLevel {
    NOTICE,
    CAUTION,
    WARN,
}
