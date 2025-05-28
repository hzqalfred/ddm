<script setup>
import { h } from "vue";
import frame_tpl from "./frame-tpl.vue";
import layout_tpl from "./layout-tpl.vue";
import control_tpl from "./control-tpl.vue";

const props = defineProps(["data"]);
const item = props.data;

// 提取通用组件渲染逻辑
const componentMap = {
  frame: frame_tpl,
  layout: layout_tpl,
  control: control_tpl,
};

// 判断当前组件类型
const renderComponent = (subitem) => {
  const component = componentMap[item.type];
  return component ? h(component, { data: subitem }) : null;
};
</script>

<template>
  <el-row
    v-if="item.ele === 'row'"
    :class="item.class || ''"
    key="row"
    :style="item.style || ''"
    :justify="item.justify || 'start'"
  >
    <template v-for="subitem in item.data" :key="subitem.id">
      <component :is="renderComponent(subitem)" />
    </template>
  </el-row>

  <el-col
    v-else-if="item.ele === 'col' || item.ele === 'row'"
    :span="item.span"
    :class="item.class || ''"
    :style="item.style || ''"
    key="col"
  >
    <template v-for="subitem in item.data" :key="subitem.id">
      <component :is="renderComponent(subitem)" />
    </template>
  </el-col>

  <!-- 如果是 layout 或 control 类型，直接渲染 -->
  <layout_tpl v-else-if="item.type === 'layout'" :data="item" key="layout" />
  <control_tpl v-else-if="item.type === 'control'" :data="item" key="control" />
  <frame_tpl v-else-if="item.type === 'frame'" :data="item" key="frame" />

  <!-- 无效类型组件时显示 -->
  <div v-else>
    <el-empty description="无效类型组件，请检查设置！[layout]" />
    {{ item.id }}
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
