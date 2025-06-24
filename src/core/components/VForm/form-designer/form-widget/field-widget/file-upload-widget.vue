<template>
  <form-item-wrapper
    :designer="designer"
    :field="field"
    :rules="rules"
    :design-state="designState"
    :parent-widget="parentWidget"
    :parent-list="parentList"
    :index-of-parent-list="indexOfParentList"
    :sub-form-row-index="subFormRowIndex"
    :sub-form-col-index="subFormColIndex"
    :sub-form-row-id="subFormRowId"
  >
    <vxe-upload
      ref="fieldEditor"
      :disabled="field.options.disabled"
      :style="styleVariables"
      class="dynamicPseudoAfter"
      :multiple="field.options.multipleSelect"
      v-model="fileList"
      :show-list="field.options.showFileList"
      :class="{ hideUploadDiv: uploadBtnHidden }"
      @upload-success="handleFileUpload"
      @upload-error="handleUploadError"
      :upload-method="uploadFile"
      @remove="removeUploadFile"
      :limit-count="field.options.limit"
      :limit-size="field.options.fileMaxSize"
      :file-types="field.options.fileTypes"
    >
      <template #default>
        <vxe-button>附件</vxe-button>
      </template>
    </vxe-upload>
  </form-item-wrapper>
</template>

<script>
import FormItemWrapper from "@/core/components/VForm/form-designer/form-widget/field-widget/form-item-wrapper.vue";
import emitter from "@/core/components/VForm/lib/emitter";
import i18n, { translate } from "@/core/i18nLang";
import { deepClone } from "@/core/utils/tool";
import fieldMixin from "@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin";
import request from "@/core/Request";
let selectFileText = "'" + translate("render.hint.selectFile") + "'";

const requestConfig = {
  baseURL: import.meta.env.VITE_NAME === "dev" ? "/api" : "/api", //基准路径
  timeout: 1000 * 60, //超时时间
};

