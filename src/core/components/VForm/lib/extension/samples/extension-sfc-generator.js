import { buildClassAttr, buildContainerWidget, buildFieldWidget } from '../../sfc-generator'

export const cardTemplateGenerator = function(cw, formConfig) {
  const wop = cw.options
  //const headerAttr = `header="${wop.label}"`
  const classAttr = buildClassAttr(cw)
  const styleAttr = !!wop.cardWidth ? `style="{width: ${wop.cardWidth} !important}"` : ''
  const shadowAttr = `shadow="${wop.shadow}"`
  const vShowAttr = !!wop.hidden ? `v-show="false"` : ''

  const cardTemplate = `<div class="card-container">
  <el-card ${classAttr} ${styleAttr} ${shadowAttr} ${vShowAttr}>
    <template #header>
      <div class="clear-fix">
        <span>${wop.label}</span>
        ${!!wop.showFold ? `<i class="float-right el-icon-arrow-down"></i>` : ''}
      </div>
    </template>
    ${cw.widgetList
      .map(wItem => {
        if (wItem.category === 'container') {
          return buildContainerWidget(wItem, formConfig)
        } else {
          return buildFieldWidget(wItem, formConfig)
        }
      })
      .join('')}
  </el-card>
</div>`

  return cardTemplate
}

export const subgridTemplateGenerator = function(cw, formConfig) {
  const wop = cw.options
  //const headerAttr = `header="${wop.label}"`
  const classAttr = buildClassAttr(cw)
  const styleAttr = !!wop.cardWidth ? `style="{width: ${wop.cardWidth} !important}"` : ''
  const shadowAttr = `shadow="${wop.shadow}"`
  const vShowAttr = !!wop.hidden ? `v-show="false"` : ''

  const cardTemplate = `<div class="card-container">
  <el-card ${classAttr} ${styleAttr} ${shadowAttr} ${vShowAttr}>
    <template #header>
      <div class="clear-fix">
        <span>${wop.label}</span>
        ${!!wop.showFold ? `<i class="float-right el-icon-arrow-down"></i>` : ''}
      </div>
    </template>
    ${cw.widgetList
      .map(wItem => {
        if (wItem.category === 'container') {
          return buildContainerWidget(wItem, formConfig)
        } else {
          return buildFieldWidget(wItem, formConfig)
        }
      })
      .join('')}
  </el-card>
</div>`

  return cardTemplate
}

export const universalTemplateGenerator = function(cw, formConfig) {
  const wop = cw.options
  //const headerAttr = `header="${wop.label}"`
  const classAttr = buildClassAttr(cw)
  const styleAttr = !!wop.cardWidth ? `style="{width: ${wop.cardWidth} !important}"` : ''
  const shadowAttr = `shadow="${wop.shadow}"`
  const vShowAttr = !!wop.hidden ? `v-show="false"` : ''

  const cardTemplate = `<div class="card-container">
  <el-card ${classAttr} ${styleAttr} ${shadowAttr} ${vShowAttr}>
    todo
  </el-card>
</div>`

  return cardTemplate
}

export const alertTemplateGenerator = function(fw, formConfig) {
  const wop = fw.options
  const titleAttr = `title="${wop.title}"`
  const typeAttr = `type=${wop.type}`
  const descriptionAttr = !!wop.description ? `description="${wop.description}"` : ''
  const closableAttr = `:closable="${wop.closable}"`
  const closeTextAttr = !!wop.closeText ? `close-text="${wop.closeText}"` : ''
  const centerAttr = `:center="${wop.center}"`
  const showIconAttr = `:show-icon="${wop.showIcon}"`
  const effectAttr = `effect="${wop.effect}"`

  const alertTemplate = `<el-alert ${titleAttr} ${typeAttr} ${descriptionAttr} ${closableAttr} ${closeTextAttr} ${centerAttr} 
  ${showIconAttr} ${effectAttr}>
</el-alert>`

  return alertTemplate
}

export const seletwinTemplateGenerator = function(fw, formConfig) {
  const wop = fw.options
  const readonlyAttr = `:readonly="${wop.readonly}"`
  const disabledAttr = `:disabled="${wop.disabled}"`
  const sizeAttr = wop.size ? `size=${wop.size}` : ''
  const placeholderAttr = wop.placeholder ? `placeholder=${wop.placeholder}` : ''
  const clearableAttr = wop.clearable ? `:clearable=${wop.clearable}` : ''
  const minlengthAttr = wop.minlength !== undefined ? `minlength=${wop.minlength}` : ''
  const maxlengthAttr = wop.maxlength !== undefined ? `maxlength=${wop.maxlength}` : ''
  const showWordLimitAttr = wop.showWordLimit !== undefined ? `:showWordLimit=${wop.showWordLimit}` : ''
  const prefixIconAttr = wop.prefixIcon ? `prefixIcon=${wop.prefixIcon}` : ''
  const suffixIconAttr = wop.suffixIcon ? `suffixIcon=${wop.suffixIcon}` : ''
  const vModel = `v-modal=${formConfig.modelName}.${wop.name}`

  const alertTemplate = `<el-input ${vModel} ${readonlyAttr} ${disabledAttr} ${sizeAttr} ${placeholderAttr} ${clearableAttr}
${minlengthAttr} ${maxlengthAttr} ${showWordLimitAttr} ${prefixIconAttr} ${suffixIconAttr}>
  <template #append>
    <el-button :disabled="field.options.disabled || field.options.appendButtonDisabled" @click="formSelectWindow">
      <svg-icon icon-class="custom-search" />
    </el-button>
  </template>
</el-input>`

  return alertTemplate
}
export const autocompleteTemplateGenerator = function(fw, formConfig) {
  const wop = fw.options
  const readonlyAttr = `:readonly="${wop.readonly}"`
  const disabledAttr = `:disabled="${wop.disabled}"`
  const sizeAttr = wop.size ? `size=${wop.size}` : ''
  const placeholderAttr = wop.placeholder ? `placeholder=${wop.placeholder}` : ''
  const clearableAttr = wop.clearable ? `:clearable=${wop.clearable}` : ''
  const minlengthAttr = wop.minlength !== undefined ? `minlength=${wop.minlength}` : ''
  const maxlengthAttr = wop.maxlength !== undefined ? `maxlength=${wop.maxlength}` : ''
  const showWordLimitAttr = wop.showWordLimit !== undefined ? `:showWordLimit=${wop.showWordLimit}` : ''
  const prefixIconAttr = wop.prefixIcon ? `prefixIcon=${wop.prefixIcon}` : ''
  const suffixIconAttr = wop.suffixIcon ? `suffixIcon=${wop.suffixIcon}` : ''
  const vModel = `v-modal=${formConfig.modelName}.${wop.name}`

  const alertTemplate = `<el-autocomplete ${vModel} ${readonlyAttr} ${disabledAttr} ${sizeAttr} ${placeholderAttr} ${clearableAttr}
${minlengthAttr} ${maxlengthAttr} ${showWordLimitAttr} ${prefixIconAttr} ${suffixIconAttr}>
</el-autocomplete>`

  return alertTemplate
}

export const qrcodeTemplateGenerator = function(fw, formConfig) {
  // const wop = fw.options

  const qrcodeTemplate = ``

  return qrcodeTemplate
}


export const barcodeTemplateGenerator = function(fw, formConfig) {
  // const wop = fw.options
  const barrcodeTemplate = ``

  return barrcodeTemplate
}
