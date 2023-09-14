<template>
  <div class="project-layer-wrapper height-100">
    <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #4f4f4f; font-weight: 450;">
      <a-row>
        <a-col :span="1"></a-col>
        <a-col :span="20">标注</a-col>
        <a-col :span="1">
          <a-tooltip title="导入">
            <img :src="importImg" class="img-icon" @click="openFileDialog" />
          </a-tooltip>
        </a-col>
      </a-row>
    </div>
    <div class="scrollbar" :style="{ height: scorllHeight + 'px'}">
    <LayersTree
      :layer-data="mapLayers"
      class="project-layer-content"
      @check="checkLayer"
      @select="selectLayer"
      v-model:selectedKeys="selectedKeys"
      v-model:checkedKeys="checkedKeys"
    />
    </div>
    <a-drawer
      title="标注信息"
      placement="right"
      :closable="true"
      v-model:visible="visible"
      :mask="false"
      wrapClassName="drawer-element-wrapper"
      @close="closeDrawer"
      width="300"
    >
      <div class="drawer-element-content">
        <div class="name element-item">
          <span class="title">名称:</span>
          <a-input
            v-model:value="layerState.layerName"
            style="width:120px"
            placeholder="element name"
            @change="changeLayer"
          />
        </div>
        <div class="name element-item" v-if="layerState.currentType === geoType.Polygon">
          <span class="title">水平面积:</span>
          <span class="title">{{layerState.laterArea}} m²</span>
        </div>
        <div class="name element-item" v-if="layerState.currentType === geoType.Polygon">
          <span class="title">水平周长:</span>
          <span class="title">{{layerState.laterRound}} m</span>
        </div>
        <div class="name element-item" v-if="layerState.currentType === geoType.Polygon">
          <span class="title">高度差:</span>
          <span class="title">0</span>
        </div>
        <div class="name element-item" v-if="layerState.currentType === geoType.LineString">
          <span class="title">水平距离:</span>
          <span class="title">{{layerState.laterRound}} m</span>
        </div>
        <div class="name element-item" v-if="layerState.currentType === geoType.LineString">
          <span class="title">直线距离:</span>
          <span class="title">{{layerState.laterRound}} m</span>
        </div>
        <div
          class="longitude element-item"
          v-if="layerState.currentType === geoType.Point"
        >
          <span class="title">Longitude:</span>
          <a-input
            v-model:value="layerState.longitude"
            style="width:120px"
            placeholder="longitude"
            @change="changeLayer"
          />
        </div>
        <div
          class="latitude element-item"
          v-if="layerState.currentType === geoType.Point"
        >
          <span class="title">Latitude:</span>
          <a-input
            v-model:value="layerState.latitude"
            style="width:120px"
            placeholder="latitude"
            @change="changeLayer"
          />
        </div>
        <div class="color-content">
          <span class="mr30">颜色: </span>
          <div
            v-for="item in colors"
            :key="item.id"
            class="color-item"
            :style="'background:' + item.color"
            @click="changeColor(item)"
          >
            <svg-icon
              v-if="item.color === layerState.color"
              :size="18"
              name="check"
            ></svg-icon>
          </div>
        </div>
      </div>
      <div class="flex-row flex-justify-around flex-align-center mt20">
        <a-button type="primary" @click="deleteElement">删除</a-button>
      </div>
    </a-drawer>
    <a-modal v-model:visible="importVisible" :closable="false"  :maskClosable="false" class="modal-layer-content">
      <template #title>
        <div class="model-title">导入</div>
      </template>
      <a-form :model="state" :rules="rules" class="form-content" ref="fileModalRef">
        <a-form-item label="文件" style="color:#fff" name="file">
          <a-upload
          accept=".kml"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          :file-list="state.file"
          :show-upload-list="true"
          :before-upload="beforeUpload"
          :remove="removeFile"

          >
            <a-button class="btn-color">
              <upload-outlined></upload-outlined>
              上传文件
            </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="文件夹" style="color:#fff" name="id">
          <a-tree-select
          v-model:value="state.id"
          style="width: 100%"
          :tree-data="mapLayers"
          :replace-fields="{children:'elements', label:'name', value: 'id' }"
          allow-clear
          placeholder="Please select"
          />
        </a-form-item>
      </a-form>
      <template #footer>
        <div>
          <a-button  large class="btn-primary btn-color" @click='importVisible=false'>取消</a-button>
          <a-button  type="primary" large class="btn-primary" @click='importSubmit()'>确定</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import {
  deleteElementReq,
  getElementGroupsReq,
  updateElementsReq,
  importKmlFile
} from '/@/api/layer'
import LayersTree from '/@/components/LayersTree.vue'
import { MapDoodleColor, MapElementEnum } from '/@/constants/map'
import { useGMapCover } from '/@/hooks/use-g-map-cover'
import { getRoot } from '/@/root'
import { useMyStore } from '/@/store'
import { ELocalStorageKey } from '/@/types'
import { GeojsonCoordinate, LayerResource } from '/@/types/map'
import { Color, GeoType } from '/@/types/mapLayer'
import { generatePoint } from '/@/utils/genjson'
import { gcj02towgs84, wgs84togcj02 } from '/@/vendors/coordtransform'
import importImg from '/@/assets/icons/import.svg'

