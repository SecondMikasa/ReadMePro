import React, { useState, useRef, useCallback } from 'react'
import { Editor as MonacoEditor } from "@monaco-editor/react"
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
  const editorRef = useRef<any>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)

  // Handle Monaco Editor mount
  const handleEditorMount = useCallback((editor: any) => {
    editorRef.current = editor
    setIsEditorReady(true)

    // Focus the editor
    editor.focus()

    // Add mobile-specific keyboard shortcuts
    // Note: Monaco keyboard shortcuts will be added when Monaco is available
    // For now, we'll handle them in the toolbar action handler
  }, [])

  // Handle toolbar button actions using Monaco Editor API
  const handleToolbarAction = useCallback((action: string, insertText?: string) => {
    if (!editorRef.current) return

    const editor = editorRef.current
    const model = editor.getModel()
    const selection = editor.getSelection()
    const selectedText = model.getValueInRange(selection)

    let newText = ''
    let newSelection = null

    switch (action) {
      case 'bold':
        if (selectedText) {
          newText = `**${selectedText}**`
          newSelection = {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn + 4
          }
        } else {
          newText = '**text**'
          newSelection = {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn + 2,
            endLineNumber: selection.startLineNumber,
            endColumn: selection.startColumn + 6
          }
        }
        break

      case 'italic':
        if (selectedText) {
          newText = `*${selectedText}*`
          newSelection = {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn + 2
          }
        } else {
          newText = '*text*'
          newSelection = {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn + 1,
            endLineNumber: selection.startLineNumber,
            endColumn: selection.startColumn + 5
          }
        }
        break

      case 'header':
        const lineStart = { lineNumber: selection.startLineNumber, column: 1 }
        const lineEnd = { lineNumber: selection.startLineNumber, column: 1 }
        newText = '# '
        editor.executeEdits('mobile-toolbar', [{
          range: {
            startLineNumber: lineStart.lineNumber,
            startColumn: lineStart.column,
            endLineNumber: lineEnd.lineNumber,
            endColumn: lineEnd.column
          },
          text: newText
        }])
        editor.setPosition({ lineNumber: selection.startLineNumber, column: selection.startColumn + 2 })
        return

      case 'list':
        const listLineStart = { lineNumber: selection.startLineNumber, column: 1 }
        const listLineEnd = { lineNumber: selection.startLineNumber, column: 1 }
        newText = '- '
        editor.executeEdits('mobile-toolbar', [{
          range: {
            startLineNumber: listLineStart.lineNumber,
            startColumn: listLineStart.column,
            endLineNumber: listLineEnd.lineNumber,
            endColumn: listLineEnd.column
          },
          text: newText
        }])
        editor.setPosition({ lineNumber: selection.startLineNumber, column: selection.startColumn + 2 })
        return

      case 'code':
        if (selectedText) {
          newText = `\`${selectedText}\``
          newSelection = {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn + 2
          }
        } else {
          newText = '`code`'
          newSelection = {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn + 1,
            endLineNumber: selection.startLineNumber,
            endColumn: selection.startColumn + 5
          }
        }
        break

      case 'link':
        if (selectedText) {
          newText = `[${selectedText}](url)`
          newSelection = {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.endColumn + 3,
            endLineNumber: selection.endLineNumber,
            endColumn: selection.endColumn + 6
          }
        } else {
          newText = '[link text](url)'
          newSelection = {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn + 1,
            endLineNumber: selection.startLineNumber,
            endColumn: selection.startColumn + 10
          }
        }
        break

      default:
        return
    }

    // Execute the edit for cases that need text replacement
    if (newText) {
      editor.executeEdits('mobile-toolbar', [{
        range: selection,
        text: newText
      }])

      // Set new selection if provided
      if (newSelection) {
        editor.setSelection(newSelection)
      }
    }

    editor.focus()

    // Call external handler if provided
    if (onToolbarAction) {
      onToolbarAction(action, insertText)
    }
  }, [onToolbarAction])

  const isDark = theme === 'vs-dark'

  return (
    <div className={cn("relative w-full h-full flex flex-col", className)}>
      {/* Touch-optimized toolbar */}
      {showToolbar && (
        <div
          className={cn(
            "flex flex-wrap gap-1 p-2 border-b shrink-0 min-h-[60px]",
            isDark
              ? "bg-[#2d2d30] border-gray-600"
              : "bg-gray-50 border-gray-300"
          )}
          role="toolbar"
          aria-label="Markdown formatting toolbar"
        >
          {toolbarButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleToolbarAction(button.action, button.insertText)}
              className={cn(
                "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md",
                "font-semibold text-sm transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                "active:scale-95 transform transition-transform",
                isDark
                  ? "bg-[#3c3c3c] text-gray-200 hover:bg-[#4a4a4a] active:bg-[#555555]"
                  : "bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200 border border-gray-300"
              )}
              aria-label={button.ariaLabel}
              type="button"
            >
              {button.icon}
            </button>
          ))}
        </div>
      )}

      {/* Monaco Editor container */}
      <div className="relative flex-1 overflow-hidden min-h-0">
        <MonacoEditor
          height="100%"
          width="100%"
          language={language}
          theme={theme}
          value={value}
          onChange={(newValue) => onChange(newValue || '')}
          onMount={handleEditorMount}
          loading={
            <div className="p-4 text-gray-400">
              Loading Editor...
            </div>
          }
          options={{
            minimap: { enabled: false },
            lineNumbers: 'off',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontSize: 14,
            padding: {
              top: 10,
              bottom: 10
            },
            overviewRulerLanes: 0,
            overviewRulerBorder: false,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              alwaysConsumeMouseWheel: false
            }
          }}
        />
      </div>
    </div>
  )
}