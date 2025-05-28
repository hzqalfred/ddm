<template>
  <el-scrollbar class="side-scroll-bar" :style="{ height: scrollerHeight }">
    <div class="panel-container">
      <el-tabs v-model="firstTab" class="no-bottom-margin indent-left-margin">
        <!-- <el-tab-pane name="functionLib">
          <template #label>
            <span>
              {{ i18nt("designer.functionLib") }}
            </span>
          </template>

          <el-collapse v-model="activeNames" class="widget-collapse">
            <el-collapse-item
              name="0"
              :title="i18nt('designer.containerTitle')"
            >
              <draggable
                tag="ul"
                :list="containers"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :clone="handleContainerWidgetClone"
                ghost-class="ghost"
                :sort="false"
                :move="checkContainerMove"
                @end="onContainerDragEnd"
              >
                <template #item="{ element: ctn }">
                  <li
                    class="container-widget-item"
                    :title="ctn.displayName"
                    @dblclick="addContainerByDbClick(ctn)"
                  >
                    <span>
                      <svg-icon
                        :icon-class="ctn.icon"
                        class-name="color-svg-icon"
                      />
                      {{
                        i18n2t(
                          `designer.widgetLabel.${ctn.type}`,
                          `extension.widgetLabel.${ctn.type}`
                        )
                      }}
                    </span>
                  </li>
                </template>
              </draggable>
            </el-collapse-item>
            <el-collapse-item name="1" :title="i18nt('designer.fieldLib')">
              <draggable
                tag="ul"
                :list="fieldsList"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :clone="handleContainerWidgetClone"
                ghost-class="ghost"
                :sort="false"
                :move="checkContainerMove"
                @end="onContainerDragEnd"
              >
                <template #item="{ element: ctn }">
                  <li
                    :class="{
                      'container-widget-item': true,
                      selected: ctn.selected,
                    }"
                    :title="ctn.column_type"
                    @dblclick="addContainerByDbClick(ctn)"
                  >
                    <span>
                      <svg-icon
                        :icon-class="ctn.icon"
                        class-name="color-svg-icon"
                      />
                      {{ ctn.displayName }}
                    </span>
                  </li>
                </template>
              </draggable>
            </el-collapse-item>
            <el-collapse-item name="2" :title="i18nt('designer.subgridList')">
              <draggable
                tag="ul"
                :list="subgridList"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :clone="handleContainerWidgetClone"
                ghost-class="ghost"
                :sort="false"
                :move="checkContainerMove"
                @end="onContainerDragEnd"
              >
                <template #item="{ element: ctn }">
                  <li
                    :class="{
                      'container-widget-item': true,
                      selected: ctn.selected,
                    }"
                    :title="ctn.column_type"
                    @dblclick="addContainerByDbClick(ctn)"
                  >
                    <span>
                      <svg-icon
                        :icon-class="ctn.icon"
                        class-name="color-svg-icon"
                      />
                      {{ ctn.displayName }}
                    </span>
                  </li>
                </template>
              </draggable>
            </el-collapse-item>
            <el-collapse-item name="3" :title="i18nt('designer.expandList')">
              <draggable
                tag="ul"
                :list="expandList"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :clone="handleContainerWidgetClone"
                ghost-class="ghost"
                :sort="false"
                :move="checkContainerMove"
                @end="onContainerDragEnd"
              >
                <template #item="{ element: ctn }">
                  <li
                    :class="{
                      'container-widget-item': true,
                      selected: ctn.selected,
                    }"
                    :title="ctn.column_type"
                    @dblclick="addContainerByDbClick(ctn)"
                  >
                    <span>
                      <svg-icon
                        :icon-class="ctn.icon"
                        class-name="color-svg-icon"
                      />
                      {{ ctn.displayName }}
                    </span>
                  </li>
                </template>
              </draggable>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane> -->

        <el-tab-pane name="componentLib">
          <template #label>
            <span>
              {{ i18nt("designer.componentLib") }}
            </span>
          </template>

          <el-collapse v-model="activeNames2" class="widget-collapse">
            <el-collapse-item
              name="1"
              :title="i18nt('designer.containerTitle')"
            >
              <draggable
                tag="ul"
                :list="containers"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :clone="handleContainerWidgetClone"
                ghost-class="ghost"
                :sort="false"
                :move="checkContainerMove"
                @end="onContainerDragEnd"
              >
                <template #item="{ element: ctn }">
                  <li
                    class="container-widget-item"
                    :title="ctn.displayName"
                    @dblclick="addContainerByDbClick(ctn)"
                  >
                    <span>
                      <svg-icon
                        :icon-class="ctn.icon"
                        class-name="color-svg-icon"
                      />
                      {{
                        i18n2t(
                          `designer.widgetLabel.${ctn.type}`,
                          `extension.widgetLabel.${ctn.type}`
                        )
                      }}
                      <!-- <vxe-icon v-if="ctn.isnew === true" name="star-fill" status="error"></vxe-icon> -->
                    </span>
                  </li>
                </template>
              </draggable>
            </el-collapse-item>

            <el-collapse-item
              name="2"
              :title="i18nt('designer.basicFieldTitle')"
            >
              <draggable
                tag="ul"
                :list="basicFields"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :move="checkFieldMove"
                :clone="handleFieldWidgetClone"
                ghost-class="ghost"
                :sort="false"
              >
                <template #item="{ element: fld }">
                  <li
                    v-if="fld.type !== 'subgrid'"
                    class="field-widget-item"
                    :title="fld.displayName"
                    @dblclick="addFieldByDbClick(fld)"
                  >
                    <span>
                      <svg-icon
                        :icon-class="fld.icon"
                        class-name="color-svg-icon"
                      />
                      {{
                        fld?.alias ||
                          i18n2t(
                            `designer.widgetLabel.${fld.type}`,
                            `extension.widgetLabel.${fld.type}`
                          )
                      }}
                      <!-- <vxe-icon v-if="fld.isnew === '1'" name="star-half" status="error"></vxe-icon> -->
                      <!-- <vxe-icon v-if="fld.isnew === '9'" name="star-fill" status="error"></vxe-icon> -->
                    </span>
                  </li>
                </template>
              </draggable>
            </el-collapse-item>

            <el-collapse-item
              name="3"
              :title="i18nt('designer.advancedFieldTitle')"
            >
              <draggable
                tag="ul"
                :list="advancedFields"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :move="checkFieldMove"
                :clone="handleFieldWidgetClone"
                ghost-class="ghost"
                :sort="false"
              >
                <template #item="{ element: fld }">
                  <li
                    class="field-widget-item"
                    :title="fld.displayName"
                    @dblclick="addFieldByDbClick(fld)"
                  >
                    <span>
                      <svg-icon
                        :icon-class="fld.icon"
                        class-name="color-svg-icon"
                      />
                      {{
                        i18n2t(
                          `designer.widgetLabel.${fld.type}`,
                          `extension.widgetLabel.${fld.type}`
                        )
                      }}
                    </span>
                  </li>
                </template>
              </draggable>
            </el-collapse-item>
            <el-collapse-item name="4" :title="i18nt('designer.subgridList')">
              <draggable
                tag="ul"
                :list="subgridList.concat(expandList)"
                item-key="key"
                :group="{ name: 'dragGroup', pull: 'clone', put: false }"
                :clone="handleContainerWidgetClone"
                ghost-class="ghost"
                :sort="false"
                :move="checkContainerMove"
                @end="onSubgridDragEnd"
              >
                <template #item="{ element: ctn }">
                  <li
                    :class="{
                      'container-widget-item': true,
                      selected: ctn.selected,
                    }"
                    :title="ctn.column_type"
                    @dblclick="addContainerByDbClick(ctn)"
                  >
                    <span>
                      <svg-icon
                        :icon-class="ctn.icon"
                        class-name="color-svg-icon"
                      />
                      {{ ctn.displayName }}
                    </span>
                  </li>
                </template>
              </draggable>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>

        <el-tab-pane
          v-if="showFormTemplates() && true"
          name="formLib"
          style="padding: 8px"
        >
          <template #label>
            <span>
              {{ i18nt("designer.formLib") }}
            </span>
          </template>

          <template v-for="(ft, idx) in formTemplates" :key="idx">
            <el-card
              :bord-style="{ padding: '0' }"
              shadow="hover"
              class="ft-card"
            >
              <el-popover placement="right" trigger="hover">
                <template #reference>
                  <img :src="ft.imgUrl" style="width: 200px" />
                </template>
                <img :src="ft.imgUrl" style="height: 600px;width: 720px" />
              </el-popover>
              <div class="bottom clear-fix">
                <span class="ft-title">#{{ idx + 1 }} {{ ft.title }}</span>
                <el-button
                  link
                  type="primary"
                  class="right-button"
                  @click="loadFormTemplate(ft.jsonUrl)"
                >
                  {{ i18nt("designer.hint.loadFormTemplate") }}
                </el-button>
              </div>
            </el-card>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-scrollbar>
  <vxe-modal v-model="showGuide" width="100%" height="100%">
    <template #title>
      <div>功能设计</div>
    </template>
    <function-generator
      :modData="globalDsv?.param || {}"
      @generateData="reloadJson"
    ></function-generator>
  </vxe-modal>
