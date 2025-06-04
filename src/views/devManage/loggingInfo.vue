<!-- 系统日志 -->
<template>
  <div>
  <iframe ref="infoIframe" :srcdoc="iframeContent" frameborder="0" width="100%" style="height: 500px;"></iframe>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive, inject,nextTick } from "vue";
import {
  logfile,
} from "@/api/devManage";
import messageHandler from "@/core/Message";
import { VxeUI } from "vxe-pc-ui";
import router from "@/core/components/WebHash/router";
import auth from "@/core/AuthManage";
const homePage = ref(null);
let iframeContent =ref('')
let infoIframe = ref(null);
const fetchData = () => {
  logfile({}).then((res) => {
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

