//import { vfApp } from '@/core/utils/create-app'

import { addContainerWidgetSchema, addCustomWidgetSchema } from '@/core/components/VForm/form-designer/widget-panel/widgetsConfig'
import * as PERegister from '@/core/components/VForm/form-designer/setting-panel/propertyRegister'
import * as PEFactory from '@/core/components/VForm/form-designer/setting-panel/property-editor-factory.jsx'

import { registerCWGenerator } from '../sfc-generator'
import { registerFWGenerator } from '../sfc-generator'

import { cardSchema } from './samples/extension-schema.js'
import CardWidget from './samples/card/card-widget.vue'
import CardItem from './samples/card/card-item.vue'
import { cardTemplateGenerator } from './samples/extension-sfc-generator'

import { alertSchema } from './samples/extension-schema.js'
import AlertWidget from './samples/alert/alert-widget.vue'
import { alertTemplateGenerator } from './samples/extension-sfc-generator'

import { selectwinSchema } from './samples/extension-schema.js'
import SelectwinWidget from './samples/selectwin/selectwin-widget.vue'
import { seletwinTemplateGenerator } from './samples/extension-sfc-generator'

import { autocompleteSchema } from './samples/extension-schema.js'
import autocompleteWidget from './samples/autocomplete/autocomplete-widget.vue'
import { autocompleteTemplateGenerator } from './samples/extension-sfc-generator'

import { subgridSchema } from './samples/extension-schema.js'
import SubgridWidget from './samples/subgrid/subgrid-widget.vue'
import { subgridTemplateGenerator } from './samples/extension-sfc-generator'

import { qrcodeSchema } from './samples/extension-schema.js'
import qrcodeWidget from './samples/qrcode/qrcode-widget.vue'
import { qrcodeTemplateGenerator } from './samples/extension-sfc-generator'

import { barcodeSchema } from './samples/extension-schema.js'
import barcodeWidget from './samples/barcode/barcode-widget.vue'
import { barcodeTemplateGenerator } from './samples/extension-sfc-generator'

import { universalSchema } from './samples/extension-schema.js'
import UniversalWidget from './samples/universal/universal-widget.vue'
import { universalTemplateGenerator } from './samples/extension-sfc-generator'

