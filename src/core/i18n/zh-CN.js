export default {
  application: {
    'zh-CN': '简体中文',
    'en-US': 'English',
    productTitle: '表单设计器',
    github: 'GitHub',
    document: '文档',
    qqGroup: '技术WX群',
    deployment: '私有部署',
    subscription: '订阅Pro'
  },

  designer: {
    functionLib: '功能选项列表',
    fieldLib: '字段列表',
    subgridList: '表单子功能列表',
    expandList: '数据服务',
    componentLib: '组件库',
    formLib: '表单模板',
    containerTitle: '容器',
    dragHandlerHint: '鼠标拖拽容器组件或字段组件并放置于表单中',
    dragAction: '拖动',
    basicFieldTitle: '基础字段',
    advancedFieldTitle: '高级字段',
    customFieldTitle: '自定义扩展字段',

    noWidgetHint: '请从左侧列表中选择一个组件, 然后用鼠标拖动组件放置于此处.',

    widgetLabel: {
      grid: '栅格',
      table: '表格',
      tab: '标签页',
      section: '区块',
      'sub-form': '子表单',
      'grid-col': '栅格列',
      'table-cell': '单元格',
      'tab-pane': '选项卡页',
      'data-table': '数据表格',
      page: '页面', //hzq
      dialog: '弹出窗口', //hzq
      form: '表单', //hzq
      input: '单行输入',
      textarea: '多行输入',
      password: '密码输入',
      number: '计数器',
      radio: '单选项',
      checkbox: '多选项',
      select: '下拉选项',
      'radio-group': '单选框组',
      'checkbox-group': '复选框组',
      time: '时间',
      'time-range': '时间范围',
      date: '日期',
      'date-range': '日期范围',
      switch: '开关',
      rate: '评分',
      color: '颜色选择器',
      slider: '滑块',
      'static-text': '静态文字',
      'html-text': 'HTML',
      button: '按钮',
      buttongroup: '按钮组', //hzq
      tree: '树形', //hzq
      eltable: '数据表格', //hzq
      drawer: '侧滑抽屉', //hzq
      popupwin: '窗口合集',
      'grid-table': '组合表格', //hzq
      pagination: '分页', //hzq
      query: '搜索', //hzq
      divider: '分隔线',

      'picture-upload': '图片',
      'video-upload': '视频',
      'audio-upload': '音频',
      'file-upload': '文件',
      'rich-editor': '富文本',
      cascader: '级联选择',
      slot: '插槽',

      custom: 'Custom Component'
    },

    hint: {
      selectParentWidget: '选中父组件',
      moveUpWidget: '上移组件',
      moveDownWidget: '下移组件',
      cloneWidget: '复制组件',
      insertRow: '插入新行',
      insertColumn: '插入新列',
      remove: '移除组件',
      cellSetting: '单元格操作',
      dragHandler: '拖拽手柄',
      copyField: '复制字段组件',
      onlyFieldWidgetAcceptable: '子表单只能接收字段组件',
      moveUpFirstChildHint: '已经移动到最上面',
      moveDownLastChildHint: '已经移动到最下面',

      closePreview: '关闭',
      copyJson: '复制JSON',
      saveFormJson: '保存为文件',
      copyVueCode: '复制Vue代码',
      copyHtmlCode: '复制HTML代码',
      copyJsonSuccess: '复制JSON成功',
      importJsonSuccess: '导入JSON成功',
      invalidJsonFormat: '无效的表单JSON格式',
      jsonVersionMismatch: '表单JSON版本号不匹配',
      copyJsonFail: '复制JSON失败',
      copyVueCodeSuccess: '复制Vue代码成功',
      copyVueCodeFail: '复制Vue代码失败',
      copyHtmlCodeSuccess: '复制HTML代码成功',
      copyHtmlCodeFail: '复制HTML代码失败',
      saveVueCode: '保存Vue文件',
      saveHtmlCode: '保存Html文件',
      getFormData: '获取数据',
      resetForm: '重置表单',
      disableForm: '禁用编辑',
      enableForm: '恢复编辑',
      exportFormData: '表单数据',
      copyFormData: '复制JSON',
      saveFormData: '保存为文件',
      copyVue2SFC: '复制Vue2代码',
      copyVue3SFC: '复制Vue3代码',
      copySFCFail: '复制SFC代码失败',
      copySFCSuccess: '复制SFC代码成功',
      saveVue2SFC: '保存为Vue2组件',
      saveVue3SFC: '保存为Vue3组件',
      fileNameForSave: '文件名：',
      saveFileTitle: '保存为文件',
      fileNameInputPlaceholder: '请输入文件名',
      sampleLoadedSuccess: '表单示例加载成功',
      sampleLoadedFail: '表单示例加载失败',
      loadFormTemplate: '加载此模板',
      loadFormTemplateHint: '是否加载这个模板？加载后会覆盖设计器当前表单，你可以使用“撤销”功能恢复。',
      loadFormTemplateSuccess: '表单模板加载成功',
      loadFormTemplateFailed: '表单模板加载失败',
      currentNodeCannotBeSelected: '当前组件节点不可选择',

      widgetSetting: '组件设置',
      formSetting: '表单设置',

      prompt: '提示',
      confirm: '确定',
      cancel: '取消',
      import: '导入',
      importJsonHint: '导入的JSON内容须符合下述格式，以保证顺利导入.',
      invalidOptionsData: '无效的选项数据:',
      lastPaneCannotBeDeleted: '仅剩一个选项卡页不可删除.',
      duplicateName: '组件名称已存在: ',
      nameRequired: '组件名称不可为空',

      numberValidator: '数字',
      letterValidator: '字母',
      letterAndNumberValidator: '数字字母',
      mobilePhoneValidator: '手机号码',
      emailValidator: '邮箱',
      urlValidator: '网址',
      noChineseValidator: '非中文字符',
      chineseValidator: '仅中文字符',

      rowspanNotConsistentForMergeEntireRow: '存在行高不一致的单元格, 无法合并整行.',
      colspanNotConsistentForMergeEntireColumn: '存在列宽不一致的单元格, 无法合并整列.',
      rowspanNotConsistentForDeleteEntireRow: '存在行高不一致的单元格, 不可删除整行.',
      colspanNotConsistentForDeleteEntireColumn: '存在列宽不一致的单元格, 不可删除整列.',
      lastColCannotBeDeleted: '最后一列不可删除.',
      lastRowCannotBeDeleted: '最后一行不可删除.'
    },

    toolbar: {
      undoHint: '撤销',
      redoHint: '重做',
      pcLayout: 'PC',
      padLayout: 'Pad',
      mobileLayout: 'H5',
      nodeTreeHint: '组件层次结构树',
      nodeTreeTitle: '组件层次结构树',
      clear: '清空',
      preview: '预览',
      saveJson: '保存',
      importJson: '导入JSON',
      exportJson: '导出JSON',
      exportCode: '导出代码',
      generateCode: '生成代码',
      generateSFC: '生成SFC'
    },

    setting: {
      basicSetting: '基本属性',
      attributeSetting: '属性设置',
      commonSetting: '基础属性',
      advancedSetting: '其他属性',
      eventSetting: '常用事件属性',
      uniqueName: '控件编号',
      editNameHelp: '修改名称后需按回车确认',
      label: '标签',
      displayType: '显示类型',
      defaultValue: '默认值',
      placeholder: '占位内容',
      startPlaceholder: '起始占位内容',
      endPlaceholder: '截止占位内容',
      widgetColumnWidth: '组件列宽',
      widgetSize: '组件大小',
      fontSize: '字体大小',
      textAlign: '文字对齐',
      autoFullWidth: '自动拉伸宽度',
      showStops: '显示间断点',
      displayStyle: '显示样式',
      inlineLayout: '行内',
      blockLayout: '块',
      buttonStyle: '显示为按钮',
      border: '带有边框',
      labelWidth: '标签宽度',
      rows: '行数',
      labelHidden: '隐藏字段标签',
      required: '必填字段',
      requiredHint: '必填校验提示',
      validation: '字段校验',
      validationHelp: '支持输入正则表达式',
      validationHint: '校验失败提示',
      readonly: '只读',
      disabled: '禁用',
      hidden: '隐藏',
      isFunField: '是否功能字段',
      textContent: '静态文字',
      preWrap: '自动换行',
      htmlContent: 'HTML',
      clearable: '可清除',
      editable: '可输入',
      format: '显示格式',
      valueFormat: '绑定值格式',
      showPassword: '可显示密码',
      filterable: '可搜索选项',
      allowCreate: '允许创建选项',
      remote: '可远程搜索',
      automaticDropdown: '自动弹出选项',
      multiple: '选项可多选',
      multipleLimit: '多选数量限制',
      checkStrictly: '任意级节点可选',
      showAllLevels: '显示完整路径',
      contentPosition: '文字位置',
      plain: '朴素按钮',
      round: '圆角按钮',
      circle: '圆形按钮',
      icon: '图标',
      optionsSetting: '选项设置',
      dictionary: '数据字典',
      addOption: '增加选项',
      importOptions: '导入选项',
      editItems: '编辑选项',
      resetDefault: '重设选中项',
      uploadSetting: '上传参数设置',
      uploadURL: '上传地址',
      uploadTip: '上传提示内容',
      withCredentials: '发送cookie凭证',
      multipleSelect: '文件可多选',
      showFileList: '显示文件列表',
      limit: '最大上传数量',
      fileMaxSize: '文件大小限制(MB)',
      fileTypes: '上传文件类型',
      fileTypesHelp: '支持添加其他文件类型',
      headers: '上传请求头',

      cellWidth: '宽度',
      cellHeight: '高度',
      wordBreak: '文字自动换行',
      gridColHeight: '栅格列统一高度(px)',
      gutter: '栅格间隔(px)',
      columnSetting: '栅格属性设置',
      colsOfGrid: '当前栅格列:',
      colSpanTitle: '栅格宽度',
      colOffsetTitle: '左侧间隔格数',
      colPushTitle: '右移栅格数',
      colPullTitle: '左移栅格数',
      addColumn: '增加栅格',
      responsive: '响应式布局',

      tabPaneSetting: '选项卡设置',
      addTabPane: '增加选项卡页',
      paneActive: '激活',

      customLabelIcon: '定制字段标签',
      labelIconClass: '标签Icon样式',
      labelIconPosition: '标签Icon位置',
      labelTooltip: '标签文字提示',
      minValue: '最小值',
      maxValue: '最大值',
      precision: '精度',
      step: '增减步长',
      controlsPosition: '控制按钮位置',
      minLength: '最小长度',
      maxLength: '最大长度',
      showWordLimit: '显示字数统计',
      scanCode: '是否扫码',
      scanCodeSkip: '扫码后跳转',
      prefixIcon: '头部Icon',
      suffixIcon: '尾部Icon',
      inputButton: '输入框按钮设置',
      appendButton: '添加后置按钮',
      appendButtonDisabled: '后置按钮禁用',
      appendButtonIcon: '后置按钮Icon',
      buttonIcon: '按钮Icon',
      switchWidth: '开关宽度（像素）',
      activeText: '开启时文字描述',
      inactiveText: '关闭时文字描述',
      activeColor: '开启时背景色',
      inactiveColor: '关闭时背景色',
      maxStars: '最大评分值',
      lowThreshold: '低分界限值',
      highThreshold: '高分界限值',
      allowHalf: '允许半选',
      showText: '显示辅助文字',
      showScore: '显示当前分数',
      range: '是否为范围选择',
      vertical: '是否竖向显示',
      showBlankRow: '默认显示新行',
      showRowNumber: '显示行号',
      contentHeight: '内容区高度',

      insertColumnToLeft: '插入左侧列',
      insertColumnToRight: '插入右侧列',
      insertRowAbove: '插入上方行',
      insertRowBelow: '插入下方行',
      mergeLeftColumn: '合并左侧单元格',
      mergeRightColumn: '合并右侧单元格',
      mergeEntireRow: '合并整行',
      mergeRowAbove: '合并上方单元格',
      mergeRowBelow: '合并下方单元格',
      mergeEntireColumn: '合并整列',
      undoMergeCol: '撤销列合并',
      undoMergeRow: '撤销行合并',
      deleteEntireCol: '删除整列',
      deleteEntireRow: '删除整行',

      widgetName: '组件唯一名称',
      formSize: '全局组件大小',
      labelPosition: '标签位置',
      topPosition: '顶部',
      leftPosition: '左边',
      labelAlign: '字段标签对齐',
      leftAlign: '居左',
      centerAlign: '居中',
      rightAlign: '居右',
      formCss: '表单全局CSS',
      addCss: '编写CSS',
      customClass: '自定义CSS类',
      globalFunctions: '表单全局函数',
      addEventHandler: '编写代码',
      editWidgetEventHandler: '组件事件处理',
      editFormEventHandler: '表单事件处理',
      formSFCSetting: '生成SFC设置',
      formModelName: '数据对象名称',
      formRefName: '引用名称',
      formRulesName: '验证规则名称',
      syntaxCheckWarning: 'JS代码存在语法错误，请仔细检查！',
      showModal: '显示遮罩层', //hzq
      showClose: '显示关闭按钮', //hzq
      closeOnClickModal: '点击遮罩层关闭', //hzq
      closeOnPressEscape: '按Esc键关闭', //hzq
      center: '头部底部居中', //hzq
      hideComfirm: '隐藏确认按钮', //hzq
      hideCancel: '隐藏取消按钮', //hzq
      comfirmButtonText: '确认按钮文字', //hzq
      cancelButtonText: '取消按钮文字', //hzq
      columns: '表头', //hzq
      selectabled: '是否显示选择列', //hzq
      size:'尺寸',
      type: "类型",
      highlightCurrentRow: '单选', //hzq
      isCheckBox: '是否复选框', //hzq
      defaultExpandAll: '展开所有', //hzq
      highlightCurrent: '高亮选中节点', //hzq
      stripe: '斑马纹', //hzq
      maxHeight: '最大高度', //hzq
      dialogWidth: '弹窗宽度(px/%)', //hzq
      fullScreen: '全屏显示弹窗', //hzq
      showIndex: '显示索引', //hzq
      pageList: '默认分页条数', //hzq
      pageUnit: '分页展示条数', //hzq
      pageAlign: '组件位置', //hzq
      isDraggable: '是否允许拖拽', //hzq
      eltableHeight:'表格高度',//hzq
      editConfig:'编辑配置',//hzq
      events:'事件配置',//hzq
      columnWidth:'列宽',//hzq
      items:'查询项',//hzq
      sourceType:'来源类型',//hzq
      paginate:'分页',//hzq
      virtual:'虚拟滚动',//hzq
      sourceType:'来源类型',//hzq
      isSelectType:'选择列类型',//hzq
      operate:'操作列',//hzq
      isFilter: '显示过滤框' //hzq
    }
  }
}
