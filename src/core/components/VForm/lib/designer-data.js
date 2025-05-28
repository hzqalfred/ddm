const generatedNumbers = new Set()

function generateUniqueFiveDigitNumber() {
  let number
  do {
    number = Math.floor(10000 + Math.random() * 90000) // 生成一个五位数
  } while (generatedNumbers.has(number)) // 如果已经生成过，则重新生成

  generatedNumbers.add(number) // 将新生成的数加入集合
  return number
}

export function buildButtonArr(data, displayStyle = 'block', moreIndex = 5) {
  let id = generateUniqueFiveDigitNumber()
  let eventArr = (data.dbModelConfig && data.dbServiceConfig.dataEventList && data.dbServiceConfig.dataEventList.filter(x => x.vue_page_type === 'grid')) || []
  return {
    displayName: '事件按钮',
    type: 'buttongroup',
    icon: 'buttongroup',
    formItemFlag: false,
    options: {
      isFunItem: false,
      scanCode: false,
      scanCodeSkip: false,
      name: 'buttongroup' + id,
      label: 'buttongroup',
      columnWidth: '200px',
      size: '',
      pageAlign: 'left',
      displayStyle: displayStyle,
      moreIndex,
      disabled: false,
      hidden: false,
      //   sourceType: 'custom',
      //   dictionary: '',
      items: eventArr.map(x =>
        Object.assign(x, {
          label: x.event_name,
          value: x.event_code
        })
      ),
      type: '',
      round: false,
      buttonType: 'default',
      icon: null,
      customClass: [],
      onCreated: '',
      onMounted: '',
      onButtonGroupClick: ''
    },
    id: 'buttongroup' + id
  }
}

export function buildQuery(data) {
  let id = generateUniqueFiveDigitNumber()
  let columns = (data.componentConfig && data.componentConfig.columnList && data.componentConfig.columnList.filter(x => x.is_query == '1')) || []
  console.log(columns)
  return {
    type: 'query',
    icon: 'query',
    formItemFlag: true,
    options: {
      isFunItem: false,
      scanCode: false,
      scanCodeSkip: false,
      name: 'query' + id,
      label: '',
      columnWidth: '200px',
      size: '',
      displayStyle: 'inline',
      disabled: false,
      hidden: false,
      pageAlign: 'right',
      items: columns.map(x => ({
        label: x.column_comment,
        value: x.column_statement
      })),
      //-------------------
      customClass: '', //自定义css类名
      //-------------------
      onCreated: '',
      onMounted: '',
      onSearchClick: ''
    },
    id: 'query' + id
  }
}

export function buildTree(treeOptions) {
  let id = generateUniqueFiveDigitNumber()
  return {
    type: 'tree',
    icon: 'tree',
    formItemFlag: true,
    options: {
      isFunItem: false,
      scanCode: false,
      scanCodeSkip: false,
      name: 'tree' + id,
      label: '',
      labelAlign: '',
      isCheckBox: false,
      defaultExpandAll: false,
      highlightCurrent: false,
      columnWidth: '200px',
      labelWidth: '0',
      labelHidden: false,
      hidden: false,
      required: false,
      requiredHint: '',
      sourceType: 'dictionary',
      dictionary: '',
      validation: '',
      validationHint: '',
      optionItems: treeOptions,
      customClass: [],
      onCreated: '',
      onMounted: '',
      onRemoteQuery: '',
      onChange: ''
    },
    id: 'tree' + id
  }
}

export function buildElTable(columns, key = '') {
  let id = generateUniqueFiveDigitNumber()

  return {
    type: 'eltable',
    icon: 'table',
    formItemFlag: key ? true : false,
    category: '',
    options: {
      isFunItem: false,
      scanCode: false,
      scanCodeSkip: false,
      name: key || `eltable${id}`,
      label: 'eltable',
      hidden: false,
      sourceType: 'custom',
      dictionary: '',
      type: '',
      stripe: false,
      border: false,
      eltableHeight: '200',
      maxHeight: '200',
      showIndex: false,
      highlightCurrentRow: false,
      pageList: 10,
      pageUnit: '10,20,30',
      selectabled: false,
      columns: columns,
      defaultValue: '',
      customClass: [],
      onCreated: '',
      onMounted: '',
      onClick: '',
      onChange: ''
    },
    id: key || `eltable${id}`
  }
}

