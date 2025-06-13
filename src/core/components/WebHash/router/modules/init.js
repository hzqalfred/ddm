const Init = () => import("@/views/initPage.vue");
const mainlayout = () => import("@/views/mainlayout.vue");
const setting = () => import("@/views/setting.vue");
const functiongenerator = () => import( "@/core/components/functionGenerator.vue")
const directFunction = () => import("@/views/directFunction.vue");

export default [
  {
    path: "/init",
    name: "init",
    component: Init,
    meta: {
      title: "初始化",
    },
  },
  {
    path: "/main",
    name: "main",
    component: mainlayout,
    meta: {
      title: "运行",
    },
  },
  {
    path: "/setting",
    name: "setting",
    component: setting,
    meta: {
      title: "设置",
    },
  },
  {
    path: "/functiongenerator",
    name: "functiongenerator",
    component: functiongenerator,
    meta: {
      title: "功能生成器",
    },
  },
  {
    path: "/direct/:moduleCode/:functionCode",
    name: "directFunction",
    component: directFunction,
    meta: {
      title: "直接访问",
    },
  },
];
