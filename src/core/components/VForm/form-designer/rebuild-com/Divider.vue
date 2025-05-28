<template>
    <div
      :id="id"
      class="divider-container"
      :class="[
        direction === 'vertical' ? 'vertical' : 'horizontal',
        `align-${align}`,
        `style-com-${styleType}`,
      ]"
      :style="{
        width: direction === 'horizontal' ? width : 'auto',
        height: direction === 'vertical' ? height : 'auto',
        borderColor: lineColor,
      }"
    >
      <!-- 水平分割线：主标题在上、副标题在下 -->
      <template v-if="direction === 'horizontal'">
        <div v-if="['1', '2', '3', '4'].includes(styleType)" style="width: 100%;">
            <div v-if="title" class="divider-title" :style="{ color: titleColor, justifyContent: align}">
                <i v-if="icon" :class="icon" class="divider-icon"></i>
                {{ title }}
            </div>
            <div class="divider-line" :style="{color:lineColor}"></div>
        </div>
        <div v-else-if="styleType == '5'" style="width: 100%;">
            <div class="sep-line style5" style="display: flex;width: 100%;">
                    <div class="sep-label" :style="{color: titleColor, backgroundColor:lineColor}">
                        <div v-if="title" class="divider-title" :style="{ color: titleColor }">
                            <i v-if="icon" :class="icon" class="divider-icon"></i>
                            {{ title }}
                        </div>
                    </div>
                    <div class="sep-right">
                        <div class="right-triangle" :style="{backgroundColor: lineColor}"></div>
                        <div class="right-line" :style="{borderColor: lineColor}"></div>
                        <div class="right-parallelogram1" :style="{backgroundColor: lineColor}"></div>
                        <div class="right-parallelogram2" :style="{backgroundColor: lineColor}"></div>
                        <div class="right-parallelogram3" :style="{backgroundColor: lineColor}"></div>
                    </div>
                </div>
        </div>
            
        <div v-else-if="styleType == '6'" style="width: 100%;">
            <div v-if="title" class="divider-title" :style="{ color: titleColor }">
                <i v-if="icon" :class="icon" class="divider-icon"></i>
                {{ title }}
            </div>
            <div class="sep-line style6" style="">
                <div class="sep-bg-wrapper" style="">
                    <div class="sep-bg" :style="{borderColor: lineColor}"></div>
                </div>
                <div class="sep-label" :style="{color: titleColor, backgroundColor:lineColor}">
                    
                </div>
            </div>
        </div>

        <div v-else-if="styleType == '7'" style="width: 100%;">
            <div class="sep-line style7" style="">
                    <div class="sep-bg-wrapper" style="">
                        <div class="sep-bg" :style="{backgroundColor: lineColor}"></div>
                    </div>
                    <div class="sep-label" :style="{color: titleColor, backgroundColor:lineColor}">
                        <div v-if="title" class="divider-title" :style="{ color: titleColor }">
                            <i v-if="icon" :class="icon" class="divider-icon"></i>
                            {{ title }}
                        </div>
                </div>
            </div>
        </div>

        <div v-else-if="styleType == '8'" style="width: 100%;">
            <div class="sep-line style8" style="">
                <div class="sep-bg" :style="{backgroundColor: lineColor}"></div>
                <div class="sep-center" style="">
                    <div class="sep-label" :style="{color: titleColor, backgroundColor:lineColor}">
                        <div v-if="title" class="divider-title" :style="{ color: titleColor }">
                            <i v-if="icon" :class="icon" class="divider-icon"></i>
                            {{ title }}
                        </div>
                    </div>
                    <div class="left-triangle" :style="{backgroundColor: lineColor}"></div>
                    <div class="left-border" :style="{backgroundColor: lineColor}"></div>
                    <div class="right-triangle" :style="{backgroundColor: lineColor}"></div>
                    <div class="right-border" :style="{backgroundColor: lineColor}"></div>
                </div>
            </div>
        </div>

        <div v-else-if="styleType == '9'" style="width: 100%;">
            <div class="sep-line style9" style="">
                <div class="left-wrapper" style="">
                    <div class="left-block" :style="{backgroundColor: lineColor}"></div>
                    <div class="left-triangle" :style="{backgroundColor: lineColor}"></div>
                    <div class="left-square"></div>
                    <div class="left-line1" :style="{borderColor: lineColor}"></div>
                    <div class="left-line2" :style="{borderColor: lineColor}"></div>
                </div>
                <div class="sep-label" :style="{color: titleColor, backgroundColor:lineColor}">
                    <span>分割线</span>
                </div>
                <div class="right-wrapper">
                    <div class="right-block" :style="{backgroundColor: lineColor}"></div>
                    <div class="right-triangle" :style="{backgroundColor: lineColor}"></div>
                    <div class="right-square"></div>
                    <div class="right-line1" :style="{borderColor: lineColor}"></div>
                    <div class="right-line2" :style="{borderColor: lineColor}"></div>
                </div>
            </div>
        </div>

        <div v-if="subtitle" class="divider-subtitle" :style="{ color: subtitleColor }">
          {{ subtitle }}
        </div>
      </template>
  
      <!-- 已去除分割线方向 -->
      <!-- 垂直分割线：主标题在左、副标题在右 -->
      <template v-else>
        <div class="divider-vertical-wrapper">
          <div v-if="title" class="divider-title-vertical" :style="{ color: titleColor }">
            <i v-if="icon" :class="icon" class="divider-icon"></i>
            {{ title }}
          </div>
          <div class="divider-line-vertical"></div>
          <div v-if="subtitle" class="divider-subtitle-vertical" :style="{ color: subtitleColor }">
            {{ subtitle }}
          </div>
        </div>
      </template>
    </div>
  </template>


  <script setup>
  import { defineProps } from 'vue'
  import { VxeUI } from 'vxe-pc-ui'
  defineProps({
    id: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '1px',
    },
    align: {
      type: String,
      default: 'center', // 'left', 'center', 'right'
      validator: (value) => ['left', 'center', 'right'].includes(value),
    },
    direction: {
      type: String,
      default: 'horizontal', // 'horizontal', 'vertical'
      validator: (value) => ['horizontal', 'vertical'].includes(value),
    },
    lineColor: {
      type: String,
      default: '#ccc',
    },
    titleColor: {
      type: String,
      default: '#333',
    },
    subtitleColor: {
      type: String,
      default: '#666',
    },
    icon: {
      type: String,
      default: '',
    },
    styleType: {
      type: Number,
      default: 3,
    },
  })
  </script>
  
  <style scoped>
 /* =============== 水平分割线 =============== */
