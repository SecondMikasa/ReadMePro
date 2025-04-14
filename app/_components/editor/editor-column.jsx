import {
    useState,
    useEffect,
    useRef,
    useCallback
} from "react" 

import { Editor as MonacoEditor } from "@monaco-editor/react" 

import useDeviceDetect from "../../../hooks/useDeviceDetect"

import { cn } from "../../../lib/utils"

export const EditorColumn = ({
    focusedSectionSlug,
    templates,
    setTemplates,
    theme,
    setToggleState // Keep if needed for initial theme set
}) => {

    // Local state for the editor content
    const [markdown, setMarkdown] = useState("")
    const [monacoEditor, setMonacoEditor] = useState(null)

    const { isMobile } = useDeviceDetect()

    const monacoEditorRef = useRef(null)
    const textAreaRef = useRef(null)

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
    // Rerun when slug changes or getter updates

    // --- Monaco Mount Handler ---
    const handleEditorMount = (editor) => {
        monacoEditorRef.current = editor
        // You could potentially set initial theme here if needed, but EditorPreviewContainer handles it too
        // setEditorTheme(); // Example: if you had a setEditorTheme function
        console.log("Monaco Editor Mounted")
        editor.focus() // Optionally auto-focus on mount
    }

    // --- Edit Handler (for both Monaco and Textarea) ---
    // useCallback is useful if this function were passed down further, but good practice anyway
    const handleEdit = useCallback((value) => {
        const newValue = value ?? '' // Ensure value is a string
        // Update local state immediately for responsiveness
        setMarkdown(newValue)

        // Update the main templates state in page.tsx using functional update
        setTemplates(currentTemplates => {
            if (!Array.isArray(currentTemplates)) {
                console.error("handleEdit: currentTemplates is not an array!", currentTemplates)
                return []
                // Return empty array or handle error appropriately
            }
            // Use map to create a new array with the updated item
            return currentTemplates.map(template => {
                if (template.slug === focusedSectionSlug) {
                    return { ...template, markdown: newValue }
                }
                // Return the original object if it's not the one being edited
                return template;
            })
        })

        // The useEffect in page.tsx watching 'templates' will handle saving the backup
        // No need to call saveTemplateBackup(newTemplates) here

    }, [focusedSectionSlug, setTemplates]) // Dependencies for the update logic

    return (
        <>
            {
                focusedSectionSlug ? (
                // If a section is focused, show the appropriate editor
                isMobile ? (
                    <textarea
                        ref={textAreaRef}
                        onChange={(e) => handleEdit(e.target.value)}
                        value={markdown}
                        placeholder="Enter markdown content here..."
                        className={cn(
                            "w-full h-full rounded-sm border border-gray-500 p-4 resize-none outline-none focus:border-blue-500", // Ensure full size and basic styling
                            theme === "vs-dark" ? "bg-[#1e1e1e] text-gray-200 placeholder-gray-500" : "bg-white text-black placeholder-gray-400" // Theme-based colors
                        )}
                    />
                ) : (
                    // Show Monaco Editor if loaded, otherwise a loading message
                    monacoEditor ? (
                        <MonacoEditor // Render the dynamically imported component
                            height="100%" // Make editor fill container height
                            width="100%" // Make editor fill container width
                            language="markdown"
                            theme={theme} // Pass theme prop
                            value={markdown} // Controlled component
                            onChange={handleEdit} // Use the onChange prop
                            onMount={handleEditorMount} // Use the onMount prop
                            loading={
                                <div className="p-4 text-gray-400">
                                    Loading Editor...
                                </div>
                            }
                            options={{
                                minimap: { enabled: false },
                                lineNumbers: 'off', // 'on' or 'off'
                                wordWrap: 'on', // Enable word wrap
                                scrollBeyondLastLine: false,
                                automaticLayout: true, // Adjust layout on container resize
                                fontSize: 14,
                                padding: { top: 10, bottom: 10 },
                            }}
                        />
                    ) : (
                                <div className="p-4 text-gray-400">
                                    Initializing Editor...
                                </div> // Show if component not loaded yet
                    )
                )
            ) : (
                // --- If NO section is focused, show placeholder ---
                <div className="flex items-center justify-center h-full">
                    <p className="text-md text-gray-500 text-center px-4">
                        Select a section from the left panel to start editing its content.
                    </p>
                </div>
            )}
        </>
    );
};