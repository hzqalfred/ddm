import { defineStore } from 'pinia'

export const useWebDesigner = defineStore('designer', {
  state: () => ({
    searchVal: '',
    filterValue: '1',
    moduleId: '',
    moduleItemData: {},
    activeObject: {}
  }),
  actions: {

  },
})
