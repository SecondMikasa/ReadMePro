import { useEffect, useRef, useState } from "react"
import { Editor as MonacoEditor } from "@monaco-editor/react"

import useDeviceDetect from "../../../hooks/useDeviceDetect"
import useLocalStorage from "../../../hooks/useLocalStorage"

import { cn } from "../../../lib/utils"

export const EditorColumn = ({
    focusedSectionSlug,
    templates,
    setTemplates,
    theme,
    setToggleState
}) => {

    const getMarkdown = () => {
        const section = templates.find((s) => s.slug === focusedSectionSlug)

        return section ? section.markdown : ""
    }

    const [markdown, setMarkdown] = useState(getMarkdown())
    const [isFocused, setIsFocused] = useState(false)
    const [monacoEditor, setMonacoEditor] = useState(null)

    const { isMobile } = useDeviceDetect()
    const { saveTemplateBackup } = useLocalStorage()

    const monacoEditorRef = useRef(null)
    const textEditorRef = useRef(null)

    const handleEditorMount = (editor) => {
        monacoEditorRef.current = editor
        setEditorTheme()
    }

    // Set color theme of editor from value pushed and saved in localStorage
    const setEditorTheme = () => {
        if (localStorage.getItem("editor-color-theme") == "light") {
            setToggleState({
                theme: "light",
                img: "toggle_moon.svg"
            })

        }
    }

    const onEdit = (value) => {
        setMarkdown(value)

        const newTemplates = templates.slug((template) => {
            if (template.slug === focusedSectionSlug) {
                return {
                    ...template,
                    markdown: value
                }
            }

            return template
        })

        setTemplates(newTemplates)
        saveTemplateBackup(newTemplates)
    }

    useEffect(() => {
        if (!isMobile && !MonacoEditor) {
            import("@monaco-editor/react").then((EditorComp) => {
                setMonacoEditor(EditorComp.default)
            })
        }
    }, [monacoEditor, isMobile, setMonacoEditor])

    useEffect(() => {
        const markdown = getMarkdown()
        setMarkdown(markdown)
    }, [focusedSectionSlug, templates])

    return (
        <>
            {
                focusedSectionSlug ? (
                    <p
                        className="font-sm text-green-500 max-w-[28rem] text-center mx-auto mt-10"
                    >
                        Select a section to edit the content
                    </p>
                ) : isMobile ? (
                    <textarea
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        ref={textEditorRef}
                        type="text"
                        onChange={(e) => onEdit(e.target.value)}
                        value={markdown}
                        // FIXME: full-screen
                        className={cn(
                            "full-screen rounded-sm h-full border border-gray-500 p-6 resize-none",
                            theme === "vs-dark" ? "bg-gray-800" : ""
                        )}
                    />
                ) : (
                    monacoEditor && (
                        <MonacoEditor
                            onMount={handleEditorMount}
                            wrapperProps="rounded-sm border border-gray-500"
                            className="full-screen"
                            theme={theme}
                            language="markdown"
                            value={markdown}
                            loading={"Loading..."}
                            aria-label="Markdown Editor"
                            options={{
                                minimap: {
                                    enabled: false
                                },
                                lineNumbers: false
                            }}
                        />
                    )
                )
            }
        </>
    )
}