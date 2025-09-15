import {
    useState,
    useEffect,
    useRef,
    useCallback
} from "react"

import { Editor as MonacoEditor } from "@monaco-editor/react"

import { useDeviceCapabilities } from "../../../hooks/useDeviceCapabilities"
import { MobileEditor } from "./mobile-editor"

export const EditorColumn = ({
    focusedSectionSlug,
    templates,
    setTemplates,
    theme,
}) => {

    // Local state for the editor content
    const [markdown, setMarkdown] = useState("")
    const [monacoEditor, setMonacoEditor] = useState(null)

    const { isMobile, hasTouch } = useDeviceCapabilities()

    const monacoEditorRef = useRef(null)
    const editorContainerRef = useRef(null)

    // --- Helper to get current markdown ---
    const getMarkdownForSlug = useCallback((slug) => {
        if (!slug || !Array.isArray(templates)) return ""
        const section = templates.find((s) => s.slug === slug)
        return section ? section.markdown : ""
    }, [templates]) // Depends only on templates array

    // --- Effect to load Monaco dynamically ---
    useEffect(() => {
        if (!isMobile && !monacoEditor) {
            import("@monaco-editor/react").then((EditorModule) => {
                setMonacoEditor(() => EditorModule.Editor) // Set the component itself
            }).catch(err => console.error("Failed to load Monaco Editor:", err))
        }
    }, [isMobile, monacoEditor])

    // --- Effect to update local markdown state when focus changes ---
    useEffect(() => {
        const currentMarkdown = getMarkdownForSlug(focusedSectionSlug);
        setMarkdown(currentMarkdown);

    }, [focusedSectionSlug, getMarkdownForSlug])
    // Rerun when slug changes

    // --- Monaco Mount Handler ---
    const handleEditorMount = (editor) => {
        monacoEditorRef.current = editor
        editor.focus()
    }

    // --- Edit Handler (for both Monaco and Textarea) ---
    const handleEdit = useCallback((value) => {
        const newValue = value ?? '' // Ensure value is a string
        // Update local state immediately for responsiveness
        setMarkdown(newValue)

        // Update the main templates state in page.tsx using functional update
        setTemplates(currentTemplates => {
            if (!Array.isArray(currentTemplates)) {
                console.error("handleEdit: currentTemplates is not an array!", currentTemplates)
                return []
                // Return empty array as error handling
            }

            return currentTemplates.map(template => {
                if (template.slug === focusedSectionSlug) {
                    return { ...template, markdown: newValue }
                }
                return template
            })
        })

    }, [focusedSectionSlug, setTemplates]) // Dependencies for the update logic

    useEffect(() => {
        const container = editorContainerRef.current
        if (!container || isMobile) return
        // Only apply to desktop editor container

        const handleWheel = (event) => {
            const editor = monacoEditorRef.current;
            if (!editor) return

            const scrollableElement = editor.getDomNode()

            if (!scrollableElement) return

            const {
                scrollTop,
                scrollHeight,
                clientHeight
            } = scrollableElement

            const isAtTop = scrollTop === 0
            const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1
            // Use tolerance

            const isScrollingUp = event.deltaY < 0
            const isScrollingDown = event.deltaY > 0

            // If editor content doesn't fill the view, let parent scroll
            if (scrollHeight <= clientHeight) {
                // Optionally prevent default here too if you NEVER want editor scroll
                // event.preventDefault(); // Uncomment cautiously
                return // Allow parent scroll implicitly
            }

            // If at the top and scrolling up, prevent editor scroll to allow parent scroll
            if (isAtTop && isScrollingUp) {
                event.preventDefault();
                return
            }

            // If at the bottom and scrolling down, prevent editor scroll to allow parent scroll
            if (isAtBottom && isScrollingDown) {
                event.preventDefault();
                return;
            }

            // Otherwise, let the editor handle the scroll (do nothing here)
        };

        container.addEventListener('wheel', handleWheel, { passive: false }); // Need passive: false to call preventDefault

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [isMobile]);

    return (
        <>
            {
                focusedSectionSlug ? (
                    // If a section is focused, show the appropriate editor
                    isMobile || hasTouch ? (
                        <MobileEditor
                            value={markdown}
                            onChange={handleEdit}
                            theme={theme}
                            language="markdown"
                            placeholder="Enter markdown content here..."
                            ariaLabel="Markdown editor"
                            showToolbar={true}
                            className="w-full h-full"
                        />
                    ) : (
                        // Show Monaco Editor if loaded, otherwise a loading message
                        monacoEditor ? (
                            <div
                                ref={editorContainerRef}
                                className="w-full h-full overflow-hidden overscroll-contain">
                                <MonacoEditor
                                    height="100%"
                                    width="100%"
                                    language="markdown"
                                    theme={theme}
                                    value={markdown}
                                    onChange={handleEdit}
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
                        ) : (
                            <div className="p-4 text-gray-400">
                                Initializing Editor...
                            </div>
                        )
                    )
                ) : (
                    // --- If NO section is focused, show placeholder ---
                    <div className="flex items-center justify-center h-full">
                        <p className="text-md text-gray-500 text-center px-4">
                            Select a section from the left panel to start editing its content.
                        </p>
                    </div>
                )
            }
        </>
    )
}