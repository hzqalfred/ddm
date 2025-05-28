export function formatCode(code) {
    // 简单的代码格式化实现
    // 实际项目中建议使用专业库如 js-beautify
    
    // 移除多余空行
    code = code.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // 调整缩进
    const lines = code.split('\n');
    let indent = 0;
    const formattedLines = lines.map(line => {
      const trimmedLine = line.trim();
      
      // 减少缩进的情况
      if (trimmedLine.match(/^[\}\)\]],?$/)) {
        indent = Math.max(0, indent - 1);
      }
      
      // 添加缩进
      const formattedLine = ' '.repeat(indent * 2) + trimmedLine;
      
      // 增加缩进的情况
      if (trimmedLine.match(/[\{\(\[]$/) && !trimmedLine.match(/\/\//)) {
        indent += 1;
      }
      
      return formattedLine;
    });
    
    return formattedLines.join('\n');
  }