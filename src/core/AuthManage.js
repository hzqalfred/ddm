// authManage.js
export function createAuthManage() {
  let token = "";
  let expiryTime = 0;
  let userInfo = {};
  let authenticationEnabled = false

  const setEnabled = (flag) => {
    authenticationEnabled = flag;
    // 保存到本地存储
  };

  const getEnabled = () => authenticationEnabled;

  const setToken = (newToken, tokenName) => {
    token = newToken;
    // 保存到本地存储
    localStorage.setItem(tokenName, newToken);
  };

  const getToken = () => token;

  const setInfo = (info) => {
    userInfo = info;
    // 保存到本地存储
    localStorage.setItem("userInfo",JSON.stringify(info) );
  };

  const getInfo = () => userInfo;

  const validateToken = () => {
    if (!token) return false;

    // 检查令牌是否过期
    const now = new Date().getTime();
    return now < expiryTime;
  };
  // 登出方法
  const logout = () => {
    token = "";
    expiryTime = 0;
    userInfo = {};
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userInfo");
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const hasPermission = (permission) => {
    // 模拟权限验证，实际可以根据业务逻辑调整
    return permission === "admin"; // 示例逻辑
  };

  return {
    setEnabled,
    getEnabled,
    setToken,
    getToken,
    setInfo,
    getInfo,
    logout,
    validateToken,
    hasPermission,
  };
}
export default createAuthManage();
