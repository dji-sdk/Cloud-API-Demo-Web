import { FlightAreasDroneLocation } from '/@/types/flight-area'
import { CommonHostWs } from '/@/websocket'
import EventBus from '/@/event-bus/'
import { onMounted, onBeforeUnmount } from 'vue'

export function useFlightAreaDroneLocationEvent (onFlightAreaDroneLocationWs: (data: CommonHostWs<FlightAreasDroneLocation>) => void): void {
  function handleDroneLocationEvent (data: any) {
    onFlightAreaDroneLocationWs(data.data)
  }

  onMounted(() => {
    EventBus.on('flightAreasDroneLocationWs', handleDroneLocationEvent)
  })

  onBeforeUnmount(() => {
    EventBus.off('flightAreasDroneLocationWs', handleDroneLocationEvent)
  })
}
