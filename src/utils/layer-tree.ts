const layerTreeTypes = ['layer', 'resource'] as const
type LayerTreeType = (typeof layerTreeTypes)[number]
const Spliter = '__'

export function getLayerTreeKey (type: LayerTreeType, id: number | string) {
  return `${type}${Spliter}${id}`
}

export function isLayerTreeKey (key: string, type?: LayerTreeType) {
  if (type) {
    return key.startsWith(`${type}${Spliter}`)
  } else {
    return layerTreeTypes.some(t => key.startsWith(`${t}${Spliter}`))
  }
}

export function getIdFromLayerTreeKey (key: string) {
  return key.split(Spliter)[1]
}
