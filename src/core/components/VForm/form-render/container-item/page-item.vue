<template>
  <container-item-wrapper :widget="widget">
    <div :key="widget.id" class="tab-container" v-show="!widget.options.hidden">
      <template v-for="(subWidget, swIdx) in widget.widgetList">
        <template v-if="'container' === subWidget.category">
          <component
            :is="getComponentByContainer(subWidget)"
            :widget="subWidget"
            :key="swIdx"
            :parent-list="widget.widgetList"
            :index-of-parent-list="swIdx"
            :parent-widget="widget"
          >
            <!-- 递归传递插槽！！！ -->
            <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
              <slot :name="slot" v-bind="scope" />
            </template>
          </component>
        </template>
        <template v-else>
          <component
            :is="(getFormType == 'print' ? 'print' : subWidget.type) + '-widget'"
            :field="subWidget"
            :key="swIdx"
            :parent-list="widget.widgetList"
            :index-of-parent-list="swIdx"
            :parent-widget="widget"
          >
            <!-- 递归传递插槽！！！ -->
            <template v-for="slot in Object.keys($slots)" v-slot:[slot]="scope">
              <slot :name="slot" v-bind="scope" />
            </template>
          </component>
        </template>
      </template>
    </div>
  </container-item-wrapper>
</template>

<script>
import emitter from '@/core/components/VForm/lib/emitter'
import i18n from '@/core/i18nLang'
import refMixin from '../refMixin'
import ContainerItemWrapper from '@/core/components/VForm/form-render/container-item/container-item-wrapper.vue'
import containerItemMixin from './containerItemMixin'
import FieldComponents from '@/core/components/VForm/form-designer/form-widget/field-widget/index'

export default {
  name: 'page-item',
  componentName: 'ContainerItem',
  mixins: [emitter, i18n, refMixin, containerItemMixin],
  components: {
    ContainerItemWrapper,
    ...FieldComponents
  },
  props: {
    widget: Object
  },
  inject: ['refList', 'sfRefList', 'globalModel', 'getFormType'],
  data() {
    return {
      activeTabName: ''
    }
  },
  computed: {},
  created() {
    this.initRefList()
  },
  mounted() {
    console.log(this.widget, 'tab-item')
  },
  beforeUnmount() {
    this.unregisterFromRefList()
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
