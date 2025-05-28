<template>
  <container-item-wrapper :widget="widget">
    <div :key="widget.id" class="tab-container" v-show="!widget.options.hidden">
      {{ activeTabName }}
      {{ visibleTabs }}
      <el-steps :active="activeTabName" finish-status="success">
        <el-step title="Step 1" />
        <el-step title="Step 2" />
        <el-step title="Step 3" />
      </el-steps>
      <el-tabs v-model="activeTabName" :ref="widget.id" :class="[customClass]">
        <el-tab-pane v-for="(tab, index) in visibleTabs" :key="index" :label="tab.options.label" :disabled="tab.options.disabled" :name="tab.options.name">
          <template v-for="(subWidget, swIdx) in tab.widgetList">
            <template v-if="'container' === subWidget.category">
              <component
                :is="getComponentByContainer(subWidget)"
                :widget="subWidget"
                :key="swIdx"
                :parent-list="tab.widgetList"
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
                :parent-list="tab.widgetList"
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
        </el-tab-pane>
      </el-tabs>
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
  name: 'smartwizard-item',
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
  computed: {
    visibleTabs() {
      return this.widget.tabs.filter(tp => {
        return !tp.options.hidden
      })
    }
  },
  created() {
    this.initRefList()
  },
  mounted() {
    this.initActiveTab()
  },
  beforeUnmount() {
    this.unregisterFromRefList()
  },
  methods: {
    initActiveTab() {
      if (this.widget.type === 'tab' && this.widget.tabs.length > 0) {
        let activePanes = this.widget.tabs.filter(tp => {
          return tp.options.active === true
        })
        if (activePanes.length > 0) {
          this.activeTabName = activePanes[0].options.name
        } else {
          this.activeTabName = this.widget.tabs[0].options.name
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
