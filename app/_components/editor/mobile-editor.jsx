import React, { useRef, useCallback, useEffect } from 'react'
import { Editor as MonacoEditor } from "@monaco-editor/react"
import { cn } from '../../../lib/utils'

// Touch-optimized toolbar buttons for markdown editing
const toolbarButtons = [
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

export const MobileEditor = ({
  value,
  onChange,
  theme,
  language,
  className,
  showToolbar = true,
  onToolbarAction
}) => {
  const editorRef = useRef(null)
  const containerRef = useRef(null)
  const recentlyBlurredRef = useRef(0)
  const touchStateRef = useRef({ startX: 0, startY: 0, startTime: 0, moved: false })
  const FOCUS_COOLDOWN = 700 // ms

  // Handle Monaco Editor mount
  const handleEditorMount = useCallback((editor) => {
  editorRef.current = editor

  // do not call editor.focus() here

  const editorDomNode = editor.getDomNode()
  const scrollableElement = editorDomNode?.querySelector('.monaco-scrollable-element')

  // TAP detection: only focus on a true tap and only if cooldown passed
  const onTouchStart = (e) => {
    const t = e.touches ? e.touches[0] : e
    touchStateRef.current.startX = t.clientX
    touchStateRef.current.startY = t.clientY
    touchStateRef.current.startTime = Date.now()
    touchStateRef.current.moved = false
  }

  const onTouchMove = (e) => {
    const t = e.touches ? e.touches[0] : e
    const dx = Math.abs(t.clientX - touchStateRef.current.startX)
    const dy = Math.abs(t.clientY - touchStateRef.current.startY)
    if (dx > 10 || dy > 10) touchStateRef.current.moved = true
  }

  const onTouchEnd = () => {
    const duration = Date.now() - touchStateRef.current.startTime
    const isTap = !touchStateRef.current.moved && duration < 300
    if (isTap && (Date.now() - recentlyBlurredRef.current) > FOCUS_COOLDOWN) {
      try { editor.focus() } catch { /* ignore */ }
    }
  }

  // Attach handlers on editor DOM node (not the scrollable element) to avoid re-focusing while scrolling
  if (editorDomNode) {
    editorDomNode.addEventListener('touchstart', onTouchStart, { passive: true })
    editorDomNode.addEventListener('touchmove', onTouchMove, { passive: true })
    editorDomNode.addEventListener('touchend', onTouchEnd, { passive: true })

    // desktop mouse parity
    editorDomNode.addEventListener('mousedown', onTouchStart)
    editorDomNode.addEventListener('mousemove', onTouchMove)
    editorDomNode.addEventListener('mouseup', onTouchEnd)

    // store cleanup
    editor._tapFocusCleanup = () => {
      editorDomNode.removeEventListener('touchstart', onTouchStart)
      editorDomNode.removeEventListener('touchmove', onTouchMove)
      editorDomNode.removeEventListener('touchend', onTouchEnd)
      editorDomNode.removeEventListener('mousedown', onTouchStart)
      editorDomNode.removeEventListener('mousemove', onTouchMove)
      editorDomNode.removeEventListener('mouseup', onTouchEnd)
    }
  }

  // track blur to set cooldown so user-dismiss hides keyboard reliably
  if (typeof editor.onDidBlurEditorWidget === 'function') {
    const disp = editor.onDidBlurEditorWidget(() => {
      recentlyBlurredRef.current = Date.now()
    })
    editor._blurDisp = disp
  } else {
    // fallback: listen to focusout on DOM
    const onFocusOut = () => { recentlyBlurredRef.current = Date.now() }
    editorDomNode?.addEventListener('focusout', onFocusOut)
    editor._focusOutCleanup = () => editorDomNode?.removeEventListener('focusout', onFocusOut)
  }
    
    if (scrollableElement) {
      let touchStartY = 0

      const handleTouchStart = (e) => {
        touchStartY = e.touches[0].clientY
      }

      const handleTouchMove = (e) => {
        const touchY = e.touches[0].clientY
        const deltaY = touchStartY - touchY

        // Get editor scroll information
        const scrollTop = editor.getScrollTop()
        const scrollHeight = editor.getScrollHeight()
        const clientHeight = scrollableElement.clientHeight

        // Check if editor can scroll in the direction user is trying to scroll
        const canScrollUp = scrollTop > 0
        const canScrollDown = scrollTop < (scrollHeight - clientHeight)
        
        // Determine if we should let the editor handle this scroll
        const shouldScrollUp = deltaY < 0 && canScrollUp
        const shouldScrollDown = deltaY > 0 && canScrollDown

        if (shouldScrollUp || shouldScrollDown) {
          // Editor can handle this scroll direction
          // Let Monaco handle the scroll
          return
        } else {
          // Editor can't scroll further in this direction
          // Prevent the event to allow page scrolling
          if (Math.abs(deltaY) > 10) { // Add threshold to avoid accidental triggers
            e.preventDefault()
            e.stopPropagation()
            
            // Manually trigger page scroll
            const pageScrollDelta = deltaY * 0.5 // Adjust scroll speed
            window.scrollBy(0, pageScrollDelta)
          }
        }
      }

      const handleTouchEnd = () => {
        // Touch end handler - no specific action needed
      }

      // Add event listeners with proper options
      scrollableElement.addEventListener('touchstart', handleTouchStart, { passive: true })
      scrollableElement.addEventListener('touchmove', handleTouchMove, { passive: false })
      scrollableElement.addEventListener('touchend', handleTouchEnd, { passive: true })

      // Also add wheel event handling for better desktop experience
      const handleWheel = (e) => {
        const scrollTop = editor.getScrollTop()
        const scrollHeight = editor.getScrollHeight()
        const clientHeight = scrollableElement.clientHeight

        const canScrollUp = scrollTop > 0
        const canScrollDown = scrollTop < (scrollHeight - clientHeight)
        
        const isScrollingUp = e.deltaY < 0
        const isScrollingDown = e.deltaY > 0

        if ((isScrollingUp && !canScrollUp) || (isScrollingDown && !canScrollDown)) {
          // Editor can't scroll further, allow page scroll
          e.stopPropagation()
          return true
        }
      }

      scrollableElement.addEventListener('wheel', handleWheel, { passive: false })

      // Store cleanup function
      editor._scrollCleanup = () => {
        scrollableElement.removeEventListener('touchstart', handleTouchStart)
        scrollableElement.removeEventListener('touchmove', handleTouchMove)
        scrollableElement.removeEventListener('touchend', handleTouchEnd)
        scrollableElement.removeEventListener('wheel', handleWheel)
      }
    }
  }, [])

  // Cleanup scroll handlers
  useEffect(() => {
  return () => {
    const ed = editorRef.current
    if (ed) {
      if (ed._scrollCleanup) ed._scrollCleanup()
      if (ed._tapFocusCleanup) ed._tapFocusCleanup()
      if (ed._blurDisp) ed._blurDisp.dispose()
      if (ed._focusOutCleanup) ed._focusOutCleanup()
    }
  }
}, [])

  // Handle toolbar button actions using Monaco Editor API
  const handleToolbarAction = useCallback((action, insertText) => {
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

  // Add keyboard shortcuts after editor is mounted
  useEffect(() => {
    if (!editorRef.current) return
    
    const editor = editorRef.current
    
    // Add mobile-specific keyboard shortcuts
    try {
      editor.addCommand(editor.KeyMod.CtrlCmd | editor.KeyCode.KeyB, () => {
        handleToolbarAction('bold', '**text**')
      })
      
      editor.addCommand(editor.KeyMod.CtrlCmd | editor.KeyCode.KeyI, () => {
        handleToolbarAction('italic', '*text*')
      })
      
      editor.addCommand(editor.KeyMod.CtrlCmd | editor.KeyCode.KeyK, () => {
        handleToolbarAction('link', '[link text](url)')
      })
    } catch (error) {
      console.warn('Failed to add keyboard shortcuts:', error)
    }
  }, [handleToolbarAction])

  const isDark = theme === 'vs-dark'

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-full flex flex-col", className)}
    >
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