import { ElLoading } from "element-plus";
import router from "@/core/components/WebHash/router";
import auth from "@/core/AuthManage";
import { getIntiInfo } from "@/api/init";

// 白名单，里面是路由对象的name
const WhiteList = ["login", "directFunction"];

let loadingInstance = null;

// vue-router4的路由守卫不再是通过next放行，而是通过return返回true或false或者一个路由地址
router.beforeEach(async (to, from) => {
  let { data: initData } = await getIntiInfo(); //每一次跳转链接 都到后台请求状态
  if (!to.name) return initData.flag;
  auth.setEnabled(initData.authenticationEnabled); // 记录当前是否启用权限套件
  if (initData.flag == "init" && to.name == "init") return true;
  if (initData.flag == "init") return "/init";
  if (!initData.authenticationEnabled) return true; //权限套件未激活,则所有路径都可进入

  if (WhiteList.includes(to.name)) {
    //白名单自由出入
    return true;
  }

  if (!initData.loggedIn) return "/login"; // 未登录则跳入登录页面

  if (to.name !== initData.flag) return initData.flag; //后台控制路由跳转

  loadingInstance = ElLoading.service({
    lock: true,
    // text: '正在加载数据，请稍候~',
    background: "rgba(0, 0, 0, 0.7)",
  });

  return true;
});

router.afterEach((to) => {
  loadingInstance && loadingInstance.close();
});
