<template>
  <div>
    <vxe-form ref="tabSettingFormRef" :data="optionModel">


      <vxe-form-item title="搜索框显示" span="24">
        <vxe-switch v-model="optionModel.isFilter"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="搜索框提示" span="24">
        <vxe-input v-model="optionModel.filterTip"></vxe-input>
      </vxe-form-item>
      <vxe-form-item title="搜索框宽度" span="24">
        <vxe-number-input v-model="optionModel.filterWidth"></vxe-number-input>
      </vxe-form-item>






      <vxe-form-item title="归属" span="24">
        <vxe-input v-model="optionModel.belongTo" placeholder="绑定表格唯一属性"></vxe-input>
      </vxe-form-item>


      <vxe-form-item title="尺寸" span="24">
        <vxe-radio-group v-model="optionModel.comsize" size="mini">
          <vxe-radio-button label="" content="默认"></vxe-radio-button>
          <vxe-radio-button label="medium" content="中等"></vxe-radio-button>
          <vxe-radio-button label="small" content="小型"></vxe-radio-button>
          <vxe-radio-button label="mini" content="超小"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>

      <!-- <vxe-form-item title="数据结构" span="24">
        <vxe-radio-group v-model="optionModel.transform" size="mini">
          <vxe-radio-button label="staircase" content="层级" ></vxe-radio-button>
          <vxe-radio-button label="level" content="平级" ></vxe-radio-button>
        </vxe-radio-group>
        <vxe-button style="margin-left: 10px;" status="info" content="了解" @click="showPopup = true" size="mini"
          icon="vxe-icon-question-circle"></vxe-button>
      </vxe-form-item> -->

      <vxe-form-item title="展开数据" span="24">
        <vxe-switch v-model="optionModel.expandtype"></vxe-switch>
      </vxe-form-item>
      
      <vxe-form-item title="整体高度" span="24">
        <vxe-number-input v-model="optionModel.height" placeholder="自适应"></vxe-number-input>
      </vxe-form-item>
      <vxe-form-item title="节点缩进" span="24">
        <vxe-number-input v-model="optionModel.indent"></vxe-number-input>
      </vxe-form-item>

      <vxe-form-item title="节点展开方式" span="24">
        <vxe-radio-group v-model="optionModel.trigger" size="mini" :strict="false">
          <vxe-radio-button label="default" content="按钮"></vxe-radio-button>
          <vxe-radio-button label="node" content="任意"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>
      <vxe-form-item title="悬停高亮" span="24">
        <vxe-switch v-model="optionModel.nodeConfigIsHover"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="点击高亮" span="24">
        <vxe-switch v-model="optionModel.nodeConfigIsCurrent"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="可点击节点" span="24">
        <vxe-radio-group v-model="optionModel.nodeConfigTrigger" size="mini">
          <vxe-radio-button label="default" content="默认"></vxe-radio-button>
          <vxe-radio-button label="parent" content="父节点"></vxe-radio-button>
          <vxe-radio-button label="child" content="子节点"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>

      <vxe-form-item title="节点标题字段" span="24">
        <vxe-input v-model="optionModel.titleField"></vxe-input>
      </vxe-form-item>
      <vxe-form-item title="节点主键字段" span="24">
        <vxe-input v-model="optionModel.keyField"></vxe-input>
      </vxe-form-item>
      <vxe-form-item title="子节点字段" span="24">
        <vxe-input v-model="optionModel.childrenField"></vxe-input>
      </vxe-form-item>
      


      <vxe-form-item title="显示图标" span="24">
        <vxe-switch v-model="optionModel.showIcon"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="展开后图标" span="24">
        <vxe-icon-picker v-model="optionModel.iconOpen" :icons="iconList" clearable placeholder="展开后"></vxe-icon-picker>
      </vxe-form-item>
      <vxe-form-item title="收起后图标" span="24">
        <vxe-icon-picker v-model="optionModel.iconClose" :icons="iconList" clearable
          placeholder="收起后"></vxe-icon-picker>
      </vxe-form-item>

      <vxe-form-item title="手风琴模式" span="24">
        <vxe-switch v-model="optionModel.accordion"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="连接线模式" span="24">
        <vxe-switch v-model="optionModel.showLine"></vxe-switch>
      </vxe-form-item>

      <vxe-form-item title="选择模式" span="24">
        <vxe-radio-group v-model="optionModel.showRadioCheckbox" size="mini">
          <vxe-radio-button label="" content="默认"></vxe-radio-button>
          <vxe-radio-button label="radio" content="单选框"></vxe-radio-button>
          <vxe-radio-button label="checkbox" content="复选框"></vxe-radio-button>
        </vxe-radio-group>
      </vxe-form-item>

      <vxe-form-item title="选择模式-严选状态" span="24">
        <vxe-switch v-model="optionModel.strict"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item title="选择模式-是否高亮" span="24">
        <vxe-switch v-model="optionModel.highlight"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item v-if="optionModel.showRadioCheckbox === 'checkbox'" title="复选框-节点关联" span="24">
        <vxe-switch v-model="optionModel.strictly"></vxe-switch>
      </vxe-form-item>

      <!-- <vxe-form-item title="是否初始选中数据" span="24">
        <vxe-switch v-model="optionModel.isCheckNodeKeys"></vxe-switch>
      </vxe-form-item>
      <vxe-form-item v-if="optionModel.isCheckNodeKeys" title="选中数据" span="24">
        <vxe-input v-model="optionModel.checkNodeKeysSync" placeholder="格式：[1, 2, 5]"></vxe-input>
      </vxe-form-item> -->

    </vxe-form>
    <!-- <vxe-modal v-model="showPopup" :width="600" :height="400">
      <div style="float: left; width: 34%; padding: 2%; border-right: 2px solid black;background: #909399;">
        <h3 style="text-align: center;">层级结构</h3>
        <pre>
{
  "id": 1,
  "label": "根节点",
  "children": [
    {
      "id": 2,
      "label": "子节点1",
      "children": [
        {
          "id": 3,
          "label": "孙子节点1"
        }
      ]
    },
    {
      "id": 4,
      "label": "子节点2"
    }
  ]
}
</pre>
      </div>

      <div style="float: right; width: 56%; padding: 2%;">
        <h3 style="text-align: center;">平级结构</h3>
        <pre>
