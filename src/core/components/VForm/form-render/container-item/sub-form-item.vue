<template>
  <container-item-wrapper :widget="widget">
    <div :key="widget.id" class="sub-form-container" v-show="!widget.options.hidden">
      <el-row class="header-row">
        <div class="action-header-column">
          <span class="action-label">{{ i18nt('render.hint.subFormAction') }}</span>
          <vxe-button
            :disabled="actionDisabled"
            round
            status="primary"
            size="small"
            class="action-button"
            @click="addSubFormRow"
            :title="i18nt('render.hint.subFormAddActionHint')"
          >
            {{ i18nt('render.hint.subFormAddAction') }}
            <svg-icon icon-class="el-plus" />
          </vxe-button>
        </div>
        <template v-for="subWidget in widget.widgetList" :key="subWidget.id + 'thc'">
          <div
            class="field-header-column"
            :class="[getLabelAlign(widget, subWidget), !!subWidget.options.required ? 'is-required' : '']"
            :style="{ width: subWidget.options.columnWidth }"
          >
            <span v-if="!!subWidget.options.labelIconClass" class="custom-label">
              <template v-if="subWidget.options.labelIconPosition === 'front'">
                <template v-if="!!subWidget.options.labelTooltip">
                  <vxe-tooltip :content="subWidget.options.labelTooltip" theme="light">
                    <svg-icon :icon-class="subWidget.options.labelIconClass" />
                  </vxe-tooltip>
                  {{ subWidget.options.label }}
                </template>
                <template v-else>
                  <svg-icon :icon-class="subWidget.options.labelIconClass" />
                  {{ subWidget.options.label }}
                </template>
              </template>
              <template v-else-if="subWidget.options.labelIconPosition === 'rear'">
                <template v-if="!!subWidget.options.labelTooltip">
                  {{ subWidget.options.label }}
                  <vxe-tooltip :content="subWidget.options.labelTooltip" theme="light">
                    <svg-icon :icon-class="subWidget.options.labelIconClass" />
                  </vxe-tooltip>
                </template>
                <template v-else>
                  {{ subWidget.options.label }}
                  <svg-icon :icon-class="subWidget.options.labelIconClass" />
                </template>
              </template>
            </span>
            <template v-else>
              <span :title="subWidget.options.labelTooltip">{{ subWidget.options.label }}</span>
            </template>
          </div>
        </template>
      </el-row>
      <el-row v-for="(subFormRowId, sfrIdx) in rowIdData" class="sub-form-row" :key="subFormRowId">
        <div class="sub-form-action-column hide-label">
          <div class="action-button-column">
            <vxe-button :disabled="actionDisabled" circle @click="insertSubFormRow(sfrIdx)" :title="i18nt('render.hint.insertSubFormRow')">
              <svg-icon icon-class="el-plus" />
            </vxe-button>
            <vxe-button :disabled="actionDisabled" circle @click="deleteSubFormRow(sfrIdx)" :title="i18nt('render.hint.deleteSubFormRow')">
              <svg-icon icon-class="el-delete" />
            </vxe-button>
            <span v-if="widget.options.showRowNumber" class="row-number-span">#{{ sfrIdx + 1 }}</span>
          </div>
        </div>
        <template v-for="(subWidget, swIdx) in widget.widgetList" :key="subWidget.id + 'tc' + subFormRowId">
          <div class="sub-form-table-column hide-label" :style="{ width: subWidget.options.columnWidth }">
            <component
              :is="(getFormType == 'print' ? 'print' : subWidget.type) + '-widget'"
              :field="fieldSchemaData[sfrIdx][swIdx]"
              :key="fieldSchemaData[sfrIdx][swIdx].id"
              :parent-list="widget.widgetList"
              :index-of-parent-list="swIdx"
              :parent-widget="widget"
              :sub-form-row-id="subFormRowId"
              :sub-form-row-index="sfrIdx"
              :sub-form-col-index="swIdx"
            >
              <!-- 子表单暂不支持插槽！！！ -->
            </component>
          </div>
        </template>
      </el-row>
    </div>
  </container-item-wrapper>
</template>

<script>
import emitter from '@/core/components/VForm/lib/emitter'
import i18n from '@/core/i18nLang'
import { deepClone } from '@/core/utils/tool'
import { generateId } from '@/core/components/VForm/lib/utils'
import refMixin from '../refMixin'
import ContainerItemWrapper from '@/core/components/VForm/form-render/container-item/container-item-wrapper.vue'
import containerItemMixin from './containerItemMixin'
import FieldComponents from '@/core/components/VForm/form-designer/form-widget/field-widget/index'
import SvgIcon from '@/core/components/SvgIcon/index.vue'

