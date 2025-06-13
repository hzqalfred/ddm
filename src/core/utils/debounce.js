export const debounceDirective = {
  mounted(el, binding) {
    let timer = null
    const delay = binding.arg || 500 // 默认500ms防抖时间
    
    const originalHandler = el._vueClickHandler || el.onclick
    
    const debouncedHandler = function(event) {
      if (timer) {
        clearTimeout(timer)
      }
      
      // 添加loading状态（可选）
      el.setAttribute('loading', 'true')
      
      timer = setTimeout(() => {
        el.removeAttribute('loading')
        if (typeof binding.value === 'function') {
          binding.value.call(this, event)
        } else if (originalHandler) {
          originalHandler.call(this, event)
        }
      }, delay)
    }
    
    el._debouncedHandler = debouncedHandler
    el.addEventListener('click', debouncedHandler)
  },
  
  unmounted(el) {
    if (el._debouncedHandler) {
      el.removeEventListener('click', el._debouncedHandler)
      delete el._debouncedHandler
    }
  }
}