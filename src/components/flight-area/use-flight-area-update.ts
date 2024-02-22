import { EFlightAreaUpdate, FlightAreaUpdate, FlightAreasDroneLocation } from '/@/types/flight-area'
import { CommonHostWs } from '/@/websocket'
import EventBus from '/@/event-bus/'
import { onMounted, onBeforeUnmount } from 'vue'

function doNothing (data: FlightAreaUpdate) {
}
export function useFlightAreaUpdateEvent (addFunc = doNothing, deleteFunc = doNothing, updateFunc = doNothing): void {
  function handleDroneLocationEvent (data: FlightAreaUpdate) {
    switch (data.operation) {
      case EFlightAreaUpdate.ADD:
        addFunc(data)
        break
      case EFlightAreaUpdate.UPDATE:
        updateFunc(data)
        break
      case EFlightAreaUpdate.DELETE:
        deleteFunc(data)
        break
    }
  }

  onMounted(() => {
    EventBus.on('flightAreasUpdateWs', handleDroneLocationEvent)
  })

  onBeforeUnmount(() => {
    EventBus.off('flightAreasUpdateWs', handleDroneLocationEvent)
  })
}
