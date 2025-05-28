// menuButtonHelper.js
// 用于管理菜单按钮的添加和移除的工具函数

import { useApp } from '@/core/pinia/modules/app';

/**
 * 添加菜单切换按钮到页面头部
 * @param {number} delayMs 延迟时间，默认100毫秒
 * @param {string} selector 头部元素选择器，默认'.el-header'
 * @returns {HTMLElement|null} 返回添加的按钮元素，如果添加失败则返回null
 */
export function addMenuButton(delayMs = 100, selector = '.el-header') {
  const appStore = useApp();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const headerEl = document.querySelector(selector);
      if (!headerEl) {
        console.warn('无法找到头部元素:', selector);
        resolve(null);
        return;
      }
      
      // 避免重复添加
      const existingButton = headerEl.querySelector('.menu-toggle-btn');
      if (existingButton) {
        resolve(existingButton);
        return;
      }
      
      // 创建按钮
      const button = document.createElement('button');
      button.className = 'el-button el-button--default el-button--small menu-toggle-btn';
      button.innerHTML = '<i class="el-icon-menu"></i>菜单';
      button.style.marginRight = '10px';
      
      // 添加点击事件
      button.addEventListener('click', () => {
        appStore.toggleMenuDrawer();
      });
      
      // 添加到头部
      if (headerEl.firstChild) {
        headerEl.insertBefore(button, headerEl.firstChild);
      } else {
        headerEl.appendChild(button);
      }
      
      resolve(button);
    }, delayMs);
  });
}

/**
 * 移除菜单切换按钮
 * @param {string} selector 按钮选择器，默认'.menu-toggle-btn'
 * @returns {boolean} 是否成功移除
 */
export function removeMenuButton(selector = '.menu-toggle-btn') {
  const button = document.querySelector(selector);
  if (button) {
    button.remove();
    return true;
  }
  return false;
}

/**
 * 检查是否已添加菜单按钮
 * @param {string} selector 按钮选择器，默认'.menu-toggle-btn'
 * @returns {boolean} 是否已存在按钮
 */
export function hasMenuButton(selector = '.menu-toggle-btn') {
  return !!document.querySelector(selector);
}

/**
 * 根据布局模式自动添加或移除菜单按钮
 * @param {string} layoutMode 当前布局模式
 * @returns {Promise<HTMLElement|null>} 返回添加的按钮元素，如果是移除操作或添加失败则返回null
 */
export function updateMenuButtonByLayout(layoutMode) {
  if (layoutMode === 'wins') {
    return addMenuButton();
  } else {
    removeMenuButton();
    return Promise.resolve(null);
  }
}

/**
 * 初始化菜单按钮管理
 * 会自动根据当前布局模式决定是否添加按钮，并设置监听器
 * @param {Object} appStore Pinia app store实例
 * @returns {Function} 返回清理函数，用于取消监听
 */
export function initMenuButtonManager(appStore) {
  // 初始状态检查
  const initialMode = appStore.layoutConfig.layoutMode;
  if (initialMode === 'wins') {
    addMenuButton();
  }
  
  // 创建监听器
  const unwatch = appStore.$subscribe((mutation, state) => {
    if (mutation.type === 'direct' && state.layoutConfig.layoutMode !== undefined) {
      updateMenuButtonByLayout(state.layoutConfig.layoutMode);
    }
  });
  
  return unwatch;
}