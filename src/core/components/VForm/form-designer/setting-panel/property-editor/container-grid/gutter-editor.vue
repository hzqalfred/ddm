<template>
  <div>
    <el-form-item label-width="0">
      <el-divider class="custom-divider">{{
        i18nt("designer.setting.columnSetting")
      }}</el-divider>
    </el-form-item>
    <el-form-item :label="i18nt('designer.setting.gutter')">
      <el-input-number
        v-model="optionModel.gutter"
        style="width: 100%"
      ></el-input-number>
    </el-form-item>
    <el-form-item :label="i18nt('designer.setting.colsOfGrid')">
      <el-button link type="primary" @click="addNewCol(selectedWidget)">{{
        i18nt("designer.setting.addColumn")
      }}</el-button>
    </el-form-item>
    <el-form-item label="栅格列数设置">
      <el-input-number
        v-model="optionModel.formColumnNums"
        style="width: 100%"
      ></el-input-number>
      <el-button link type="primary" @click="setColumnNums"
        >设置列数</el-button
      >
    </el-form-item>
    <el-form-item label-width="0">
      <li
        v-for="(colItem, colIdx) in selectedWidget.cols"
        :key="colIdx"
        class="col-item"
      >
        <span class="col-span-title"
          >{{ colItem?.widgetList[0]?.options?.label }}
          {{ i18nt("designer.setting.cellWidth") }}</span
        >
        <!-- <span class="col-span-title">{{ i18nt('designer.setting.colSpanTitle') }}{{ colIdx + 1 }}</span> -->
        <el-input-number
          v-model.number="colItem.options.span"
          :precision="0"
          :min="1"
          :max="24"
          @change="
            (newValue, oldValue) =>
              spanChanged(selectedWidget, colItem, colIdx, newValue, oldValue)
          "
          class="cell-span-input"
        ></el-input-number>
        <!-- <el-button circle plain size="small" type="danger" @click="deleteCol(selectedWidget, colIdx)" icon="el-icon-minus" class="col-delete-button"></el-button> -->
        <vxe-button
          size="mini"
          status="error"
          icon="vxe-icon-delete"
          circle
          @click="deleteCol(selectedWidget, colIdx)"
          style="left: 5px;"
        ></vxe-button>
      </li>
    </el-form-item>
  </div>
</template>

<script>
import i18n from "@/core/i18nLang";

export default {
  name: "gutter-editor",
  mixins: [i18n],
  props: {
    designer: Object,
    selectedWidget: Object,
    optionModel: Object,
  },
  methods: {
    spanChanged(curGrid) {
      let spanSum = 0;
      curGrid.cols.forEach((colItem) => {
        spanSum += colItem.options.span;
      });
      if (spanSum > 24) {
        //this.$message.info('列栅格之和超出24')
        console.log("列栅格之和超出24");
        //TODO: 语言字符串资源化
      }

      this.designer.saveCurrentHistoryStep();
    },

    deleteCol(curGrid, colIdx) {
      this.designer.deleteColOfGrid(curGrid, colIdx);
      this.designer.emitHistoryChange();
    },

    addNewCol(curGrid) {
      this.designer.addNewColOfGrid(curGrid);
      this.designer.emitHistoryChange();
    },
    setColumnNums() {
      this.selectedWidget?.cols.map((x) => {
       if(x?.options?.span)  x.options.span = Math.floor(24 / this.optionModel.formColumnNums) ;
      })
    },
  },
};
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
</style>
