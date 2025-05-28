<template>
  <div>
    <vxe-form ref="tabSettingFormRef" :data="optionModel">
      <vxe-form-item title="标题" span="24">
        <vxe-input v-model="optionModel.label" placeholder="主标题"></vxe-input>
      </vxe-form-item>
      <vxe-form-item title="风格" span="24">
        <vxe-radio-group v-model="optionModel.radioType" size="mini" :strict="false">
          <vxe-radio-button label="radio" content="文字"></vxe-radio-button>
          <vxe-radio-button label="radio-button" content="按钮"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>
      <vxe-form-item title="尺寸" span="24">
        <vxe-radio-group v-model="optionModel.comsize" size="mini">
          <vxe-radio-button label="" content="默认"></vxe-radio-button>
          <vxe-radio-button label="medium" content="中等"></vxe-radio-button>
          <vxe-radio-button label="small" content="小型"></vxe-radio-button>
          <vxe-radio-button label="mini" content="超小"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>
      <vxe-form-item title="分布" span="24">
        <vxe-radio-group v-model="optionModel.direction" size="mini" :strict="false">
          <vxe-radio-button label="column" content="纵向排列"></vxe-radio-button>
          <vxe-radio-button label="row" content="横向排列"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>
      <vxe-form-item title="选项间距" span="24">
        <vxe-number-input v-model="optionModel.gap" min="0" max="100"></vxe-number-input>
      </vxe-form-item>
      <vxe-form-item title="严格模式" span="24">
        <vxe-switch v-model="optionModel.strict" style="width: 26%;"></vxe-switch>
        <vxe-button mode="text" :prefix-tooltip="{ content: '开启严格模式，必须选择其一！' }" style="width: 5%;margin-left: 5px;"></vxe-button>
      </vxe-form-item>
      <vxe-form-item title="默认选择" span="24">
        <vxe-select v-model="optionModel.vmodel">
          <vxe-option v-for="radios in selectedWidget.radios" :key="radios.options.name" :value="radios.options.label" :label="radios.options.title"></vxe-option>
        </vxe-select>
      </vxe-form-item>
      
      <vxe-form-item span="24">
        <Divider title="选项设置" styleType="4" />
      </vxe-form-item>
      <vxe-form-item class="panes-setting" span="24">
        <draggable tag="ul" :list="selectedWidget.radios" item-key="id"
          v-bind="{ group: 'panesGroup', ghostClass: 'ghost', handle: '.drag-option' }"
          style="width: 110%; margin: -20px 0 0 -45px;">
          <template #item="{ element: tpItem, index: tpIdx }">
            <li class="col-item" style="padding: 4px;">
              <vxe-input link type="primary" v-model="tpItem.options.label" placeholder="实际值"
                style="width: 30px"></vxe-input>
                <vxe-input link type="primary" v-model="tpItem.options.title" placeholder="显示值"
                style="width: 100px"></vxe-input>
                <vxe-switch v-model="tpItem.options.disabled" placeholder="禁用" :open-value="false" :close-value="true"
                @change="(evt) => disabledPane(selectedWidget, tpIdx, evt)" size="mini" open-icon="vxe-icon-unlock-fill"
                close-icon="vxe-icon-lock-fill" style="left: 5px;"></vxe-switch>
              <vxe-switch v-model="tpItem.options.hidden" placeholder="显隐" :open-value="false" :close-value="true"
                @change="(evt) => hiddenPane(selectedWidget, tpIdx, evt)" size="mini" open-icon="vxe-icon-eye-fill"
                close-icon="vxe-icon-eye-fill-close" style="left: 5px;"></vxe-switch>
              <vxe-button size="mini" status="error" icon="vxe-icon-delete" placeholder="删除" circle
                @click="deletePane(selectedWidget, tpIdx)" style="left: 5px;"></vxe-button>
            </li>
          </template>
        </draggable>
        <vxe-button mode="text" status="primary" icon="vxe-icon-add"
          @click="addPane(selectedWidget)">添加选择</vxe-button>
      </vxe-form-item>
    </vxe-form>
  </div>
</template>

<script>
import i18n from '@/core/i18nLang'
import { deepClone } from "@/core/utils/tool";
import Divider from '@/core/components/VForm/form-designer/rebuild-com/Divider.vue'

export default {
  name: "radio-group-customClass-editor",
  componentName: 'PropertyEditor',
  mixins: [i18n],
  components: {
    Divider
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  data() {
    return {
      cssClassList: [],
    }
  },
  created() {
    this.cssClassList = deepClone(this.designer.getCssClassList())
    //监听表单css代码改动事件并重新加载！
    this.designer.handleEvent('form-css-updated', (cssClassList) => {
      this.cssClassList = cssClassList
    })
  },
  methods: {
    addPane(curTabs) {
      this.designer.addRadiosPaneOfTabs(curTabs)
      this.designer.emitHistoryChange()
    },
    disabledPane(curTabs, tpIdx, evt) {
      this.designer.disabledRadiosPaneOfTabs(curTabs, tpIdx, evt)
      this.designer.emitHistoryChange()
    },

    hiddenPane(curTabs, tpIdx, evt) {
      this.designer.hiddenRadiosPaneOfTabs(curTabs, tpIdx, evt)
      this.designer.emitHistoryChange()
    },

    deletePane(curTabs, tpIdx) {
      if (curTabs.radios.length === 1) {
        this.$message.info(this.i18nt('designer.hint.lastPaneCannotBeDeleted'))
        return
      }
      this.designer.deleteRadiosPaneOfTabs(curTabs, tpIdx)
      this.designer.emitHistoryChange()
    },

  }
}
</script>

<style lang="scss" scoped>
li.col-item {
  list-style: none;

  span.col-span-title {
    display: inline-block;
    font-size: 13px;
    width: 120px;
  }

  .col-delete-button {
    margin-left: 6px;
  }
}

.panes-setting {
  ul {
    padding-inline-start: 0;
    padding-left: 0;
    /* 重置IE11默认样式 */
    margin: 0;
  }

  .drag-option {
    cursor: move;
  }

  li.ghost {
    background: #fff;
    border: 2px dotted $mainColor;
  }
}
</style>
