import { createApp, h } from "vue";
import App from "./App.vue";
import request from "./core/Request";
import * as Draggable from "@/core/components/VForm/lib/vuedraggable/dist/vuedraggable.umd.js";
// 引入pinia
import pinia from "./core/pinia";

// 权限控制
import "./config/permission";
// 引入svg图标注册脚本
import "vite-plugin-svg-icons/register";
// 完整导入 UI 组件库

import "vxe-pc-ui/lib/style.css";
window.VxeUI = VxeUI;

import VxeUI from "vxe-pc-ui";
import "vxe-pc-ui/lib/style.css";
import VxeUITable from "vxe-table";
import "vxe-table/lib/style.css";

// 引入element-plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import webHash from "@/core/components/WebHash";
import "./assets/style/index.css";
// 以下是对 VForm 的组件【全局注册】
import ContainerItems from "@/core/components/VForm/form-render/container-item/index";
import ContainerWidgets from "@/core/components/VForm/form-designer/form-widget/container-widget/index";
import { debounceDirective } from './core/utils/debounce'
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.config.warnHandler = () => {
  return null;
}; //去除工作台打印的警告

app.component("draggable", Draggable);
app.provide("$request", request);
app.directive('debounce', debounceDirective)
app
  .use(ElementPlus)
  .use(pinia)
  .use(VxeUI)
  .use(VxeUITable)
  .use(ContainerWidgets)
  .use(ContainerItems)
  .use(webHash)
  .mount("#app");
