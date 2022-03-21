
/**
 * Used for log printing in a non-production environment
 * @param args
 */
export function consoleLog (...args: Parameters<typeof console.log>) {
  if (import.meta.env.VITE_APP_ENVIRONMENT !== 'PROD') {
    window.console.log.apply(null, args) // eslint-disable-line no-console
  }
}

export function consoleWarn (...args: Parameters<typeof console.warn>) {
  if (import.meta.env.VITE_APP_ENVIRONMENT !== 'PROD') {
    console.warn.apply(null, args) // eslint-disable-line no-console
  }
}

export function consoleError (...args: Parameters<typeof console.error>) {
  if (import.meta.env.VITE_APP_ENVIRONMENT !== 'PROD') {
    console.error.apply(null, args) // eslint-disable-line no-console
  }
}

export function testEnvLog (...args: Parameters<typeof console.log>) {
  if (import.meta.env.VITE_APP_ENVIRONMENT !== 'PROD') {
    console.log.apply(null, args) // eslint-disable-line no-console
  }
}
