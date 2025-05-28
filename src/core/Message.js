import { ElMessage, ElMessageBox } from "element-plus";

// 创建工厂函数，返回消息提示和确认框相关的功能
export function createMessageHandler(options = {}) {
  // 设置默认值
  const messageTypes = {
    success: {
      type: "success",
      icon: "el-icon-success",
      duration: 3000,
      message: "操作成功",
    },
    error: {
      type: "error",
      icon: "el-icon-error",
      duration: 3000,
      message: "操作失败",
    },
    warning: {
      type: "warning",
      icon: "el-icon-warning",
      duration: 3000,
      message: "请注意检查",
    },
    info: {
      type: "info",
      icon: "el-icon-info",
      duration: 3000,
      message: "这是信息提示",
    },
  };

  const defaultDuration = options.duration || 3000; // 默认的消息持续时间
  const defaultMessageType = options.type || "info"; // 默认的消息类型
  function confirmDelete(message, confirmCallback, cancelCallback = null) {
    VxeUI.modal.confirm({
      title: "删除确认",
      content: message,
      type: "warning",
      draggable: false,
      onConfirm: confirmCallback,
      onCancel: cancelCallback,
    });
  }
  function confirmWithSlot(
    message,
    title,
    confirmCallback = null,
    cancelCallback = null
  ) {
     ElMessageBox.prompt(message, title, {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(({ value }) => {
     confirmCallback && confirmCallback(value)
    })
    .catch(() => {
      cancelCallback && cancelCallback()
    })
  }
  // 显示消息
  function showMessage(
    type = defaultMessageType,
    message = "",
    duration = defaultDuration
  ) {
    const msg = messageTypes[type] || messageTypes[defaultMessageType];
    ElMessage({
      message: message || msg.message,
      type: type,
      iconClass: msg.icon,
      duration: duration,
    });
  }

  // 显示消息框（确认框）
  function showMessageBox(
    type = "info",
    message = "",
    title = "提示",
    confirmCallback = null,
    cancelCallback = null
  ) {
    const msg = messageTypes[type] || messageTypes["info"];
    ElMessageBox.confirm(message || msg.message, title, {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: type,
      iconClass: msg.icon,
    })
      .then(() => {
        if (confirmCallback) confirmCallback(); // 调用确认按钮的回调
      })
      .catch(() => {
        if (cancelCallback) cancelCallback(); // 调用取消按钮的回调
      });
  }

  // 成功消息
  function notifySuccess(message = "操作成功", duration = defaultDuration) {
    showMessage("success", message, duration);
  }

  // 错误消息
  function notifyError(message = "操作失败", duration = defaultDuration) {
    showMessage("error", message, duration);
  }

  // 警告消息
  function notifyWarning(message = "警告信息", duration = defaultDuration) {
    showMessage("warning", message, duration);
  }

  // 信息消息
  function notifyInfo(message = "信息提示", duration = defaultDuration) {
    showMessage("info", message, duration);
  }

  // 确认框提示
  function confirmAction(
    message = "确认操作吗？",
    title = "确认",
    confirmCallback = null,
    cancelCallback = null
  ) {
    showMessageBox("info", message, title, confirmCallback, cancelCallback);
  }

  // 错误处理
  function handleError(error, callback = null) {
    console.error("发生错误:", error);
    notifyError("系统发生错误，请稍后重试");
    if (callback) callback(error);
  }

  // 异常处理
  function handleException(exception, callback = null) {
    notifyError("系统异常，请联系管理员");
    console.error("系统异常:", exception);
    if (callback) callback(exception);
  }

  // 关闭所有消息
  function closeAllMessages() {
    ElMessage.closeAll();
  }

  // 返回所有需要的函数
  return {
    confirmWithSlot,
    confirmDelete,
    showMessage,
    showMessageBox,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    confirmAction,
    handleError,
    handleException,
    closeAllMessages, // 新增的关闭所有消息的方法
  };
}

export default createMessageHandler();