const loadExtension = function(app) {
  /**
   * 加载容器组件步骤：
   * 1. 加载组件Json Schema;
   * 2. 全局注册容器组件，容器组件有两种状态——设计期和运行期，故需要注册两个组件；
   * 3. 全局注册属性编辑器组件（基本属性、高级属性、事件属性）；
   * 4. 注册容器组件的代码生成器；
   * 5. 加载完毕。
   */
  addContainerWidgetSchema(cardSchema) //加载组件Json Schema
  /* -------------------------------------------------- */
  app.component(CardWidget.name, CardWidget) //注册设计期的容器组件
  app.component(CardItem.name, CardItem) //注册运行期的容器组件
  /* -------------------------------------------------- */
  PERegister.registerCPEditor(app, 'card-folded', 'card-folded-editor', PEFactory.createBooleanEditor('folded', 'extension.setting.cardFolded'))

  PERegister.registerCPEditor(app, 'card-showFold', 'card-showFold-editor', PEFactory.createBooleanEditor('showFold', 'extension.setting.cardShowFold'))

  PERegister.registerCPEditor(app, 'card-cardWidth', 'card-cardWidth-editor', PEFactory.createInputTextEditor('cardWidth', 'extension.setting.cardWidth'))

  let shadowOptions = [
    { label: 'never', value: 'never' },
    { label: 'hover', value: 'hover' },
    { label: 'always', value: 'always' }
  ]
  PERegister.registerCPEditor(app, 'card-shadow', 'card-shadow-editor', PEFactory.createSelectEditor('shadow', 'extension.setting.cardShadow', { optionItems: shadowOptions }))
  /* -------------------------------------------------- */
  registerCWGenerator('card', cardTemplateGenerator) //注册容器组件的代码生成器
  /* -------------------------------------------------- */
  /* 容器组件加载完毕 end */

  /**
   * 加载字段组件步骤：
   * 1. 加载组件Json Schema;
   * 2. 全局注册字段组件，字段组件设计期和运行期共用，故仅需注册一个组件；
   * 3. 全局注册属性编辑器组件（基本属性、高级属性、事件属性）；
   * 4. 注册字段组件的代码生成器；
   * 5. 加载完毕。
   */
  addCustomWidgetSchema(alertSchema) //加载组件Json Schema
  /* -------------------------------------------------- */
  app.component(AlertWidget.name, AlertWidget) //注册组件
  /* -------------------------------------------------- */
  PERegister.registerCPEditor(app, 'alert-title', 'alert-title-editor', PEFactory.createInputTextEditor('title', 'extension.setting.alertTitle'))

  let typeOptions = [
    { label: 'success', value: 'success' },
    { label: 'warning', value: 'warning' },
    { label: 'info', value: 'info' },
    { label: 'error', value: 'error' }
  ]
  // PERegister.registerCPEditor(app, 'alert-type', 'alert-type-editor',
  //     PEFactory.createSelectEditor('type', 'extension.setting.alertType',
  //         {optionItems: typeOptions}))
  /* type属性映射已存在，无须再注册，故只需注册属性编辑器即可！！ */
  app.component('alert-type-editor', PEFactory.createSelectEditor('type', 'extension.setting.alertType', { optionItems: typeOptions }))

  PERegister.registerCPEditor(app, 'alert-description', 'alert-description-editor', PEFactory.createInputTextEditor('description', 'extension.setting.description'))

  PERegister.registerCPEditor(app, 'alert-closable', 'alert-closable-editor', PEFactory.createBooleanEditor('closable', 'extension.setting.closable'))

  PERegister.registerCPEditor(app, 'alert-closeText', 'alert-closeText-editor', PEFactory.createInputTextEditor('closeText', 'extension.setting.closeText'))

  PERegister.registerCPEditor(app, 'alert-center', 'alert-center-editor', PEFactory.createBooleanEditor('center', 'extension.setting.center'))

  PERegister.registerCPEditor(app, 'alert-showIcon', 'alert-showIcon-editor', PEFactory.createBooleanEditor('showIcon', 'extension.setting.showIcon'))

  let effectOptions = [
    { label: 'light', value: 'light' },
    { label: 'dark', value: 'dark' }
  ]
  PERegister.registerCPEditor(
    app,
    'alert-effect',
    'alert-effect-editor',
    PEFactory.createRadioButtonGroupEditor('effect', 'extension.setting.effect', { optionItems: effectOptions })
  )

  PERegister.registerEPEditor(app, 'alert-onClose', 'alert-onClose-editor', PEFactory.createEventHandlerEditor('onClose', []))
  /* -------------------------------------------------- */
  registerFWGenerator('alert', alertTemplateGenerator) //注册字段组件的代码生成器
  /* -------------------------------------------------- */

  // subgrid
  addCustomWidgetSchema(subgridSchema) //加载组件Json Schema
  /* -------------------------------------------------- */
  app.component(SubgridWidget.name, SubgridWidget) //注册设计期的容器组件
  /* -------------------------------------------------- */
  // PERegister.registerCPEditor(app, 'subgrid-subgridWidth', 'subgrid-subgridWidth-editor', PEFactory.createInputTextEditor('subgridWidth', 'extension.setting.subgridWidth'))

  registerFWGenerator('subgrid', subgridTemplateGenerator) //注册容器组件的代码生成器
  /* -------------------------------------------------- */

  // universal
  addCustomWidgetSchema(universalSchema) //加载组件Json Schema
  /* -------------------------------------------------- */
  app.component(UniversalWidget.name, UniversalWidget) //注册设计期的容器组件
  /* -------------------------------------------------- */
  PERegister.registerCPEditor(
    app,
    'universal-universalWidth',
    'universal-universalWidth-editor',
    PEFactory.createInputTextEditor('universalWidth', 'extension.setting.universalWidth')
  )

  registerFWGenerator('universal', universalTemplateGenerator) //注册容器组件的代码生成器
  /* -------------------------------------------------- */

  // selectWin
  addCustomWidgetSchema(selectwinSchema) //加载组件Json Schema
  /* -------------------------------------------------- */
  app.component(SelectwinWidget.name, SelectwinWidget) //注册组件

  PERegister.registerCPEditor(app, 'selectwin-controlName', 'selectwin-controlName-editor', PEFactory.createDisabledInputTextEditor('controlName', 'extension.setting.controlName'))

  PERegister.registerCPEditor(
    app,
    'selectwin-selectSource',
    'selectwin-selectSource-editor',
    PEFactory.createDisabledInputTextEditor('selectSource', 'extension.setting.selectSource')
  )

  PERegister.registerCPEditor(
    app,
    'selectwin-selectTarget',
    'selectwin-selectTarget-editor',
    PEFactory.createDisabledInputTextEditor('selectTarget', 'extension.setting.selectTarget')
  )

  // PERegister.registerEPEditor(app, 'selectwin-onClose', 'selectwin-onClose-editor', PEFactory.createEventHandlerEditor('onClose', []))
  registerFWGenerator('selectwin', seletwinTemplateGenerator)

  // autocomplete
  addCustomWidgetSchema(autocompleteSchema) //加载组件Json Schema
  /* -------------------------------------------------- */
  app.component(autocompleteWidget.name, autocompleteWidget) //注册组件

  PERegister.registerCPEditor(
    app,
    'autocomplete-controlName',
    'autocomplete-controlName-editor',
    PEFactory.createDisabledInputTextEditor('controlName', 'extension.setting.controlName')
  )

  PERegister.registerCPEditor(
    app,
    'autocomplete-selectSource',
    'autocomplete-selectSource-editor',
    PEFactory.createDisabledInputTextEditor('selectSource', 'extension.setting.selectSource')
  )

  PERegister.registerCPEditor(
    app,
    'autocomplete-selectTarget',
    'autocomplete-selectTarget-editor',
    PEFactory.createDisabledInputTextEditor('selectTarget', 'extension.setting.selectTarget')
  )

  // PERegister.registerEPEditor(app, 'autocomplete-onClose', 'autocomplete-onClose-editor', PEFactory.createEventHandlerEditor('onClose', []))
  registerFWGenerator('autocomplete', autocompleteTemplateGenerator)

  // qrcode
  addCustomWidgetSchema(qrcodeSchema) //加载组件Json Schema
  /* -------------------------------------------------- */
  app.component(qrcodeWidget.name, qrcodeWidget) //注册组件

  registerFWGenerator('qrcode', qrcodeTemplateGenerator)

  // barcode
  addCustomWidgetSchema(barcodeSchema) //加载组件Json Schema
  /* -------------------------------------------------- */
  app.component(barcodeWidget.name, barcodeWidget) //注册组件

  registerFWGenerator('barcode', barcodeTemplateGenerator)
  /* 字段组件加载完毕 end */
}

export default {
  install: loadExtension
}