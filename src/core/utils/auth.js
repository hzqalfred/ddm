export function advancedFilterByHiddenElements(formConfig, hiddenElements, options = {}) {
    const {
      removeInsteadOfHide = false, // 是否移除元素而不是隐藏
      disableInsteadOfHide = false, // 是否禁用元素而不是隐藏
      affectParent = false, // 是否影响父容器  如果选择的是true,当一个列中的所有元素都被隐藏，隐藏整个列
    } = options;
    
    // 深拷贝配置，避免修改原始配置
    const newConfig = formConfig
    
    // 递归处理所有组件
    function processWidgets(widgetList, parent = null) {
      if (!widgetList) return [];
      
      // 如果选择移除而不是隐藏，先过滤掉需要隐藏的元素
      if (removeInsteadOfHide) {
        widgetList = widgetList.filter(widget => 
          !(widget.options && widget.options.name && hiddenElements.includes(widget.options.name))
        );
      }
      
      return widgetList.map(widget => {
        // 复制当前组件
        const newWidget = {...widget};
        
        // 检查组件是否在隐藏列表中
        if (newWidget.options && newWidget.options.name && 
            hiddenElements.includes(newWidget.options.name)) {
            
          if (!removeInsteadOfHide) { // 如果不是移除模式
            if (disableInsteadOfHide) {
              // 禁用而不是隐藏
              newWidget.options.comdisabled = true;
            } else {
              // 默认隐藏行为
              newWidget.options.hidden = true;
            }
          }
          
          // 如果需要影响父容器，且存在父容器
          if (affectParent && parent) {
            if (parent.type === 'grid-col') {
              // 例如，如果列中所有元素都被隐藏，可以隐藏整列
              const allHidden = parent.widgetList.every(w => 
                (w.options && w.options.name && hiddenElements.includes(w.options.name))
              );
              if (allHidden) {
                parent.options.hidden = true;
              }
            }
          }
        }
        
        // 处理嵌套组件
        if (newWidget.widgetList) {
          newWidget.widgetList = processWidgets(newWidget.widgetList, newWidget);
        }
        
        // 处理grid组件的cols
        if (newWidget.type === 'grid' && newWidget.cols) {
          newWidget.cols = newWidget.cols.map(col => {
            const newCol = {...col};
            if (newCol.widgetList) {
              newCol.widgetList = processWidgets(newCol.widgetList, newCol);
            }
            return newCol;
          });
        }
        
        return newWidget;
      });
    }
    
    // 处理顶层组件
    newConfig.widgetList = processWidgets(newConfig.widgetList);
    
    return newConfig;
  }