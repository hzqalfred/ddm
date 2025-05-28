<template>
  <el-dialog v-model="dialogVisible" title="Json编辑器" width="800" :append-to-body="true" :before-close="closeDialog">
    <div id ="editCode2">
      <Codemirror
        v-model:value="jsonCode"
        :options="{
          mode: 'application/json',
          matchBrackets: true,
          lineNumbers: false,
          lineWrapping: true,
          smartIndent: true
        }"
        height="360"
        border
        placeholder="使用JSON Schema规范校验参数"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeJsonEditor" :icon="Close">取消</el-button>
        <el-button type="primary" :icon="Select" @click="saveJsonEditor">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineEmits, defineExpose } from 'vue'
import { Close, Select } from '@element-plus/icons-vue'

import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/lib/codemirror.css'

import Codemirror from 'codemirror-editor-vue3'
import 'codemirror/addon/display/placeholder.js'
import 'codemirror/mode/sql/sql.js'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/sql-hint.js'
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/fold/brace-fold"
import "codemirror/addon/fold/foldcode"
import "codemirror/addon/fold/foldgutter"
import "codemirror/addon/fold/foldgutter.css"

const $emit = defineEmits(['selectJsonCode'])

let jsonCode = ref('')
let dialogVisible = ref(false)
const closeJsonEditor = () => {
  dialogVisible.value = false
}

const openJsonEditor = (code) => {
  jsonCode.value = code
  dialogVisible.value = true
}

const saveJsonEditor = () => {
  dialogVisible.value = false
  $emit('selectJsonCode',jsonCode.value)
}

defineExpose({ openJsonEditor })
</script>

<style>
#editCode2{
  .CodeMirror {
    line-height: 1em;
    font-family: monospace;
    margin-right: 1px;
    width:800px;
    height:100% ;
    font-size : 14px;
  }

  .CodeMirror-scroll {
    overflow: auto;
    padding-bottom: 0px;
    width:800px;
    height:100% ;
    position: relative;
  }
  .codemirror-container.bordered {
    border: 0px solid #aaaaaa;
  }
  .CodeMirror-foldgutter{
    width:0;
  }
}
</style>