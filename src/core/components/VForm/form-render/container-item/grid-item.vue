<template>
  <container-item-wrapper :widget="widget">
    <el-row :key="widget.id" :gutter="widget.options.gutter" class="grid-container" :class="[customClass]" :ref="widget.id" v-show="!widget.options.hidden" style="position: relative;padding-top: 0px;">
      <template v-for="(colWidget, colIdx) in widget.cols" :key="colIdx">
        <grid-col-item :widget="colWidget" :parent-list="widget.cols" :index-of-parent-list="colIdx" :parent-widget="widget" :col-height="widget.options.colHeight">
          <!-- 递归传递插槽！！！ -->
          <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </grid-col-item>
      </template>
    </el-row>
  </container-item-wrapper>
</template>

<script>
import emitter from '@/core/components/VForm/lib/emitter'
import i18n from '@/core/i18nLang'
import refMixin from '../refMixin'
import ContainerItemWrapper from '@/core/components/VForm/form-render/container-item/container-item-wrapper.vue'
import GridColItem from '@/core/components/VForm/form-render/container-item/grid-col-item.vue'
import containerItemMixin from './containerItemMixin'

export default {
  name: 'vf-grid-item', //grid-item跟VueGridLayout全局注册组件重名，故特殊处理！！
  componentName: 'ContainerItem',
  mixins: [emitter, i18n, refMixin, containerItemMixin],
  components: {
    ContainerItemWrapper,
    GridColItem
  },
  props: {
    widget: Object
  },
  inject: ['refList', 'sfRefList', 'globalModel'],
  created() {
    this.initRefList()
  },
  mounted() {},
  beforeUnmount() {
    this.unregisterFromRefList()
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
