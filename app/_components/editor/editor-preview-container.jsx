import { useEffect, useState } from "react"

import Tabs from "./tabs"
import ColumnHeader from "./column-header"
import { EditorColumn } from "./editor-column"
import { PreviewColumn } from "./preview-column"

import { useDeviceCapabilities } from "../../../hooks/useDeviceCapabilities"
import { TAB } from "../../../lib/constants"
import { toggleDarkMode, cn } from "../../../lib/utils"

const EditorPreviewContainer = ({
    templates,
    setTemplates,
    getTemplate,
    focusedSectionSlug,
    selectedSectionSlugs,
}) => {

    const [toggleState, setToggleState] = useState({
        theme: "vs-dark",
        img: "toggle_sun.svg",
    })
    const [selectedTab, setSelectedTab] = useState(TAB.PREVIEW)

    const { isMobile, isTablet, screenSize, orientation } = useDeviceCapabilities()

    const toggleTheme = () => {
        toggleDarkMode(toggleState, setToggleState)
    }

    // Effect to set initial editor theme from localStorage
    useEffect(() => {
        const storedTheme = localStorage.getItem("editor-color-theme")
        if (storedTheme === "light") {
            setToggleState({ theme: "light", img: "toggle_moon.svg" })
        } else {
            setToggleState({ theme: "vs-dark", img: "toggle_sun.svg" })
        }
    }, []) // Run only once on mount

    // Effect to set initial tab based on device and screen size
    useEffect(() => {
        if (isMobile || (isTablet && orientation === 'portrait')) {
            setSelectedTab(TAB.EDITOR)
        } else {
            setSelectedTab(TAB.PREVIEW)
        }
    }, [isMobile, isTablet, orientation])

    // Determine column visibility based on device capabilities and screen size
    const shouldUseTabs = isMobile || (isTablet && orientation === 'portrait') || screenSize === 'small'
    const showEditorColumn = !shouldUseTabs || selectedTab === TAB.EDITOR
    const showPreviewColumn = !shouldUseTabs || selectedTab === TAB.PREVIEW || selectedTab === TAB.RAW

    // Ensure container takes full height of its parent flex container
    return (
        <div className={cn(
            "flex flex-1 overflow-hidden h-full",
            shouldUseTabs ? "flex-col" : "flex-col md:flex-row"
        )}>
            {
                shouldUseTabs ? (
                    <Tabs
                        selectedTab={selectedTab}
                        setSelectedTab={setSelectedTab}
                        focusedSectionSlug={focusedSectionSlug}
                        toggleState={toggleState}
                        toggleTheme={toggleTheme}
                    />
                ) : null}

            {/* Editor Column Container */}
            {
                showEditorColumn ? (
                    <div className={cn(
                        "h-full flex flex-col",
                        shouldUseTabs ? "w-full pb-3" : "w-full md:w-1/2 md:pr-3 pb-3 md:pb-0"
                    )}>
                        {
                            !shouldUseTabs ? (
                                <ColumnHeader.Heading>
                                <div className="flex items-baseline justify-between w-full">
                                    <span className="text-lg font-semibold">Editor</span>
                                    {focusedSectionSlug ? (
                                    <button
                                        onClick={toggleTheme}
                                        aria-label="Color Mode"
                                        className="toggle-dark-mode w-6 h-6 md:w-8 md:h-8"
                                    >
                                        <img
                                        alt={toggleState.theme === 'vs-dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                        src={`/${toggleState.img}`}
                                        className="w-full h-full object-contain"
                                        />
                                    </button>
                                    ) : (
                                    <div className="w-6 h-6 mr-2"></div>
                                    )}
                                </div>
                                </ColumnHeader.Heading>
                            ) :
                                null
                        }
                        {/* Make EditorColumn fill its container */}
                        <div className="flex-1 overflow-hidden">
                            <EditorColumn
                                focusedSectionSlug={focusedSectionSlug}
                                templates={templates}
                                setTemplates={setTemplates}
                                theme={toggleState.theme}
                                setToggleState={setToggleState}
                            />
                        </div>
                    </div>
                ) :
                    null
            }

            {/* Preview Column Container */}
            {
                showPreviewColumn ? (
                    <div className={cn(
                        "flex-1 h-full flex flex-col",
                        shouldUseTabs ? "pt-3" : "md:pl-3 pt-3 md:pt-0"
                    )}>
                        {
                            !shouldUseTabs ? (
                                <div className="border-b border-gray-600">
                                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                        <ColumnHeader.Tab
                                            isActive={selectedTab === TAB.PREVIEW}
                                            className="pb-3"
                                            onClick={() => setSelectedTab(TAB.PREVIEW)}
                                        >
                                            Preview
                                        </ColumnHeader.Tab>
                                        <ColumnHeader.Tab
                                            isActive={selectedTab === TAB.RAW}
                                            className="pb-3"
                                            onClick={() => setSelectedTab(TAB.RAW)}
                                        >
                                            Raw
                                        </ColumnHeader.Tab>
                                    </nav>
                                </div>
                            ) : null}
                        {/* Make PreviewColumn fill its container */}
                        <div className="flex-1 overflow-hidden mt-3">
                            <PreviewColumn
                                selectedSectionSlugs={selectedSectionSlugs}
                                getTemplate={getTemplate}
                                selectedTab={selectedTab}
                            />
                        </div>
                    </div>
                ) :
                    null
            }
        </div>
    )
}

export default EditorPreviewContainer