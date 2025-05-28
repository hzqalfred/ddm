<template>
  <div style="height: 100%">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from "vue";

// 初始化
onMounted(async () => {
  // 实例化并初始化 homePage
  $("#loadingPage").css("display", "none");
});
</script>

<style lang="scss">
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  * {
    outline: none;
  }
}
</style>
