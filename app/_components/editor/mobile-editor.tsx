import React, { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '../../../lib/utils'

interface MobileEditorProps {
  value: string
  onChange: (value: string) => void
  theme: 'light' | 'vs-dark'
  language: string
  placeholder?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  className?: string
  showToolbar?: boolean
  onToolbarAction?: (action: string, value?: string) => void
}

interface ToolbarButton {
  id: string
  label: string
  icon: string
  action: string
  ariaLabel: string
  insertText?: string
}

interface SyntaxToken {
  type: 'header' | 'bold' | 'italic' | 'code' | 'link' | 'list' | 'text'
  start: number
  end: number
  content: string
}

// Lightweight syntax highlighter for markdown
const tokenizeMarkdown = (text: string): SyntaxToken[] => {
  const tokens: SyntaxToken[] = []
  const lines = text.split('\n')
  let currentPos = 0

  lines.forEach((line) => {
    const lineStart = currentPos

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.*)/)
    if (headerMatch) {
      tokens.push({
        type: 'header',
        start: lineStart,
        end: lineStart + line.length,
        content: line
      })
    }
    // Bold text
    else if (line.includes('**')) {
      const boldRegex = /\*\*(.*?)\*\*/g
      let match
      let lastIndex = 0

      while ((match = boldRegex.exec(line)) !== null) {
        // Add text before bold
        if (match.index > lastIndex) {
          tokens.push({
            type: 'text',
            start: lineStart + lastIndex,
            end: lineStart + match.index,
            content: line.slice(lastIndex, match.index)
          })
        }

        // Add bold token
        tokens.push({
          type: 'bold',
          start: lineStart + match.index,
          end: lineStart + match.index + match[0].length,
          content: match[0]
        })

        lastIndex = match.index + match[0].length
      }

      // Add remaining text
      if (lastIndex < line.length) {
        tokens.push({
          type: 'text',
          start: lineStart + lastIndex,
          end: lineStart + line.length,
          content: line.slice(lastIndex)
        })
      }
    }
    // Code blocks
    else if (line.includes('`')) {
      const codeRegex = /`([^`]+)`/g
      let match
      let lastIndex = 0

      while ((match = codeRegex.exec(line)) !== null) {
        // Add text before code
        if (match.index > lastIndex) {
          tokens.push({
            type: 'text',
            start: lineStart + lastIndex,
            end: lineStart + match.index,
            content: line.slice(lastIndex, match.index)
          })
        }

        // Add code token
        tokens.push({
          type: 'code',
          start: lineStart + match.index,
          end: lineStart + match.index + match[0].length,
          content: match[0]
        })

        lastIndex = match.index + match[0].length
      }

      // Add remaining text
      if (lastIndex < line.length) {
        tokens.push({
          type: 'text',
          start: lineStart + lastIndex,
          end: lineStart + line.length,
          content: line.slice(lastIndex)
        })
      }
    }
    // List items
    else if (line.match(/^[\s]*[-*+]\s+/)) {
      tokens.push({
        type: 'list',
        start: lineStart,
        end: lineStart + line.length,
        content: line
      })
    }
    // Regular text
    else {
      tokens.push({
        type: 'text',
        start: lineStart,
        end: lineStart + line.length,
        content: line
      })
    }

    currentPos += line.length + 1 // +1 for newline
  })

  return tokens
}

// Touch-optimized toolbar buttons for markdown editing
const toolbarButtons: ToolbarButton[] = [
  {
    id: 'bold',
    label: 'B',
    icon: '𝐁',
    action: 'bold',
    ariaLabel: 'Make text bold',
    insertText: '**text**'
  },
  {
    id: 'italic',
    label: 'I',
    icon: '𝐼',
    action: 'italic',
    ariaLabel: 'Make text italic',
    insertText: '*text*'
  },
  {
    id: 'header',
    label: 'H',
    icon: 'H',
    action: 'header',
    ariaLabel: 'Insert header',
    insertText: '# Header'
  },
  {
    id: 'list',
    label: '•',
    icon: '•',
    action: 'list',
    ariaLabel: 'Insert bullet list',
    insertText: '- List item'
  },
  {
    id: 'code',
    label: '<>',
    icon: '</>',
    action: 'code',
    ariaLabel: 'Insert code block',
    insertText: '`code`'
  },
  {
    id: 'link',
    label: '🔗',
    icon: '🔗',
    action: 'link',
    ariaLabel: 'Insert link',
    insertText: '[link text](url)'
  }
]

export const MobileEditor: React.FC<MobileEditorProps> = ({
  value,
  onChange,
  theme,
  language,
  placeholder = "Enter markdown content here...",
  ariaLabel = "Mobile markdown editor",
  ariaDescribedBy,
  className,
  showToolbar = true,
  onToolbarAction
}) => {
  // Debug logging
  console.log('MobileEditor rendered with showToolbar:', showToolbar);
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [tokens, setTokens] = useState<SyntaxToken[]>([])

  // Update syntax highlighting when value changes
  useEffect(() => {
    if (language === 'markdown') {
      setTokens(tokenizeMarkdown(value))
    }
  }, [value, language])

  // Ensure layers are synchronized on mount and resize
  useEffect(() => {
    const syncLayers = () => {
      if (textareaRef.current && highlightRef.current) {
        const textarea = textareaRef.current
        const highlight = highlightRef.current
        
        // Sync scroll position
        highlight.scrollTop = textarea.scrollTop
        highlight.scrollLeft = textarea.scrollLeft
        
        // Ensure both have exactly the same computed styles
        const textareaStyles = window.getComputedStyle(textarea)
        highlight.style.lineHeight = textareaStyles.lineHeight
        highlight.style.fontSize = textareaStyles.fontSize
        highlight.style.fontFamily = textareaStyles.fontFamily
        highlight.style.padding = textareaStyles.padding
      }
    }

    // Initial sync
    syncLayers()

    // Sync on window resize
    window.addEventListener('resize', syncLayers)
    
    return () => {
      window.removeEventListener('resize', syncLayers)
    }
  }, [])

  // Sync scroll between textarea and highlight layer
  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      // Use requestAnimationFrame for smoother sync
      requestAnimationFrame(() => {
        if (textareaRef.current && highlightRef.current) {
          highlightRef.current.scrollTop = textareaRef.current.scrollTop
          highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
        }
      })
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  // Handle toolbar button actions
  const handleToolbarAction = useCallback((action: string, insertText?: string) => {
    if (!textareaRef.current || !insertText) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let newText = ''
    let newCursorPos = start

    switch (action) {
      case 'bold':
        if (selectedText) {
          newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end)
          newCursorPos = start + 2 + selectedText.length + 2
        } else {
          newText = value.substring(0, start) + '**text**' + value.substring(end)
          newCursorPos = start + 2
        }
        break
      case 'italic':
        if (selectedText) {
          newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end)
          newCursorPos = start + 1 + selectedText.length + 1
        } else {
          newText = value.substring(0, start) + '*text*' + value.substring(end)
          newCursorPos = start + 1
        }
        break
      case 'header':
        const lineStart = value.lastIndexOf('\n', start - 1) + 1
        newText = value.substring(0, lineStart) + '# ' + value.substring(lineStart)
        newCursorPos = start + 2
        break
      case 'list':
        const listLineStart = value.lastIndexOf('\n', start - 1) + 1
        newText = value.substring(0, listLineStart) + '- ' + value.substring(listLineStart)
        newCursorPos = start + 2
        break
      case 'code':
        if (selectedText) {
          newText = value.substring(0, start) + `\`${selectedText}\`` + value.substring(end)
          newCursorPos = start + 1 + selectedText.length + 1
        } else {
          newText = value.substring(0, start) + '`code`' + value.substring(end)
          newCursorPos = start + 1
        }
        break
      case 'link':
        if (selectedText) {
          newText = value.substring(0, start) + `[${selectedText}](url)` + value.substring(end)
          newCursorPos = start + selectedText.length + 3
        } else {
          newText = value.substring(0, start) + '[link text](url)' + value.substring(end)
          newCursorPos = start + 1
        }
        break
      default:
        return
    }

    onChange(newText)

    // Set cursor position after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.current.focus()
      }
    }, 0)

    // Call external handler if provided
    if (onToolbarAction) {
      onToolbarAction(action, insertText)
    }
  }, [value, onChange, onToolbarAction])

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          handleToolbarAction('bold', '**text**')
          break
        case 'i':
          e.preventDefault()
          handleToolbarAction('italic', '*text*')
          break
        case 'k':
          e.preventDefault()
          handleToolbarAction('link', '[link text](url)')
          break
      }
    }
  }

  // Render highlighted content
  const renderHighlightedContent = () => {
    if (language !== 'markdown' || tokens.length === 0) {
      return value
    }

    return tokens.map((token, index) => {
      const getTokenClassName = (type: string) => {
        const baseClasses = "whitespace-pre-wrap"
        switch (type) {
          case 'header':
            return cn(baseClasses, theme === 'vs-dark' ? 'text-blue-300 font-semibold' : 'text-blue-600 font-semibold')
          case 'bold':
            return cn(baseClasses, theme === 'vs-dark' ? 'text-yellow-300 font-bold' : 'text-orange-600 font-bold')
          case 'italic':
            return cn(baseClasses, theme === 'vs-dark' ? 'text-green-300 italic' : 'text-green-600 italic')
          case 'code':
            return cn(baseClasses, theme === 'vs-dark' ? 'text-pink-300 bg-gray-800 px-1 rounded' : 'text-pink-600 bg-gray-100 px-1 rounded')
          case 'link':
            return cn(baseClasses, theme === 'vs-dark' ? 'text-cyan-300 underline' : 'text-cyan-600 underline')
          case 'list':
            return cn(baseClasses, theme === 'vs-dark' ? 'text-purple-300' : 'text-purple-600')
          default:
            return cn(baseClasses, theme === 'vs-dark' ? 'text-gray-200' : 'text-gray-800')
        }
      }

      return (
        <span key={index} className={getTokenClassName(token.type)}>
          {token.content}
        </span>
      )
    })
  }

  const isDark = theme === 'vs-dark'

  return (
    <div className={cn("relative w-full h-full flex flex-col", className)}>
      {/* Touch-optimized toolbar */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          className={cn(
            "flex flex-wrap gap-1 p-2 border-b shrink-0 z-10 min-h-[60px]",
            isDark
              ? "bg-[#2d2d30] border-gray-600"
              : "bg-gray-50 border-gray-300"
          )}
          role="toolbar"
          aria-label="Markdown formatting toolbar"
          style={{ 
            position: 'relative',
            display: 'flex',
            visibility: 'visible'
          }}
        >
          <div className="text-xs text-red-500 mb-2">Toolbar Debug: {toolbarButtons.length} buttons</div>
          {toolbarButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleToolbarAction(button.action, button.insertText)}
              className={cn(
                "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md",
                "font-semibold text-sm transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                "active:scale-95 transform transition-transform",
                "relative z-10",
                isDark
                  ? "bg-[#3c3c3c] text-gray-200 hover:bg-[#4a4a4a] active:bg-[#555555]"
                  : "bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200 border border-gray-300"
              )}
              aria-label={button.ariaLabel}
              type="button"
              style={{
                display: 'flex',
                visibility: 'visible'
              }}
            >
              {button.icon}
            </button>
          ))}
        </div>
      )}

      {/* Editor container */}
      <div className="relative flex-1 overflow-hidden min-h-0">
        {/* Syntax highlighting layer */}
        <div
          ref={highlightRef}
          className={cn(
            "absolute inset-0 p-4 pointer-events-none overflow-auto whitespace-pre-wrap break-words font-mono text-sm",
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400",
            isDark ? "bg-[#1e1e1e]" : "bg-white"
          )}
          style={{
            zIndex: 1,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: '1.5rem', // Match textarea line height exactly
            fontSize: '14px', // Match textarea font size exactly
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' // Match textarea font family
          }}
          aria-hidden="true"
        >
          {renderHighlightedContent()}
        </div>

        {/* Actual textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          className={cn(
            "relative w-full h-full p-4 resize-none outline-none font-mono text-sm",
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400",
            "focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
            "transition-colors duration-200",
            isDark
              ? "bg-transparent text-transparent caret-gray-200 placeholder-gray-500 border-gray-600 focus:border-blue-400"
              : "bg-transparent text-transparent caret-gray-800 placeholder-gray-400 border-gray-300 focus:border-blue-500",
            isFocused ? "border-2" : "border border-gray-500"
          )}
          style={{
            zIndex: 2,
            caretColor: isDark ? '#e5e7eb' : '#1f2937',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: '1.5rem', // Ensure exact match with highlight layer
            fontSize: '14px', // Ensure exact match with highlight layer
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' // Ensure exact match
          }}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  )
}