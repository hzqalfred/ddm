<template>
  <container-item-wrapper :widget="widget">
    <div :key="widget.id" class="table-container" v-show="!widget.options.hidden">
      <table :ref="widget.id" class="table-layout" :class="[customClass]">
        <tbody>
          <tr v-for="(row, rowIdx) in widget.rows" :key="row.id">
            <template v-for="(colWidget, colIdx) in row.cols">
              <table-cell-item
                v-if="!colWidget.merged"
                :widget="colWidget"
                :key="colIdx"
                :parent-list="widget.cols"
                :row-index="rowIdx"
                :col-index="colIdx"
                :parent-widget="widget"
              >
                <!-- 递归传递插槽！！！ -->
                <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
                  <slot :name="slot" v-bind="scope" />
                </template>
              </table-cell-item>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </container-item-wrapper>
</template>

<script>
import emitter from '@/core/components/VForm/lib/emitter'
import i18n from '@/core/i18nLang'
import refMixin from '../refMixin'
import ContainerItemWrapper from '@/core/components/VForm/form-render/container-item/container-item-wrapper.vue'
import TableCellItem from '@/core/components/VForm/form-render/container-item/table-cell-item.vue'
import containerItemMixin from './containerItemMixin'

export default {
  name: 'table-item',
  componentName: 'ContainerItem',
  mixins: [emitter, i18n, refMixin, containerItemMixin],
  components: {
    ContainerItemWrapper,
    TableCellItem
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

<style lang="scss" scoped>
div.table-container {
  table.table-layout {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }
}
</style>