const root = getRoot()
const store = useMyStore()
let useGMapCoverHook = useGMapCover(store)
console.log('store', store)
const mapLayers = ref(store?.state?.Layers)
const checkedKeys = ref<string[]>([])
const selectedKeys = ref<string[]>([])
const selectedKey = ref<string>('')
const selectedLayer = ref<any>(null)
const visible = ref<boolean>(false)
store.commit('SET_DRAW_VISIBLE_INFO', visible.value)
const geoType = GeoType
const layerState = reactive({
  layerName: '',
  layerId: '',
  laterArea: '',
  laterRound: '',
  laterRound2: 276.7,
  longitude: 0,
  latitude: 0,
  currentType: '', // “LineString”,"Polygon","Point"
  color: '#212121'
})
const colors = ref<Color[]>([
  { id: 1, name: 'BLUE', color: '#2D8CF0', selected: true },
  { id: 2, name: 'GREEN', color: '#19BE6B', selected: false },
  { id: 3, name: 'YELLOW', color: '#FFBB00', selected: false },
  { id: 4, name: 'ORANGE', color: '#B620E0', selected: false },
  { id: 5, name: 'RED', color: '#E23C39', selected: false },
  { id: 6, name: 'NAME_DEFAULT', color: '#212121', selected: false }
])
const scorllHeight = ref()

async function getAllElement () {
  getElementGroups('init')
  setTimeout(() => {
    useGMapCoverHook = useGMapCover()
    initMapCover()
  }, 1000)
}
function initMapCover () {
  mapLayers.value.forEach(item => {
    if (item.elements) {
      setMapCoverByElement(item.elements)
    }
  })
}
watch(
  () => store.state.Layers,
  newData => {
    mapLayers.value = newData
  },
  {
    deep: true
  }
)

