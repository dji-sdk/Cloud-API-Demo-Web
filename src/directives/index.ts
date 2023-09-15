import { App } from 'vue'
import useDragWindowDirective from './drag-window'

export function useDirectives (app: App): void {
  useDragWindowDirective(app)
}
