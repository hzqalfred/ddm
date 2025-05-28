export const cardSchema = {
  type: 'card',
  category: 'container',
  icon: 'card',
  widgetList: [],
  options: {
    name: '',
    label: 'card',
    hidden: false,
    folded: false,
    showFold: true,
    cardWidth: '100%',
    shadow: 'never',
    customClass: ''
  }
}

export const alertSchema = {
  type: 'alert',
  icon: 'alert',
  formItemFlag: false,
  options: {
    name: '',
    title: 'Good things are coming...',
    type: 'info',
    description: '',
    closable: true,
    closeText: '',
    showIcon: false,
    hidden: false,
    onClose: '',
    customClass: ''
  }
}

export const subgridSchema = {
  type: 'subgrid',
  category: 'container',
  icon: 'subgrid',
  formItemFlag: true,
  options: {
    isFunItem: false,
    name: '',
    funId: '',
    label: 'subgrid',
    hidden: false,
    // subgridWidth: '100%',
    customClass: ''
  }
}

export const universalSchema = {
  type: 'universal',
  category: 'container',
  icon: 'subgrid',
  formItemFlag: true,
  options: {
    isFunItem: false,
    name: '',
    label: 'universal',
    hidden: false,
    universalWidth: '100%',
    customClass: ''
  }
}

export const selectwinSchema = {
  type: 'selectwin',
  icon: 'selectwin-field',
  formItemFlag: true,
  options: {
    isFunItem: false,
    name: '',
    label: '',
    labelAlign: '',
    type: 'text',
    defaultValue: '',
    placeholder: '',
    columnWidth: '200px',
    size: '',
    labelWidth: null,
    labelHidden: false,
    readonly: true,
    disabled: false,
    hidden: false,
    clearable: true,
    required: false,
    requiredHint: '',
    validation: '',
    validationHint: '',
    controlName: '',
    selectSource: '',
    selectTarget: '',
    multiple: false,
    // vwhereSQL: '',
    //-------------------
    customClass: '', //自定义css类名
    minLength: null,
    maxLength: null,
    showWordLimit: false,
    scanCode: false,
    scanCodeSkip: false,
    prefixIcon: '',
    suffixIcon: '',
    appendButtonDisabled: false,
    //-------------------
    onCreated: '',
    onMounted: '',
    onInput: '',
    onChange: '',
    onFocus: '',
    onBlur: '',
    onValidate: '',
    onAppendButtonClick: ''
  }
}

export const autocompleteSchema = {
  type: 'autocomplete',
  icon: 'autocomplete-field',
  formItemFlag: true,
  options: {
    isFunItem: false,
    name: '',
    label: '',
    labelAlign: '',
    type: 'text',
    defaultValue: '',
    placeholder: '',
    columnWidth: '200px',
    size: '',
    labelWidth: null,
    labelHidden: false,
    readonly: true,
    disabled: false,
    hidden: false,
    clearable: true,
    required: false,
    requiredHint: '',
    validation: '',
    validationHint: '',
    controlName: '',
    selectSource: '',
    selectTarget: '',
    multiple: false,
    // vwhereSQL: '',
    //-------------------
    customClass: '', //自定义css类名
    minLength: null,
    maxLength: null,
    showWordLimit: false,
    scanCode: false,
    scanCodeSkip: false,
    prefixIcon: '',
    suffixIcon: '',
    //-------------------
    onCreated: '',
    onMounted: '',
    onInput: '',
    onChange: '',
    onFocus: '',
    onBlur: '',
    onValidate: '',
    onAppendButtonClick: ''
  }
}

export const qrcodeSchema = {
  type: 'qrcode',
  icon: 'qrcode-field',
  formItemFlag: true,
  options: {
    isFunItem: false,
    name: '',
    label: '',
    labelAlign: '',
    defaultValue: '',
    columnWidth: '200px',
    labelWidth: null,
    labelHidden: false,
    readonly: true,
    hidden: false,
    scanCode: false,
    scanCodeSkip: false,
    // vwhereSQL: '',
    //-------------------
    customClass: '', //自定义css类名
  }
}

export const barcodeSchema = {
  type: 'barcode',
  icon: 'barcode-field',
  formItemFlag: true,
  options: {
    isFunItem: false,
    name: '',
    label: '',
    labelAlign: '',
    defaultValue: '',
    columnWidth: '200px',
    labelWidth: null,
    labelHidden: false,
    readonly: true,
    hidden: false,
    scanCode: false,
    scanCodeSkip: false,
    // vwhereSQL: '',
    //-------------------
    customClass: '', //自定义css类名
  }
}