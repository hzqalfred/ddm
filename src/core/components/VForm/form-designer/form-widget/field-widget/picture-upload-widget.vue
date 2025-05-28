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
    <!-- el-upload增加:name="field.options.name"后，会导致又拍云上传失败！故删除之！！ -->
    <vxe-upload
      ref="fieldEditor"
      :disabled="field.options.disabled"
      :multiple="field.options.multipleSelect"
      v-model="fileList"
      :show-list="field.options.showFileList"
      :class="{ hideUploadDiv: uploadBtnHidden, disabled: field.options.disabled }"
      @upload-success="handlePictureUpload"
      @upload-error="handleUploadError"
      @remove="handleRemove"
      :upload-method="uploadFile"
      :limit-count="field.options.limit"
      :limit-size="field.options.fileMaxSize"
      :fileTypes="field.options.fileTypes"
      mode="image"
    >
      <template #tip>
        <div class="el-upload__tip" v-if="!!field.options.uploadTip">
          {{ field.options.uploadTip }}
        </div>
      </template>
      <div class="uploader-icon"><svg-icon icon-class="el-plus" /></div>
    </vxe-upload>
  </form-item-wrapper>
</template>

<script>
import FormItemWrapper from '@/core/components/VForm/form-designer/form-widget/field-widget/form-item-wrapper.vue'
import emitter from '@/core/components/VForm/lib/emitter'
import i18n, { translate } from '@/core/i18nLang'
import { deepClone } from '@/core/utils/tool'
import fieldMixin from '@/core/components/VForm/form-designer/form-widget/field-widget/fieldMixin'
import SvgIcon from '@/core/components/SvgIcon/index.vue'
import request from '@/core/Request'
const requestConfig = {
  baseURL: import.meta.env.VITE_NAME === "dev" ? "/api" : "/api", //基准路径
  timeout: 1000 * 60, //超时时间
};
export default {
  name: 'picture-upload-widget',
  componentName: 'FieldWidget', //必须固定为FieldWidget，用于接收父级组件的broadcast事件
  mixins: [emitter, fieldMixin, i18n],
  inject: ['getFunId', 'getKeyId'],
  props: {
    field: Object,
    parentWidget: Object,
    parentList: Array,
    indexOfParentList: Number,
    designer: Object,
    funId: String,

    designState: {
      type: Boolean,
      default: false
    },

    subFormRowIndex: {
      /* 子表单组件行索引，从0开始计数 */
      type: Number,
      default: -1
    },
    subFormColIndex: {
      /* 子表单组件列索引，从0开始计数 */
      type: Number,
      default: -1
    },
    subFormRowId: {
      /* 子表单组件行Id，唯一id且不可变 */
      type: String,
      default: ''
    }
  },
  components: {
    FormItemWrapper,
    SvgIcon
  },
  data() {
    return {
      oldFieldValue: null, //field组件change之前的值
      fieldModel: [],
      rules: [],

      uploadData: {
        // key: '', //文件名
        // funId: '',
        // keyId: ''
        //token: '',  //上传token
        //policy: '',  //又拍云上传policy
        //authorization: '',  //又拍云上传签名
      },
      fileList: [], //上传文件列表
      fileListBeforeRemove: [], //删除前的文件列表
      uploadBtnHidden: false,
      requestConfig,
      previewIndex: 1 // 初始预览图像索引
    }
  },
  beforeCreate() {
    /* 这里不能访问方法和属性！！ */
  },

  created() {
    /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
    this.initFieldModel()
    this.registerToRefList()
    this.initEventHandler()
    this.buildFieldRules()
    this.handleOnCreated()
  },

  mounted() {
    this.handleOnMounted()
  },

  beforeUnmount() {
    this.unregisterFromRefList()
  },

  methods: {
    //删除前
    handleBeforeRemove(fileList) {
      /* 保留删除之前的文件列表！！ */
      this.fileListBeforeRemove = deepClone(fileList)
    },
    //删除时
    handleRemove(opt) {
      let file = opt.file
      this.handleBeforeRemove(this.fileList) // 由于自定义了 #file slot，需要手动调用 handleBeforeRemove，并移除 @before-remove 和 @remove
      this.fileList.splice(this.fileList.indexOf(file), 1) // 删除所点击的文件
      this.updateFieldModelAndEmitDataChangeForRemove(file)
      let fileList = deepClone(this.fileList) // 进行深拷贝，避免用户自定义函数对 fileList 进行修改时，影响组件内的数据
      // this.uploadBtnHidden = fileList.length >= this.field.options.limit

      if (this.field.options.onFileRemove) {
        let customFn = new Function('file', 'fileList', this.field.options.onFileRemove)
        customFn.call(this, file, fileList)
      }
    },
    //删除成功后更新 form表单的值
    updateFieldModelAndEmitDataChangeForRemove(file) {
      let oldValue = deepClone(this.fieldModel)
      let foundFileIdx = -1
      let deleteFile
      this.fileListBeforeRemove.map((fi, idx) => {
        /* 跟element-ui不同，element-plus删除文件时this.fileList数组对应元素已被删除！！ */
        if (fi.name === file.name && (fi.url === file.url || (!!fi.uid && fi.uid === file.uid))) {
          /* 这个判断有问题？？ */
          foundFileIdx = idx
        }
      })
      if (foundFileIdx > -1) {
        deleteFile = this.fieldModel.splice(foundFileIdx, 1)
      }
      this.syncUpdateFormModel(this.fieldModel)
      this.emitFieldDataChange(this.fieldModel, oldValue)
      if (deleteFile[0].id) {
        // 记录删除以前上传的id，新上传未保存的不用
        this.emitDelFile(deleteFile[0].id)
      }
    },
    //提交前
    beforePictureUpload(file) {
      if (this.designState) {
        //设计状态不触发点击事件
        return false
      }
      this.uploadData.key = file.name
      if (this.field.options.onBeforeUpload) {
        let bfFunc = new Function('file', this.field.options.onBeforeUpload)
        let result = bfFunc.call(this, file)
        if (typeof result === 'boolean') {
          return result
        } else {
          return true
        }
      }

      return true
    },
    //提交時
    uploadFile(param) {
      var fileObj = param.file
      this.beforePictureUpload(fileObj)
      var form = new FormData()
      // 文件对象
      form.append('file', fileObj)
      form.append('funId', this.getFunId())
      form.append('keyId', this.getKeyId())
      request
        .post(this.field.options.uploadURL || '/file/upload', form)
        .then(res => {
          if (res.success) {
            Promise.resolve(res)
          } else {
            Promise.reject(res)
          }
        })
        .catch(({ err }) => {
          Promise.reject(err)
        })
    },
    //提交成功
    handlePictureUpload(res, file, fileList) {
      this.$message.notifySuccess('上传成功')
      if (file.status === 'success') {
        let customResult = null
        if (this.field.options.onUploadSuccess) {
          let customFn = new Function('result', 'file', 'fileList', this.field.options.onUploadSuccess)
          customResult = customFn.call(this, res, file, fileList)
        }

        this.updateFieldModelAndEmitDataChangeForUpload(fileList, customResult, res)
        this.fileList = deepClone(fileList)
        // this.uploadBtnHidden = fileList.length >= this.field.options.limit
      }
    },
    //提交成功后更新 form表单的值
    updateFieldModelAndEmitDataChangeForUpload(fileList, customResult, defaultResult) {
      let oldValue = deepClone(this.fieldModel)

      if (!!customResult && !!customResult.name && !!customResult.url) {
        this.fieldModel.push({
          name: customResult.name,
          url: customResult.url
        })
      } else if (defaultResult && defaultResult.success) {
        fileList.some((item, index) => {
          if (!item.id && item.response && item.response.success) {
            fileList[fileList.length - 1].id = defaultResult.data[0].file_id
            fileList[fileList.length - 1].url = requestConfig.baseURL + '/file/preview/image/' + defaultResult.data[0].file_id + '?thumbnail=1&scale=0.2&outputQuality=0.2'
            fileList[fileList.length - 1].originalUrl = requestConfig.baseURL + '/file/preview/image/' + defaultResult.data[0].file_id + '?thumbnail=0'
            return true
          }
        })

        this.fieldModel = deepClone(fileList)
      } else {
        this.fieldModel = deepClone(fileList)
      }
      this.syncUpdateFormModel(this.fieldModel)
      this.emitFieldDataChange(this.fieldModel, oldValue)
    },
    //提交失败
    handleUploadError(err, file, fileList) {
      if (this.field.options.onUploadError) {
        let customFn = new Function('error', 'file', 'fileList', this.field.options.onUploadError)
        customFn.call(this, err, file, fileList)
      } else {
        this.$message({
          message: err.msg || this.i18nt('render.hint.uploadError') + err,
          duration: 3000,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.full-width-input {
  width: 100% !important;
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
    /* 隐藏最后的文件上传按钮提示 */
    display: none;
  }
}

.uploader-icon {
  height: 100%;
  display: flex;
  color: #8c939d;
  font-size: 28px;
  justify-content: center;
  align-items: center;
}

.disabled :deep(.el-upload) {
  display: none;
}
</style>