export function buildGrid(...args) {
  let id = generateUniqueFiveDigitNumber()
  return {
    type: 'grid-col',
    category: 'container',
    icon: 'grid-col',
    internal: true,
    key: 'grid-col-' + id,
    widgetList: args, //hzq
    options: {
      name: 'gridCol' + id,
      hidden: false,
      span: 24,
      offset: 0,
      push: 0,
      pull: 0,
      responsive: false,
      md: 12,
      sm: 12,
      xs: 12,
      customClass: []
    },
    id: 'grid-col-' + id
  }
}

export function generateGrid(data, key = '') {
  console.log('data', data)
  const treeOptions =
    data.treeConfig && data.treeConfig.treeList
      ? data.treeConfig.treeList.map(x => ({
          label: x.tree_title,
          value: x.tree_title,
          children: []
        }))
      : []

  let tree = buildTree(treeOptions)
  let query = buildQuery(data)
  let ButtonArr = buildButtonArr(data, 'inline')
  let columns = (data.gridDesignConfig && data.gridDesignConfig.columnJson && JSON.parse(data.gridDesignConfig.columnJson)) || []

  let eltable = buildElTable(columns, key)

  const hasTreeOptions = treeOptions.length > 0

  let cols = [
    ...(hasTreeOptions
      ? [
          {
            type: 'grid-col',
            category: 'container',
            icon: 'grid-col',
            internal: true,
            widgetList: hasTreeOptions ? [tree] : [], //hzq
            options: {
              name: 'gridCol92717',
              hidden: false,
              span: hasTreeOptions ? 5 : 0,
              offset: 0,
              push: 0,
              pull: 0,
              responsive: false,
              md: 12,
              sm: 12,
              xs: 12,
              customClass: []
            },
            id: 'grid-col-92717'
          }
        ]
      : []),
    {
      type: 'grid-col',
      category: 'container',
      icon: 'grid-col',
      internal: true,
      widgetList: [
        {
          type: 'grid',
          category: 'container',
          icon: 'grid',
          cols: [
            {
              type: 'grid-col',
              category: 'container',
              icon: 'grid-col',
              internal: true,
              widgetList: [
                {
                  key: 100637,
                  type: 'page',
                  category: 'container',
                  icon: 'page',
                  widgetList: [query, ButtonArr],
                  options: {
                    name: 'page64415',
                    hidden: false,
                    customClass: []
                  },
                  id: 'page64415'
                }
              ],
              options: {
                name: 'gridCol71768',
                hidden: false,
                span: 24,
                offset: 0,
                push: 0,
                pull: 0,
                responsive: false,
                md: 12,
                sm: 12,
                xs: 12,
                customClass: ''
              },
              id: 'grid-col-71768'
            },
            {
              type: 'grid-col',
              category: 'container',
              icon: 'grid-col',
              internal: true,
              widgetList: [eltable],
              options: {
                name: 'gridCol37892',
                hidden: false,
                span: 24,
                offset: 0,
                push: 0,
                pull: 0,
                responsive: false,
                md: 12,
                sm: 12,
                xs: 12,
                customClass: []
              },
              id: 'grid-col-37892'
            }
          ],
          options: {
            name: 'grid76364',
            hidden: false,
            gutter: 12,
            colHeight: null,
            customClass: ''
          },
          id: 'grid76364'
        }
      ],
      options: {
        name: 'gridCol101770',
        hidden: false,
        span: hasTreeOptions ? 19 : 24,
        offset: 0,
        push: 0,
        pull: 0,
        responsive: false,
        md: 12,
        sm: 12,
        xs: 12,
        customClass: []
      },
      id: 'grid-col-101770'
    }
  ]

  return [
    {
      type: 'grid',
      category: 'container',
      icon: 'grid',
      cols,
      options: {
        name: 'grid86089',
        hidden: false,
        gutter: 12,
        colHeight: null,
        customClass: []
      },
      id: 'grid86089'
    }
  ]
}
