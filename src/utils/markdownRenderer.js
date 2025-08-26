// Simple Markdown renderer for basic formatting
export const renderMarkdown = (text) => {
  if (!text) return ''
  
  // Debug: log the input text
  console.log('Markdown input:', text)
  
  // Convert **text** to <strong>text</strong>
  let rendered = text.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: inherit;">$1</strong>')
  
  // Convert *text* to <em>text</em> (italic)
  rendered = rendered.replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: inherit;">$1</em>')
  
  // Convert `text` to <code>text</code> (inline code)
  rendered = rendered.replace(/`(.*?)`/g, '<code style="background-color: rgba(55, 65, 81, 0.8); padding: 2px 4px; border-radius: 4px; font-size: 0.875rem; color: inherit;">$1</code>')
  
  // Debug: log the output
  console.log('Markdown output:', rendered)
  
  return rendered
}

// React component for rendering markdown text
export const MarkdownText = ({ children, className = '' }) => {
  const renderedText = renderMarkdown(children)
  
  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ __html: renderedText }}
    />
  )
}