</template>

<script>
import {
  containers as CONS,
  basicFields as BFS,
  advancedFields as AFS,
  customFields as CFS,
} from "./widgetsConfig";
import { formTemplates } from "./templatesConfig";
import {
  generateId,
  getAllFieldWidgets,
} from "@/core/components/VForm/lib/utils";
import { addWindowResizeHandler, parseEnhance } from "@/core/utils/tool";
import i18n from "@/core/i18nLang";
import axios from "axios";
import SvgIcon from "@/core/components/SvgIcon/index.vue";
import { getFunctionDetail } from "@/api/webDesigner";
import functionGenerator from "./components/functionGenerator.vue";

export default {
  name: "FieldPanel",
  mixins: [i18n],
  components: {
    SvgIcon,
    functionGenerator,
  },
  props: {
    designer: Object,
    funId: String,
    fieldsList: Array,
    subgridList: Array,
    expandList: Array,
    globalDsv: Object,
  },
  inject: ["getBannedWidgets", "getDesignerConfig"],
  data() {
    return {
      designerConfig: this.getDesignerConfig(),

      firstTab: "componentLib",

      scrollerHeight: 0,

      activeNames: ["1", "2"],
      activeNames2: ["1", "2", "3", "4"],

      containers: [],
      basicFields: [],
      advancedFields: [],
      customFields: [],

      formTemplates: formTemplates,
      originMoveFields: {},
      showGuide: false,
    };
  },
  created() {
    this.loadWidgets();
  },
  mounted() {
    this.scrollerHeight = window.innerHeight - 56 + "px";
    addWindowResizeHandler(() => {
      this.$nextTick(() => {
        this.scrollerHeight = window.innerHeight - 56 + "px";
      });
    });
  },
  methods: {
    isBanned(wName) {
      return this.getBannedWidgets().indexOf(wName) > -1;
    },

    showFormTemplates() {
      if (this.designerConfig["formTemplates"] === undefined) {
        return true;
      }

      return !!this.designerConfig["formTemplates"];
    },

    loadWidgets() {
      this.containers = CONS.map((con) => {
        return {
          key: generateId(),
          ...con,
          displayName: this.i18n2t(
            `designer.widgetLabel.${con.type}`,
            `extension.widgetLabel.${con.type}`
          ),
        };
      }).filter((con) => {
        return !con.internal && !this.isBanned(con.type);
      });

      this.basicFields = BFS.map((fld) => {
        return {
          key: generateId(),
          ...fld,
          displayName: this.i18n2t(
            `designer.widgetLabel.${fld.type}`,
            `extension.widgetLabel.${fld.type}`
          ),
        };
      }).filter((fld) => {
        return !this.isBanned(fld.type);
      });

      this.advancedFields = AFS.map((fld) => {
        return {
          key: generateId(),
          ...fld,
          displayName: this.i18n2t(
            `designer.widgetLabel.${fld.type}`,
            `extension.widgetLabel.${fld.type}`
          ),
        };
      }).filter((fld) => {
        return !this.isBanned(fld.type);
      });

      this.customFields = CFS.map((fld) => {
        return {
          key: generateId(),
          ...fld,
          displayName: this.i18n2t(
            `designer.widgetLabel.${fld.type}`,
            `extension.widgetLabel.${fld.type}`
          ),
        };
      }).filter((fld) => {
        return !this.isBanned(fld.type);
      });
    },

    handleContainerWidgetClone(origin) {
      const fieldsList = getAllFieldWidgets(this.designer.widgetList);
      if (
        origin.options.isFunItem &&
        fieldsList.find((i) => i.field.key === origin.key)
      ) {
        this.message.notifyWarning("该字段已存在");
        return false;
      }
      this.originMoveFields = origin;
      return this.designer.copyNewContainerWidget(origin);
    },

    handleFieldWidgetClone(origin) {
      return this.designer.copyNewFieldWidget(origin);
    },

    checkContainerMove(evt) {
      // 已存在的禁止拖动
      const fieldsList = getAllFieldWidgets(this.designer.widgetList);
      if (
        evt.draggedContext.element.options.isFunItem &&
        fieldsList.find((i) => i.field.key === evt.draggedContext.element.key)
      ) {
        return false;
      }
      return this.designer.checkWidgetMove(evt);
    },

    checkFieldMove(evt) {
      return this.designer.checkFieldMove(evt);
    },

    onContainerDragEnd(evt) {
      //
    },
    async onSubgridDragEnd() {
      let origin = this.originMoveFields;
      let module = this.globalDsv?.param;
      try {
        // 拖拽子组件请求json显示 3.24
        if (origin?.type == "subgrid") {
          const res = await getFunctionDetail({
            functionCode: origin?.options?.functionCode,
            moduleName: module?.moduleName,
            moduleCode: module?.moduleCode,
          });
          let obj = parseEnhance(res?.data?.designJson);

          if (!Object.keys(obj).length) return;
          let pageContain = Object.assign({}, origin, {
            type: "page",
            icon: "page",
            widgetList: obj.widgetList,
          });
          let copy = this.designer.copyNewContainerWidget(pageContain);
          let index = this.designer.widgetList.findIndex(
            (x) => x.key == origin.key
          );
          this.designer.widgetList.splice(index, 1, copy);
        }
      } catch (error) {}
    },

    addContainerByDbClick(container) {
      this.designer.addContainerByDbClick(container);
    },

    addFieldByDbClick(widget) {
      this.designer.addFieldByDbClick(widget);
    },
    reloadJson(json) {
      if(json) this.designer.loadFormJson(json);
      this.showGuide = false
    },
    loadFormTemplate(jsonUrl) {
      this.showGuide = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.color-svg-icon {
  color: $mainColor;
}

.side-scroll-bar {
  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }
}

div.panel-container {
  padding-bottom: 10px;
}

.no-bottom-margin :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.indent-left-margin {
  :deep(.el-tabs__nav) {
    margin-left: 20px;
  }
}

.el-collapse-item :deep(ul) > li {
  list-style: none;
}

.widget-collapse {
  border-top-width: 0;

  :deep(.el-collapse-item__header) {
    margin-left: 8px;
    font-style: italic;
    font-weight: bold;
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 6px;

    ul {
      padding-left: 10px; /* 重置IE11默认样式 */
      margin: 0; /* 重置IE11默认样式 */
      margin-block-start: 0;
      margin-block-end: 0.25em;
      padding-inline-start: 10px;

      &:after {
        content: "";
        display: block;
        clear: both;
      }

      .container-widget-item,
      .field-widget-item {
        height: 28px;
        line-height: 28px;
        width: 115px;
        float: left;
        margin: 2px 6px 6px 0;
        cursor: move;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        background: #f1f2f3;
      }

      .container-widget-item.selected {
        background: #c7ccd5;
      }

      .container-widget-item.selected:hover {
        background: #c7ccd5;
      }

      .container-widget-item:hover,
      .field-widget-item:hover {
        background: #ebeef5;
        outline: 1px solid $mainColor;
      }

      .drag-handler {
        position: absolute;
        top: 0;
        left: 160px;
        background-color: #dddddd;
        border-radius: 5px;
        padding-right: 5px;
        font-size: 11px;
        color: #666666;
      }
    }
  }
}

.el-card.ft-card {
  border: 1px solid #8896b3;
}

.ft-card {
  margin-bottom: 10px;

  .bottom {
    margin-top: 10px;
    line-height: 12px;
  }

  .ft-title {
    font-size: 13px;
    font-weight: bold;
  }

  .right-button {
    padding: 0;
    float: right;
  }

  .clear-fix:before,
  .clear-fix:after {
    display: table;
    content: "";
  }

  .clear-fix:after {
    clear: both;
  }
}
</style>