export default {
  name: "file-upload-widget",
  componentName: "FieldWidget", //必须固定为FieldWidget，用于接收父级组件的broadcast事件
  mixins: [emitter, fieldMixin, i18n],
  inject: ["getFunId", "getKeyId"],
  props: {
    field: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,

    designState: {
      type: Boolean,
      default: false,
    },

    subFormRowIndex: {
      /* 子表单组件行索引，从0开始计数 */
      type: Number,
      default: -1,
    },
    subFormColIndex: {
      /* 子表单组件列索引，从0开始计数 */
      type: Number,
      default: -1,
    },
    subFormRowId: {
      /* 子表单组件行Id，唯一id且不可变 */
      type: String,
      default: "",
    },
  },
  components: {
    FormItemWrapper,
  },
  data() {
    return {
      oldFieldValue: null, //field组件change之前的值
      fieldModel: [],
      rules: [],

      uploadHeaders: {},
      uploadData: {
        key: "", //七牛云上传文件名
        //token: '',  //七牛云上传token

        //policy: '',  //又拍云上传policy
        //authorization: '',  //又拍云上传签名
      },
      fileList: [], //上传文件列表
      uploadBtnHidden: false,
      requestConfig,
      styleVariables: {
        "--select-file-action": selectFileText,
      },
    };
  },
  computed: {},
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
    this.initFieldModel();
    this.registerToRefList();
    this.initEventHandler();
    this.buildFieldRules();
    this.handleOnCreated();
  },

  mounted() {
    this.handleOnMounted();
  },
  beforeUnmount() {
    this.unregisterFromRefList();
  },

  methods: {
    updateFieldModelAndEmitDataChangeForUpload(
      fileList,
      customResult,
      defaultResult
    ) {
      let oldValue = deepClone(this.fieldModel);
      if (!!customResult && !!customResult.name && !!customResult.url) {
        this.fieldModel.push({
          name: customResult.name,
          url: customResult.url,
        });
      } else if (defaultResult && defaultResult.success) {
        fileList[fileList.length - 1].id = defaultResult.data[0].file_id;
        fileList[fileList.length - 1].url =
          requestConfig.baseURL +
          "/file/preview/image/" +
          defaultResult.data[0].file_id +
          "?thumbnail=1&scale=0.2&outputQuality=0.2";
        fileList[fileList.length - 1].originalUrl =
          requestConfig.baseURL +
          "/file/preview/image/" +
          defaultResult.data[0].file_id +
          "?thumbnail=0";
        fileList[fileList.length - 1].fileUrl =
          requestConfig.baseURL +
          "/file/download?file_id=" +
          defaultResult.data[0].file_id;
        fileList[fileList.length - 1].name =
          defaultResult.data[0].file_name +
          "." +
          defaultResult.data[0].file_type;
        this.fieldModel = deepClone(fileList);
      } else {
        this.fieldModel = deepClone(fileList);
      }
      this.syncUpdateFormModel(this.fieldModel);
      this.emitFieldDataChange(this.fieldModel, oldValue);
    },

    uploadFile(param) {
      var fileObj = param.file;
      var form = new FormData();
      // 文件对象
      form.append("file", fileObj);
      form.append("funId", this.getFunId());
      form.append("keyId", this.getKeyId());
      request
        .post(this.field.options.uploadURL || "/file/upload", form)
        .then((res) => {
          if (res.success) {
            Promise.resolve(res);
          } else {
            Promise.reject(res);
          }
        })
        .catch(({ err }) => {
          Promise.onError(err);
        });
    },

    handleFileUpload(res, file, fileList) {
      if (file.status === "success") {
        let customResult = null;
        // if (this.field.options.onUploadSuccess) {
        //   let mountFunc = new Function(
        //     "result",
        //     "file",
        //     "fileList",
        //     this.field.options.onUploadSuccess
        //   );
        //   customResult = mountFunc.call(this, res, file, fileList);
        // }
        try {
          let event =
            (this.formConfig.eventMap &&
              this.formConfig.eventMap[`${this.field.id}.onUploadSuccess`]) ||
            "";
          let obj = this.formConfig?.globalObject;
          if (obj && event && obj[event]) {
            let customFn = obj[event];
            customFn.call(this, res, file, fileList);
          }
        } catch (error) {
          this.Message.notifyError("请检查全局函数的调用");
          console.error("请检查全局函数的调用:",error);
        }
        this.updateFieldModelAndEmitDataChangeForUpload(
          fileList,
          customResult,
          res
        );
        if (!!customResult && !!customResult.name) {
          file.name = customResult.name;
        } else {
          file.name = file.name || res.name || res.fileName || res.filename;
        }
        if (!!customResult && !!customResult.url) {
          file.url = customResult.url;
        } else {
          file.url = file.url || res.url;
        }
        this.fileList = deepClone(fileList);
        // this.uploadBtnHidden = fileList.length >= this.field.options.limit
      }
    },

    updateFieldModelAndEmitDataChangeForRemove(deletedFileIdx, fileList) {
      let oldValue = deepClone(this.fieldModel);
      let deleteFile = this.fieldModel.splice(deletedFileIdx, 1);
      this.syncUpdateFormModel(this.fieldModel);
      this.emitFieldDataChange(this.fieldModel, oldValue);
      if (deleteFile[0].id) {
        // 记录删除以前上传的id，新上传未保存的不用
        this.emitDelFile(deleteFile[0].id);
      }
    },

    removeUploadFile(opt) {
      let file = opt.file;
      let fileName = file.name;
      let fileUrl = file.url;
      let fileUid = file.uid;
      let foundIdx = -1;
      let foundFile = null;
      this.fileList.forEach((file, idx) => {
        if (
          file.name === fileName &&
          (file.url === fileUrl || (!!fileUid && file.uid === fileUid))
        ) {
          foundIdx = idx;
          foundFile = file;
        }
      });

      if (foundIdx >= 0) {
        this.fileList.splice(foundIdx, 1);
        this.updateFieldModelAndEmitDataChangeForRemove(
          foundIdx,
          this.fileList
        );
        // this.uploadBtnHidden = this.fileList.length >= this.field.options.limit

        // if (this.field.options.onFileRemove) {
        //   let customFn = new Function(
        //     "file",
        //     "fileList",
        //     this.field.options.onFileRemove
        //   );
        //   customFn.call(this, foundFile, this.fileList);
        // }
        try {
          let event =
            (this.formConfig.eventMap &&
              this.formConfig.eventMap[`${this.field.id}.onFileRemove`]) ||
            "";
          let obj = this.formConfig?.globalObject;
          if (obj && event && obj[event]) {
            let customFn = obj[event];
            customFn.call(this, foundFile, this.fileList);
          }
        } catch (error) {
          this.Message.notifyError("请检查全局函数的调用");
          console.error("请检查全局函数的调用:",error);
        }
      }
    },

    handleUploadError(err, file, fileList) {
      // if (this.field.options.onUploadError) {
      //   let customFn = new Function(
      //     "error",
      //     "file",
      //     "fileList",
      //     this.field.options.onUploadError
      //   );
      //   customFn.call(this, err, file, fileList);
      // } else {
      //   this.$message({
      //     message: err.msg || this.i18nt("render.hint.uploadError") + err,
      //     duration: 3000,
      //     type: "error",
      //   });
      // }
      try {
        let event =
          (this.formConfig.eventMap &&
            this.formConfig.eventMap[`${this.field.id}.onUploadError`]) ||
          "";
        let obj = this.formConfig?.globalObject;
        if (obj && event && obj[event]) {
          let customFn = obj[event];
          customFn.call(this, err, file, fileList);
        }
      } catch (error) {
        this.Message.notifyError("请检查全局函数的调用");
        console.error("请检查全局函数的调用:",error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.full-width-input {
  width: 100% !important;
}

.dynamicPseudoAfter :deep(.el-upload.el-upload--text) {
  color: $mainColor;
  font-size: 12px;
  .el-icon-plus:after {
    content: var(--select-file-action);
  }
}

.hideUploadDiv {
  :deep(div.el-upload--picture-card) {
    /* 隐藏最后的图片上传按钮 */
    display: none;
  }

  :deep(div.el-upload--text) {
    /* 隐藏最后的文件上传按钮 */
    display: none;
  }

  :deep(div.el-upload__tip) {
    /* 隐藏最后的文件上传按钮 */
    display: none;
  }
}

.upload-file-list {
  font-size: 12px;

  .file-action {
    color: $mainColor;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
