import { nextTick, App } from 'vue'

export default function useDragWindowDirective (app: App): void {
  app.directive('drag-window', async (el) => {
    await nextTick()

    const modal = el
    const header = el.getElementsByClassName('drag-title')[0]
    let left = 0
    let top = 0
    header.style.cursor = 'move'
    top = top || modal.offsetTop

    header.onpointerdown = (e: { clientX: number; clientY: number; pointerId: number }) => {
      const startX = e.clientX
      const startY = e.clientY
      header.left = header.offsetLeft
      header.top = header.offsetTop
      header.setPointerCapture(e.pointerId)

      el.onpointermove = (event: { clientX: number; clientY: number }) => {
        const endX = event.clientX
        const endY = event.clientY
        modal.left = header.left + (endX - startX) + left
        modal.top = header.top + (endY - startY) + top
        modal.style.left = modal.left + 'px'
        modal.style.top = modal.top + 'px'
      }
      el.onpointerup = () => {
        left = modal.left || 0
        top = modal.top || 0
        el.onpointermove = null
        el.onpointerup = null
        header.releasePointerCapture(e.pointerId)
      }
    }
  })
}
