// stores/formCenter.js
import { defineStore } from 'pinia';
import { DataCenter } from '@/core/DataCenter';

export const useFormCenterStore = defineStore('formCenter', {
  state: () => ({
    dataCenters: new Map(),
    activeFormId: null,
  }),

  getters: {
    // 获取指定表单的 DataCenter
    getDataCenter: (state) => {
      return (formId) => state.dataCenters.get(formId);
    },

    // 获取所有 DataCenter 实例
    getAllDataCenters: (state) => {
      return Array.from(state.dataCenters.entries()).map(([id, dc]) => ({
        id,
        dataCenter: dc
      }));
    },

    // 获取当前活动表单的 DataCenter
    getActiveDataCenter: (state) => {
      return state.activeFormId ? state.dataCenters.get(state.activeFormId) : null;
    },
  },

  actions: {
    // 注册 DataCenter 实例
    registerDataCenter(formId, dataCenter) {
      if (!this.dataCenters.has(formId)) {
        this.dataCenters.set(formId, dataCenter);
      }
    },

    // 注销 DataCenter 实例
    unregisterDataCenter(formId) {
      const dataCenter = this.dataCenters.get(formId);
      if (dataCenter) {
        // 清理相关资源
        dataCenter.resetData();
        this.dataCenters.delete(formId);
        
        // 如果当前活动表单被注销，清除activeFormId
        if (this.activeFormId === formId) {
          this.activeFormId = null;
        }
      }
    },

    // 设置活动表单
    setActiveForm(formId) {
      if (this.dataCenters.has(formId)) {
        this.activeFormId = formId;
      }
    },

    // 创建新的 DataCenter 实例
    createDataCenter(formId, options = {}) {
      if (!this.dataCenters.has(formId)) {
        const dataCenter = new DataCenter(formId, {
          enableValidation: true,
          autoSync: true,
          ...options
        });
        this.registerDataCenter(formId, dataCenter);
        return dataCenter;
      }
      return this.dataCenters.get(formId);
    },

    // 更新指定表单的数据
    updateFormData(formId, data, options = {}) {
      const dataCenter = this.dataCenters.get(formId);
      if (dataCenter) {
        dataCenter.setData(data, options);
        return true;
      }
      return false;
    },

    // 验证指定表单
    async validateForm(formId, fields = null) {
      const dataCenter = this.dataCenters.get(formId);
      if (dataCenter) {
        return await dataCenter.validateData(fields);
      }
      return { isValid: false, errors: { _global: '表单不存在' } };
    },

    // 重置指定表单
    resetForm(formId) {
      const dataCenter = this.dataCenters.get(formId);
      if (dataCenter) {
        dataCenter.resetData();
        return true;
      }
      return false;
    },

    // 提交指定表单数据
    async submitForm(formId, options = {}) {
      const dataCenter = this.dataCenters.get(formId);
      if (dataCenter) {
        return await dataCenter.submitData(options);
      }
      return { success: false, error: '表单不存在' };
    },

    // 清理所有表单
    clearAllForms() {
      this.dataCenters.forEach(dataCenter => {
        dataCenter.resetData();
      });
      this.dataCenters.clear();
      this.activeFormId = null;
    }
  }
});