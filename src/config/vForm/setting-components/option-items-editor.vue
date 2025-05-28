<template>
  <div class="option-items-pane">
    <el-button link type="primary" @click="importCascaderOptions"
      >编写</el-button
    >
    <div
      v-if="showImportCascaderDialogFlag"
      class=""
      v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']"
    >
      <el-dialog
        :title="i18nt('designer.setting.importOptions')"
        v-model="showImportCascaderDialogFlag"
        :show-close="true"
        class="drag-dialog small-padding-dialog"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
      >
        <code-editor
          v-model="cascaderOptions"
          mode="json"
          :readonly="false"
        ></code-editor>
        <template #footer>
          <div class="dialog-footer">
            <el-button
              size="large"
              type="primary"
              @click="saveCascaderOptions"
              >{{ i18nt("designer.hint.confirm") }}</el-button
            >
            <el-button
              size="large"
              @click="showImportCascaderDialogFlag = false"
              >{{ i18nt("designer.hint.cancel") }}</el-button
            >
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import CodeEditor from "@/core/components/CodeEditor/index.vue";
import i18n from "@/core/i18nLang";

export default {
  name: "option-items-editor",
  mixins: [i18n],
  components: {
    CodeEditor,
  },
  props: {
    designer: Object,
    selectedWidget: Object,
    name: String,
  },
  data() {
    return {
      showImportDialogFlag: false,
      optionLines: "",

      cascaderOptions: "",
      showImportCascaderDialogFlag: false,

      //separator: '||',
      separator: ",",
    };
  },
  computed: {
    optionModel() {
      return this.selectedWidget.options;
    },
  },
  watch: {
    "selectedWidget.options": {
      deep: true,
      handler(val) {
        //console.log('888888', 'Options change!')
      },
    },
  },
  methods: {
    importCascaderOptions() {
      this.cascaderOptions = JSON.stringify(
        this.optionModel[this.$props.name],
        null,
        "  "
      );
      this.showImportCascaderDialogFlag = true;
    },

    saveCascaderOptions() {
      try {
        let newOptions = JSON.parse(this.cascaderOptions);
        this.optionModel[this.$props.name] = newOptions;
        //TODO: 是否需要重置选项默认值？？

        this.showImportCascaderDialogFlag = false;
      } catch (ex) {
        this.$message.error(
          this.i18nt("designer.hint.invalidOptionsData") + ex.message
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.option-items-pane {
  width: 100%;

  ul {
    padding-inline-start: 6px;
    padding-left: 6px; /* 重置IE11默认样式 */
  }
}

li.ghost {
  background: #fff;
  border: 2px dotted $mainColor;
}

.drag-option {
  cursor: move;
}

.small-padding-dialog :deep(.el-dialog__body) {
  padding: 10px 15px;
}

.dialog-footer .el-button {
  width: 100px;
}

.full-width-input {
  width: 100% !important;

  :deep(.el-cascader) {
    width: 100% !important;
  }
}
</style>
