import { useEffect, useState } from "react"

import Tabs from "./tabs" // Assuming paths are correct
import ColumnHeader from "./column-header"
import { EditorColumn } from "./editor-column"
import { PreviewColumn } from "./preview-column"

import useDeviceDetect from "../../../hooks/useDeviceDetect" // Assuming path is correct
import { TAB } from "../../../lib/constants" // Assuming path is correct
import { toggleDarkMode } from "../../../lib/utils" // Assuming toggleDarkMode is here or import specific path

const EditorPreviewContainer = ({
    templates,
    setTemplates, // Keep this prop for EditorColumn
    getTemplate, // Keep this prop for PreviewColumn
    focusedSectionSlug,
    selectedSectionSlugs,
    // Removed setSelectedSectionSlugs and setFocusedSectionSlug as they seem unused here
}) => {
    const [toggleState, setToggleState] = useState({
        theme: "vs-dark", // Default theme
        img: "toggle_sun.svg", // Default icon
    });
    const [selectedTab, setSelectedTab] = useState(TAB.PREVIEW);

    const { isMobile } = useDeviceDetect();

    const toggleTheme = () => {
        toggleDarkMode(toggleState, setToggleState); // Ensure toggleDarkMode is imported correctly
    };

    // Effect to set initial editor theme from localStorage
    useEffect(() => {
        const storedTheme = localStorage.getItem("editor-color-theme");
        if (storedTheme === "light") {
            setToggleState({ theme: "light", img: "toggle_moon.svg" });
        } else {
            setToggleState({ theme: "vs-dark", img: "toggle_sun.svg" });
        }
    }, []); // Run only once on mount

    // Effect to set initial tab based on device
    useEffect(() => {
        setSelectedTab(isMobile ? TAB.EDITOR : TAB.PREVIEW);
    }, [isMobile]);

    const showEditorColumn = !isMobile || selectedTab === TAB.EDITOR;
    const showPreviewColumn = !isMobile || selectedTab === TAB.PREVIEW || selectedTab === TAB.RAW;

    // Ensure container takes full height of its parent flex container
    return (
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden h-full">
            {isMobile ? (
                <Tabs
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    focusedSectionSlug={focusedSectionSlug}
                    toggleState={toggleState}
                    toggleTheme={toggleTheme}
                />
            ) : null}

            {/* Editor Column Container */}
            {showEditorColumn ? (
                <div className="w-full md:w-1/2 h-full flex flex-col md:pr-3 pb-3 md:pb-0"> {/* Added flex-col, h-full */}
                    {!isMobile ? (
                        <ColumnHeader.Heading>
                            Editor
                            {/* Show toggle only if a section is selected for editing */}
                            {focusedSectionSlug ? (
                                <button
                                    onClick={toggleTheme}
                                    aria-label="Color Mode"
                                    className="toggle-dark-mode focus:outline-none transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:transform-none p-1" // Added padding
                                >
                                    <img
                                        className="w-auto h-6" // Adjusted size
                                        alt={toggleState.theme === 'vs-dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                        src={`/${toggleState.img}`} // Assuming images are in public root
                                    />
                                </button>
                            ) : (
                                <div className="w-auto h-8 mr-2"></div> // Placeholder for alignment
                            )}
                        </ColumnHeader.Heading>
                    ) : null}

                    {/* Make EditorColumn fill its container */}
                    <div className="flex-1 overflow-hidden"> {/* Added flex-1 and overflow-hidden */}
                        <EditorColumn
                            focusedSectionSlug={focusedSectionSlug}
                            templates={templates}
                            setTemplates={setTemplates} // Pass down the state setter
                            theme={toggleState.theme}
                            setToggleState={setToggleState} // Pass down if needed inside EditorColumn (e.g., for initial mount)
                            // Removed selectedSectionSlugs, setSelectedSectionSlugs as they seem unused here
                        />
                    </div>
                </div>
            ) : null}

            {/* Preview Column Container */}
            {showPreviewColumn ? (
                 <div className="flex-1 h-full flex flex-col md:pl-3 pt-3 md:pt-0"> {/* Added flex-col, h-full */}
                    {!isMobile ? (
                        <div className="border-b border-gray-600"> {/* Adjusted border color */}
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
                    <div className="flex-1 overflow-hidden mt-3"> {/* Added flex-1, overflow-hidden and margin-top */}
                        <PreviewColumn
                            selectedSectionSlugs={selectedSectionSlugs}
                            getTemplate={getTemplate} // Pass down the getter function
                            selectedTab={selectedTab}
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default EditorPreviewContainer;