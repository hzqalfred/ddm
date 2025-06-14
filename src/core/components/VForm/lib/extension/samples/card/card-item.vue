<template>
  <container-item-wrapper :widget="widget">
    <vxe-card
      :key="widget.id"
      class="card-container"
      :class="[!!widget.options.folded ? 'folded' : '', customClass]"
      :shadow="widget.options.shadow"
      :style="{ width: widget.options.cardWidth + '!important' || '' }"
      :ref="widget.id"
      v-show="!widget.options.hidden"
      :body-style="
        widget.widgetList[0] && widget.widgetList[0].type == 'subgrid'
          ? {
              'padding-top': 0
            }
          : {}
      "
    >
      <template #header>
        <div class="clear-fix" @click="toggleCard">
          <span>{{ widget.options.label }}</span>

          <i v-if="widget.options.showFold && formType !== 'print'" class="float-right">
            <template v-if="!widget.options.folded">
              <vxe-icon name="arrow-down"></vxe-icon>
            </template>
            <template v-else>
              <vxe-icon name="arrow-up"></vxe-icon>
            </template>
          </i>
        </div>
      </template>
      <template v-if="!!widget.widgetList && widget.widgetList.length > 0">
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

              <template #[subWidget.id]>
                <slot :name="subWidget.id"></slot>
              </template>
            </component>
          </template>

          <template v-else>
            <component
              :is="subWidget.type + '-widget'"
              :field="subWidget"
              :designer="null"
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
      </template>
    </vxe-card>
  </container-item-wrapper>
</template>

<script>
import emitter from '@/core/components/VForm/lib/emitter'
import i18n from '@/core/i18nLang'
import refMixin from '@/core/components/VForm/form-render/refMixin'
import ContainerItemWrapper from '@/core/components/VForm/form-render/container-item/container-item-wrapper.vue'
import containerItemMixin from '@/core/components/VForm/form-render/container-item/containerItemMixin'
import FieldComponents from '@/core/components/VForm/form-designer/form-widget/field-widget/index'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

export default {
  name: 'card-item',
  componentName: 'ContainerItem',
  mixins: [emitter, i18n, refMixin, containerItemMixin],
  components: {
    ContainerItemWrapper,
    ...FieldComponents,
    ArrowDown,
    ArrowUp
  },
  props: {
    widget: Object,
    formType: String
  },
  inject: ['refList', 'sfRefList', 'globalModel'],
  computed: {
    customClass() {
      return this.widget.options.customClass || ''
    }
  },
  created() {
    this.initRefList()

    if (this.formType == 'print') {
      this.widget.options.folded = false
    }
  },
  beforeUnmount() {
    this.unregisterFromRefList()
  },
  methods: {
    toggleCard() {
      if (this.formType == 'print') {
        return //打印模式不允许收缩
      }
      this.widget.options.folded = !this.widget.options.folded
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  :deep(.vxe-card__header) {
    padding: 0;
    .clear-fix {
      padding: 10px 12px;
      cursor: pointer;
    }
  }
}

.folded :deep(.vxe-card--body) {
  display: none;
}

.clear-fix:before,
.clear-fix:after {
  display: table;
  content: '';
}

.clear-fix:after {
  clear: both;
}
.clear-fix {
  width: 100%;
}

.float-right {
  float: right;
}
</style>