watch(
  () => store.state.layerId,
  newLayerId => {
    selectedKey.value = 'resource__' + newLayerId
    selectedLayer.value = getCurrentLayer(selectedKey.value)
    setBaseInfo()
    visible.value = true
    store.commit('SET_DRAW_VISIBLE_INFO', visible.value)
  },
  {
    deep: true // 监听属性变化
  }
)
function setMapCoverByElement (elements: LayerResource[]) {
  elements.forEach(element => {
    const name = element.name
    const color = element.resource?.content.properties.color
    const type = element.resource?.type as number
    updateMapElement(element, name, color)
  })
}
function updateMapElement (
  element: LayerResource,
  name: string,
  color: string | undefined
) {
  const geoType = element.resource?.content.geometry.type
  const id = element.id
  const type = element.resource?.type as number

  if (MapElementEnum.PIN === type) {
    const coordinates = element.resource?.content.geometry
      .coordinates as GeojsonCoordinate
    useGMapCoverHook.updatePinElement(id, name, coordinates, color)
  } else if (MapElementEnum.LINE === type && geoType === 'LineString') {
    const coordinates = element.resource?.content.geometry
      .coordinates as GeojsonCoordinate[]
    useGMapCoverHook.initPolyline(name, coordinates, color, {
      id: id,
      name: name
    })
  } else if (MapElementEnum.POLY === type && geoType === 'Polygon') {
    const coordinates = element.resource?.content.geometry
      .coordinates[0] as GeojsonCoordinate[]
    useGMapCoverHook.initPolygon(name, coordinates, color, {
      id: id,
      name: name,
    })
  }
}
function checkLayer (keys: string[]) {
  console.log('checkLayer', keys, selectedKeys.value, checkedKeys.value)
}
function selectLayer (keys: string[], e) {
  // console.log('selectLayer', e.node.eventKey, e.selected)
  if (e.selected) {
    selectedKey.value = e.node.eventKey
    selectedLayer.value = getCurrentLayer(selectedKey.value)
    setBaseInfo()
  }
  visible.value = e.selected
  store.commit('SET_DRAW_VISIBLE_INFO', visible.value)
  // store.dispatch('updateElement', { type: 'is_select', id: e.node.eventKey, bool: e.selected })
}
function getCurrentLayer (id: string) {
  const Layers = store.state.Layers
  const key = id.replaceAll('resource__', '')
  // console.log('selectedKey.value', selectedKey.value)
  let layer = null
  const findCan = function (V) {
    V.forEach(item => {
      if (item.id === key) {
        layer = item
      }
      if (item.elements) {
        findCan(item.elements)
      }
    })
  }
  findCan(Layers)
  // const layer = Layers.find(item => item.elements.find(el => el.id === key))
  console.log('layer', layer)
  return layer
}
function setBaseInfo () {
  const layer = selectedLayer.value
  if (layer) {
    const geoType = layer.resource?.content.geometry.type
    // “LineString”,"Polygon","Point"
    layerState.currentType = geoType
    layerState.layerName = layer.name
    layerState.layerId = layer.id
    layerState.color = layer.resource?.content.properties.color
    // 水平面积
    layerState.laterArea = layer.area
    // 水平周长
    layerState.laterRound = layer.around
    switch (geoType) {
      case GeoType.Point:
        layerState.longitude = layer.resource?.content.geometry.coordinates[0]
        layerState.latitude = layer.resource?.content.geometry.coordinates[1]
        break
      case GeoType.LineString:
        break
      case GeoType.Polygon:

        break
    }
  }
}
onMounted(() => {
  const element = document.getElementsByClassName('scrollbar').item(0) as HTMLDivElement
  const parent = element?.parentNode as HTMLDivElement
  scorllHeight.value = parent?.clientHeight - parent?.firstElementChild!.clientHeight
  getAllElement()
})
function closeDrawer () {
  store.commit('SET_DRAW_VISIBLE_INFO', false)
  selectedKeys.value = []
}
function changeColor (color: Color) {
  layerState.color = color.color

  updateElements()
}
function changeLayer (val: string) {
  updateElements()
}
async function deleteElement () {
  const elementid = selectedLayer.value.id

  await deleteElementReq(elementid, {}).then(async (res: any) => {
    // console.log('delete element res:', res)
    if (res.code !== 0) {
      console.warn(res)
      return
    }
    visible.value = false
    store.commit('SET_DRAW_VISIBLE_INFO', visible.value)
    useGMapCoverHook.removeCoverFromMap(elementid)
    getElementGroups()
  })
}
async function getElementGroups (type?: string) {
  const result = await getElementGroupsReq({
    groupId: '',
    isDistributed: true
  })
  mapLayers.value = result.data
  mapLayers.value = updateWgs84togcj02()
  if (type && type === 'init') {
    store.dispatch('setLayerInfo', mapLayers.value)
  }
  store.commit('SET_LAYER_INFO', mapLayers.value)
}
async function updateElements () {
  let content = null
  if (layerState.currentType === GeoType.Point) {
    const position = {
      height: 0,
      latitude: Number(layerState.latitude || 0),
      longitude: Number(layerState.longitude || 0)
    }
    const cxt = generatePoint(position, {
      color: layerState.color || MapDoodleColor.PinColor,
      clampToGround: true
    })
    content = {
      type: MapElementEnum.PIN,
      geometry: cxt.geometry,
      properties: cxt.properties
    }
    const currentLayer = selectedLayer.value
    currentLayer.resource.content = content
    selectedLayer.value = currentLayer
  } else {
    const currentLayer = selectedLayer.value
    content = currentLayer.resource.content
    content.properties.color = layerState.color
  }
  updateMapElement(selectedLayer.value, layerState.layerName, layerState.color)
  const result = await updateElementsReq(layerState.layerId, {
    name: layerState.layerName,
    content: content
  })
  getElementGroups()
}

