export const loginFormJson = {
  widgetList: [
    {
      key: 98722,
      type: "grid",
      category: "container",
      icon: "grid",
      cols: [
        {
          type: "grid-col",
          category: "container",
          icon: "grid-col",
          internal: true,
          widgetList: [
            {
              type: "static-text",
              icon: "static-text",
              category: "field",
              options: {
                name: "leftIllustration",
                title: "",
                comsize: "",
                status: "",
                icon: "",
                clickToCopy: false,
                hidden: false,
                fontFamily: "Arial, sans-serif",
                fontSize: 24,
                fontWeight: "bold",
                fontStyle: "normal",
                lineHeight: 1.5,
                comtextAlign: "center",
                textDecoration: "none",
                textTransform: "none",
                letterSpacing: 0,
                textIndent: 0,
                customClass: ["left-illustration-text"],
                label: "static-text",
              },
              id: "leftIllustration",
            },
          ],
          options: {
            name: "gridCol59831",
            hidden: false,
            span: 12,
            offset: 0,
            push: 0,
            pull: 0,
            responsive: false,
            md: 12,
            sm: 12,
            xs: 12,
            customClass: ["left-decoration"],
          },
          id: "grid-col-59831",
        },
        {
          type: "grid-col",
          category: "container",
          icon: "grid-col",
          internal: true,
          widgetList: [
            {
              key: 98722,
              type: "grid",
              category: "container",
              icon: "grid",
              cols: [
                {
                  type: "grid-col",
                  category: "container",
                  icon: "grid-col",
                  internal: true,
                  widgetList: [
                    {
                      type: "static-text",
                      icon: "static-text",
                      category: "field",
                      options: {
                        name: "platformTitle",
                        title: "CPII系统登录",
                        comsize: "",
                        status: "",
                        icon: "",
                        clickToCopy: false,
                        hidden: false,
                        fontFamily: "Arial, sans-serif",
                        fontSize: 24,
                        fontWeight: "bold",
                        fontStyle: "normal",
                        lineHeight: 1.5,
                        comtextAlign: "center",
                        textDecoration: "none",
                        textTransform: "none",
                        letterSpacing: 0,
                        textIndent: 0,
                        customClass: [
                          "platform-title",
                          "fade-in-up",
                          "delay-1",
                        ],
                        label: "static-text",
                      },
                      id: "platformTitle",
                    },
                  ],
                  options: {
                    name: "gridCol56155",
                    hidden: false,
                    span: 24,
                    offset: 0,
                    push: 0,
                    pull: 0,
                    responsive: false,
                    md: 12,
                    sm: 12,
                    xs: 12,
                    customClass: [],
                  },
                  id: "grid-col-56155",
                },
                {
                  type: "grid-col",
                  category: "container",
                  icon: "grid-col",
                  internal: true,
                  widgetList: [
                    {
                      type: "input",
                      icon: "input",
                      formItemFlag: true,
                      options: {
                        name: "username",
                        label: "",
                        labelAlign: "label-left-align",
                        type: "text",
                        defaultValue: "admin",
                        placeholder: "请输入账号",
                        columnWidth: "100%",
                        size: "",
                        labelWidth: 0,
                        labelHidden: true,
                        readonly: false,
                        disabled: false,
                        hidden: false,
                        clearable: true,
                        showPassword: false,
                        required: true,
                        requiredHint: "请输入账号",
                        validation: "",
                        validationHint: "",
                        customClass: ["login-input", "fade-in-up", "delay-2"],
                        labelIconClass: null,
                        labelIconPosition: "front",
                        labelTooltip: null,
                        minLength: 3,
                        maxLength: null,
                        showWordLimit: false,
                        prefixIcon: "vxe-icon-user",
                        suffixIcon: "",
                        appendButton: false,
                        appendButtonDisabled: false,
                        buttonIcon: "",
                        appendButtonType: "primary",
                        onCreated: "",
                        onMounted: "",
                        onInput: "",
                        onChange: "",
                        onFocus: "",
                        onBlur: "",
                        onAppendButtonClick: "",
                      },
                      id: "username",
                    },
                  ],
                  options: {
                    name: "gridCol12845",
                    hidden: false,
                    span: 24,
                    offset: 0,
                    push: 0,
                    pull: 0,
                    responsive: false,
                    md: 12,
                    sm: 12,
                    xs: 12,
                    customClass: [],
                  },
                  id: "grid-col-12845",
                },
                {
                  type: "grid-col",
                  category: "container",
                  icon: "grid-col",
                  internal: true,
                  widgetList: [
                    {
                      type: "password",
                      icon: "password",
                      formItemFlag: true,
                      options: {
                        name: "password",
                        label: "",
                        labelAlign: "label-left-align",
                        type: "password",
                        defaultValue: "",
                        placeholder: "请输入密码",
                        columnWidth: "100%",
                        size: "",
                        labelWidth: 0,
                        labelHidden: true,
                        readonly: false,
                        disabled: false,
                        hidden: false,
                        clearable: true,
                        showPassword: true,
                        required: true,
                        requiredHint: "请输入密码",
                        validation: "",
                        validationHint: "",
                        customClass: ["login-input", "fade-in-up", "delay-3"],
                        labelIconClass: null,
                        labelIconPosition: "front",
                        labelTooltip: null,
                        minLength: 5,
                        maxLength: null,
                        showWordLimit: false,
                        prefixIcon: "vxe-icon-lock",
                        suffixIcon: "",
                        appendButton: false,
                        appendButtonDisabled: false,
                        buttonIcon: "",
                        appendButtonType: "primary",
                        onCreated: "",
                        onMounted: "",
                        onInput: "",
                        onChange: "",
                        onFocus: "",
                        onBlur: "",
                        onAppendButtonClick: "",
                      },
                      id: "password",
                    },
                  ],
                  options: {
                    name: "gridCol26953",
                    hidden: false,
                    span: 24,
                    offset: 0,
                    push: 0,
                    pull: 0,
                    responsive: false,
                    md: 12,
                    sm: 12,
                    xs: 12,
                    customClass: [],
                  },
                  id: "grid-col-26953",
                },

                {
                  type: "grid-col",
                  category: "container",
                  icon: "grid-col",
                  internal: true,
                  widgetList: [
                    {
                      type: "static-text",
                      icon: "static-text",
                      category: "field",
                      options: {
                        name: "forgotPassword",
                        title: "忘记密码？",
                        comsize: "",
                        status: "",
                        icon: "",
                        clickToCopy: false,
                        hidden: false,
                        fontFamily: "Arial, sans-serif",
                        fontSize: 14,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        lineHeight: 1.5,
                        comtextAlign: "right",
                        textDecoration: "none",
                        textTransform: "none",
                        letterSpacing: 0,
                        textIndent: 0,
                        customClass: [
                          "forgot-password-link",
                          "fade-in-up",
                          "delay-5",
                        ],
                        label: "static-text",
                      },
                      id: "forgotPassword",
                    },
                  ],
                  options: {
                    name: "gridColForgot",
                    hidden: false,
                    span: 24,
                    offset: 0,
                    push: 0,
                    pull: 0,
                    responsive: false,
                    md: 12,
                    sm: 12,
                    xs: 12,
                    customClass: [],
                  },
                  id: "grid-col-forgot",
                },
                {
                  type: "grid-col",
                  category: "container",
                  icon: "grid-col",
                  internal: true,
                  widgetList: [
                    {
                      key: 78476,
                      type: "button",
                      icon: "button",
                      category: "field",
                      isnew: "9",
                      options: {
                        name: "loginButton",
                        title: "登录",
                        belongTo: "",
                        mode: "button",
                        float: "center",
                        comsize: "",
                        status: "primary",
                        round: false,
                        circle: false,
                        icon: "",
                        prefixTooltip: "",
                        suffixTooltip: "",
                        loading: false,
                        comdisabled: false,
                        hidden: false,
                        customClass: ["login-button", "fade-in-up", "delay-5"],
                        onCreated: "",
                        onMounted: "",
                        onClick: "",
                        label: "button",
                      },
                      id: "button71287",
                    },
                  ],
                  options: {
                    name: "gridCol45832",
                    hidden: false,
                    span: 24,
                    offset: 0,
                    push: 0,
                    pull: 0,
                    responsive: false,
                    md: 12,
                    sm: 12,
                    xs: 12,
                    customClass: [],
                  },
                  id: "grid-col-45832",
                },
                {
                  type: "grid-col",
                  category: "container",
                  icon: "grid-col",
                  internal: true,
                  widgetList: [
                    {
                      type: "static-text",
                      icon: "static-text",
                      category: "field",
                      options: {
                        name: "bottomLinks",
                        title: "返回首页 | 还没账号？去登录",
                        comsize: "",
                        status: "",
                        icon: "",
                        clickToCopy: false,
                        hidden: false,
                        fontFamily: "Arial, sans-serif",
                        fontSize: 14,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        lineHeight: 1.5,
                        comtextAlign: "center",
                        textDecoration: "none",
                        textTransform: "none",
                        letterSpacing: 0,
                        textIndent: 0,
                        customClass: ["bottom-links", "fade-in-up", "delay-6"],
                        label: "static-text",
                      },
                      id: "bottomLinks",
                    },
                  ],
                  options: {
                    name: "gridColBottom",
                    hidden: false,
                    span: 24,
                    offset: 0,
                    push: 0,
                    pull: 0,
                    responsive: false,
                    md: 12,
                    sm: 12,
                    xs: 12,
                    customClass: [],
                  },
                  id: "grid-col-bottom",
                },
              ],
              options: {
                name: "grid85814",
                hidden: false,
                gutter: 12,
                colHeight: null,
                customClass: [],
              },
              id: "grid85814",
            },
          ],
          options: {
            name: "gridCol79678",
            hidden: false,
            span: 12,
            offset: 0,
            push: 0,
            pull: 0,
            responsive: false,
            md: 12,
            sm: 12,
            xs: 12,
            customClass: ["login-panel"],
          },
          id: "grid-col-79678",
        },
      ],
      options: {
        name: "grid74043",
        hidden: false,
        gutter: 12,
        colHeight: "",
        customClass: ["bg"],
      },
      id: "grid74043",
    },
  ],
  formConfig: {
    modelName: "formData",
    refName: "vForm",
    rulesName: "rules",
    labelWidth: 120,
    labelPosition: "right",
    size: "",
    labelAlign: "label-right-align",
    cssCode: `/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container .grid-container.bg{
  padding:15vh 0 !important;
}

/* 背景和全局布局 */
.login-container .bg {
  width: 100%;
  height: 100vh;
  background: #F1F7FF;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-container .bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.h100 {
  height: 100vh;
}

.w100 {
  width: 100%;
}



/* 左侧装饰区域 */
.login-container .left-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  background: linear-gradient( 228deg, #73BAFF 0%, #0F63FF 100%);
  border-radius: 20px 0 0 20px;
  padding: 40px;
  min-height: 500px;
  height:100%;
}

.login-container .left-decoration::before {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: 10%;
  right: 10%;
  animation: float 3s ease-in-out infinite;
}

.login-container .left-decoration::after {
  content: '';
  position: absolute;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  bottom: 15%;
  left: 15%;
  animation: float 4s ease-in-out infinite reverse;
}
.login-container .field-wrapper{
  height:100%;
  width:100%;
}
.login-container .left-illustration-text {
  color: white !important;
  text-align: center !important;
  font-size: 22px !important;
  font-weight: 300 !important;
  line-height: 1.6 !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 3;
  position: relative;
  background-image:url('/public/img/login_bg.png');
  background-size:contain;
  background-repeat:no-repeat;
  background-position:center;
  height:100%;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* 登录面板样式 */
.login-container .login-panel {
  background-color: white;
  border-radius: 0 20px 20px 0;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 50px 40px;
  max-width: 400px;
  min-height: 500px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height:100%
}
  

/* 平台标题样式 */
.login-container .platform-title {
  color: #337FFF !important;
  margin-bottom: 40px !important;
  font-size: 24px !important;
  display: block;
  text-align: center !important;
  font-weight: 600 !important;
  letter-spacing: 1px;
}
.login-container .platform-title  .vxe-text--content{
  color: #337FFF !important;
}

/* 输入框样式 */
.login-container .login-input .vxe-input {
  border-radius: 8px !important;
  height: 50px !important;
  transition: all 0.3s;
  background-color: #f8f9fa !important;
  border: 1px solid #e9ecef !important;
  font-size: 14px !important;
  display:flex;
  align-items:center
}

.login-container .login-input .el-form-item__label::before{
    content:'' !important
}

.login-container .login-input .vxe-input:focus-within {
  border-color: #4f8ff7 !important;
  box-shadow: 0 0 0 2px rgba(79, 143, 247, 0.2) !important;
  background-color: white !important;
}

.login-container .login-input .vxe-input--prefix,.login-input .vxe-input--suffix{
    background-color: transparent;
}

.login-container .login-input .vxe-input--prefix-icon,
.login-container .captcha-input .vxe-input--prefix-icon {
  color: #6c757d !important;
  font-size: 16px !important;
  width:30px;
  text-align:center
}

.login-container .login-input,
.login-container .captcha-input {
  margin-bottom: 20px !important;
}

/* 验证码行样式 */
.login-container .captcha-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.login-container .captcha-input {
  flex: 1;
}

.login-container .captcha-row::after {
  content: '点击刷新';
  display: inline-block;
  width: 100px;
  height: 40px;
  background: linear-gradient(45deg, #4f8ff7, #0F63FF);
  color: white;
  text-align: center;
  line-height: 40px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.login-container .captcha-row::after:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 143, 247, 0.3);
}

/* 忘记密码链接 */
.login-container .forgot-password-link {
  color: #4f8ff7 !important;
  font-size: 14px !important;
  text-align: right !important;
  cursor: pointer;
  margin-bottom: 30px !important;
  transition: all 0.3s;
}

.login-container .forgot-password-link:hover {
  color: #2c5aa0 !important;
  text-decoration: underline !important;
}

/* 登录按钮样式 */
.login-container .login-button {
  width: 100% !important;
  height: 50px !important;
  border-radius: 8px !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  margin-bottom: 30px !important;
  background: linear-gradient(135deg, #4f8ff7 0%, #0F63FF 100%) !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(79, 143, 247, 0.3);
  transition: all 0.3s;
  color: white !important;
}

.login-container .login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 143, 247, 0.4);
}

.login-container .login-button .vxe-button--content {
  color: white !important;
}

.login-container .login-button > div {
  width: 100%;
  height: 100%;
}

.login-container .login-button button {
  background: transparent !important;
  border: none !important;  
  height: 100% !important;
  width: 100% !important;
  color: white !important;
}

/* 底部链接 */
.login-container .bottom-links {
  color: #6c757d !important;
  font-size: 14px !important;
  text-align: center !important;
  cursor: pointer;
  line-height: 1.5 !important;
}

.login-container .bottom-links:hover {
  color: #0F63FF !important;
}

/* 内容区动画 */
.login-container .fade-in-up {
  animation: slideUp 0.6s ease-out;
  animation-fill-mode: both;
}

.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }
.delay-5 { animation-delay: 0.5s; }
.delay-6 { animation-delay: 0.6s; }
.delay-7 { animation-delay: 0.7s; }

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media screen and (max-width: 992px) {
  .bg {
    padding: 20px;
  }
  
  .left-decoration {
    border-radius: 20px 20px 0 0;
    min-height: 200px;
  }
  
  .login-panel {
    border-radius: 0 0 20px 20px;
    padding: 30px 20px;
    min-height: auto;
  }
  
  .left-decoration,
  .login-panel {
    width: 100%;
    max-width: 400px;
  }
}

@media screen and (max-width: 768px) {
  .bg {
    flex-direction: column;
  }
  
  .left-decoration {
    order: 1;
    width: 100%;
    border-radius: 20px 20px 0 0;
  }
  
  .login-panel {
    order: 2;
    width: 100%;
    border-radius: 0 0 20px 20px;
  }
}`,
    customClass: ["h100", "w100"],
    functions: "",
    layoutType: "PC",
    jsonVersion: 3,
    onFormCreated: "",
    onFormMounted: "initLoginPage",
    onFormDataChange: "",
    serviceMap: {},
    moduleId: "test2_login",
    moduleName: "test2",
    moduleCode: "test2",
    functionCode: "login",
    eventMap: {
      "form.onLoad": "initLoginPage",
      "button71287.onClick": "loginButton.onClick",
      "password.onKeyEnter": "password.onKeyEnter",
    },
    globalObject: {
      "loginButton.onClick": `function() {
  // 获取表单数据
  try {
    let username = typeof this.formModel.username == 'string' ? this.formModel.username : this.formModel.username?.value || '';
    let password = typeof this.formModel.password == 'string' ? this.formModel.password : this.formModel.password?.value || '';
    
    // 表单验证
    if (!username) {
      this.Message.notifyError('请输入账号');
      return;
    }
    
    if (!password) {
      this.Message.notifyError('请输入密码');
      return;
    }
    
    // 显示加载状态
    const loginBtn = this.refList.loginButton;
    loginBtn.setWidgetOption('loading', true);
    
    this.request.postData('/permission/login', {
      username: this.dataCenter.encode(username),
      password: this.dataCenter.encode(password)
    }).then(res => {
      if (res.success) {
        if (this.dataCenter) this.dataCenter.postEvent('login-submit', {
          token: res.data.tokenValue,
          tokenName: res.data.tokenName,
          userInfo: res.data.userInfo
        });
        
        this.Message.notifySuccess(res.msg);
      } else {
        this.Message.notifyError(res.msg);
      }
    }).finally(() => {
      loginBtn.setWidgetOption('loading', false);
    });
  } catch (e) {
    const loginBtn = this.refList.loginButton;
    loginBtn.setWidgetOption('loading', false);
    this.Message.notifyError('登录失败，请重试');
  }
}`,
      initLoginPage: `function() {
  this.dataCenter.getkey();
  
  // 检查是否有保存的登录信息
  const savedUsername = localStorage.getItem('rememberedUser');
  
  if (savedUsername) {
    this.formData.username = savedUsername;
  }
}`,
      "password.onKeyEnter": `function(event) {
  // 按下回车键时触发登录
  if (event.key === 'Enter') {
    const loginBtn = this.refList.loginButton;
    if (loginBtn) {
      this.formConfig.globalObject['loginButton.onClick'].call(this);
    }
  }
}`,
      "captcha.onKeyEnter": `function(event) {
  // 按下回车键时触发登录
  if (event.key === 'Enter') {
    const loginBtn = this.refList.loginButton;
    if (loginBtn) {
      this.formConfig.globalObject['loginButton.onClick'].call(this);
    }
  }
}`,
      refreshCaptcha: `function() {
  // 刷新验证码的逻辑
  // 这里可以调用后端接口获取新的验证码
  console.log('刷新验证码');
}`,
    },
  },
};