export default {
  name: 'sub-form-item',
  componentName: 'ContainerItem',
  mixins: [emitter, i18n, refMixin, containerItemMixin],
  components: {
    ContainerItemWrapper,
    ...FieldComponents,
    SvgIcon
  },
  props: {
    widget: Object
  },
  inject: ['refList', 'sfRefList', 'globalModel', 'getFormType'],
  data() {
    return {
      rowIdData: [],
      fieldSchemaData: [],
      actionDisabled: false
    }
  },
  created() {
    this.initRefList()
    this.registerSubFormToRefList()
    this.initRowIdData(true)
    this.initFieldSchemaData()
    this.initEventHandler()
  },
  mounted() {
    this.handleSubFormFirstRowAdd() //默认添加首行后，主动触发相关事件！！
  },
  beforeUnmount() {
    this.unregisterFromRefList()
  },
  methods: {
    getLabelAlign(widget, subWidget) {
      return subWidget.options.labelAlign || widget.options.labelAlign
    },

    registerSubFormToRefList() {
      if (this.widget.type === 'sub-form') {
        this.sfRefList[this.widget.options.name] = this
      }
    },

    initRowIdData(initFlag) {
      if (this.widget.type === 'sub-form') {
        this.rowIdData.splice(0, this.rowIdData.length) //清除数组必须用splice，length=0不会响应式更新！！
        let subFormModel = this.formModel[this.widget.options.name]
        if (!!subFormModel && subFormModel.length > 0) {
          subFormModel.forEach(() => {
            this.rowIdData.push('id' + generateId())
          })

          if (!!initFlag) {
            //注意：事件触发需延期执行，SumFormDataChange事件处理代码中可能存在尚未创建完成的组件！！
            setTimeout(() => {
              this.handleSubFormRowChange(subFormModel)
            }, 800)
          }
        }
      }
    },

    addToRowIdData() {
      this.rowIdData.push('id' + generateId())
    },

    insertToRowIdData(rowIndex) {
      this.rowIdData.splice(rowIndex, 0, 'id' + generateId())
    },

    deleteFromRowIdData(rowIndex) {
      this.rowIdData.splice(rowIndex, 1)
    },

    getRowIdData() {
      return this.rowIdData
    },

    getWidgetRefOfSubForm(widgetName, rowIndex) {
      let realWidgetName = widgetName + '@row' + this.rowIdData[rowIndex]
      return this.getWidgetRef(realWidgetName)
    },

    initFieldSchemaData() {
      //初始化fieldSchemaData！！！
      if (this.widget.type !== 'sub-form') {
        return
      }

      let rowLength = this.rowIdData.length
      this.fieldSchemaData.splice(0, this.fieldSchemaData.length) //清除数组必须用splice，length=0不会响应式更新！！
      if (rowLength > 0) {
        for (let i = 0; i < rowLength; i++) {
          let fieldSchemas = []
          this.widget.widgetList.forEach(swItem => {
            fieldSchemas.push(this.cloneFieldSchema(swItem))
          })
          this.fieldSchemaData.push(fieldSchemas)
        }
      }
    },

    addToFieldSchemaData(rowIndex) {
      let fieldSchemas = []
      this.widget.widgetList.forEach(swItem => {
        fieldSchemas.push(this.cloneFieldSchema(swItem))
      })

      if (rowIndex === undefined) {
        this.fieldSchemaData.push(fieldSchemas)
      } else {
        this.fieldSchemaData.splice(rowIndex, 0, fieldSchemas)
      }
    },

    deleteFromFieldSchemaData(rowIndex) {
      this.fieldSchemaData.splice(rowIndex, 1)
    },

    cloneFieldSchema(fieldWidget) {
      let newFieldSchema = deepClone(fieldWidget)
      newFieldSchema.id = fieldWidget.type + generateId()
      return newFieldSchema
    },

    initEventHandler() {
      if (this.widget.type !== 'sub-form') {
        return
      }

      this.on$('setFormData', newFormData => {
        this.initRowIdData(false)
        this.initFieldSchemaData()

        let subFormData = newFormData[this.widget.options.name] || []
        setTimeout(() => {
          //延时触发SubFormRowChange事件, 便于更新计算字段！！
          this.handleSubFormRowChange(subFormData)
        }, 800)
      })
    },

    handleSubFormFirstRowAdd() {
      if (this.widget.type !== 'sub-form') {
        return
      }

      if (!!this.widget.options.showBlankRow && this.rowIdData.length === 1) {
        let oldSubFormData = this.formModel[this.widget.options.name] || []
        this.handleSubFormRowAdd(oldSubFormData, this.rowIdData[0])
        this.handleSubFormRowChange(oldSubFormData)
      }
    },

    addSubFormRow() {
      let newSubFormDataRow = {}
      this.widget.widgetList.forEach(subFormItem => {
        if (!!subFormItem.formItemFlag) {
          newSubFormDataRow[subFormItem.options.name] = subFormItem.options.defaultValue
        }
      })

      let oldSubFormData = this.formModel[this.widget.options.name] || []
      oldSubFormData.push(newSubFormDataRow)
      this.addToRowIdData()
      this.addToFieldSchemaData()

      this.handleSubFormRowAdd(oldSubFormData, this.rowIdData[oldSubFormData.length - 1])
      this.handleSubFormRowChange(oldSubFormData)
    },

    insertSubFormRow(beforeFormRowIndex) {
      let newSubFormDataRow = {}
      this.widget.widgetList.forEach(subFormItem => {
        if (!!subFormItem.formItemFlag) {
          newSubFormDataRow[subFormItem.options.name] = subFormItem.options.defaultValue
        }
      })

      let oldSubFormData = this.formModel[this.widget.options.name] || []
      oldSubFormData.splice(beforeFormRowIndex, 0, newSubFormDataRow)
      this.insertToRowIdData(beforeFormRowIndex)
      this.addToFieldSchemaData(beforeFormRowIndex)

      this.handleSubFormRowInsert(oldSubFormData, this.rowIdData[beforeFormRowIndex])
      this.handleSubFormRowChange(oldSubFormData)
    },

    deleteSubFormRow(formRowIndex) {
      this.$confirm(this.i18nt('render.hint.deleteSubFormRow') + '?', this.i18nt('render.hint.prompt'), {
        confirmButtonText: this.i18nt('render.hint.confirm'),
        cancelButtonText: this.i18nt('render.hint.cancel')
      })
        .then(() => {
          let oldSubFormData = this.formModel[this.widget.options.name] || []
          let deletedDataRow = deepClone(oldSubFormData[formRowIndex])
          oldSubFormData.splice(formRowIndex, 1)
          this.deleteFromRowIdData(formRowIndex)
          this.deleteFromFieldSchemaData(formRowIndex)

          this.handleSubFormRowDelete(oldSubFormData, deletedDataRow)
          this.handleSubFormRowChange(oldSubFormData)
        })
        .catch(() => {
          //
        })
    },

    handleSubFormRowChange(subFormData) {
      if (!!this.widget.options.onSubFormRowChange) {
        let customFunc = new Function('subFormData', this.widget.options.onSubFormRowChange)
        customFunc.call(this, subFormData)
      }
    },

    handleSubFormRowAdd(subFormData, newRowId) {
      if (!!this.widget.options.onSubFormRowAdd) {
        let customFunc = new Function('subFormData', 'newRowId', this.widget.options.onSubFormRowAdd)
        customFunc.call(this, subFormData, newRowId)
      }
    },

    handleSubFormRowInsert(subFormData, newRowId) {
      if (!!this.widget.options.onSubFormRowInsert) {
        let customFunc = new Function('subFormData', 'newRowId', this.widget.options.onSubFormRowInsert)
        customFunc.call(this, subFormData, newRowId)
      }
    },

    handleSubFormRowDelete(subFormData, deletedDataRow) {
      if (!!this.widget.options.onSubFormRowDelete) {
        let customFunc = new Function('subFormData', 'deletedDataRow', this.widget.options.onSubFormRowDelete)
        customFunc.call(this, subFormData, deletedDataRow)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-form-container {
  margin-bottom: 8px;
  text-align: left; //IE浏览器强制居左对齐

  :deep(.el-row.header-row) {
    padding-bottom: 0;
  }

  :deep(.el-row.sub-form-row) {
    padding-top: 3px;
    padding-bottom: 3px;

    .row-number-span {
      margin-left: 16px;
    }
  }
}

div.action-header-column {
  display: inline-block;
  width: 120px;

  .action-label {
    margin-right: 12px;
  }

  .action-button {
    padding-left: 8px;
    padding-right: 8px;
  }
}

div.field-header-column {
  display: inline-block;
  //overflow: hidden;
  //white-space: nowrap;  //文字超出长度不自动换行
  //text-overflow: ellipsis;  //文字超出长度显示省略号

  span.custom-label i {
    margin: 0 3px;
  }
}

div.field-header-column.is-required:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

div.label-center-left {
  text-align: left;
}

div.label-center-align {
  text-align: center;
}

div.label-right-align {
  text-align: right;
}

div.sub-form-action-column {
  display: inline-block;
  width: 120px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-button) {
    font-size: 14px;
    padding: 0;
    background: #dcdfe6;
    border: 4px solid #dcdfe6;
  }
}

div.sub-form-action-column.hide-label {
  :deep(.el-form-item__label) {
    display: none;
  }
}

div.sub-form-table-column {
  display: inline-block;
  //width: 200px;

  :deep(.el-form-item) {
    margin-left: 4px;
    margin-right: 4px;
    margin-bottom: 0;
  }

  :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}

div.sub-form-table-column.hide-label {
  :deep(.el-form-item__label) {
    display: none;
  }
}
</style>
