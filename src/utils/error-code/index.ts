export interface ErrorCode {
  code: number;
  msg: string;
}

/**
 * 根据错误码翻译错误信息
 * @param code
 * @param errorMsg
 * @returns
 */
export function getErrorMessage (code: number, errorMsg?: string): string {
  const errorInfo = ERROR_CODE.find((item: ErrorCode) => item.code === code)
  return errorInfo ? errorInfo.msg : errorMsg || 'Server error'
}

// 暂时只添加航线错误
export const ERROR_CODE = [
  {
    code: 314001,
    msg: 'The issued route task url is empty',
  },
  {
    code: 314002,
    msg: 'The issued route task md5 is empty',
  },
  {
    code: 314003,
    msg: 'MissionID is invalid',
  },
  {
    code: 314004,
    msg: 'Failed to send flight route task from cloud',
  },
  {
    code: 314005,
    msg: 'Route md5 check failed',
  },
  {
    code: 314006,
    msg: 'Timeout waiting for aircraft to upload route (waiting for gs_state)',
  },
  {
    code: 314007,
    msg: 'Failed to upload route to aircraft',
  },
  {
    code: 314008,
    msg: 'Timeout waiting for the aircraft to enter the route executable state',
  },
  {
    code: 314009,
    msg: 'Failed to open route mission',
  },
  {
    code: 314010,
    msg: 'Route execution failed',
  },
  {
    code: 316001,
    msg: 'Failed to set alternate point',
  },
  {
    code: 316002,
    msg: 'Alternate safety transfer altitude equipment failed',
  },
  {
    code: 316003,
    msg: 'Failed to set takeoff altitude. Remarks: The default safe takeoff height of the aircraft set by the current DJI Dock is: 1.8',
  },
  {
    code: 316004,
    msg: 'Failed to set runaway behavior',
  },
  {
    code: 316005,
    msg: 'Aircraft RTK convergence failed',
  },
  {
    code: 316013,
    msg: 'DJI Dock Moved',
  },
  {
    code: 316015,
    msg: 'The aircraft RTK convergence position is too far from the DJI Dock',
  },
  {
    code: 316007,
    msg: 'Set parameter timeout while waiting for aircraft to be ready',
  },
  {
    code: 316008,
    msg: 'Failed to gain control of aircraft',
  },
  {
    code: 316009,
    msg: 'Aircraft power is low',
  },
  {
    code: 316010,
    msg: 'After power on, the aircraft is not connected for more than 2 minutes (flight control OSD reception timeout)',
  },
  {
    code: 316011,
    msg: 'Landing Position Offset',
  },

  {
    code: 317001,
    msg: 'Failed to get the number of media files',
  },

  {
    code: 319001,
    msg: 'The task center is not currently idle',
  },
  {
    code: 319002,
    msg: 'dronenest communication timeout',
  },
  {
    code: 319999,
    msg: 'Unknown error, e.g. restart after crash',
  },
  {
    code: 321000,
    msg: 'Route execution failed, unknown error',
  },
  {
    code: 321257,
    msg: 'The route has already started and cannot be started again',
  },
  {
    code: 321258,
    msg: 'The route cannot be interrupted in this state',
  },
  {
    code: 321259,
    msg: 'The route has not started and cannot end the route',
  },
  {
    code: 321513,
    msg: 'Reach the height limit',
  },
  {
    code: 321514,
    msg: 'Reach the limit',
  },
  {
    code: 321515,
    msg: 'Crossing the restricted flight zone',
  },
  {
    code: 321516,
    msg: 'Low limit',
  },

  {
    code: 321517,
    msg: 'Obstacle Avoidance',
  },
  {
    code: 321769,
    msg: 'Weak GPS signal',
  },
  {
    code: 321770,
    msg: 'The current gear state cannot be executed, B control seizes the control, and the gear is switched',
  },
  {
    code: 321771,
    msg: 'The home point is not refreshed',
  },
  {
    code: 321772,
    msg: 'The current battery is too low to start the task',
  },
  {
    code: 321773,
    msg: 'Low battery return',
  },
  {
    code: 321776,
    msg: 'RTK not ready',
  },
  {
    code: 321778,
    msg: 'The aircraft is idling on the ground and is not allowed to start the route, thinking that the user is not ready.',
  },
  {
    code: 322282,
    msg: 'User interrupt (B control takeover)',
  },
  {
    code: 514100,
    msg: 'Command not supported',
  },
  {
    code: 514101,
    msg: 'Failed to close putter',
  },
  {
    code: 514102,
    msg: 'Failed to release putter',
  },
  {
    code: 514103,
    msg: 'Aircraft battery is low',
  },
  {
    code: 514104,
    msg: 'Failed to start charging',
  },
  {
    code: 514105,
    msg: 'Failed to stop charging',
  },
  {
    code: 514106,
    msg: 'Failed to restart the aircraft',
  },
  {
    code: 514107,
    msg: 'Failed to open hatch',
  },
  {
    code: 514108,
    msg: 'Failed to close hatch',
  },
  {
    code: 514109,
    msg: 'Failed to open the plane',
  },
  {
    code: 514110,
    msg: 'Failed to close the plane',
  },
  {
    code: 514111,
    msg: 'The aircraft failed to turn on the slow-rotating propeller in the cabin',
  },
  {
    code: 514112,
    msg: 'The aircraft failed to stop the slow-rotating propeller in the cabin',
  },
  {
    code: 514113,
    msg: 'Failed to establish wired connection with aircraft',
  },
  {
    code: 514114,
    msg: 'Get aircraft power status, command timed out, or return code is not 0',
  },
  {
    code: 514116,
    msg: 'The DJI Dock is busy and other control orders are being executed at the DJI Dock',
  },
  {
    code: 514117,
    msg: 'Check hatch status failed',
  },
  {
    code: 514118,
    msg: 'Check putter status failed',
  },
  {
    code: 514120,
    msg: 'DJI Dock and aircraft SDR connection failed',
  },
  {
    code: 514121,
    msg: 'Emergency stop state',
  },
  {
    code: 514122,
    msg: 'Failed to get the charging status of the aircraft (Failed to get the charging status, the flight mission can be executed, affecting charging and remote troubleshooting)',
  },
  {
    code: 514123,
    msg: 'Unable to power on due to low battery',
  },
  {
    code: 514124,
    msg: 'Failed to get battery information',
  },
  {
    code: 514125,
    msg: 'The battery is fully charged and cannot be charged',
  },
  {
    code: 514145,
    msg: 'Can not work while debugging on site',
  },
  {
    code: 514146,
    msg: 'Unable to work in remote debugging',
  },
  {
    code: 514147,
    msg: 'Unable to work in upgrade state',
  },
  {
    code: 514148,
    msg: 'Unable to execute new tasks in job state',
  },
  {
    code: 514150,
    msg: 'DJI Dock is automatically restarting',
  },
]
