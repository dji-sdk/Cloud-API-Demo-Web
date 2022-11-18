import EventBus from '/@/event-bus/'
import { onMounted, onBeforeUnmount } from 'vue'
import { TaskProgressInfo } from '/@/types/task'

export function useTaskProgressEvent (onTaskProgressWs: (data: TaskProgressInfo) => void): void {
  function handleTaskProgress (payload: any) {
    onTaskProgressWs(payload.data)
    // eslint-disable-next-line no-unused-expressions
    // console.log('payload', payload.data)
  }

  onMounted(() => {
    EventBus.on('deviceTaskProgress', handleTaskProgress)
  })

  onBeforeUnmount(() => {
    EventBus.off('deviceTaskProgress', handleTaskProgress)
  })
}
