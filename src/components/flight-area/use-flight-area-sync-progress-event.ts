import EventBus from '/@/event-bus/'
import { onMounted, onBeforeUnmount } from 'vue'
import { FlightAreaSyncProgress } from '/@/types/flight-area'

export function useFlightAreaSyncProgressEvent (onFlightAreaSyncProgressWs: (data: FlightAreaSyncProgress) => void): void {
  function handleSyncProgressEvent (data: FlightAreaSyncProgress) {
    onFlightAreaSyncProgressWs(data)
  }

  onMounted(() => {
    EventBus.on('flightAreasSyncProgressWs', handleSyncProgressEvent)
  })

  onBeforeUnmount(() => {
    EventBus.off('flightAreasSyncProgressWs', handleSyncProgressEvent)
  })
}
