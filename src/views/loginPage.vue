<!-- views/loginPage.vue -->
<template>
    <div class="login-container">
      <web-render
        :data-center="dataCenter"
        :data="loginPageData"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import WebRender from '@/views/webRender.vue';
  import { useRouter, useRoute } from 'vue-router';
  import { DataCenter } from '@/core/DataCenter';
  import auth from '@/core/AuthManage';
  import { loginFormJson } from '@/config/loginForm';
  
  const router = useRouter();
  const route = useRoute();
  const dataCenter = new DataCenter('login-form');
  
  // 构造WebRender所需的登录页数据
  const loginPageData = reactive({
    id: 'login-form',
    param: {
      moduleName: 'system',
      moduleCode: 'system',
      functionCode: 'login',
      formJson: loginFormJson  // 直接传入表单的JSON配置
    },
    code: 'webrender',
    origin: true
  });
  
  // 监听登录成功事件
  onMounted(() => {
    dataCenter.subscribe('login-submit', (tokenInfo) => {
      // 处理登录成功，存储token
      auth.setToken(tokenInfo.token, tokenInfo.tokenName);
      auth.setInfo(tokenInfo.userInfo)
      // 跳转到目标页面或默认首页
      const redirectPath = route.query.redirect || '/main';
      router.push(redirectPath);
    });
    
    // 监听登录失败事件
    dataCenter.subscribe('login-error', (errorMsg) => {
      console.error('登录失败:', errorMsg);
    });
  });
  </script>
  
  <style scoped>
  .login-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  </style>