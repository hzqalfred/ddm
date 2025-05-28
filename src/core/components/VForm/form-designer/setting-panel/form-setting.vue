<template>
  <div>
    <el-form
      :model="formConfig"
      size="small"
      label-position="left"
      label-width="120px"
      class="setting-form"
      @submit.prevent
    >
      <el-collapse v-model="formActiveCollapseNames" class="setting-collapse">
        <!-- 表单设置 基础属性 -->
        <el-collapse-item
          name="1"
          :title="i18nt('designer.setting.basicSetting')"
        >
          <el-form-item :label="i18nt('designer.setting.formSize')">
            <el-select v-model="formConfig.size">
              <el-option
                v-for="item in formSizes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="i18nt('designer.setting.labelPosition')">
            <el-radio-group
              v-model="formConfig.labelPosition"
              class="radio-group-custom"
            >
              <el-radio-button value="left">
                {{ i18nt("designer.setting.leftPosition") }}
              </el-radio-button>
              <el-radio-button value="top">
                {{ i18nt("designer.setting.topPosition") }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="i18nt('designer.setting.labelAlign')">
            <el-radio-group
              v-model="formConfig.labelAlign"
              class="radio-group-custom"
            >
              <el-radio-button value="label-left-align">
                {{ i18nt("designer.setting.leftAlign") }}
              </el-radio-button>
              <el-radio-button value="label-center-align">
                {{ i18nt("designer.setting.centerAlign") }}
              </el-radio-button>
              <el-radio-button value="label-right-align">
                {{ i18nt("designer.setting.rightAlign") }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="i18nt('designer.setting.labelWidth')">
            <el-input-number
              v-model="formConfig.labelWidth"
              :min="0"
              style="width: 100%"
            ></el-input-number>
          </el-form-item>
          <el-form-item :label="i18nt('designer.setting.formCss')">
            <el-button
              type="info"
              icon="el-icon-edit"
              plain
              round
              @click="editFormCss"
            >
              {{ i18nt("designer.setting.addCss") }}
            </el-button>
          </el-form-item>
          <!-- -->
          <el-form-item :label="i18nt('designer.setting.customClass')">
            <el-select
              v-model="formConfig.customClass"
              multiple
              filterable
              allow-create
              default-first-option
            >
              <el-option
                v-for="(item, idx) in cssClassList"
                :key="idx"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="i18nt('designer.setting.globalFunctions')">
            <el-button
              type="info"
              icon="el-icon-edit"
              plain
              round
              @click="editGlobalFunctionsObject('')"
            >
              {{ i18nt("designer.setting.addEventHandler") }}
            </el-button>
          </el-form-item>
        </el-collapse-item>
        <!-- 表单设置 事件属性 -->
        <el-collapse-item
          v-if="showEventCollapse()"
          name="2"
          :title="i18nt('designer.setting.eventSetting')"
        >
          <el-form-item label="DOMContentLoaded" label-width="150px">
            <el-select-v2
              v-model="eventMap['form.DOMContentLoaded']"
              style="width: 100%;vertical-align: middle"
              :options="globalFuncOpts"
              @change="(val) => setEventMap('form.DOMContentLoaded', val)"
              @dblclick="editGlobalFunctionsObject('form.DOMContentLoaded')"
              allow-create
              filterable
              clearable
            />
          </el-form-item>
          <el-form-item label="onLoad" label-width="150px">
            <el-select-v2
              v-model="eventMap['form.onLoad']"
              style="width: 100%;vertical-align: middle"
              :options="globalFuncOpts"
              @change="(val) => setEventMap('form.onLoad', val)"
              @dblclick="editGlobalFunctionsObject('form.onLoad')"
              allow-create
              filterable
              clearable
            />
          </el-form-item>
          <el-form-item label="onChange" label-width="150px">
            <el-select-v2
              v-model="eventMap['form.onChange']"
              style="width: 100%;vertical-align: middle"
              :options="globalFuncOpts"
              @change="(val) => setEventMap('form.onChange', val)"
              @dblclick="editGlobalFunctionsObject('form.onChange')"
              allow-create
              filterable
              clearable
            />
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>

    <div
      v-if="showEditFormCssDialogFlag"
      class=""
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
    >
      <el-dialog
        :title="i18nt('designer.setting.formCss')"
        v-model="showEditFormCssDialogFlag"
        :show-close="true"
        class="drag-dialog small-padding-dialog"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <code-editor
          :mode="'css'"
          :readonly="false"
          v-model="formCssCode"
        ></code-editor>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showEditFormCssDialogFlag = false">
              {{ i18nt("designer.hint.cancel") }}
            </el-button>
            <el-button type="primary" @click="saveFormCss">
              {{ i18nt("designer.hint.confirm") }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <el-dialog
      :title="i18nt('designer.setting.globalFunctions')"
      v-model="showGlobalFunctionObjectDialogFlag"
      :show-close="true"
      class="drag-dialog small-padding-dialog"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
    >
      <code-editor
        :mode="'javascript'"
        :readonly="false"
        :user-worker="false"
        v-model="globalFunctionObject"
        ref="gfoEditor"
      ></code-editor>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showGlobalFunctionObjectDialogFlag = false">
            {{ i18nt("designer.hint.cancel") }}
          </el-button>
          <el-button type="primary" @click="saveGlobalFunctionsObject">
            {{ i18nt("designer.hint.confirm") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import i18n from "@/core/i18nLang";
import CodeEditor from "@/core/components/CodeEditor/index.vue";
import { deepClone, objectToString } from "@/core/utils/tool";
import { insertCustomCssToHead } from "@/core/components/VForm/lib/utils";

export default {
  name: "form-setting",
  mixins: [i18n],
  components: {
    CodeEditor,
  },
  props: {
    designer: Object,
    formConfig: Object,
  },
  inject: ["getDesignerConfig"],
  computed: {
    globalFuncOpts() {
      return (
        Object.keys(this.formConfig?.globalObject || []).map((x) => ({
          value: x,
          label: x,
        })) || []
      );
    },
  },
  data() {
    return {
      designerConfig: this.getDesignerConfig(),

      formActiveCollapseNames: ["1", "2"],

      // formSizes: [
      //   { label: "default", value: "" },
      //   { label: "large", value: "large" },
      //   //{label: 'medium', value: 'medium'},
      //   { label: "small", value: "small" },
      //   //{label: 'mini', value: 'mini'},
      // ],

      formSizes: [ // 使用 vxe 的尺寸控制
        { label: "默认尺寸", value: "" },
        {label: '中等尺寸', value: 'medium'},
        {label: "小型尺寸", value: "small" },
        {label: '超小尺寸', value: 'mini'},
      ],

      showEditFormCssDialogFlag: false,
      formCssCode: "",
      cssClassList: [],

      functionsCode: "",

      showGlobalFunctionObjectDialogFlag: false,
      globalFunctionObject: "",

      eventMap: {},
      curEventName: "",
    };
  },
  created() {
    //导入表单JSON后需要重新加载自定义CSS类！！！
    this.eventMap = this.formConfig.eventMap || {};
    this.designer.handleEvent("form-json-imported", () => {
      this.formCssCode = this.formConfig.cssCode;
      insertCustomCssToHead(this.formCssCode);
      this.extractCssClass();
      this.designer.emitEvent("form-css-updated", deepClone(this.cssClassList));
    });
  },
  mounted() {
    /* SettingPanel和FormWidget为兄弟组件, 在FormWidget加载formConfig时，
         此处SettingPanel可能无法获取到formConfig.cssCode, 故加个延时函数！ */
    setTimeout(() => {
      this.formCssCode = this.formConfig.cssCode;
      insertCustomCssToHead(this.formCssCode);
      this.extractCssClass();
      this.designer.emitEvent("form-css-updated", deepClone(this.cssClassList));
    }, 1200);
  },
  methods: {
    showEventCollapse() {
      if (this.designerConfig["eventCollapse"] === undefined) {
        return true;
      }

      return !!this.designerConfig["eventCollapse"];
    },

    editFormCss() {
      this.formCssCode = this.designer.formConfig.cssCode;
      this.showEditFormCssDialogFlag = true;
    },

    extractCssClass() {
      let regExp = /\..*{/g;
      let result = this.formCssCode.match(regExp);
      let cssNameArray = [];

      if (!!result && result.length > 0) {
        result.forEach((rItem) => {
          let classArray = rItem.split(","); //切分逗号分割的多个class
          if (classArray.length > 0) {
            classArray.forEach((cItem) => {
              let caItem = cItem.trim();
              if (caItem.indexOf(".", 1) !== -1) {
                //查找第二个.位置
                let newClass = caItem.substring(
                  caItem.indexOf(".") + 1,
                  caItem.indexOf(".", 1)
                ); //仅截取第一、二个.号之间的class
                if (newClass) {
                  cssNameArray.push(newClass.trim());
                }
              } else if (caItem.indexOf(" ") !== -1) {
                //查找第一个空格位置
                let newClass = caItem.substring(
                  caItem.indexOf(".") + 1,
                  caItem.indexOf(" ")
                ); //仅截取第一、二个.号之间的class
                if (newClass) {
                  cssNameArray.push(newClass.trim());
                }
              } else {
                if (caItem.indexOf("{") !== -1) {
                  //查找第一个{位置
                  let newClass = caItem.substring(
                    caItem.indexOf(".") + 1,
                    caItem.indexOf("{")
                  );
                  cssNameArray.push(newClass.trim());
                } else {
                  let newClass = caItem.substring(caItem.indexOf(".") + 1);
                  cssNameArray.push(newClass.trim());
                }
              }
            });
          }
        });
      }

      //this.cssClassList.length = 0
      this.cssClassList.splice(0, this.cssClassList.length); //清除数组必须用splice，length=0不会响应式更新！！
      this.cssClassList = Array.from(new Set(cssNameArray)); //数组去重
    },

    saveFormCss() {
      this.extractCssClass();
      this.designer.formConfig.cssCode = this.formCssCode;
      insertCustomCssToHead(this.formCssCode);
      this.showEditFormCssDialogFlag = false;
      this.designer.emitEvent("form-css-updated", deepClone(this.cssClassList));
    },

    setEventMap(name, val) {
      this.eventMap[name] = val;
      this.designer.formConfig.eventMap = Object.assign(
        {},
        this.designer.formConfig.eventMap,
        this.eventMap
      );
    },

    editGlobalFunctionsObject(name) {
      this.curEventName = name;
      console.log("editGlobalFunctionsObject");

      // 直接从当前的 globalObject 生成编辑器需要的字符串
      const currentObject = this.designer?.formConfig?.globalObject || {};
      this.globalFunctionObject = objectToString(currentObject);

      // 如果需要添加新函数
      if (name && !currentObject[name]) {
        let obj = { ...currentObject };
        obj[name] = function() {};
        this.globalFunctionObject = objectToString(obj);
      }

      this.showGlobalFunctionObjectDialogFlag = true;
      if (name) {
        setTimeout(() => {
          // 获取编辑器的当前内容
          const content = this.$refs.gfoEditor.aceEditor.getValue();

          // 查找文本的位置
          const index = content.indexOf(name);

          if (index === -1) {
            console.log("未找到目标文本");
            return false;
          }
          // 首先获取从开始到匹配位置的所有内容
          const textBeforeMatch = content.substring(0, index);

          // 按行分割并计算行号
          const lines = textBeforeMatch.split("\n");
          const row = lines.length - 1;

          // 获取列号 (最后一行文本的长度)
          const column = lines[lines.length - 1].length;

          // 计算新的光标位置 (文本右边 + 偏移量)
          const newColumn = column + name.length + 14;

          // 移动光标
          this.$refs.gfoEditor.aceEditor.moveCursorTo(row, newColumn);
          this.$refs.gfoEditor.aceEditor.scrollToLine(row, true, true);
        }, 1);
      }
    },

    saveGlobalFunctionsObject() {
      console.log("saveGlobalFunctionsObject", this.$refs.gfoEditor);
      try {
        // 直接将编辑器中的字符串转换为对象并保存到 globalObject
        this.designer.formConfig.globalObject = eval(
          "(" + this.globalFunctionObject + ")"
        );
        let mergeEventMap = Object.assign({},this.designer.formConfig.eventMap,this.eventMap) 
        this.eventMap =  this.designer.formConfig.eventMap = mergeEventMap
        if(!this.eventMap[this.curEventName]&&this.designer.formConfig.globalObject[this.curEventName]) this.eventMap[this.curEventName] = this.curEventName
        this.showGlobalFunctionObjectDialogFlag = false;
        this.curEventName = "";
      } catch (e) {
        this.$message.error("编辑格式有误,检查编辑器是否为对象");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.setting-form {
  :deep(.el-form-item__label) {
    font-size: 13px;
    //text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  :deep(.el-form-item--small.el-form-item) {
    margin-bottom: 10px;
  }

  .radio-group-custom {
    :deep(.el-radio-button__inner) {
      padding-left: 12px;
      padding-right: 12px;
    }
  }

  .custom-divider.el-divider--horizontal {
    margin: 10px 0;
  }
}

.setting-collapse {
  :deep(.el-collapse-item__content) {
    padding-bottom: 6px;
  }

  :deep(.el-collapse-item__header) {
    font-style: italic;
    font-weight: bold;
  }
}

.small-padding-dialog {
  :deep(.el-dialog__body) {
    padding: 6px 15px 12px 15px;
  }
}
</style>