[
  {"id": 1, "label": "根节点", "parentId": null},
  {"id": 2, "label": "子节点1", "parentId": 1},
  {"id": 3, "label": "孙子节点1", "parentId": 2},
  {"id": 4, "label": "子节点2", "parentId": 1}
]
</pre>
      </div>

    </vxe-modal> -->
  </div>
</template>

<script>
import i18n from '@/core/i18nLang'
import { deepClone } from "@/core/utils/tool";
import Divider from '@/core/components/VForm/form-designer/rebuild-com/Divider.vue'

export default {
  name: "tree-customClass-editor",
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
      showPopup: false,
      iconList: [
        'arrow-right',
        'arrow-down',
        'arrows-right',
        'arrows-down',
        'caret-right',
        'caret-down',
        'check',
        'click-button',
        'checkbox-unchecked',
        'checkbox-checked',
        'checkbox-checked-fill',
        'checkbox-indeterminate-fill',
        'square',
        'square-caret-right',
        'square-caret-right-fill',
        'square-checked',
        'square-minus',
        'square-plus',
        'square-minus-fill',
        'square-plus-fill',
      ],
      inData: null,
    }
  },
  created() {
    this.cssClassList = deepClone(this.designer.getCssClassList())
    //监听表单css代码改动事件并重新加载！
    this.designer.handleEvent('form-css-updated', (cssClassList) => {
      this.cssClassList = cssClassList
    })

    this.inData = this.optionModel.data
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