function updateWgs84togcj02 () {
  const layers = mapLayers.value
  layers.forEach(item => {
    if (item.elements) {
      item.elements.forEach(ele => {
        updateCoordinates('wgs84-gcj02', ele)
      })
    }
  })
  return layers
}
function updateCoordinates (transformType: string, element: LayerResource) {
  const geoType = element.resource?.content.geometry.type
  const type = element.resource?.type as number
  if (element.resource) {
    if (MapElementEnum.PIN === type) {
      const coordinates = element.resource?.content.geometry
        .coordinates as GeojsonCoordinate
      if (transformType === 'wgs84-gcj02') {
        const transResult = wgs84togcj02(
          coordinates[0],
          coordinates[1]
        ) as GeojsonCoordinate
        element.resource.content.geometry.coordinates = transResult
      } else if (transformType === 'gcj02-wgs84') {
        const transResult = gcj02towgs84(
          coordinates[0],
          coordinates[1]
        ) as GeojsonCoordinate
        element.resource.content.geometry.coordinates = transResult
      }
    } else if (MapElementEnum.LINE === type && geoType === 'LineString') {
      const coordinates = element.resource?.content.geometry
        .coordinates as GeojsonCoordinate[]
      if (transformType === 'wgs84-gcj02') {
        coordinates.forEach(coordinate => {
          coordinate = wgs84togcj02(
            coordinate[0],
            coordinate[1]
          ) as GeojsonCoordinate
        })
      } else if (transformType === 'gcj02-wgs84') {
        coordinates.forEach(coordinate => {
          coordinate = gcj02towgs84(
            coordinate[0],
            coordinate[1]
          ) as GeojsonCoordinate
        })
      }
      element.resource.content.geometry.coordinates = coordinates
    } else if (MapElementEnum.LINE === type && geoType === 'Polygon') {
      const coordinates = element.resource?.content.geometry
        .coordinates[0] as GeojsonCoordinate[]

      if (transformType === 'wgs84-gcj02') {
        coordinates.forEach(coordinate => {
          coordinate = wgs84togcj02(
            coordinate[0],
            coordinate[1]
          ) as GeojsonCoordinate
        })
      } else if (transformType === 'gcj02-wgs84') {
        coordinates.forEach(coordinate => {
          coordinate = gcj02towgs84(
            coordinate[0],
            coordinate[1]
          ) as GeojsonCoordinate
        })
      }
      element.resource.content.geometry.coordinates = [coordinates]
    }
  }
}
/** 导入文件--------------start */
interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
}
const fileModalRef = ref()
const workspaceId: string = localStorage.getItem(ELocalStorageKey.WorkspaceId) || ''
const importVisible = ref(false)
const state = reactive({ id: '', file: [] })
// 打开文件导入弹框
const openFileDialog = () => {
  state.id = ''
  state.file = []
  importVisible.value = true
}
// 确认导入操作
const importSubmit = () => {
  fileModalRef.value.validate().then(() => {
    state.file.forEach(async (file: any) => {
      const fileData = new FormData()
      fileData.append('file', file, file.name)
      await importKmlFile(workspaceId, fileData, state.id).then((res:any) => {
        importVisible.value = false
        getElementGroups()
      })
    })
  })
}
function beforeUpload (file: FileItem) {
  fileModalRef.value.validate()
  state.file = [file]
  return true
}
const rules = {
  id: [{ required: true, message: '请选择文件夹', trigger: 'change' }],
  file: [
    {
      required: true,
      trigger: 'change',
      validator: async (rule: any, value: string) => {
        if (!value.length) {
          throw new Error('请上传文件')
        }
      },
    }
  ],
}
const removeFile = () => {
  state.file = []
}

/** 导入文件--------------end */
</script>

<style lang="scss" scoped>

@import '/@/styles/index.scss';
::v-deep(.ant-modal-content){
  background-color: #1c1c1c;

}
.btn-color{
    background-color: #3c3c3c;
    border:none;
    color:#fff;
    &:hover{
    background-color: #666;

    }
  }
.form-content{
  ::v-deep(.ant-form-item-label>label){
    color:#ffffffa6
  }
  ::v-deep(.ant-select-selector){
    background-color:#3c3c3c !important;
    border:none !important;
  }
  ::v-deep{
    .ant-upload-list-item-name{
      color:#fff;
    }
    .anticon-paper-clip,.ant-upload-list-item-card-actions .anticon{
      color: #fff;
    }
    .ant-upload-list-item-info{
      &:hover{
        background: #1c1c1c;
      }
    }
  }
}
.img-icon{
  cursor: pointer;
  width:22px;
  height:22px;
}

.model-title{
  cursor: move ;
  text-align: center;
  border: none;
  color:#fff;
  width:100%;
}
</style>
<style lang="scss">
.modal-layer-content{
  .ant-modal-content{
    background-color: #1c1c1c !important;
  }
  .ant-modal-header{
    background-color: #282828;
    border:none;
  }
  .ant-modal-footer{
    border:none;
  }
}
.drawer-element-wrapper {
  .ant-drawer-content {
    background-color: $dark-highlight;
    color: $text-white-basic;
    .ant-drawer-header {
      background-color: $dark-highlight;
      .ant-drawer-title {
        color: $text-white-basic;
      }
      .ant-drawer-close {
        color: $text-white-basic;
      }
    }
    .ant-input {
      background-color: #101010;
      border-color: $dark-border;
      color: $text-white-basic;
    }
  }
  .color-content {
    display: flex;
    align-items: center;
    margin-top: 8px;
    .color-item {
      cursor: pointer;
      width: 18px;
      height: 18px;
      line-height: 18px;
      display: flex;
      align-items: center;
      margin-left: 5px;
    }
  }
  .title {
    display: inline-flex;
    width: 80px;
  }
  .element-item {
    margin-bottom: 10px;
  }
}
.scrollbar {
  overflow: auto;
}

</style>
