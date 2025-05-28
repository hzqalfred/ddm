<template>
  <div style="margin-top: 40px;padding: 0 40px;">
    <div>
      <vxe-tip status="primary">功能参数设置</vxe-tip>
      <div style="margin-bottom: 10px;">
        <vxe-button status="primary" icon="vxe-icon-add" @click="addEvent('A')">新增</vxe-button>
        <vxe-button status="error" icon="vxe-icon-delete" @click="deleteList('A')">删除</vxe-button>
      </div>
      <vxe-table border show-overflow height="300" :data="functionParamList" ref="functionParamRef">
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column field="orderIndex" title="排序" width="60"></vxe-column>
        <vxe-column field="paramId" title="参数id" :edit-render="{ name: 'input' }" :visible="false"></vxe-column>
        <vxe-column field="paramCode" title="参数编码"></vxe-column>
        <vxe-column field="paramName" title="参数名称"></vxe-column>
        <vxe-column field="paramValue" title="默认值"></vxe-column>
        <vxe-column title="操作" width="200">
          <template #default="{ row }">
            <vxe-button mode="text" status="primary" icon="vxe-icon-edit"
                        @click="editRow('A', row)">编辑
            </vxe-button>
            <vxe-button mode="text" status="error" icon="vxe-icon-delete"
                        @click="removeRow('A', row)">删除
            </vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>

    <vxe-modal resize destroy-on-close show-footer v-model="showEditPopupA"
               :title="selectRow ? '编辑' : '新增'" width="60vw" height="60vh" :loading="loading"
               :confirm-closable="false">
      <vxe-form ref="formRefA" v-bind="formOptions" @submit="confirmEventA" @reset="resetEvent"></vxe-form>
    </vxe-modal>

<!--    <div style="margin-top: 10px; ">-->
<!--      <vxe-tip status="primary">全局参数设置</vxe-tip>-->
<!--      <div style="margin-bottom: 10px;">-->
<!--        <vxe-button status="primary" icon="vxe-icon-add" @click="addEvent('B')">新增</vxe-button>-->
<!--        <vxe-button status="error" icon="vxe-icon-delete" @click="deleteList('B')">删除</vxe-button>-->
<!--      </div>-->
<!--      <vxe-table border show-overflow height="300" :data="globalParamList" ref="tableRefB">-->
<!--        <vxe-column type="checkbox" width="60"></vxe-column>-->
<!--        <vxe-column field="orderIndex" title="排序" width="60"></vxe-column>-->
<!--        <vxe-column field="paramId" title="参数id" :edit-render="{ name: 'input' }" :visible="false"></vxe-column>-->
<!--        <vxe-column field="paramCode" title="参数编码"></vxe-column>-->
<!--        <vxe-column field="paramName" title="参数名称"></vxe-column>-->
<!--        <vxe-column field="paramValue" title="默认值"></vxe-column>-->
<!--        <vxe-column title="操作" width="200">-->
<!--          <template #default="{ row }">-->
<!--            <vxe-button mode="text" status="primary" icon="vxe-icon-edit"-->
<!--                        @click="editRow('B', row)">编辑-->
<!--            </vxe-button>-->
<!--            <vxe-button mode="text" status="error" icon="vxe-icon-delete"-->
<!--                        @click="removeRow('B', row)">删除-->
<!--            </vxe-button>-->
<!--          </template>-->
<!--        </vxe-column>-->
<!--      </vxe-table>-->
<!--    </div>-->

    <vxe-modal resize destroy-on-close show-footer v-model="showEditPopupB"
               :title="selectRow ? '编辑' : '新增'" width="60vw" height="60vh" :loading="loading"
               :confirm-closable="false">
      <vxe-form ref="formRefB" v-bind="formOptions" @submit="confirmEventB" @reset="resetEvent"></vxe-form>
    </vxe-modal>
    <div>
      <vxe-button type="submit" status="primary" content="下一步" class="next-button"
                  @click="submitEvent()"></vxe-button>
    </div>
  </div>
</template>

<script>
import {getFunctionDetail, saveOtherSetting, deleteOtherSetting} from "@/api/functionGenerator";
import messageHandler from "@/core/Message";
import XEUtils from 'xe-utils'

const defaultData = {
  paramId: "",
  orderIndex: 1,
  paramName: "",
  paramCode: "",
  paramValue: "",
}

const formOptions = {
  titleWidth: 130,
  titleAlign: 'right',
  titleColon: true,
  data: XEUtils.clone(defaultData, true),
  rules: {
    orderIndex: [{required: true, message: '请输入排序'}],
    paramName: [{required: true, message: '请输入参数名称'}],
    paramCode: [{required: true, message: '请输入参数编码'}],
  },
  items: [
    {field: 'paramId', title: '树id', span: 6, visible: false, itemRender: {name: 'VxeInput'}},
    {field: 'orderIndex', title: '排序', span: 6, itemRender: {name: 'VxeInput', props: {type: 'integer'}}},
    {field: 'paramCode', title: '参数编码', span: 6, itemRender: {name: 'VxeInput'}},
    {field: 'paramName', title: '参数名称', span: 6, itemRender: {name: 'VxeInput'}},
    {field: 'paramValue', title: '默认值', span: 6, itemRender: {name: 'VxeInput'}},
    {
      align: 'center',
      span: 24,
      itemRender: {
        name: 'VxeButtonGroup',
        options: [
          {type: 'submit', content: '确定', status: 'primary'},
          {type: 'reset', content: '取消'}
        ]
      }
    }
  ]
}

