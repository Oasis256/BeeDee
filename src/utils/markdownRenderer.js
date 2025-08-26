// Simple Markdown renderer for basic formatting
export const renderMarkdown = (text) => {
  if (!text) return ''
  
  // Convert **text** to <strong>text</strong>
  let rendered = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Convert *text* to <em>text</em> (italic)
  rendered = rendered.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // Convert `text` to <code>text</code> (inline code)
  rendered = rendered.replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
  
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
