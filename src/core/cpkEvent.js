/**
 * cpkEvent.js - 套件公共事件工具
 * 提供统一的表格和树组件操作方法，包括查询、删除、新增、保存等功能
 */

export function cpkEvent() {
    /**
     * 转换排序项为请求所需格式
     * @param {Array} sortItems - 排序项数组，每个元素包含sortColumn和sortType
     * @returns {Array} - 转换后的排序项数组
     */
    const transformSortItems = (sortItems = []) => 
        [...sortItems]
            .sort((a, b) => a.sortPriority - b.sortPriority)
            .map(({ sortColumn, sortType }) => ({
                sortColumn,
                asc: sortType === "asc"
            }));

    /**
     * 统一查询表格数据
     * @param {object} context - 组件上下文，包含formConfig和refList等属性
     * @param {string} signName - 表格字段标识，用于定位表格组件
     * @param {object} result - 查询条件对象
     */
    function queryTableData(context, signName, result, treeNode) {
        debugger
        const self = context;
        // 从组件配置中获取模块信息
        const { moduleName, moduleCode, functionCode } = self.formConfig ?? {};
        
        // 获取表格配置
        const tableConfig = self.refList?.[signName] ?? {};
        const { 
            pageSize, 
            currentPage: pageNum = 1, 
            field = {} 
        } = tableConfig;
        
        // 构建请求参数
        const requestParams = {
            moduleName,
            moduleCode,
            pageSize,
            pageNum: self.field.type === "tree" ? 1 : pageNum,
            ...(self.field.type === "query" && { searchItems: result }),
            ...(self.field.type === "tree" && { treeNode: treeNode }),
            sortItems: transformSortItems(field.options?.sortBy)
        };
        
        // 发送查询请求
        self.execRequest(`${functionCode}.query`, requestParams)
            .then(({ data: { rows = [], total = 0 } = {} }) => {
                // 更新表格数据并显示成功提示
                self.refList[signName].setData(rows, total);
                self.Message.notifySuccess("查询成功！");
            })
            .catch(error => {
                self.Message.notifyError("查询失败！");
            });
    }

    /**
     * 统一删除表格数据
     * @param {object} context - 组件上下文
     * @param {string} signName - 表格字段标识
     */
    function deleteTableData(context, signName) {
        const self = context;
        const { moduleCode, moduleName, functionCode } = self.formConfig;
        const tableConfig = self.refList[signName];
        const { field, $refs: { [signName]: $table } } = tableConfig;
    
        // 检查是否有未保存的新增或修改数据
        if ($table.getInsertRecords().length) return self.Message.notifyError("有未保存的新增数据！");
        if ($table.getUpdateRecords().length) return self.Message.notifyError("有未保存的修改数据！");
        
        // 根据选择类型获取选中的数据
        const selType = field.options.isSelectType;
        const selectedData = selType === "checkbox" 
            ? $table.getCheckboxRecords() 
            : $table.getRadioRecord();
        
        // 检查是否选择了数据
        if (!selectedData || (Array.isArray(selectedData) && selectedData.length === 0)) {
            return self.Message.notifyError("请选择要删除的数据！");
        }
    
        /**
         * 执行删除请求
         * @param {Array|object} data - 要删除的数据
         * @returns {Promise} - 删除请求的Promise
         */
        const performDelete = async (data) => {
            // 确保数据是数组格式
            const dataArray = Array.isArray(data) ? data : [data];
            return await self.execRequest(`${functionCode}.delete`, { moduleName, moduleCode, data: dataArray });
        };
        
        /**
         * 执行删除流程
         */
        const executeDeleteFlow = async () => {
            try {
                const delRes = await performDelete(selectedData);
                if (!delRes.success) {
                    return self.Message.notifyError("删除失败，请稍后重试！");
                }
                
                // 删除成功后刷新表格数据
                self.cpkEvent.queryTableData(self, signName);
                self.Message.notifySuccess("删除成功！");
            } catch (error) {
                self.Message.notifyError("删除失败，请稍后重试！");
            }
        };
        
        // 显示确认对话框
        window.VxeUI.modal.confirm({
            title: '确认删除提示',
            content: '是否删除当前选择数据？',
            draggable: false,
            escClosable: true,
            confirmButtonText: '确认删除',
            onConfirm: executeDeleteFlow
        });
    }

    /**
     * 统一新增表格数据
     * @param {object} context - 组件上下文
     * @param {string} signName - 表格字段标识
     */
    function addTableData(context, signName) {
        const self = context;
        const tableList = self.refList[signName];
        const $table = tableList?.$refs[signName];
        
        if (!$table) return;
        
        // 生成带默认值的新记录
        const record = tableList.field.options.columns.reduce((acc, column) => {
            // 如果列有默认值，则设置到新记录中
            if (column.defaultValue !== undefined) {
                acc[column.field] = column.defaultValue;
            }
            return acc;
        }, {});
        
        // 插入新记录并进入编辑模式
        $table.insert(record)
            .then(res => $table.setEditRow(res.row))
            .catch(error => {
                self.Message.notifyError("新增记录失败！");
            });
    }

    /**
     * 统一保存表格数据
     * @param {object} context - 组件上下文
     * @param {string} signName - 表格字段标识
     */
    function saveTableData(context, signName) {
        const self = context;
        const { formConfig, refList } = self;
        const { moduleCode, moduleName, functionCode } = formConfig;
        const tableList = refList[signName];
        const { $refs } = tableList;
        const $table = $refs[signName];
        
        // 获取新增和修改的记录
        const [insertRecords, updateRecords] = [$table.getInsertRecords(), $table.getUpdateRecords()];
        
        // 如果没有需要保存的数据，直接返回
        if (!insertRecords.length && !updateRecords.length) {
            return self.Message.notifyInfo("没有需要保存的数据！");
        }
        
        /**
         * 处理保存请求
         * @param {string} type - 操作类型：insert或update
         * @param {Array} records - 要保存的记录
         */
        const handleRequest = async (type, records) => {
            try {
                // 表单验证
                const errMap = await $table.validate();
                if (errMap) {
                    return self.Message.notifyError(`校验不通过！`);
                }
                
                // 执行保存请求
                await self.execRequest(`${functionCode}.save`, { moduleName, moduleCode, data: records });
                
                // 刷新表格数据并显示成功提示
                self.cpkEvent.queryTableData(self, signName);
                self.Message.notifySuccess(`${type === 'insert' ? '新增' : '修改'}成功！`);
            } catch (error) {
                console.error(`${type === 'insert' ? '新增' : '修改'}失败:`, error);
                self.Message.notifyError(`${type === 'insert' ? '新增' : '修改'}失败！`);
            }
        };
        
        // 分别处理新增和修改的记录
        if (insertRecords.length) handleRequest('insert', insertRecords);
        if (updateRecords.length) handleRequest('update', updateRecords);
    }

    /**
     * 统一查询树数据
     * @param {object} context - 组件上下文
     * @param {string} pamUrl - 请求数据服务URL
     * @param {string} treeSignName - 树字段标识
     * @param {string} tableSignName - 表格字段标识（树操作关联的表格）针对树上方刷新按钮
     */
    function queryTreeData(context, pamUrl, treeSignName, tableSignName) {
        const self = context;
        const { moduleCode, moduleName } = self.formConfig;
        
        self.execRequest(pamUrl, { moduleName, moduleCode })
            .then(({ data }) => {
                const treeData = data?.rows || [];
                const treeComponent = self.refList[treeSignName];
                const treeRef = treeComponent.$refs.treeRef;
            
                // 清除当前选中项
                if (treeRef?.getCurrentNodeId()) {
                    treeRef.clearCurrentNode();
                }
            
                // 设置树数据
                treeComponent.dataSource = treeData; // 原始数据
                treeComponent.treeData = treeData; // 变动数据
                self.Message.notifySuccess("树加载成功！");
                
                // 根据配置决定是否展开树
                setTimeout(() => {
                    const { expandtype } = treeComponent.field.options;
                    treeRef.setAllExpandNode(!!expandtype);
                }, 1);
        
                // 如果是树上方的重置按钮触发，连带刷新表格数据
                if (tableSignName) {
                    self.cpkEvent.queryTableData(self, tableSignName);
                }
            })
            .catch((error) => {
                console.error("树加载失败:", error);
                self.Message.notifyError("树加载失败，请重试！");
            });
    }

    return {
        queryTableData,     // 查询方法
        deleteTableData,    // 删除方法
        addTableData,       // 新增方法
        saveTableData,      // 保存方法
        queryTreeData,      // 树查询方法
    };
}

export default cpkEvent();    