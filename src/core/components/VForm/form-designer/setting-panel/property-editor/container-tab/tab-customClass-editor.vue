<!--
  因tabs属性并不包含于options属性之中，故只能跟其他options属性之内的属性值合并设置，此处选择与customClass合并！！
-->

<template>
  <div>
    <!-- 

      yao:
        1.统一 VXE UI 
        2.不过度接入外部纯写 
        3.国际化等所有组件完成处理
     -->
    <!-- <el-form-item :label="i18nt('designer.setting.customClass')">
      <el-select v-model="optionModel.customClass" multiple filterable allow-create default-first-option>
        <el-option v-for="(item, idx) in cssClassList" :key="idx" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item> -->
    <vxe-form ref="tabSettingFormRef" :data="optionModel">
      <vxe-form-item title="标签风格" span="24">
        <vxe-radio-group v-model="optionModel.tabType" size="mini" :strict="false">
          <vxe-radio-button label="" content="默认"></vxe-radio-button>
          <vxe-radio-button label="card" content="卡片"></vxe-radio-button>
          <vxe-radio-button label="border-card" content="边框背景卡片"></vxe-radio-button>
          <vxe-radio-button label="round-card" content="圆角边框背景卡片"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>
      <vxe-form-item title="是否带间距" span="24">
        <vxe-switch v-model="optionModel.tabPadding"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="内容区域高度" span="24">
        <vxe-number-input v-model="optionModel.tabHeight" :step="50" type="integer"
          style="width: 80%;"></vxe-number-input>
        <vxe-button mode="text" :prefix-tooltip="{ content: '当为0时，自适应高度' }"
          style="width: 5%;margin-left: 5px;"></vxe-button>
      </vxe-form-item>

      
      <!-- <vxe-form-item title="默认展开" span="24">
        <vxe-input v-model="optionModel.selectTab"></vxe-input>
      </vxe-form-item> -->

      <vxe-form-item span="24">
        <Divider title="标签页属性设置" styleType="4" />
      </vxe-form-item>
      <vxe-form-item class="panes-setting" span="24">
        <draggable tag="ul" :list="selectedWidget.tabs" item-key="id"
          v-bind="{ group: 'panesGroup', ghostClass: 'ghost', handle: '.drag-option' }"
          style="width: 110%; margin: -20px 0 0 -45px;">
          <template #item="{ element: tpItem, index: tpIdx }">
            <li class="col-item" style="padding: 10px;">
              <vxe-icon-picker v-model="tpItem.options.icon" placeholder="标签图标" clearable
                style="width: 100px"></vxe-icon-picker>
              <vxe-input link type="primary" v-model="tpItem.options.title" placeholder="标签名称"
                style="width: 100px"></vxe-input>
              <vxe-switch v-model="tpItem.options.hidden" placeholder="标签显隐" :open-value="false" :close-value="true"
                @change="(evt) => hiddenTabPane(selectedWidget, tpIdx, evt)" size="mini" open-icon="vxe-icon-eye-fill"
                close-icon="vxe-icon-eye-fill-close" style="left: 5px;"></vxe-switch>
              <vxe-number-input v-model="tpItem.options.titleWidth" placeholder="标签宽度" :step="10" type="integer"
                style="width: 100px;"></vxe-number-input>
              <vxe-select v-model="tpItem.options.titleAlign" placeholder="对齐方式" style="width: 100px">
                <vxe-option value="center" label="居中"></vxe-option>
                <vxe-option value="left" label="靠左"></vxe-option>
                <vxe-option value="right" label="靠右"></vxe-option>
              </vxe-select>
              <vxe-button size="mini" status="error" icon="vxe-icon-delete" placeholder="标签删除" circle
                @click="deleteTabPane(selectedWidget, tpIdx)" style="left: 5px;"></vxe-button>
            </li>
          </template>
        </draggable>
        <vxe-button mode="text" status="primary" icon="vxe-icon-add"
          @click="addTabPane(selectedWidget)">{{ i18nt('designer.setting.addTabPane') }}</vxe-button>
      </vxe-form-item>
    </vxe-form>
  </div>
</template>

<script>
import i18n from '@/core/i18nLang'
//import Draggable from 'vuedraggable'
import { deepClone } from "@/core/utils/tool";
import Divider from '@/core/components/VForm/form-designer/rebuild-com/Divider.vue'

export default {
  name: "tab-customClass-editor",
  componentName: 'PropertyEditor',
  mixins: [i18n],
  components: {
    //Draggable,
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
    addTabPane(curTabs) {
      this.designer.addTabPaneOfTabs(curTabs)
      this.designer.emitHistoryChange()
    },
    hiddenTabPane(curTabs, tpIdx, evt) {
      this.designer.hiddenTabPaneOfTabs(curTabs, tpIdx, evt)
      this.designer.emitHistoryChange()
    },

    deleteTabPane(curTabs, tpIdx) {
      if (curTabs.tabs.length === 1) {
        this.$message.info(this.i18nt('designer.hint.lastPaneCannotBeDeleted'))
        return
      }

      this.designer.deleteTabPaneOfTabs(curTabs, tpIdx)
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
