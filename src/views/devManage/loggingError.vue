<!-- 异常日志 -->
<template>
  <div style="color:#F56C6C;">
  <iframe ref="infoIframe" :srcdoc="iframeContent" frameborder="0" width="100%" style="height: 500px;"></iframe>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive, inject,nextTick } from "vue";
import {
  errorFile,
} from "@/api/devManage";
import messageHandler from "@/core/Message";
import { VxeUI } from "vxe-pc-ui";
import router from "@/core/components/WebHash/router";
import auth from "@/core/AuthManage";
const homePage = ref(null);
let iframeContent =ref('')
let infoIframe = ref(null);
const fetchData = () => {
  errorFile({}).then((res) => {
    iframeContent.value = res
    nextTick(()=>{
      infoIframe.height = infoIframe.contentWindow.document.body.scrollHeight + 'px';
    })
  });
};

onMounted(() => {
  homePage.value = inject("homePage");
  fetchData();
});
</script>