export default {
  name: "otherString",
  props: ["funData"],
  data() {
    return {
      formData: {
        moduleName: "",
        moduleCode: "",
        functionCode: "",
      },
      globalParamList: [],
      functionParamList: [],

      formOptions,

      loading: false,
      selectRow: undefined,
      showEditPopupA: false,
      showEditPopupB: false,
    };
  },
  watch: {
    funData: {
      handler(newValue) {
        this.formData.moduleName = newValue.moduleName;
        this.formData.moduleCode = newValue.moduleCode;
        this.formData.functionCode = newValue.functionCode;
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 下一步操作
    submitEvent() {
      this.$parent.next();
    },
    // 获取所有事件信息
    getDetail() {
      const param = this.getModuleRelatedParams();
      return getFunctionDetail(param).then((res) => {
        if (res.code == "200") {
          this.globalParamList = res.data.globalParamList;
          this.functionParamList = res.data.functionParamList;
        }
      });
    },
    // 传递param
    getModuleRelatedParams() {
      return {
        moduleName: this.formData.moduleName,
        moduleCode: this.formData.moduleCode,
        functionCode: this.formData.functionCode,
      };
    },
    addEvent(type) {
      this.selectRow = undefined
      if (type == 'A') {
        this.formOptions.data = XEUtils.clone(defaultData, true)
        this.showEditPopupA = true
      } else {
        this.formOptions.data = XEUtils.clone(defaultData, true)
        this.showEditPopupB = true
      }
    },

    async confirmEventA() {
      const $formA = this.$refs.formRefA
      if ($formA) {
        const errMap = await $formA.validate()
        if (!errMap) {
          this.showEditPopupA = false
          this.saveRow('A', $formA.data);
        }
      }
    },
    async confirmEventB() {
      const $formB = this.$refs.formRefB
      if ($formB) {
        const errMap = await $formB.validate()
        if (!errMap) {
          this.showEditPopupB = false
          this.saveRow('B', $formB.data);
        }
      }
    },

    // 保存事件预处理
    saveRow(type, data) {
      if (data) {
        const param = this.getModuleRelatedParams();
        if (type == 'A') {
          param.functionParamList = [{
            "paramId": data.paramId,
            "paramName": data.paramName,
            "paramCode": data.paramCode,
            "paramValue": data.paramValue,
            "orderIndex": data.orderIndex
          }];
        } else {
          param.globalParamList = [{
            "paramId": data.paramId,
            "paramName": data.paramName,
            "paramCode": data.paramCode,
            "paramValue": data.paramValue,
            "orderIndex": data.orderIndex
          }];
        }
        this.saveList(param);
      }
    },

    // 保存事件
    saveList(param) {
      return saveOtherSetting(param).then((res) => {
        if (res.code == "200") {
          messageHandler.notifySuccess("编辑成功！");
          this.getDetail();
        }
      });
    },

    editRow(type, row) {

      this.selectRow = row
      this.formOptions.data = Object.assign(XEUtils.clone(defaultData, true), row)
      if (type == 'A') {
        this.showEditPopupA = true
      } else {
        this.showEditPopupB = true
      }
    },
    // 删除事件预处理
    removeRow(type, row) {
      const param = this.getModuleRelatedParams();
      if (row.paramId) {
        if (type == 'A') {
          param.functionParamIds = [row.paramId];
          this.$refs.functionParamRef.remove(row);
        } else {
          param.globalParamIds = [row.paramId];
          this.$refs.tableRefB.remove(row);
        }
      }
      this.deleteParam(param);
    },

    deleteParam(param) {
      return deleteOtherSetting(param).then((res) => {
        if (res.code == "200") {
          messageHandler.notifySuccess("删除成功！");
          this.getDetail();
        }
      });
    },

    deleteList(type) {
      const param = this.getModuleRelatedParams();
      if (type == 'A') {
        const data = this.$refs.functionParamRef.getCheckboxRecords();
        const ids = [];
        if (data.length !== 0) {
          for (var i = 0; i < data.length; i++) {
            ids.push(data[i].paramId);
          }
          param.functionParamIds = ids;
        }
      } else {
        const data = this.$refs.tableRefB.getCheckboxRecords();
        const ids = [];
        if (data.length !== 0) {
          for (var i = 0; i < data.length; i++) {
            ids.push(data[i].paramId);
          }
          param.globalParamIds = ids;
        }
      }
      this.deleteParam(param);
    },

  }
}
</script>

<style>
/* .next-button {
    position: fixed;
    right: 40px;
    bottom: 20px;
    float: none;
    z-index: 12;
} */
</style>