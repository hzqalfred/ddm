<template>
  <div>
    <component
      :is="getElementComponent(item)"
      :data="item"
      :dataCenter="createDataCenter(item)"
      :id="item.id"
    >
      <template v-if="item.ele === 'btngroup'">
        <template v-for="subitem in item.data" :key="subitem.id">
          <el-button
            v-if="subitem.value"
            :type="subitem.type"
            :id="subitem.id"
            :style="subitem.style || ''"
            @click="fireEvent(subitem.click, $event)"
            :icon="subitem.icon"
          >
            {{ subitem.value }}
          </el-button>
          <el-button
            v-else
            :type="subitem.type"
            :id="subitem.id"
            :style="subitem.style || ''"
            @click="fireEvent(subitem.click, $event)"
            :icon="subitem.icon"
          ></el-button>
        </template>
      </template>
      <template v-else-if="item.ele === 'txtsearch'">
        <el-input
          v-model="item.value"
          :id="item.id"
          :placeholder="item.placeholder"
          class="input-with-select"
          @input="fireEvent(item.input, $event)"
        >
          <template #prepend>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </template>
      <template v-else-if="item.ele === 'switch'">
        <el-switch
          v-model="item.value"
          :id="item.id"
          :active-color="item.activeColor"
          :inactive-color="item.inactiveColor"
          @change="handleSwitchChange"
        />
      </template>
      <template v-else-if="item.ele === 'cardlist'">
        <vxe-card title="标题" :key="'cardlist'">
          <vxe-image
            src="https://vxeui.com/resource/img/fj124.jpeg"
            width="300"
          />
        </vxe-card>
      </template>
      <template v-else-if="item.ele === 'avatar'">
        <div class="avatar-fit">
          <el-avatar
            :id="item.id"
            :shape="item.shape || 'square'"
            :size="item.size"
            :fit="item.fit || 'fit'"
            :src="item.url"
            @click="fireEvent(item.click, $event)"
          />
          <span class="title" @click="fireEvent(item.click, $event)">{{
            item.title
          }}</span>
        </div>
      </template>
      <template v-else-if="item.ele === 'slider'">
        <el-slider
          v-model="item.options.defaultValue"
          :min="item.attrs.min"
          :max="item.attrs.max"
          :disabled="item.attrs.disabled"
          :step="item.attrs.step"
          :show-input="item.attrs.showInput"
          :range="item.attrs.range"
          :style="{ width: item.attrs.width || '100%' }"
        />
      </template>
      <!-- 普通文本 -->
      <template v-else-if="item.ele === 'span'">
        <span
          :id="item.id"
          class="text-element"
          :style="item.style || ''"
          @click="fireEvent(item.click, $event)"
        >
          {{ item.value }}
        </span>
      </template>
    </component>
  </div>
</template>

<script setup>
import { inject, reactive } from "vue";
import { useFormCenterStore } from "@/core/pinia/modules/datacenter";
import { Search } from "@element-plus/icons-vue";
// import comm_table from "./controls/comm_table.vue";
import comm_menu from "./controls/comm_menu.vue";
import comm_taskbar from "./controls/comm_taskbar.vue";
import initpage from "@/views/initPage.vue";

import webrender from "@/views/webRender.vue";
import webdesigner from "@/views/webDesigner.vue";

import devManageList from "@/views/devManage/devManageList.vue";
import devHistory from "@/views/devManage/devHistory.vue";
import devSetting from "@/views/devManage/devSetting.vue";
import devMenu from "@/views/devManage/devMenu.vue";

import suiteManageList from "@/views/idk/suiteManageList.vue";
import suiteManage from "@/views/idk/suiteManage.vue";
import functionPrivilege from "@/views/idk/functionPrivilege.vue"

import functiongenerator from "@/views/idk/functionGenerator.vue";
const formCenterStore = useFormCenterStore();
const props = defineProps(["data"]);
const item = reactive(props.data);
const homePage = inject("homePage");

// 公共处理方法
const createDataCenter = (item) => {
  return formCenterStore.createDataCenter(item?.id, {
    autoSync: true,
  });
};

// 事件触发
const fireEvent = (eventName, e) => {
  if (homePage && eventName) {
    homePage.fireEvent({ eventName, args: e });
  }
};

// switch变化处理函数
const handleSwitchChange = (val) => {
  // 确保事件名存在
  if (item.click) {
    fireEvent({ eventName: item.click, args: val });
  }
};

// 获取对应组件
const getElementComponent = (item) => {
  switch (item.ele) {
    case "menu":
      return comm_menu;
    case "taskbar":
      return comm_taskbar;
    case "divider":
      return "el-divider";
    case "btngroup":
      return "el-button-group";
    case "txtsearch":
      return "el-input";
    case "cardlist":
      return "div";
    case "avatar":
      return "div";
    case "slider":
      return "el-slider";
    case "table":
      return "div";
    case "initPage":
      return initpage;
    case "webdesigner":
      return webdesigner;
    case "webrender":
      return webrender;
    case "suiteManageList":
      return suiteManageList;
    case "functionPrivilege":
      return functionPrivilege;
    case "devManageList":
      return devManageList;
    case "devHistory":
      return devHistory;
    case "devSetting":
      return devSetting;
    case "devMenu":
      return devMenu;
    case "functiongenerator":
      return functiongenerator;
    case "suiteManage":
      return suiteManage;
    default:
      return "div";
  }
};
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
.avatar-fit {
  display: flex;
  align-items: center;
}
.title {
  margin-left: 8px;
}
</style>