.divider-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 默认居中 */
  position: relative;
  margin: 8px 0;
}

.horizontal {
  width: 100%;
}

/* 对齐控制修正：horizontal 模式 */
.align-left {
  align-items: flex-start;
}
.align-center {
  align-items: center;
}
.align-right {
  align-items: flex-end;
}

.divider-title,
.divider-subtitle {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 水平线 */
.divider-line {
  width: 100%;
  height: 1px;
  margin: 2px 0; /* 主副标题间距减少 */
}

/* =============== 垂直分割线 =============== */
.divider-vertical-wrapper {
  display: flex;
  flex-direction: row; /* 左右排列 */
  align-items: center;
  height: 100%;
}

/* 对齐控制修正：vertical 模式 */
.vertical.align-left {
  justify-content: flex-start;
}
.vertical.align-center {
  justify-content: center;
}
.vertical.align-right {
  justify-content: flex-end;
}

/* 垂直线 */
.divider-line-vertical {
  width: 1px;
  height: 100%;
  margin: 0 4px;
}

.divider-title-vertical,
.divider-subtitle-vertical {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* --- Icon 样式 --- */
.divider-icon {
  font-size: 16px;
}

.divider-title {
    font-size: 16px;
  font-weight: bold;
  padding: 0 10px;
}
.divider-line {
    padding: 0 10px;
}
.divider-subtitle {
    font-size: 14px;
    padding: 0 10px;
}


/* ================== 样式1：无线 ================== */
.style-com-1 .divider-line {
  display: none;
}

/* ================== 样式2：虚线 ================== */
.style-com-2 .divider-line {
    border-top: 1px dashed;
}

/* ================== 样式3：直线 ================== */
.style-com-3 .divider-line {
    border-top: 1px solid;
}

/* ================== 样式4：加粗直线 ================== */
.style-com-4 .divider-line {
    border-top: 2px solid;
}

/* ================== 样式5："波块"直线 ================== */
.sep-line style5 {
    display: flex;
    height: 28px;
    position: relative;
}

.sep-line.style5 .sep-label{
    -webkit-box-flex: 0;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    -ms-flex: none;
    flex: none;
    height: 100%;
    line-height: 28px;
    max-width: 80%;
    min-width: 7%;
    overflow: hidden;
    padding: 0 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.sep-line.style5 .sep-right {
    -webkit-box-flex: 1;
    -ms-flex: auto;
    flex: auto;
    position: relative;
}
.sep-line.style5 .sep-right .right-triangle {
    height: 100%;
    -webkit-transform: skew(26deg) translateX(-50%);
    transform: skew(26deg) translateX(-50%);
    width: 15px;
}
.sep-line.style5 .sep-right .right-line {
    border-bottom: 3px solid;
    bottom: 0;
    height: 0;
    left: 0;
    position: absolute;
    right: 0;
}
.sep-line.style5 .sep-right .right-parallelogram1 {
    height: 22px;
    left: 15px;
    opacity: .9;
    position: absolute;
    top: 0;
    -webkit-transform: skew(26deg) translateX(-50%);
    transform: skew(26deg) translateX(-50%);
    width: 8px;
}
.sep-line.style5 .sep-right .right-parallelogram2 {
    height: 22px;
    left: 27px;
    opacity: .6;
    position: absolute;
    top: 0;
    -webkit-transform: skew(26deg) translateX(-50%);
    transform: skew(26deg) translateX(-50%);
    width: 8px;
}
.sep-line.style5 .sep-right .right-parallelogram3 {
    height: 22px;
    left: 39px;
    opacity: .3;
    position: absolute;
    top: 0;
    -webkit-transform: skew(26deg) translateX(-50%);
    transform: skew(26deg) translateX(-50%);
    width: 8px;
}

/* ================== 样式6：重头细线 ================== */
.sep-line.style6 {
    height: 8px;
    position: relative;
}
.sep-line.style6 .sep-bg-wrapper {
    bottom: 0;
    left: 0;
    padding-left: 8px;
    position: absolute;
    right: 0;
}
.sep-line.style6 .sep-bg-wrapper .sep-bg {
    border-bottom: 4px solid;
    height: 0;
    opacity: .2;
    width: 100%;
}
.sep-line.style6 .sep-label {
    border-radius: 0 8px;
    bottom: 0;
    left: 0;
    max-width: 81%;
    min-width: 8%;
    overflow: hidden;
    position: absolute;
    text-overflow: ellipsis;
    top: 0;
    white-space: nowrap;
}


/* ================== 样式7：重头粗线 ================== */
.sep-line.style7 {
    height: 28px;
    position: relative;
}

.sep-line.style7 .sep-bg-wrapper {
    bottom: 0;
    left: 0;
    padding-left: 20px;
    position: absolute;
    right: 0;
    top: 0;
}
.sep-line.style7 .sep-bg-wrapper .sep-bg {
    height: 100%;
    opacity: .2;
    width: 100%;
}


.sep-line.style7 .sep-label {
    border-radius: 14px 0;
    bottom: 0;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    font-weight: 600;
    left: 0;
    line-height: 28px;
    max-width: 76%;
    min-width: 7%;
    overflow: hidden;
    padding: 0 20px;
    position: absolute;
    text-overflow: ellipsis;
    top: 0;
    white-space: nowrap;
}

/* ================== 样式8：屋顶分割 ================== */
.sep-line.style8 {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 38px;
    justify-content: center;
    position: relative;
}

.sep-line.style8 .sep-bg {
    border-radius: 16px 16px 0 0;
    bottom: 0;
    height: 28px;
    left: 0;
    opacity: .15;
    position: absolute;
    right: 0;
}

.sep-line.style8 .sep-center {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    max-width: 50%;
    min-width: 7%;
    overflow: hidden;
    padding: 0 38px;
    position: relative;
}

.sep-line.style8 .sep-center .sep-label {
    font-weight: 600;
    height: 100%;
    line-height: 38px;
    overflow: hidden;
    padding: 0 1px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.sep-line.style8 .sep-center .left-triangle {
    height: 10px;
    left: 0;
    position: absolute;
    top: 0;
    -webkit-transform: skew(-60deg) translateX(50%);
    transform: skew(-60deg) translateX(50%);
    width: 18px;
}

.sep-line.style8 .sep-center .left-border {
    border-radius: 0 0 0 16px;
    bottom: 0;
    left: 18px;
    position: absolute;
    top: 0;
    width: 21px;
}

.sep-line.style8 .sep-center .right-triangle {
    height: 10px;
    position: absolute;
    right: 0;
    top: 0;
    -webkit-transform: skew(60deg) translateX(-50%);
    transform: skew(60deg) translateX(-50%);
    width: 18px;
}

.sep-line.style8 .sep-center .right-border {
    border-radius: 0 0 16px;
    bottom: 0;
    position: absolute;
    right: 18px;
    top: 0;
    width: 21px;
}

/* ================== 样式9：流式分割 ================== */
.sep-line.style9 {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 28px;
    justify-content: center;
    overflow: hidden;
    position: relative;
}
.sep-line.style9 .left-wrapper {
    -webkit-box-flex: 0;
    -ms-flex: none;
    flex: none;
    position: relative;
    width: 151px;
}
.sep-line.style9 .left-wrapper .left-block {
    bottom: 0;
    position: absolute;
    right: -1px;
    top: 0;
    width: 53px;
}.sep-line.style9 .left-wrapper .left-triangle {
    height: 20px;
    position: absolute;
    right: 52px;
    top: 0;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transform-origin: 100% 0;
    transform-origin: 100% 0;
    width: 20px;
} 
.sep-line.style9 .left-wrapper .left-square {
    background: var(--fd-color-bg-container);
    height: 10px;
    position: absolute;
    right: 45px;
    top: 9px;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    width: 10px;
}
.sep-line.style9 .left-wrapper .left-line1 {
    border-top: 1px solid;
    height: 0;
    left: 27px;
    position: absolute;
    top: 9px;
    width: 48px;
}
.sep-line.style9 .left-wrapper .left-line2 {
    border-bottom: 1px solid;
    bottom: 8px;
    height: 0;
    left: 0;
    position: absolute;
    width: 75px;
}
.sep-line.style9 .sep-label {
    font-weight: 600;
    height: 100%;
    line-height: 28px;
    max-width: 54%;
    min-width: 10%;
    overflow: hidden;
    padding: 0 1px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.sep-line.style9 .right-wrapper {
    -webkit-box-flex: 0;
    -ms-flex: none;
    flex: none;
    position: relative;
    width: 151px;
}
.sep-line.style9 .right-wrapper .right-block {
    bottom: 0;
    left: -1px;
    position: absolute;
    top: 0;
    width: 53px;
}
.sep-line.style9 .right-wrapper .right-triangle {
    height: 20px;
    left: 52px;
    position: absolute;
    top: 0;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    width: 20px;
}
.sep-line.style9 .right-wrapper .right-square {
    background: var(--fd-color-bg-container);
    height: 10px;
    left: 45px;
    position: absolute;
    top: 9px;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    width: 10px;
}
.sep-line.style9 .right-wrapper .right-line1 {
    border-top: 1px solid;
    height: 0;
    position: absolute;
    right: 27px;
    top: 9px;
    width: 48px;
}
.sep-line.style9 .right-wrapper .right-line2 {
    border-bottom: 1px solid;
    bottom: 8px;
    height: 0;
    position: absolute;
    right: 0;
    width: 75px;
}






  </style>
  