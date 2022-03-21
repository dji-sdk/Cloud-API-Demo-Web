// Environment variable definition
// https://cn.vitejs.dev/guide/env-and-mode.html#env-files

interface ImportMetaEnv {
  VITE_APP_ENVIRONMENT: 'DEV' | 'STAG' | 'UAT' | 'PROD',
  // api gateway
  VITE_APP_APIGATEWAY_BACKEND_HOST: string
  // More environment variables...
}
